import os
import sys
import sqlite3
from types import SimpleNamespace

from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

sys.path.insert(0, os.path.dirname(__file__))
from ingest import load_faq_data, build_index
from rag_helper import RAGBase
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor, SpanExporter, SpanExportResult
import pandas as pd


class RecordingSpanExporter(SpanExporter):
    def __init__(self):
        self.spans = []

    def export(self, spans):
        self.spans.extend(spans)
        return SpanExportResult.SUCCESS

    def shutdown(self):
        pass

    def force_flush(self):
        return True


class LocalLLMClient:
    class _Completions:
        def create(self, model, messages):
            return SimpleNamespace(
                usage=SimpleNamespace(input_tokens=700, output_tokens=120),
                choices=[SimpleNamespace(message=SimpleNamespace(content='demo answer'))],
            )

    class _Chat:
        def __init__(self, outer):
            self.completions = outer._Completions()

    def __init__(self):
        self.chat = self._Chat(self)


class RAGTraced(RAGBase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tracer = trace.get_tracer('llm-zoomcamp')

    def search(self, query, num_results=5):
        with self.tracer.start_as_current_span('search') as span:
            results = super().search(query, num_results=num_results)
            span.set_attribute('num_results', len(results))
            return results

    def llm(self, prompt):
        with self.tracer.start_as_current_span('llm') as span:
            response = self.llm_client.chat.completions.create(model=self.model, messages=[{'role': 'system', 'content': self.instructions}, {'role': 'user', 'content': prompt}])
            usage = getattr(response, 'usage', None)
            input_tokens = getattr(usage, 'input_tokens', None)
            output_tokens = getattr(usage, 'output_tokens', None)
            if input_tokens is None:
                input_tokens = getattr(usage, 'prompt_tokens', None)
            if output_tokens is None:
                output_tokens = getattr(usage, 'completion_tokens', None)
            cost = (input_tokens * 0.15 + output_tokens * 0.60) / 1_000_000
            span.set_attribute('input_tokens', input_tokens or 0)
            span.set_attribute('output_tokens', output_tokens or 0)
            span.set_attribute('cost', cost)
            return response.choices[0].message.content

    def rag(self, query):
        with self.tracer.start_as_current_span('rag') as span:
            search_results = self.search(query)
            prompt = self.build_prompt(query, search_results)
            answer = self.llm(prompt)
            span.set_attribute('query', query)
            return answer


provider = TracerProvider()
recording_exporter = RecordingSpanExporter()
provider.add_span_processor(SimpleSpanProcessor(recording_exporter))
provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(provider)

rag = RAGTraced(index=build_index(load_faq_data()), llm_client=LocalLLMClient(), model='gpt-5.4-mini')
q = 'How does the agentic loop keep calling the model until it stops?'
print(rag.rag(q))
print('span count', len(recording_exporter.spans))
print('span names', [s.name for s in recording_exporter.spans])


class SQLiteSpanExporter(SpanExporter):
    def __init__(self, db_path='traces.db'):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS spans (
                name TEXT,
                start_time INTEGER,
                end_time INTEGER,
                input_tokens INTEGER,
                output_tokens INTEGER,
                cost REAL
            )
        ''')
        self.conn.commit()

    def export(self, spans):
        for span in spans:
            attrs = dict(span.attributes or {})
            self.conn.execute('INSERT INTO spans VALUES (?, ?, ?, ?, ?, ?)', (span.name, span.start_time, span.end_time, attrs.get('input_tokens'), attrs.get('output_tokens'), attrs.get('cost')))
        self.conn.commit()
        return SpanExportResult.SUCCESS

    def shutdown(self):
        self.conn.close()

    def force_flush(self):
        return True


provider.add_span_processor(SimpleSpanProcessor(SQLiteSpanExporter('traces.db')))
rag.rag(q)
print(pd.read_sql_query('SELECT name, input_tokens FROM spans WHERE name = "llm"', sqlite3.connect('traces.db')))
