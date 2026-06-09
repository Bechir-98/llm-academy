import { foundationsTopics } from './foundations';
import { datasetsTopics } from './datasets';
import { finetuningTopics } from './finetuning';
import { inferenceTopics } from './inference';
import { localaiTopics } from './localai';
import { ragTopics } from './rag';
import { agentsTopics } from './agents';
import { modeltypesTopics } from './modeltypes';
import { deploymentTopics } from './deployment';
import { evaluationTopics } from './evaluation';
import { realworldTopics } from './realworld';

export const SECTIONS = [
  {
    id: 'foundations',
    title: 'Foundations',
    icon: '🧠',
    topics: [
      'llm-basics', 'how-ai-models-work', 'tokens', 'tokenization', 'context-windows',
      'embeddings', 'transformers', 'attention-mechanism', 'parameters',
      'training-vs-inference', 'open-vs-closed-source'
    ]
  },
  {
    id: 'datasets-training',
    title: 'Datasets & Training',
    icon: '📊',
    topics: [
      'sft-datasets', 'instruction-tuning', 'preference-datasets', 'synthetic-datasets',
      'data-curation', 'dataset-cleaning', 'dataset-formatting', 'fine-tuning-basics',
      'continued-pretraining', 'hallucination-reduction'
    ]
  },
  {
    id: 'fine-tuning',
    title: 'Fine-Tuning',
    icon: '🔧',
    topics: [
      'lora', 'qlora', 'dpo', 'rlhf', 'quantization', 'model-checkpoints',
      'adapter-tuning', 'gguf-models'
    ]
  },
  {
    id: 'inference-optimization',
    title: 'Inference & Optimization',
    icon: '⚡',
    topics: [
      'kv-cache', 'flash-attention', 'speculative-decoding', 'inference-optimization',
      'model-serving', 'batch-inference', 'gpu-basics', 'vram-basics',
      'latency-vs-quality'
    ]
  },
  {
    id: 'local-ai',
    title: 'Local AI Ecosystem',
    icon: '🏠',
    topics: [
      'llama-cpp', 'ollama', 'vllm', 'mlx', 'hugging-face',
      'unsloth', 'axolotl', 'peft', 'trl-library'
    ]
  },
  {
    id: 'rag-memory',
    title: 'RAG & Memory',
    icon: '🔍',
    topics: [
      'rag', 'vector-databases', 'chunking', 'retrieval-pipelines',
      'ai-memory-systems', 'semantic-search'
    ]
  },
  {
    id: 'agents-workflows',
    title: 'Agents & Workflows',
    icon: '🤖',
    topics: [
      'prompt-engineering', 'system-prompts', 'tool-calling', 'function-calling',
      'ai-agents', 'agentic-workflows', 'multi-agent-systems', 'browser-agents'
    ]
  },
  {
    id: 'model-types',
    title: 'Model Types',
    icon: '🏗️',
    topics: [
      'vlms', 'slms', 'dense-models', 'moe-models', 'coding-models', 'reasoning-models'
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: '🚀',
    topics: [
      'local-inference', 'on-device-ai', 'api-serving', 'cloud-gpus', 'edge-ai'
    ]
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    icon: '📏',
    topics: [
      'ai-benchmarks', 'human-evals', 'cost-per-token', 'speed-benchmarking',
      'quality-benchmarking'
    ]
  },
  {
    id: 'real-world',
    title: 'Real-World Skills',
    icon: '💼',
    topics: [
      'building-chatbots', 'building-copilots', 'ai-automation', 'ai-saas',
      'ai-coding-workflows', 'ai-orchestration', 'ai-product-thinking'
    ]
  }
];

export const ALL_TOPICS = {
  ...foundationsTopics,
  ...datasetsTopics,
  ...finetuningTopics,
  ...inferenceTopics,
  ...localaiTopics,
  ...ragTopics,
  ...agentsTopics,
  ...modeltypesTopics,
  ...deploymentTopics,
  ...evaluationTopics,
  ...realworldTopics
};
