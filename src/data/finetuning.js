export const finetuningTopics = {
  'lora': {
    id: 'lora', title: 'LoRA',
    description: 'Low-Rank Adaptation — fine-tune huge models on a single GPU by training tiny adapter matrices.',
    sections: [
      { type: 'text', title: 'The Problem LoRA Solves', icon: '💡', content: 'Full fine-tuning updates ALL parameters. A 7B model needs 50-80GB GPU memory. **LoRA** freezes original weights and adds tiny trainable matrices alongside them — training <1% of parameters with 90-99% of full fine-tuning quality.' },
      { type: 'analogy', title: 'Post-It Notes', content: 'Instead of rewriting a textbook (full fine-tuning), stick Post-It notes (LoRA adapters) on specific pages. The book stays intact, the notes are tiny, and you get most of the benefit.' },
      { type: 'diagram', content: '  Original Weight W (frozen): 4096 × 4096 = 67M params\n                    +\n  LoRA: A(4096×16) × B(16×4096) = 131K params\n\n  Result: W + A×B (original + small adjustment)', label: 'LoRA adds two small matrices instead of modifying the large original' },
      { type: 'code', language: 'python', code: 'from peft import LoraConfig, get_peft_model\n\nlora_config = LoraConfig(\n    r=16, lora_alpha=32,\n    target_modules=["q_proj","k_proj","v_proj","o_proj"],\n    lora_dropout=0.05, task_type="CAUSAL_LM"\n)\nmodel = get_peft_model(model, lora_config)\nmodel.print_trainable_parameters()\n# "trainable: 13M || all: 8B || 0.16%"' },
      { type: 'key-point', title: 'Key Parameters', content: '**Rank (r)**: Size of LoRA matrices. Common: 8, 16, 32, 64\\n**Alpha**: Scaling factor, usually 2× rank\\n**Target Modules**: Which layers to apply LoRA to (usually attention layers)' }
    ],
    summary: ['LoRA freezes original model, trains tiny adapter matrices', 'Reduces trainable parameters to <1%', 'Key settings: rank (r), alpha, target modules', 'Enables fine-tuning large models on consumer GPUs'],
    mentalModel: 'Post-It notes on a textbook — don\'t rewrite the book, just add small notes.',
    mistakes: ['Rank too high (wastes memory) or too low (underfits)', 'Not merging adapter into base model for faster inference', 'Only targeting attention layers — try MLP layers too', 'Forgetting alpha should be relative to rank'],
    exercise: { description: 'Fine-tune with LoRA.', steps: ['Install peft and transformers', 'Load a small model (Phi-3 or Gemma-2B)', 'Apply LoRA with r=16', 'Compare output before and after training'] }
  },
  'qlora': {
    id: 'qlora', title: 'QLoRA',
    description: 'Quantized LoRA — fine-tune a 65B model on one GPU using 4-bit quantization plus LoRA.',
    sections: [
      { type: 'text', title: 'LoRA + 4-bit', icon: '🔥', content: '**QLoRA** loads the base model in 4-bit precision (NF4) and applies LoRA on top. The base model uses ~4× less memory while LoRA keeps trainable parts in full precision. Fine-tune a 70B model on a single 48GB GPU.' },
      { type: 'comparison', title: 'Memory Comparison', headers: ['Method', '7B Model', '70B Model'], rows: [['Full FP16', '~60 GB', '~600 GB'],['LoRA FP16', '~18 GB', '~160 GB'],['QLoRA 4-bit', '~6 GB', '~48 GB']]},
      { type: 'code', language: 'python', code: 'from transformers import BitsAndBytesConfig\nimport torch\n\nbnb_config = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type="nf4",\n    bnb_4bit_compute_dtype=torch.bfloat16,\n    bnb_4bit_use_double_quant=True,\n)\nmodel = AutoModelForCausalLM.from_pretrained("model", quantization_config=bnb_config)' }
    ],
    summary: ['QLoRA = 4-bit base model + full-precision LoRA', 'NF4 + double quantization + paged optimizers', '70B models trainable on single 48GB GPU', 'Very close to full fine-tuning quality'],
    mentalModel: 'Compressing a textbook to pocket edition (4-bit) while writing Post-It notes (LoRA) in full detail.',
    mistakes: ['Not using NF4 (use regular INT4 instead)', 'Forgetting bfloat16 compute dtype', 'Not enabling double quantization', 'Expecting identical quality to full fine-tuning'],
    exercise: { description: 'Try QLoRA.', steps: ['Check GPU VRAM', 'Load a model in 4-bit', 'Apply LoRA and train', 'Compare quality and memory usage'] }
  },
  'dpo': {
    id: 'dpo', title: 'DPO',
    description: 'Direct Preference Optimization — align models with human preferences without a reward model.',
    sections: [
      { type: 'text', title: 'Simpler Alignment', icon: '🎯', content: '**DPO** directly uses preference pairs (chosen/rejected) to train — no separate reward model needed. It mathematically rearranges the RLHF objective into a simple supervised learning loss.' },
      { type: 'diagram', content: '  RLHF: Data → Reward Model → PPO (complex, 3 steps)\n  DPO:  Data → Direct Training (simple, 1 step)', label: 'DPO eliminates the reward model and RL steps' },
      { type: 'code', language: 'python', code: 'from trl import DPOTrainer, DPOConfig\n\nargs = DPOConfig(output_dir="./dpo-model", beta=0.1)\ntrainer = DPOTrainer(\n    model=model, args=args,\n    train_dataset=dataset,  # needs: prompt, chosen, rejected\n    tokenizer=tokenizer,\n)\ntrainer.train()' }
    ],
    summary: ['Uses preference pairs directly — no reward model', 'Much simpler than RLHF', 'Beta controls divergence from original model', 'Increasingly preferred over RLHF'],
    mentalModel: 'Showing good and bad examples side-by-side: "be more like this, less like that." Skip the middleman.',
    mistakes: ['Not doing SFT before DPO', 'Beta too low (diverges) or high (no learning)', 'Low-quality preference data', 'Expecting DPO to fix a weak base model'],
    exercise: { description: 'Compare DPO vs RLHF.', steps: ['Read the DPO paper abstract', 'Compare pipelines: 3 steps vs 1', 'Check benchmark results', 'Try DPOTrainer on sample data'] }
  },
  'rlhf': {
    id: 'rlhf', title: 'RLHF',
    description: 'Reinforcement Learning from Human Feedback — the technique that made ChatGPT helpful.',
    sections: [
      { type: 'text', title: 'Three-Step Pipeline', icon: '🏆', content: '**Step 1 — SFT**: Fine-tune on instruction data\\n**Step 2 — Reward Model**: Train a model to score responses using human preferences\\n**Step 3 — PPO**: Use the reward model to further train the main model via reinforcement learning' },
      { type: 'analogy', title: 'Dog Training', content: 'Step 1: Teach basic commands. Step 2: Define "good behavior" (treats system). Step 3: Dog practices to maximize treats.' },
      { type: 'diagram', content: '  Base → [SFT] → SFT Model\n  Human Rankings → [Train] → Reward Model\n  SFT Model + Reward → [PPO] → Aligned Model', label: 'The RLHF pipeline' }
    ],
    summary: ['3 steps: SFT → Reward Model → PPO', 'Aligns models with human preferences', 'Used by OpenAI for ChatGPT', 'More complex than DPO but historically gold standard'],
    mentalModel: 'Teach commands (SFT), define good behavior (reward model), practice until maximizing treats (PPO).',
    mistakes: ['Skipping SFT step', 'Reward hacking (tricks to score high)', 'Training PPO too long (instability)', 'Not using KL divergence constraint'],
    exercise: { description: 'Understand RLHF.', steps: ['Watch InstructGPT summary', 'Diagram the 3-step pipeline', 'Compare what each step adds', 'Research why DPO is simpler'] }
  },
  'quantization': {
    id: 'quantization', title: 'Quantization',
    description: 'Making models smaller and faster by reducing number precision.',
    sections: [
      { type: 'text', title: 'Precision Reduction', icon: '📉', content: 'Reduce number precision to use less memory. FP32 (4 bytes) → FP16 (2 bytes) → INT8 (1 byte) → INT4 (0.5 bytes). A 7B model: FP32=28GB, INT4=3.5GB.' },
      { type: 'comparison', title: 'Formats', headers: ['Format', 'Bits', '7B Size', 'Quality'], rows: [['FP32','32','28 GB','Full'],['FP16','16','14 GB','Negligible loss'],['INT8','8','7 GB','Minimal loss'],['INT4','4','3.5 GB','Small, acceptable loss']]},
      { type: 'key-point', title: 'Methods', content: '**GPTQ**: GPU-focused, uses calibration data\\n**AWQ**: Preserves important weights\\n**bitsandbytes**: HuggingFace integration, NF4\\n**GGUF**: CPU inference via llama.cpp' },
      { type: 'analogy', title: 'JPEG Compression', content: 'Like JPEG for images — smaller file, nearly same quality, compress too much and artifacts appear.' }
    ],
    summary: ['Reduces precision to save memory', 'INT4 = ~8x smaller than FP32', 'GPTQ, AWQ, GGUF are popular methods', 'Essential for running models on consumer hardware'],
    mentalModel: 'JPEG compression for AI — smaller but nearly same quality.',
    mistakes: ['INT2-3 and expecting good quality', 'No calibration dataset for GPTQ', 'Confusing training vs inference quantization', 'Assuming quantized is always worse'],
    exercise: { description: 'Compare quantized models.', steps: ['Download FP16 and Q4 versions', 'Run same prompts through both', 'Compare quality', 'Check memory and speed'] }
  },
  'model-checkpoints': {
    id: 'model-checkpoints', title: 'Model Checkpoints',
    description: 'Saving training snapshots to resume or pick the best model version.',
    sections: [
      { type: 'text', title: 'Save Points', icon: '💾', content: 'If your GPU crashes at hour 23 of 24, you lose everything without checkpoints. They save model weights, optimizer state, and training step. Also let you pick the best-performing version.' },
      { type: 'code', language: 'python', code: 'args = TrainingArguments(\n    save_strategy="steps", save_steps=500,\n    save_total_limit=3,\n    load_best_model_at_end=True,\n)\n# Resume: trainer.train(resume_from_checkpoint="checkpoint-1500")' },
      { type: 'key-point', title: 'SafeTensors', content: 'Use **safetensors** format — secure (no code injection like pickle), fast loading.' }
    ],
    summary: ['Save training state for resuming or model selection', 'Use safetensors format', 'Limit total checkpoints to save disk', 'Auto-select best with load_best_model_at_end'],
    mentalModel: 'Video game save points — don\'t start from the beginning if something goes wrong.',
    mistakes: ['Not saving frequently enough', 'Too many checkpoints (disk space)', 'Using pickle instead of safetensors', 'Not evaluating checkpoints to find the best'],
    exercise: { description: 'Practice checkpointing.', steps: ['Set up training with checkpoints every 100 steps', 'Interrupt and resume from a checkpoint', 'Compare loss across checkpoints', 'Keep only the best'] }
  },
  'adapter-tuning': {
    id: 'adapter-tuning', title: 'Adapter Tuning',
    description: 'Swapping small trained modules in and out of a base model for different tasks.',
    sections: [
      { type: 'text', title: 'One Model, Many Tasks', icon: '🔌', content: 'One base model + many adapters = multiple specialized models. Instead of storing 5 separate 14GB models, store one 14GB base + five 50MB adapters. Swap at runtime.' },
      { type: 'code', language: 'python', code: '# Load different adapters\nmedical = PeftModel.from_pretrained(base, "medical-adapter")\nlegal = PeftModel.from_pretrained(base, "legal-adapter")\n\n# Merge for production\nmerged = medical.merge_and_unload()\nmerged.save_pretrained("merged-model")' }
    ],
    summary: ['Adapters are small task-specific modules on a frozen base', 'Swap at runtime without reloading', 'Merge into base model for production', 'LoRA is the most popular adapter type'],
    mentalModel: 'Phone cases — one phone, many cases for different situations.',
    mistakes: ['Not merging for production', 'Mismatched base models', 'Too many adapters loaded simultaneously', 'Forgetting to save base model info with adapter'],
    exercise: { description: 'Train and swap adapters.', steps: ['Train two LoRA adapters for different tasks', 'Load both on the same base model', 'Compare outputs from each', 'Merge one and verify'] }
  },
  'gguf-models': {
    id: 'gguf-models', title: 'GGUF Models',
    description: 'The file format for running LLMs on CPU with llama.cpp.',
    sections: [
      { type: 'text', title: 'What is GGUF?', icon: '📦', content: '**GGUF** stores quantized model weights in a single file for CPU inference. Comes in levels: Q4_K_M (good balance), Q5_K_M (higher quality), Q8_0 (near-original).' },
      { type: 'comparison', title: 'Quant Levels', headers: ['Quant', '7B Size', 'Quality'], rows: [['Q2_K','~2.7 GB','Low'],['Q4_K_M','~4.1 GB','Good (recommended)'],['Q5_K_M','~4.8 GB','Very good'],['Q8_0','~7.2 GB','Near-perfect']]},
      { type: 'code', language: 'bash', code: '# Run with llama.cpp\n./llama-cli -m model-Q4_K_M.gguf -p "Hello" -n 256\n\n# Or with Ollama (uses GGUF internally)\nollama run llama3' }
    ],
    summary: ['Standard format for CPU inference', 'Q4_K_M is the sweet spot', 'Single portable file', 'Used by Ollama and llama.cpp'],
    mentalModel: 'MP3s for AI — compressed versions that play anywhere, with quality levels to choose.',
    mistakes: ['Q2 and expecting good quality', 'Trying to train a GGUF model', 'Not checking RAM requirements', 'Ignoring K variants (they\'re better)'],
    exercise: { description: 'Run a GGUF model.', steps: ['Download a Q4_K_M from HuggingFace', 'Install Ollama', 'Run and test with various prompts', 'Try different quant levels'] }
  }
};
