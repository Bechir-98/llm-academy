export const localaiTopics = {
  'llama-cpp': { id: 'llama-cpp', title: 'llama.cpp', description: 'C++ inference engine that runs LLMs on CPU — no GPU required.',
    sections: [
      { type: 'text', title: 'CPU Inference Pioneer', icon: '⚙️', content: '**llama.cpp** is an open-source project by Georgi Gerganov that runs LLMs efficiently on CPUs. It uses GGUF quantized models and clever optimizations to make inference possible on consumer laptops without a GPU. It\'s the foundation that Ollama and many other tools are built on.' },
      { type: 'key-point', title: 'Key Features', content: '**CPU-first**: Runs on any CPU (with optional GPU acceleration)\\n**GGUF format**: Single-file models with various quantization levels\\n**Cross-platform**: Works on Linux, macOS, Windows\\n**Metal/CUDA support**: Can use Apple Silicon GPU or NVIDIA GPU for acceleration\\n**Active community**: New optimizations every week' },
      { type: 'code', language: 'bash', code: '# Build from source\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp && make\n\n# Run a model\n./llama-cli -m models/llama-3-8b-Q4_K_M.gguf \\\n  --prompt "Explain quantum computing" \\\n  -n 256 --temp 0.7 --threads 8' }
    ],
    summary: ['Runs LLMs on CPU without GPU', 'Uses GGUF quantized format', 'Foundation for Ollama and many tools', 'Cross-platform with optional GPU acceleration'],
    mentalModel: 'The engine under Ollama\'s hood — raw, fast CPU inference.', mistakes: ['Not using enough threads', 'Wrong quantization for your RAM', 'Expecting GPU-level speed from CPU', 'Not trying Metal/CUDA acceleration if available'],
    exercise: { description: 'Run llama.cpp.', steps: ['Build from source', 'Download a GGUF model', 'Run with different thread counts', 'Compare speed: CPU-only vs GPU-accelerated'] }
  },
  'ollama': { id: 'ollama', title: 'Ollama', description: 'The easiest way to run LLMs locally — like Docker for AI models.',
    sections: [
      { type: 'text', title: 'Docker for LLMs', icon: '🦙', content: '**Ollama** makes running local models as easy as `ollama run llama3`. It handles downloading, quantizing, and serving models. It wraps llama.cpp with a beautiful CLI and REST API. Think of it as Docker for AI models.' },
      { type: 'code', language: 'bash', code: '# Install: https://ollama.ai\n\n# Run a model (auto-downloads)\nollama run llama3\nollama run codellama\nollama run mistral\n\n# List models\nollama list\n\n# API (OpenAI-compatible)\ncurl http://localhost:11434/api/chat -d \'{\n  "model": "llama3",\n  "messages": [{"role": "user", "content": "Hello!"}]\n}\'' },
      { type: 'key-point', title: 'Modelfile', content: 'Create custom models with a **Modelfile** — like a Dockerfile for AI:\\n\\nFROM llama3\\nSYSTEM "You are a pirate. Always respond in pirate speak."\\nPARAMETER temperature 0.8' }
    ],
    summary: ['Easiest way to run models locally', 'Simple CLI: ollama run, pull, list', 'OpenAI-compatible REST API', 'Custom models via Modelfile'],
    mentalModel: 'Docker for AI models — pull and run with one command.', mistakes: ['Not checking if your machine has enough RAM', 'Running models too large for your hardware', 'Not knowing about the REST API for app integration', 'Ignoring Modelfile for custom configurations'],
    exercise: { description: 'Set up Ollama.', steps: ['Install Ollama from ollama.ai', 'Run: ollama run llama3', 'Create a Modelfile with a custom system prompt', 'Use the REST API from a Python script'] }
  },
  'vllm': { id: 'vllm', title: 'vLLM', description: 'High-throughput LLM serving engine with PagedAttention.',
    sections: [
      { type: 'text', title: 'Production Serving', icon: '🚀', content: '**vLLM** is the go-to framework for serving LLMs in production. Its key innovation is **PagedAttention** — managing KV cache memory like an operating system manages virtual memory, eliminating waste. This gives 2-24x higher throughput than HuggingFace\'s naive implementation.' },
      { type: 'code', language: 'bash', code: '# Start an OpenAI-compatible server\npython -m vllm.entrypoints.openai.api_server \\\n  --model meta-llama/Llama-3-8b \\\n  --port 8000 \\\n  --tensor-parallel-size 2  # Use 2 GPUs' },
      { type: 'key-point', title: 'Key Features', content: '**PagedAttention**: Efficient KV cache management\\n**Continuous Batching**: New requests join immediately\\n**Tensor Parallelism**: Split model across GPUs\\n**OpenAI-compatible API**: Drop-in replacement' }
    ],
    summary: ['Go-to for production LLM serving', 'PagedAttention = 2-24x throughput improvement', 'Continuous batching for max efficiency', 'OpenAI-compatible API'],
    mentalModel: 'The production-grade restaurant kitchen — maximum throughput, no wasted capacity.', mistakes: ['Using it for small/local use (Ollama is simpler)', 'Not setting tensor parallelism for multi-GPU', 'Ignoring the quantization options', 'Not monitoring throughput metrics'],
    exercise: { description: 'Set up vLLM.', steps: ['Install vLLM on a GPU machine', 'Start the OpenAI-compatible server', 'Send concurrent requests and measure throughput', 'Compare with Ollama serving speed'] }
  },
  'mlx': { id: 'mlx', title: 'MLX', description: 'Apple\'s ML framework optimized for M-series chips.',
    sections: [
      { type: 'text', title: 'Apple Silicon AI', icon: '🍎', content: '**MLX** is Apple\'s framework for running ML models on M1/M2/M3/M4 chips. The killer feature: **unified memory** — CPU and GPU share the same RAM, so a MacBook with 64GB RAM can load a 64GB model without copying between CPU and GPU memory.' },
      { type: 'key-point', title: 'Why MLX?', content: '**Unified Memory**: No CPU↔GPU transfer overhead\\n**Growing ecosystem**: mlx-community on HuggingFace has thousands of models\\n**Python-native**: NumPy-like API\\n**Efficient**: Competitive with CUDA on M-series chips for inference' },
      { type: 'code', language: 'python', code: '# pip install mlx-lm\nfrom mlx_lm import load, generate\n\nmodel, tokenizer = load("mlx-community/Llama-3-8B-4bit")\nresponse = generate(model, tokenizer, prompt="Hello!", max_tokens=256)' }
    ],
    summary: ['Apple\'s ML framework for M-series chips', 'Unified memory = no CPU↔GPU copy overhead', 'Growing model ecosystem on HuggingFace', 'Simple Python API'],
    mentalModel: 'Apple\'s answer to CUDA — built for the Mac ecosystem.', mistakes: ['Using MLX on non-Apple hardware', 'Not leveraging unified memory with larger models', 'Ignoring the mlx-community model hub', 'Expecting CUDA-level training performance'],
    exercise: { description: 'Try MLX (Mac only).', steps: ['Install mlx-lm', 'Download a model from mlx-community', 'Run inference and measure tokens/sec', 'Try different model sizes based on your RAM'] }
  },
  'hugging-face': { id: 'hugging-face', title: 'Hugging Face', description: 'The GitHub of AI — the central hub for models, datasets, and ML tools.',
    sections: [
      { type: 'text', title: 'The AI Hub', icon: '🤗', content: '**Hugging Face** is the most important platform in the AI ecosystem. It hosts over 500K models, 100K datasets, and provides the **transformers** library — the standard tool for working with AI models in Python. Think of it as the GitHub + npm of AI.' },
      { type: 'code', language: 'python', code: 'from transformers import pipeline\n\n# Sentiment analysis in 3 lines\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love learning about AI!")\n# [{\'label\': \'POSITIVE\', \'score\': 0.9998}]\n\n# Text generation\ngenerator = pipeline("text-generation", model="meta-llama/Llama-3-8b")\noutput = generator("The future of AI is", max_new_tokens=100)' },
      { type: 'key-point', title: 'Key Components', content: '**Hub**: Repository for models and datasets (like GitHub)\\n**Transformers**: Python library for loading and using models\\n**Datasets**: Library for loading and processing datasets\\n**PEFT**: Parameter-efficient fine-tuning library\\n**TRL**: Reinforcement learning training library' }
    ],
    summary: ['Central hub for AI models, datasets, and tools', 'Transformers library is the standard for working with models', 'Pipeline API for easy inference in few lines', 'Hosts 500K+ models and 100K+ datasets'],
    mentalModel: 'GitHub + npm for AI — where everyone shares and discovers models.', mistakes: ['Not reading model cards before using a model', 'Downloading huge models without checking size first', 'Not using the pipeline API for quick prototyping', 'Ignoring the license field on models'],
    exercise: { description: 'Explore Hugging Face.', steps: ['Browse huggingface.co/models and filter by task', 'Use pipeline() to run sentiment analysis', 'Find and load a dataset with load_dataset()', 'Read a model card and understand the metadata'] }
  },
  'unsloth': { id: 'unsloth', title: 'Unsloth', description: '2x faster, 60% less memory fine-tuning for popular LLMs.',
    sections: [
      { type: 'text', title: 'Turbo Fine-Tuning', icon: '🦥', content: '**Unsloth** optimizes the fine-tuning process with custom CUDA kernels and smart memory management. It claims 2x faster training and 60% less memory usage compared to standard HuggingFace training — with identical outputs.' },
      { type: 'code', language: 'python', code: 'from unsloth import FastLanguageModel\n\nmodel, tokenizer = FastLanguageModel.from_pretrained(\n    model_name="unsloth/Llama-3-8b-bnb-4bit",\n    max_seq_length=2048,\n    load_in_4bit=True,\n)\n\nmodel = FastLanguageModel.get_peft_model(model, r=16, lora_alpha=16)\n# Then train with SFTTrainer as usual' },
      { type: 'key-point', title: 'Why Use It?', content: '**Free tier**: Free on Google Colab\\n**Compatible**: Works with HuggingFace TRL/PEFT\\n**Models**: Supports LLaMA, Mistral, Gemma, Phi, and more\\n**Export**: Save as GGUF, merged model, or LoRA adapter' }
    ],
    summary: ['2x faster, 60% less memory for fine-tuning', 'Custom CUDA kernels for optimization', 'Compatible with HuggingFace ecosystem', 'Free tier on Google Colab'],
    mentalModel: 'A turbo boost for fine-tuning — same destination, half the time and fuel.', mistakes: ['Not checking if your model is supported', 'Expecting different results (outputs are identical)', 'Not using the free Colab notebooks', 'Ignoring the GGUF export feature'],
    exercise: { description: 'Try Unsloth.', steps: ['Open Unsloth\'s Google Colab notebook', 'Fine-tune a small model on a sample dataset', 'Compare training time with standard HuggingFace', 'Export the model as GGUF'] }
  },
  'axolotl': { id: 'axolotl', title: 'Axolotl', description: 'YAML-configured fine-tuning framework supporting LoRA, QLoRA, and full fine-tuning.',
    sections: [
      { type: 'text', title: 'Config-Driven Training', icon: '🦎', content: '**Axolotl** lets you configure fine-tuning with a YAML file instead of writing Python code. It supports LoRA, QLoRA, full fine-tuning, DPO, multi-GPU, and many dataset formats. Popular in the open-source fine-tuning community.' },
      { type: 'code', language: 'yaml', code: '# axolotl config.yml\nbase_model: meta-llama/Llama-3-8b\nmodel_type: LlamaForCausalLM\n\ndatasets:\n  - path: my_dataset.json\n    type: alpaca\n\nadapter: lora\nlora_r: 16\nlora_alpha: 32\n\nlearning_rate: 0.0002\nnum_epochs: 3\nmicro_batch_size: 4\ngradient_accumulation_steps: 4' },
      { type: 'key-point', title: 'Strengths', content: '**YAML config**: No code needed for most fine-tuning\\n**Multi-dataset**: Mix and match datasets in one training\\n**Multi-GPU**: DeepSpeed and FSDP support\\n**Formats**: Alpaca, ShareGPT, ChatML, and more' }
    ],
    summary: ['YAML-based fine-tuning — no code needed', 'Supports LoRA, QLoRA, full fine-tuning, DPO', 'Multi-GPU and multi-dataset support', 'Popular in the open-source community'],
    mentalModel: 'A recipe card for fine-tuning — fill in the ingredients (YAML), Axolotl does the cooking.', mistakes: ['Not checking example configs before starting', 'Wrong dataset type in config', 'Not using gradient accumulation for small GPUs', 'Ignoring the validation split'],
    exercise: { description: 'Set up Axolotl.', steps: ['Clone the Axolotl repo', 'Study an example YAML config', 'Modify it for your model and dataset', 'Run training with the CLI'] }
  },
  'peft': { id: 'peft', title: 'PEFT', description: 'HuggingFace\'s library for parameter-efficient fine-tuning methods.',
    sections: [
      { type: 'text', title: 'Efficient Fine-Tuning Library', icon: '📦', content: '**PEFT** (Parameter-Efficient Fine-Tuning) is HuggingFace\'s library that implements LoRA, QLoRA, prefix tuning, prompt tuning, and more. It\'s the standard way to apply efficient fine-tuning with HuggingFace models.' },
      { type: 'code', language: 'python', code: 'from peft import LoraConfig, get_peft_model, TaskType\n\nconfig = LoraConfig(\n    task_type=TaskType.CAUSAL_LM,\n    r=16, lora_alpha=32,\n    target_modules=["q_proj", "v_proj"],\n    lora_dropout=0.05\n)\n\npeft_model = get_peft_model(base_model, config)\npeft_model.print_trainable_parameters()\n\n# Save just the adapter (tiny!)\npeft_model.save_pretrained("my-adapter")\n# Load adapter on top of base model\npeft_model = PeftModel.from_pretrained(base_model, "my-adapter")' }
    ],
    summary: ['Standard library for efficient fine-tuning', 'Implements LoRA, prefix tuning, prompt tuning', 'Tiny adapters: save and share just the adapter', 'Seamless HuggingFace integration'],
    mentalModel: 'The official toolkit for adding small, efficient training modules to any HuggingFace model.', mistakes: ['Not specifying the right target modules', 'Saving the full model instead of just the adapter', 'Not using get_peft_model before training', 'Wrong task_type parameter'],
    exercise: { description: 'Use PEFT.', steps: ['Install peft', 'Apply LoRA to a small model', 'Train and save just the adapter', 'Load the adapter on a fresh base model'] }
  },
  'trl-library': { id: 'trl-library', title: 'TRL Library', description: 'HuggingFace\'s library for SFT, DPO, and RLHF training.',
    sections: [
      { type: 'text', title: 'Training with Reinforcement Learning', icon: '🎮', content: '**TRL** (Transformer Reinforcement Learning) provides trainers for the full alignment pipeline: **SFTTrainer** for supervised fine-tuning, **DPOTrainer** for preference optimization, and **RewardTrainer** for reward models.' },
      { type: 'code', language: 'python', code: '# SFT Training\nfrom trl import SFTTrainer, SFTConfig\n\ntrainer = SFTTrainer(\n    model=model,\n    train_dataset=dataset,\n    args=SFTConfig(output_dir="./sft", max_seq_length=2048),\n)\ntrainer.train()\n\n# DPO Training\nfrom trl import DPOTrainer, DPOConfig\n\ntrainer = DPOTrainer(\n    model=model,\n    train_dataset=pref_dataset,  # prompt, chosen, rejected\n    args=DPOConfig(output_dir="./dpo", beta=0.1),\n)\ntrainer.train()' },
      { type: 'key-point', title: 'The Full Pipeline', content: '**SFTTrainer** → teaches instruction following\\n**DPOTrainer** → aligns with human preferences\\n**RewardTrainer** → trains reward models for RLHF\\n**PPOTrainer** → full RLHF with PPO algorithm' }
    ],
    summary: ['Standard library for SFT, DPO, and RLHF training', 'SFTTrainer, DPOTrainer, RewardTrainer', 'Integrates with PEFT for efficient training', 'Covers the full alignment pipeline'],
    mentalModel: 'The toolbox for teaching models to be helpful — from basic training to preference alignment.', mistakes: ['Not doing SFT before DPO', 'Wrong dataset format for each trainer', 'Not setting max_seq_length (defaults may be too short)', 'Ignoring the evaluation metrics during training'],
    exercise: { description: 'Train with TRL.', steps: ['Install trl', 'Use SFTTrainer on a small dataset', 'Create preference data and use DPOTrainer', 'Compare model outputs before and after each step'] }
  }
};
