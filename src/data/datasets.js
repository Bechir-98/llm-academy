export const datasetsTopics = {
  'sft-datasets': {
    id: 'sft-datasets', title: 'SFT Datasets',
    description: 'The instruction-response pairs used to teach base models how to follow instructions and be helpful.',
    sections: [
      { type: 'text', title: 'What is SFT Data?', icon: '📋', content: '**Supervised Fine-Tuning (SFT)** datasets are collections of examples where each example has an **instruction** (what you want the model to do) and a **response** (the ideal answer). Think of them as a teacher\'s answer key.\\n\\nA base model is like a brilliant person who has read the entire internet but has never had a conversation. SFT data teaches it the format of helpful conversations.' },
      { type: 'analogy', title: 'The New Employee', content: 'Imagine hiring someone incredibly knowledgeable but who has never worked in customer service. SFT data is like the training manual with example interactions: "When a customer asks about returns, respond with..." After seeing hundreds of examples, the employee learns the pattern.' },
      { type: 'code', language: 'json', code: '// Alpaca format - the most common SFT format\n{\n  "instruction": "Explain photosynthesis simply.",\n  "input": "",\n  "output": "Photosynthesis is how plants make food using sunlight, water, and CO2."\n}\n\n// Chat format\n{\n  "conversations": [\n    {"role": "user", "content": "What is ML?"},\n    {"role": "assistant", "content": "Machine learning is..."}\n  ]\n}' },
      { type: 'key-point', title: 'Quality Over Quantity', content: 'Research shows that **1,000 high-quality SFT examples can outperform 50,000 low-quality ones**. The LIMA paper proved this. Focus on diverse, well-written, accurate responses.' }
    ],
    summary: ['SFT datasets contain instruction-response pairs', 'Quality matters far more than quantity', 'Common formats: Alpaca and ChatML', 'They transform base models into helpful assistants'],
    mentalModel: 'SFT data is the answer key that teaches a knowledgeable-but-silent model how to actually talk to people.',
    mistakes: ['Using too much low-quality data', 'Not including diverse task types', 'Forgetting to validate outputs for accuracy', 'Mixing formats inconsistently'],
    exercise: { description: 'Create a small SFT dataset.', steps: ['Pick a domain (cooking, coding, fitness)', 'Write 20 instruction-response pairs', 'Format them in Alpaca JSON format', 'Review each response for accuracy'] }
  },
  'instruction-tuning': {
    id: 'instruction-tuning', title: 'Instruction Tuning',
    description: 'The process that transforms a raw text-completion model into a helpful, instruction-following assistant.',
    sections: [
      { type: 'text', title: 'From Text Completer to Assistant', icon: '🎓', content: 'A base model trained on internet text is great at completing text but terrible at following instructions. Type "Translate hello to French" and it might continue with "is a common language exercise..." instead of saying "bonjour."\\n\\n**Instruction tuning** fixes this by training on thousands of (instruction, response) pairs. This was the key insight behind InstructGPT and ChatGPT.' },
      { type: 'diagram', content: '  Base Model              Instruction-Tuned Model\n  ─────────              ─────────────────────────\n  "Write a poem"    →    "Write a poem"    →\n  "is a creative         "Roses are red,\n  form of..."            Violets are blue..."', label: 'Before vs. after instruction tuning' },
      { type: 'key-point', title: 'Cross-Task Generalization', content: 'Google\'s **FLAN** showed that instruction tuning on diverse tasks (translation, QA, math) makes the model better at ALL tasks — even unseen ones. Diversity of instructions matters more than volume.' },
      { type: 'code', language: 'python', code: 'from trl import SFTTrainer\nfrom transformers import AutoModelForCausalLM\nfrom datasets import load_dataset\n\nmodel = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8b")\ndataset = load_dataset("tatsu-lab/alpaca", split="train")\n\ntrainer = SFTTrainer(model=model, train_dataset=dataset, max_seq_length=2048)\ntrainer.train()' }
    ],
    summary: ['Instruction tuning teaches models to follow commands', 'Diversity of tasks matters more than volume', 'Cross-task generalization improves ALL tasks', 'This is what makes ChatGPT-style models possible'],
    mentalModel: 'Converting a walking encyclopedia into a helpful assistant who answers questions instead of giving lectures.',
    mistakes: ['Training only on one type of task', 'Skipping instruction tuning for RLHF', 'Using a base model for chat directly', 'Not evaluating on held-out tasks'],
    exercise: { description: 'Compare base vs instruction-tuned models.', steps: ['Download both via Ollama', 'Send the same 5 prompts to both', 'Compare how the base model rambles vs the tuned one follows instructions', 'Try format-requiring prompts like "List 3 things"'] }
  },
  'preference-datasets': {
    id: 'preference-datasets', title: 'Preference Datasets',
    description: 'Data that teaches models which responses humans prefer by comparing good and bad examples.',
    sections: [
      { type: 'text', title: 'Chosen vs Rejected', icon: '⚖️', content: 'Preference datasets show the model pairs of responses where one is clearly better. Each example has: a **prompt**, a **chosen** response (better), and a **rejected** response (worse). The model learns what humans consider a good response.' },
      { type: 'code', language: 'json', code: '{\n  "prompt": "How do I make coffee?",\n  "chosen": "1. Boil water to 200°F\\n2. Add 2 tbsp coffee per 6oz water\\n3. Steep 4 min\\n4. Filter and enjoy!",\n  "rejected": "Coffee originates from Ethiopia and involves complex biochemical reactions during the Maillard process..."\n}' },
      { type: 'analogy', title: 'The Writing Coach', content: 'A writing coach reviews two drafts and says "This one is better because it\'s clear and concise." Over thousands of such comparisons, you learn what "good writing" means.' },
      { type: 'key-point', title: 'Powers DPO and RLHF', content: 'Preference data powers: **RLHF** (trains a reward model, then uses RL) and **DPO** (directly uses preference pairs — simpler and increasingly popular).' }
    ],
    summary: ['Contains prompt + chosen response + rejected response', 'Teaches models what humans consider "good"', 'Used for DPO and RLHF training', 'Can be created by humans or AI judges'],
    mentalModel: 'Showing a student two exam answers — "this got an A, that got a C" — so they learn quality through comparison.',
    mistakes: ['Low-quality preference labels', 'Chosen and rejected being too similar', 'Not validating that chosen is actually better', 'Ignoring AI-judge biases'],
    exercise: { description: 'Create preference data.', steps: ['Pick 10 prompts', 'Write two responses each: helpful vs unhelpful', 'Label chosen vs rejected', 'Identify patterns in what makes a response "preferred"'] }
  },
  'synthetic-datasets': {
    id: 'synthetic-datasets', title: 'Synthetic Datasets',
    description: 'Training data generated by AI models — a powerful, cost-effective shortcut.',
    sections: [
      { type: 'text', title: 'AI Teaching AI', icon: '🔄', content: 'Use a powerful model (like GPT-4) to generate training data for a smaller model. This is **knowledge distillation**. The Alpaca dataset used GPT-3.5 to generate 52K examples for just $500.' },
      { type: 'key-point', title: 'Self-Instruct Method', content: '1. Start with a few human-written seed examples\\n2. Ask a large model to generate new instructions\\n3. Generate responses to those instructions\\n4. Filter out low-quality pairs\\n5. Repeat for unlimited data' },
      { type: 'code', language: 'python', code: 'from openai import OpenAI\nclient = OpenAI()\n\ndef generate_pair(topic):\n    resp = client.chat.completions.create(\n        model="gpt-4",\n        messages=[{"role": "user",\n            "content": f"Generate a training example about {topic}.\\nINSTRUCTION: [question]\\nRESPONSE: [answer]"}],\n        temperature=0.8\n    )\n    return resp.choices[0].message.content' },
      { type: 'warning', title: 'Legal Concerns', content: 'Some model licenses restrict using outputs to train competitors. Always check terms of service. Also filter for quality — AI generates bad examples too.' }
    ],
    summary: ['Generated by AI, not written by humans', 'Knowledge distillation: teacher model creates data for student', 'Much cheaper than human annotation', 'Must be filtered for quality and checked for licensing'],
    mentalModel: 'A master chef writing recipes so cooking students can learn without years of experience.',
    mistakes: ['Not filtering for quality', 'Violating provider terms of service', 'Over-relying on one teacher model', 'Not evaluating if synthetic data helps'],
    exercise: { description: 'Generate and evaluate synthetic data.', steps: ['Use an LLM to generate 20 instruction-response pairs', 'Manually grade each for accuracy', 'Remove bottom 25%', 'Compare quality at different temperature settings'] }
  },
  'data-curation': {
    id: 'data-curation', title: 'Data Curation',
    description: 'The art of selecting, filtering, and balancing training data for maximum model quality.',
    sections: [
      { type: 'text', title: 'Garbage In, Garbage Out', icon: '🎯', content: 'The most important fine-tuning factor is **data quality**. Microsoft\'s Phi models proved this: 3B parameter models on curated "textbook quality" data outperformed 10x larger models on unfiltered data.' },
      { type: 'key-point', title: 'Three Pillars', content: '**Quality**: Each example accurate, well-written, helpful\\n**Diversity**: Many tasks, topics, difficulty levels\\n**Balance**: No category over-represented' },
      { type: 'analogy', title: 'Museum Curator', content: 'You don\'t display everything — you carefully select the best pieces that together tell a complete story.' }
    ],
    summary: ['Data quality > quantity', 'Focus on quality, diversity, balance', 'Small curated datasets can beat large messy ones', 'Always decontaminate (remove test data from training)'],
    mentalModel: 'Be a museum curator — carefully select the best pieces, not everything.',
    mistakes: ['Focusing on size over quality', 'Not checking for test data contamination', 'Imbalanced topic distribution', 'Skipping manual review'],
    exercise: { description: 'Practice curation.', steps: ['Download a public dataset from HuggingFace', 'Review 50 random examples', 'Rate them 1-5 on accuracy and helpfulness', 'Calculate what % you\'d keep in a curated version'] }
  },
  'dataset-cleaning': {
    id: 'dataset-cleaning', title: 'Dataset Cleaning',
    description: 'Removing noise, duplicates, and low-quality examples from training data.',
    sections: [
      { type: 'text', title: 'Why Cleaning Matters', icon: '🧹', content: 'Raw datasets contain duplicates, formatting errors, toxic content, PII, and incorrect answers. Training on dirty data means the model learns these problems.' },
      { type: 'key-point', title: 'Cleaning Steps', content: '**Deduplication**: Remove exact and near-duplicates (MinHash)\\n**Quality Filtering**: Remove short or incoherent responses\\n**PII Removal**: Strip names, emails, phone numbers\\n**Toxicity Filtering**: Remove harmful content\\n**Language Detection**: Ensure correct language\\n**Format Validation**: Check schema consistency' },
      { type: 'code', language: 'python', code: 'import re\n\ndef clean_example(example):\n    text = example["output"]\n    if len(text.split()) < 10:  # Too short\n        return None\n    if re.search(r\'[\\w.]+@[\\w.]+\\.[a-z]{2,}\', text):  # PII\n        return None\n    text = re.sub(r\'\\s+\', \' \', text).strip()\n    example["output"] = text\n    return example' }
    ],
    summary: ['Clean data = better model', 'Key: dedup, quality filter, PII removal', 'Deduplication alone removes 10-30% of most datasets', 'Always manually review samples'],
    mentalModel: 'Gold panning — systematically filtering dirt to keep only valuable nuggets.',
    mistakes: ['Skipping deduplication', 'Being too aggressive and losing good data', 'Not keeping original data as backup', 'Forgetting to re-validate format after cleaning'],
    exercise: { description: 'Build a cleaning pipeline.', steps: ['Download a text dataset', 'Write filters for length, dedup, PII', 'Run pipeline and measure removal rate', 'Check 20 removed examples — correctly filtered?'] }
  },
  'dataset-formatting': {
    id: 'dataset-formatting', title: 'Dataset Formatting',
    description: 'Structuring training data so the model knows who is speaking and what to generate.',
    sections: [
      { type: 'text', title: 'Why Format Matters', icon: '📝', content: 'Models need consistent format to distinguish user input from model output. Wrong format = broken model. Different models expect different formats.' },
      { type: 'comparison', title: 'Common Formats', headers: ['Format', 'Used By'], rows: [
        ['Alpaca', 'Many fine-tunes'],
        ['ChatML', 'OpenAI, Qwen'],
        ['Llama 3', 'Meta LLaMA'],
        ['ShareGPT', 'Many datasets'],
        ['Mistral', 'Mistral models']
      ]},
      { type: 'code', language: 'python', code: '# Always use the tokenizer\'s built-in template!\ntokenizer.apply_chat_template(messages, tokenize=False)\n\n# ChatML format:\n# <|im_start|>user\\nHello<|im_end|>\n# <|im_start|>assistant\\nHi!<|im_end|>' },
      { type: 'key-point', title: 'Use Chat Templates', content: 'Modern tokenizers include a **chat_template** that formats conversations correctly. Always use it to match the exact format the model was trained with.' }
    ],
    summary: ['Format determines how model distinguishes user/assistant', 'Match format to your model', 'Use tokenizer\'s built-in chat_template', 'Wrong format = garbage results'],
    mentalModel: 'Using the right envelope for each type of mail — the postal service needs the right format.',
    mistakes: ['Wrong format for your model', 'Not including system prompts', 'Forgetting special tokens (BOS/EOS)', 'Mixing formats in one dataset'],
    exercise: { description: 'Convert between formats.', steps: ['Take 5 Alpaca examples', 'Convert to ChatML format', 'Convert to Llama 3 format', 'Verify with tokenizer.apply_chat_template()'] }
  },
  'fine-tuning-basics': {
    id: 'fine-tuning-basics', title: 'Fine-Tuning Basics',
    description: 'Taking a pre-trained model and specializing it for your specific task or domain.',
    sections: [
      { type: 'text', title: 'What is Fine-Tuning?', icon: '🎯', content: '**Fine-tuning** means training an existing model further on your own data. Instead of training from scratch (millions of dollars), you start with a model that already understands language and teach it your specialty.' },
      { type: 'analogy', title: 'Job Training', content: 'A pre-trained model is like a university graduate. Fine-tuning is on-the-job training — they already know how to think, you just teach them your company\'s products and processes.' },
      { type: 'comparison', title: 'When to Fine-Tune vs Prompt', headers: ['Scenario', 'Better Approach'], rows: [
        ['Specific output format needed', 'Fine-tuning'],
        ['One-off question', 'Prompting'],
        ['Domain-specific language', 'Fine-tuning'],
        ['Quick prototype', 'Prompting'],
        ['Production at scale', 'Fine-tuning']
      ]},
      { type: 'key-point', title: 'Full vs Parameter-Efficient', content: '**Full fine-tuning**: Updates ALL parameters. Best quality, needs lots of GPU memory.\\n**LoRA/QLoRA**: Updates <1% of parameters. 10-100x less memory, nearly same quality. This is the standard now.' }
    ],
    summary: ['Fine-tuning specializes a model for your needs', 'Much cheaper than training from scratch', 'LoRA/QLoRA are standard efficient methods', 'Always try prompting first before fine-tuning'],
    mentalModel: 'Job training for AI — it already has a broad education, you teach it your specialty.',
    mistakes: ['Fine-tuning when prompting would work', 'Learning rate too high (destroys knowledge)', 'Training too many epochs (overfitting)', 'Not evaluating on held-out data'],
    exercise: { description: 'Plan a fine-tuning project.', steps: ['Pick a use case', 'Decide: would prompting work?', 'Plan dataset: format, size, diversity', 'Estimate costs: model size, GPU, time'] }
  },
  'continued-pretraining': {
    id: 'continued-pretraining', title: 'Continued Pretraining',
    description: 'Teaching a model new domain knowledge by extending pre-training on specialized text.',
    sections: [
      { type: 'text', title: 'Adding New Knowledge', icon: '📚', content: 'Take a pre-trained model and train it further on domain-specific text — medical papers, legal docs, financial reports. Unlike SFT (which teaches format), continued pretraining teaches raw **knowledge**.' },
      { type: 'analogy', title: 'Medical School', content: 'Pre-training = general education. Continued pretraining = medical school — years of reading textbooks before any hands-on training.' },
      { type: 'comparison', title: 'vs Fine-Tuning', headers: ['Aspect', 'Continued Pretraining', 'SFT'], rows: [
        ['Purpose', 'Add domain knowledge', 'Teach task format'],
        ['Data', 'Plain text', 'Instruction-response pairs'],
        ['Volume', 'Millions of tokens', 'Thousands of examples'],
        ['Type', 'Next-token prediction', 'Supervised learning']
      ]}
    ],
    summary: ['Adds domain-specific knowledge', 'Uses plain text and next-token prediction', 'Requires millions of tokens', 'Essential for specialized domains'],
    mentalModel: 'Medical school for the model — deep domain study before learning to practice.',
    mistakes: ['Confusing with fine-tuning', 'Using too little data', 'Learning rate too high (catastrophic forgetting)', 'Not following up with SFT'],
    exercise: { description: 'Understand when continued pretraining helps.', steps: ['Ask an LLM a rare domain question', 'Note where it struggles', 'Research domain-specific models', 'Compare answers between general and domain models'] }
  },
  'hallucination-reduction': {
    id: 'hallucination-reduction', title: 'Hallucination Reduction',
    description: 'Why AI models confidently make things up and how to make them more truthful.',
    sections: [
      { type: 'text', title: 'Why Models Hallucinate', icon: '🫧', content: 'LLMs predict likely text, not truth. When they lack knowledge, they generate plausible-sounding but fabricated text. They\'re trained to always produce fluent text, never to refuse.' },
      { type: 'analogy', title: 'The Confident Friend', content: 'A friend who never says "I don\'t know." Ask about anything and they\'ll confidently make up a plausible story. They\'re not lying — they just always produce an answer.' },
      { type: 'key-point', title: 'Reduction Techniques', content: '**RAG**: Give real documents to reference (most effective)\\n**Better data**: Include "I don\'t know" examples\\n**Lower temperature**: More conservative responses\\n**Grounding**: Connect to real data sources\\n**Self-consistency**: Generate multiple answers, pick the consensus' },
      { type: 'comparison', title: 'Hallucination Types', headers: ['Type', 'Example'], rows: [
        ['Factual', 'Inventing a fake paper'],
        ['Fabricated details', 'Wrong dates/names'],
        ['Conflation', 'Mixing up similar concepts'],
        ['Logical', 'Invalid reasoning that sounds right']
      ]}
    ],
    summary: ['Hallucination = confidently generating false information', 'Models optimize for fluency, not truth', 'RAG is the most effective reduction technique', 'No technique fully eliminates hallucinations'],
    mentalModel: 'A confident friend who never says "I don\'t know" — always gives an answer, but it might be made up.',
    mistakes: ['Trusting outputs without verification', 'Thinking hallucination can be eliminated', 'Not using RAG when accuracy matters', 'Temperature too high for factual tasks'],
    exercise: { description: 'Catch hallucinations.', steps: ['Ask about an obscure topic you know well', 'Identify fabricated facts', 'Re-ask with a RAG-style prompt including source text', 'Compare accuracy of both responses'] }
  }
};
