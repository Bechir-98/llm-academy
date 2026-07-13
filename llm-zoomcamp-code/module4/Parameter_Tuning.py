{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 22,
   "id": "779da6e5-0732-4eb9-915b-9b58a859686d",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "'\\nfrom evaluation_utils import llm_structured\\n\\nresult, usage = llm_structured(\\n    openai_client,\\n    data_gen_instructions,\\n    user_prompt,\\n    Questions\\n)\\n\\nprint(result.questions)'"
      ]
     },
     "execution_count": 22,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "from ingest import load_faq_data\n",
    "documents = load_faq_data()\n",
    "documents_llm = []\n",
    "results = []\n",
    "\n",
    "for doc in documents:\n",
    "    if doc[\"course\"] == \"llm-zoomcamp\":\n",
    "        documents_llm.append(doc)\n",
    "\n",
    "len(documents_llm)\n",
    "documents = documents_llm\n",
    "from pydantic import BaseModel\n",
    "\n",
    "class Questions(BaseModel):\n",
    "    questions: list[str]\n",
    "\n",
    "data_gen_instructions = \"\"\"\n",
    "You emulate a student who's taking our course.\n",
    "Formulate 5 questions this student might ask based on a FAQ record. The record\n",
    "should contain the answer to the questions, and the questions should be complete and not too short.\n",
    "If possible, use as fewer words as possible from the record.\n",
    "\n",
    "The output should resemble how people ask questions\n",
    "on the internet. Not too formal, not too short, not too long.\n",
    "\"\"\".strip()\n",
    "\n",
    "import json\n",
    "\n",
    "user_prompt = json.dumps(doc)\n",
    "\n",
    "messages = [\n",
    "    {\"role\": \"developer\", \"content\": data_gen_instructions},\n",
    "    {\"role\": \"user\", \"content\": user_prompt}\n",
    "]\n",
    "\"\"\"\n",
    "from evaluation_utils import llm_structured\n",
    "\n",
    "result, usage = llm_structured(\n",
    "    openai_client,\n",
    "    data_gen_instructions,\n",
    "    user_prompt,\n",
    "    Questions\n",
    ")\n",
    "\n",
    "print(result.questions)\"\"\""
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 23,
   "id": "4fc6a88e-4358-4f22-b317-adda4ff6775d",
   "metadata": {},
   "outputs": [],
   "source": [
    "from evaluation_utils import llm_structured_retry\n",
    "import pandas as pd\n",
    "from concurrent.futures import ThreadPoolExecutor\n",
    "from evaluation_utils import map_progress\n",
    "import json\n",
    "def generate_ground_truth(doc):\n",
    "    user_prompt = json.dumps(doc)\n",
    "\n",
    "    out, usage = llm_structured_retry(\n",
    "        openai_client,\n",
    "        data_gen_instructions,\n",
    "        user_prompt,\n",
    "        Questions\n",
    "    )\n",
    "\n",
    "    results = []\n",
    "\n",
    "    for q in out.questions:\n",
    "        results.append({\n",
    "            \"question\": q,\n",
    "            \"document\": doc[\"id\"]\n",
    "        })\n",
    "\n",
    "    return results, usage\n",
    "\"\"\"\n",
    "with ThreadPoolExecutor(max_workers=6) as pool:\n",
    "    results = map_progress(pool, documents, generate_ground_truth)\"\"\"\n",
    "\n",
    "ground_truth = []\n",
    "usages = []\n",
    "\n",
    "for records, usage in results:\n",
    "    ground_truth.extend(records)\n",
    "    usages.append(usage)\n",
    "\n",
    "len(ground_truth)\n",
    "\n",
    "df_ground_truth = pd.DataFrame(ground_truth)    \n",
    "df_ground_truth.to_csv(\"data/ground_truth-new.csv\", index=False)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 25,
   "id": "4197e00a-13c4-48f0-ab21-52995188ea11",
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "from tqdm.auto import tqdm\n",
    "\"\"\"\n",
    "df_ground_truth = pd.read_csv(\"data/ground_truth-new.csv\")\n",
    "ground_truth = df_ground_truth.to_dict(orient=\"records\")\"\"\"\n",
    "\n",
    "from ingest import load_faq_data, build_index\n",
    "\n",
    "documents = load_faq_data()\n",
    "\n",
    "documents_llm = []\n",
    "\n",
    "for doc in documents:\n",
    "    if doc[\"course\"] == \"llm-zoomcamp\":\n",
    "        documents_llm.append(doc)\n",
    "\n",
    "documents = documents_llm\n",
    "index = build_index(documents)\n",
    "\n",
    "def text_search(query):\n",
    "    boost_dict = {\"question\": 3.0, \"section\": 0.5}\n",
    "\n",
    "    return index.search(\n",
    "        query,\n",
    "        num_results=5,\n",
    "        boost_dict=boost_dict\n",
    "    )\n",
    "\n",
    "def compute_relevance(q, search_function):\n",
    "    doc_id = q[\"document\"]\n",
    "    results = search_function(query=q[\"question\"])\n",
    "\n",
    "    relevance = []\n",
    "    for d in results:\n",
    "        relevance.append(int(d[\"id\"] == doc_id))\n",
    "\n",
    "    return relevance\n",
    "\n",
    "def compute_relevance_total(ground_truth, search_function):\n",
    "    relevance_total = []\n",
    "\n",
    "    for q in tqdm(ground_truth):\n",
    "        relevance = compute_relevance(q, search_function)\n",
    "        relevance_total.append(relevance)\n",
    "\n",
    "    return relevance_total"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 27,
   "id": "3f747239-7006-4766-b439-f85c39c84d5d",
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "from tqdm.auto import tqdm\n",
    "\"\"\"\n",
    "df_ground_truth = pd.read_csv(\"data/ground_truth-new.csv\")\n",
    "ground_truth = df_ground_truth.to_dict(orient=\"records\")\"\"\"\n",
    "\n",
    "def hit_rate(relevance):\n",
    "    cnt = 0\n",
    "\n",
    "    for line in relevance:\n",
    "        if 1 in line:\n",
    "            cnt = cnt + 1\n",
    "\n",
    "    return cnt / len(relevance)\n",
    "\n",
    "\n",
    "def mrr(relevance):\n",
    "    total_score = 0.0\n",
    "\n",
    "    for line in relevance:\n",
    "        for rank in range(len(line)):\n",
    "            if line[rank] == 1:\n",
    "                total_score = total_score + 1 / (rank + 1)\n",
    "                break\n",
    "\n",
    "    return total_score / len(relevance)\n",
    "def evaluate(ground_truth, search_function):\n",
    "    relevance_total = compute_relevance_total(ground_truth, search_function)\n",
    "\n",
    "    return {\n",
    "        \"hit_rate\": hit_rate(relevance_total),\n",
    "        \"mrr\": mrr(relevance_total),\n",
    "    }"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 28,
   "id": "fab1b624-207a-45d5-b47e-ab624cb85ac3",
   "metadata": {},
   "outputs": [],
   "source": [
    "def search_boost(query, question_boost):\n",
    "    boost_dict = {\"question\": question_boost, \"section\": 0.5}\n",
    "\n",
    "    return index.search(\n",
    "        query,\n",
    "        num_results=5,\n",
    "        boost_dict=boost_dict,\n",
    "    )"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 31,
   "id": "989c5d70-9350-4926-906b-6805c01aca2f",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "'for boost in [0.5, 1.0, 3.0, 5.0, 10.0]:\\n    result = evaluate(\\n        ground_truth,\\n        lambda query, boost=boost: search_boost(query, boost)\\n    )\\n    print(f\"boost={boost}: {result}\")'"
      ]
     },
     "execution_count": 31,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "\"\"\"for boost in [0.5, 1.0, 3.0, 5.0, 10.0]:\n",
    "    result = evaluate(\n",
    "        ground_truth,\n",
    "        lambda query, boost=boost: search_boost(query, boost)\n",
    "    )\n",
    "    print(f\"boost={boost}: {result}\")\"\"\""
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 34,
   "id": "7139c866-06ed-4c0c-8d9d-91368950d22b",
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "from tqdm.auto import tqdm\n",
    "\n",
    "df_ground_truth = pd.read_csv(\"data/ground_truth-new.csv\")\n",
    "ground_truth = df_ground_truth.to_dict(orient=\"records\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 35,
   "id": "e7d51f95-f945-4eb1-a177-15531a654def",
   "metadata": {},
   "outputs": [],
   "source": [
    "def search_boosts(query, question_boost, answer_boost, section_boost):\n",
    "    boost_dict = {\n",
    "        \"question\": question_boost,\n",
    "        \"section\": section_boost,\n",
    "        \"answer\": answer_boost,\n",
    "    }\n",
    "\n",
    "    return index.search(\n",
    "        query,\n",
    "        num_results=5,\n",
    "        boost_dict=boost_dict,\n",
    "    )"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 36,
   "id": "ce57f163-a487-471b-88cf-768a0a210808",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=1.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "d2761573bd9a429c89ca5009fef618ce",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=1.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "9da55f25ca1b4730b0477b4d0f63ca2c",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=1.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "55b378f9e35746fc908810bf71ec2d1a",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=2.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "7013b5c277ad4d29bc1d272cc8c73bf8",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=2.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "11c0961518394f2e93102d523ed12223",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=2.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "938263d2f0ed4176afe1c2b42dd6228b",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=4.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "648567d19dc84fc0a739ace1f7ddd503",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=4.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "084b5067a6684a08beafbf0042f2ef9d",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=4.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "6d60e05a832f4d8fb5e11a3fafdaac48",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=10.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "3c3ccabfa711440bad3bee695dd76a92",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=10.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "f661d0aef9ec4057bbafb0ea0472de15",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=1.0, answer_boost=10.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "7814683bf0e64407b4241b611cf25390",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=1.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "8f3e17bb3c344d2eb1390bc5b7d466dc",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=1.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "235ee888a7c14d86a7a7cec1f6c0c68d",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=1.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "8e85a5f677c34b97965fb8c817c5b2c5",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=2.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "9a68f58f4bfa4bb3a85197c111d78f83",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=2.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "9c7b23e14b7841539fbecea9527ff1b3",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=2.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "ce869446e86a4c30bd07df9301c62e79",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=4.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "e697e73aadfa4e5a81c417bc08f0a1d3",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=4.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "515646214072499e914c67b25bdfdc5f",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=4.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "d1cc591dcbbc43d2935b4954568c5b46",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=10.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "3e7f2546f341428ab93f9b8ddf5be082",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=10.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "f6fa431dc4554b56bed1b99f1f79eb66",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=2.0, answer_boost=10.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "6d08731dd75740be8294f70914e69c35",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=1.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "8667da679a864afe961d197239949c0c",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=1.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "f28850fc24704c4080629c309e6f780b",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=1.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "e27911fd0aa04d79992dc762bba45ffc",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=2.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "ffb7b00a94ec452297f8c7c421d043e2",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=2.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "84dd7b7f499c4b6ca2361c54479fb696",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=2.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "2ba4928c31714a8daa248853ede4cd11",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=4.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "6287908727144d31a07f7f60e1bd7209",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=4.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "3c1446f2c8844e77a017915644a4e0be",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=4.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "b97c4f2b937c4c2abadbb9621c61fb49",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=10.0, section_boost=0.1...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "fa0d5f9740674f34867363b912713a97",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=10.0, section_boost=0.2...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "10148580e13c41378018aff5abd84003",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Evaluating question_boost=5.0, answer_boost=10.0, section_boost=0.5...\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "5130b4cf0f7e443680d757719db6a426",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "  0%|          | 0/395 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    }
   ],
   "source": [
    "results = []\n",
    "\n",
    "for question_boost in [1.0, 2.0, 5.0]:\n",
    "    for answer_boost in [1.0, 2.0, 4.0, 10.0]:\n",
    "        for section_boost in [0.1, 0.2, 0.5]:\n",
    "            print(\n",
    "                f\"Evaluating question_boost={question_boost},\"\n",
    "                f\" answer_boost={answer_boost},\"\n",
    "                f\" section_boost={section_boost}...\"\n",
    "            )\n",
    "            result = evaluate(\n",
    "                ground_truth,\n",
    "                lambda query, question_boost=question_boost, answer_boost=answer_boost, section_boost=section_boost: search_boosts(\n",
    "                    query,\n",
    "                    question_boost,\n",
    "                    answer_boost,\n",
    "                    section_boost\n",
    "                )\n",
    "            )\n",
    "\n",
    "            results.append({\n",
    "                \"question\": question_boost,\n",
    "                \"answer\": answer_boost,\n",
    "                \"section\": section_boost,\n",
    "                \"hit_rate\": result[\"hit_rate\"],\n",
    "                \"mrr\": result[\"mrr\"],\n",
    "            })"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 37,
   "id": "25dbcf39-8fd4-431e-b669-408aa3913ada",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>question</th>\n",
       "      <th>answer</th>\n",
       "      <th>section</th>\n",
       "      <th>hit_rate</th>\n",
       "      <th>mrr</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>34</th>\n",
       "      <td>5.0</td>\n",
       "      <td>10.0</td>\n",
       "      <td>0.2</td>\n",
       "      <td>0.754430</td>\n",
       "      <td>0.652110</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>18</th>\n",
       "      <td>2.0</td>\n",
       "      <td>4.0</td>\n",
       "      <td>0.1</td>\n",
       "      <td>0.754430</td>\n",
       "      <td>0.651688</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>1.0</td>\n",
       "      <td>2.0</td>\n",
       "      <td>0.1</td>\n",
       "      <td>0.749367</td>\n",
       "      <td>0.649916</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>35</th>\n",
       "      <td>5.0</td>\n",
       "      <td>10.0</td>\n",
       "      <td>0.5</td>\n",
       "      <td>0.749367</td>\n",
       "      <td>0.649916</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>19</th>\n",
       "      <td>2.0</td>\n",
       "      <td>4.0</td>\n",
       "      <td>0.2</td>\n",
       "      <td>0.749367</td>\n",
       "      <td>0.649916</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>33</th>\n",
       "      <td>5.0</td>\n",
       "      <td>10.0</td>\n",
       "      <td>0.1</td>\n",
       "      <td>0.749367</td>\n",
       "      <td>0.649620</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>20</th>\n",
       "      <td>2.0</td>\n",
       "      <td>4.0</td>\n",
       "      <td>0.5</td>\n",
       "      <td>0.746835</td>\n",
       "      <td>0.648101</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>1.0</td>\n",
       "      <td>2.0</td>\n",
       "      <td>0.2</td>\n",
       "      <td>0.746835</td>\n",
       "      <td>0.647679</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>7</th>\n",
       "      <td>1.0</td>\n",
       "      <td>4.0</td>\n",
       "      <td>0.2</td>\n",
       "      <td>0.754430</td>\n",
       "      <td>0.636287</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>6</th>\n",
       "      <td>1.0</td>\n",
       "      <td>4.0</td>\n",
       "      <td>0.1</td>\n",
       "      <td>0.754430</td>\n",
       "      <td>0.635781</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "    question  answer  section  hit_rate       mrr\n",
       "34       5.0    10.0      0.2  0.754430  0.652110\n",
       "18       2.0     4.0      0.1  0.754430  0.651688\n",
       "3        1.0     2.0      0.1  0.749367  0.649916\n",
       "35       5.0    10.0      0.5  0.749367  0.649916\n",
       "19       2.0     4.0      0.2  0.749367  0.649916\n",
       "33       5.0    10.0      0.1  0.749367  0.649620\n",
       "20       2.0     4.0      0.5  0.746835  0.648101\n",
       "4        1.0     2.0      0.2  0.746835  0.647679\n",
       "7        1.0     4.0      0.2  0.754430  0.636287\n",
       "6        1.0     4.0      0.1  0.754430  0.635781"
      ]
     },
     "execution_count": 37,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "df_results = pd.DataFrame(results)\n",
    "df_results.sort_values(\"mrr\", ascending=False).head(10)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 38,
   "id": "271a9f32-c8f9-4924-9be7-5d097401498b",
   "metadata": {},
   "outputs": [],
   "source": [
    "def text_search(query):\n",
    "    boost_dict = {\n",
    "        \"question\": 1.0,\n",
    "        \"answer\": 2.0,\n",
    "        \"section\": 0.1,\n",
    "    }\n",
    "\n",
    "    return index.search(\n",
    "        query,\n",
    "        num_results=5,\n",
    "        boost_dict=boost_dict,\n",
    "    )"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "ef9eabb4-3e94-47c0-bba5-09df441487b1",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.12.3"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
