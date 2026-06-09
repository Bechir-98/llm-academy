export const modeltypesTopics = {
  'vlms': { id: 'vlms', title: 'Vision-Language Models (VLMs)', description: 'Models that understand both images and text — see and describe the world.',
    sections: [
      { type: 'text', title: 'Seeing + Reading', icon: '👁️', content: 'VLMs combine a **vision encoder** (processes images) with an **LLM** (processes text). You can show them images and ask questions: "What\'s in this photo?", "Read the text in this receipt", "Is this X-ray normal?" Examples: GPT-4V, Claude Vision, LLaVA, Qwen-VL.' },
      { type: 'diagram', content: '  Image → [Vision Encoder (ViT)] → Image Tokens\n                                        +\n  Text  → [Tokenizer] → Text Tokens\n                    ↓\n           [LLM Decoder] → Response', label: 'VLM architecture: vision encoder feeds image tokens into the LLM' },
      { type: 'comparison', title: 'Popular VLMs', headers: ['Model', 'Type', 'Key Strength'], rows: [['GPT-4V','Closed','Best overall quality'],['Claude 3 Vision','Closed','Document understanding'],['LLaVA','Open','Easy to fine-tune'],['Qwen-VL','Open','Multilingual vision']] }
    ],
    summary: ['VLMs combine vision encoders with LLMs', 'Can analyze images, read text, answer visual questions', 'Architecture: Vision Encoder → Image Tokens → LLM', 'Applications: document processing, medical imaging, accessibility'],
    mentalModel: 'An LLM with eyes — it can read text AND see images.', mistakes: ['Expecting pixel-perfect accuracy from VLMs', 'Not considering that image tokens use context window space', 'Sending too-large images without resizing', 'Using VLMs for tasks that text-only models handle fine'],
    exercise: { description: 'Test a VLM.', steps: ['Use GPT-4V or LLaVA to analyze 5 different images', 'Test: photos, charts, handwriting, screenshots', 'Compare accuracy across image types', 'Find where it struggles'] }
  },
  'slms': { id: 'slms', title: 'Small Language Models (SLMs)', description: 'Compact models (1-4B parameters) that are fast, cheap, and increasingly capable.',
    sections: [
      { type: 'text', title: 'Small but Mighty', icon: '🔬', content: '**SLMs** have 1-4 billion parameters vs 70-400B for large models. Despite their size, models like **Phi-3** (3.8B), **Gemma 2** (2B), and **TinyLlama** (1.1B) perform surprisingly well — often matching models 10x their size on specific tasks.' },
      { type: 'key-point', title: 'Why SLMs Matter', content: '**Speed**: 10-50x faster than large models\\n**Cost**: Run on consumer hardware, even phones\\n**Privacy**: Deploy on-device, no cloud needed\\n**Fine-tuning**: Train in minutes on a laptop\\n**The secret**: They\'re trained on extremely curated, high-quality data' },
      { type: 'comparison', title: 'Popular SLMs', headers: ['Model', 'Params', 'Strength'], rows: [['Phi-3 Mini','3.8B','Reasoning, math (textbook data)'],['Gemma 2','2B','Efficient, good for fine-tuning'],['TinyLlama','1.1B','Ultra-small, mobile deployment'],['Qwen 2.5','0.5-3B','Multilingual, coding']] }
    ],
    summary: ['SLMs: 1-4B parameters, fast and efficient', 'Can match larger models on specific tasks', 'Secret: high-quality training data matters more than size', 'Perfect for on-device, real-time, and budget applications'],
    mentalModel: 'A well-trained specialist vs a generalist — smaller but expert in their area.', mistakes: ['Dismissing small models as "too weak"', 'Not fine-tuning SLMs for specific tasks (their sweet spot)', 'Using large models when SLMs would suffice', 'Ignoring SLMs for edge/mobile deployment'],
    exercise: { description: 'Evaluate SLMs.', steps: ['Run Phi-3 Mini and a 7B model on the same tasks', 'Compare quality, speed, and memory', 'Find tasks where the SLM is "good enough"', 'Try fine-tuning the SLM for a specific task'] }
  },
  'dense-models': { id: 'dense-models', title: 'Dense Models', description: 'Traditional architecture where every parameter is active for every token.',
    sections: [
      { type: 'text', title: 'All Parameters, All the Time', icon: '🧱', content: 'In a **dense model**, every single parameter participates in every computation. When you send a token through LLaMA 70B, all 70 billion parameters are used. This is straightforward but means compute cost scales linearly with model size — 70B is exactly 10x more expensive than 7B.' },
      { type: 'comparison', title: 'Dense vs MoE', headers: ['Aspect', 'Dense', 'MoE'], rows: [['Active params','All','~20-30%'],['Compute','Predictable','Lower per token'],['Memory','Params × bytes','Total params × bytes (higher)'],['Examples','LLaMA, GPT-4 (maybe)','Mixtral, DeepSeek']] },
      { type: 'key-point', title: 'When Dense Wins', content: 'Dense models are simpler, more predictable, and easier to optimize. They\'re the default choice when you can afford the compute. Most open-source models (LLaMA, Mistral 7B, Gemma) are dense.' }
    ],
    summary: ['Every parameter active for every token', 'Compute scales linearly with size', 'Simpler, more predictable than MoE', 'Examples: LLaMA, GPT, Mistral 7B, Gemma'],
    mentalModel: 'A full orchestra where every musician plays every note — powerful but expensive.', mistakes: ['Not considering MoE alternatives for efficiency', 'Assuming dense is always better', 'Not accounting for inference cost scaling', 'Ignoring that smaller dense models can beat larger ones with good data'],
    exercise: { description: 'Compare dense models.', steps: ['Run 3 dense models of different sizes', 'Compare quality, speed, and memory', 'Calculate cost per token for each', 'Determine which size fits your use case'] }
  },
  'moe-models': { id: 'moe-models', title: 'Mixture of Experts (MoE)', description: 'Models that only activate a fraction of their parameters per token for efficiency.',
    sections: [
      { type: 'text', title: 'Selective Activation', icon: '🎯', content: 'A **Mixture of Experts** model has many "expert" sub-networks but only activates a few for each token. Mixtral 8x7B has 47B total parameters but only uses ~13B per token (2 out of 8 experts). A **router** network decides which experts to activate based on the input.' },
      { type: 'diagram', content: '  Input Token → [Router] → Which experts?\n                    ↓\n  Expert 1: ████ (selected)\n  Expert 2: ░░░░ (inactive)\n  Expert 3: ████ (selected)\n  Expert 4: ░░░░ (inactive)\n  Expert 5: ░░░░ (inactive)\n  Expert 6: ░░░░ (inactive)\n  Expert 7: ░░░░ (inactive)\n  Expert 8: ░░░░ (inactive)\n                    ↓\n  Combine Expert 1 + 3 outputs', label: 'Router selects 2 of 8 experts per token' },
      { type: 'key-point', title: 'Pros and Cons', content: '**Pros**: Higher quality per compute FLOP, scales well, faster inference\\n**Cons**: Higher memory (all experts must be loaded), harder to fine-tune, routing can be unstable\\n**Examples**: Mixtral 8x7B, DeepSeek-V2, Grok, GPT-4 (rumored)' }
    ],
    summary: ['Activates only a subset of experts per token', 'Mixtral 8x7B: 47B total params, ~13B active per token', 'Router network selects which experts to use', 'Better quality per compute, but needs more memory'],
    mentalModel: 'A hospital with specialist doctors — you only see the relevant specialists, not all doctors for every visit.', mistakes: ['Confusing total params with active params', 'Expecting MoE to use less memory (it needs all experts loaded)', 'Not understanding router behavior', 'Trying to fine-tune MoE like dense models (more complex)'],
    exercise: { description: 'Explore MoE models.', steps: ['Run Mixtral 8x7B and compare with LLaMA 70B', 'Compare speed and quality', 'Check memory usage (total vs active params)', 'Research which experts activate for different types of prompts'] }
  },
  'coding-models': { id: 'coding-models', title: 'Coding Models', description: 'Language models specialized for code generation, understanding, and debugging.',
    sections: [
      { type: 'text', title: 'AI for Code', icon: '💻', content: 'Coding models are trained (or fine-tuned) specifically on source code. They excel at code generation, completion, debugging, explanation, and translation between languages. They understand syntax, patterns, and programming logic better than general models.' },
      { type: 'comparison', title: 'Popular Coding Models', headers: ['Model', 'Params', 'Strength'], rows: [['DeepSeek Coder','1.3-33B','Strong coding + reasoning'],['Code Llama','7-34B','Multiple language support, FIM'],['StarCoder 2','3-15B','Open, trained on The Stack v2'],['Qwen 2.5 Coder','1.5-32B','Multilingual code, strong benchmarks']] },
      { type: 'key-point', title: 'FIM: Fill-in-the-Middle', content: 'Unlike standard left-to-right generation, **FIM** lets coding models fill in code between existing lines — like autocomplete in an IDE. The model sees code before AND after the cursor and generates what belongs in between.' },
      { type: 'code', language: 'python', code: '# FIM format (Fill-in-the-Middle)\n# <PRE> code before cursor <SUF> code after cursor <MID>\n# Model generates what goes in the middle\n\nprompt = "<PRE>def fibonacci(n):\\n    if n <= 1:\\n        return n<SUF>\\n    return result<MID>"\n# Model generates: "\\n    result = fibonacci(n-1) + fibonacci(n-2)"' }
    ],
    summary: ['Specialized models for code tasks', 'FIM enables IDE-style code completion', 'Benchmarked on HumanEval, MBPP, MultiPL-E', 'Can generate, debug, explain, and translate code'],
    mentalModel: 'A general doctor vs a specialist — coding models are the "programmer specialist" of the LLM world.', mistakes: ['Using general models for code tasks when coding models exist', 'Not using FIM for code completion tasks', 'Ignoring code-specific benchmarks (HumanEval)', 'Not testing generated code before using it'],
    exercise: { description: 'Test a coding model.', steps: ['Run DeepSeek Coder or Code Llama', 'Test: code generation, debugging, explanation', 'Compare with a general model on the same coding tasks', 'Try FIM completion in an IDE-like scenario'] }
  },
  'reasoning-models': { id: 'reasoning-models', title: 'Reasoning Models', description: 'Models that "think" through problems step-by-step using chain-of-thought.',
    sections: [
      { type: 'text', title: 'Thinking Before Answering', icon: '🤔', content: '**Reasoning models** like OpenAI\'s o1/o3 and DeepSeek-R1 explicitly "think" through problems before answering. They generate internal reasoning (chain-of-thought) that breaks complex problems into steps. This dramatically improves performance on math, logic, coding, and science tasks.' },
      { type: 'analogy', title: 'Show Your Work', content: 'Regular models are like students who immediately write an answer. Reasoning models are like students who show their work — writing out each step of the problem. The "show your work" process actually leads to better answers.' },
      { type: 'key-point', title: 'Test-Time Compute', content: 'Regular models use the same compute for every question. Reasoning models use **more compute for harder questions** — they "think" longer. This is called **test-time compute scaling**: spending more time thinking leads to better answers, without making the model bigger.' },
      { type: 'comparison', title: 'Regular vs Reasoning', headers: ['Aspect', 'Regular Model', 'Reasoning Model'], rows: [['Speed','Fast','Slower (thinking time)'],['Math/Logic','Good','Excellent'],['Simple questions','Efficient','Overkill'],['Cost','Lower','Higher (more tokens)'],['Examples','GPT-4, Claude 3.5','o1, o3, DeepSeek-R1']] }
    ],
    summary: ['Generate chain-of-thought reasoning before answering', 'Excel at math, logic, coding, and science', 'Use more compute for harder problems (test-time scaling)', 'Slower and more expensive but significantly more accurate'],
    mentalModel: 'A student who shows their work on exams vs one who just writes the answer — the process improves the result.', mistakes: ['Using reasoning models for simple factual questions (overkill)', 'Not accounting for the higher token cost', 'Expecting reasoning models to be faster', 'Not leveraging the visible reasoning chain for debugging'],
    exercise: { description: 'Compare reasoning models.', steps: ['Send the same math/logic problems to a regular and reasoning model', 'Compare accuracy and reasoning quality', 'Note the speed and token usage difference', 'Find the complexity threshold where reasoning models shine'] }
  }
};
