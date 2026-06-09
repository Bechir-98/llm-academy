export const inferenceTopics = {
  'kv-cache': {
    id: 'kv-cache', title: 'KV Cache',
    description: 'Caching key-value matrices to avoid redundant computation during text generation.',
    sections: [
      { type: 'text', title: 'Why Cache?', icon: '⚡', content: 'LLMs generate text one token at a time. Without caching, to generate token #100, the model would recompute attention for ALL previous 99 tokens. **KV Cache** stores the Key and Value matrices from previous tokens so they\'re computed only once.\\n\\nThis turns an O(n²) computation into O(n) per new token — a massive speedup. But it trades memory for speed: the cache grows with every generated token.' },
      { type: 'analogy', title: 'The Meeting Notes', content: 'Imagine a meeting where every time someone speaks, everyone re-reads ALL previous meeting notes from scratch. KV cache is like keeping the notes open — you only read the new addition, not everything again.' },
      { type: 'key-point', title: 'Memory Impact', content: 'KV cache memory = 2 × layers × heads × head_dim × sequence_length × bytes_per_param. For a 7B model with 4K context in FP16, that\'s about 1-2GB. For 128K context, it can be 30GB+ — sometimes more than the model itself!' }
    ],
    summary: ['Stores attention Key/Value matrices to avoid recomputation', 'Trades memory for speed — essential for fast generation', 'Memory grows linearly with context length', 'Without it, each new token would recompute everything'],
    mentalModel: 'Meeting notes that stay open — read only the new addition, not everything from scratch.',
    mistakes: ['Not accounting for KV cache in VRAM budgets', 'Ignoring cache size with long contexts', 'Not clearing cache between unrelated requests', 'Confusing KV cache with prompt caching'],
    exercise: { description: 'Understand KV cache impact.', steps: ['Calculate KV cache size for a 7B model at 4K vs 128K context', 'Run a model with and without KV cache, compare speed', 'Monitor VRAM usage as you generate longer outputs', 'Research PagedAttention (vLLM\'s efficient cache management)'] }
  },
  'flash-attention': {
    id: 'flash-attention', title: 'Flash Attention',
    description: 'A faster, memory-efficient attention algorithm that processes data in tiles.',
    sections: [
      { type: 'text', title: 'The IO Bottleneck', icon: '⚡', content: 'Standard attention is slow not because of math, but because of **memory reads/writes**. Moving data between GPU\'s fast SRAM and slow HBM is the bottleneck. **Flash Attention** restructures the computation to minimize these data transfers using a technique called **tiling** — processing attention in small blocks that fit in fast SRAM.' },
      { type: 'analogy', title: 'Kitchen vs Pantry', content: 'Imagine cooking where every ingredient trip requires walking to a distant pantry (HBM). Flash Attention is like bringing all ingredients to your counter (SRAM) first, cooking the dish, then putting everything back — fewer trips, faster cooking.' },
      { type: 'key-point', title: 'Benefits', content: '**2-4x faster** than standard attention\\n**Memory: O(N) instead of O(N²)** — enabling much longer contexts\\n**Exact** — not an approximation, gives identical results\\n**Flash Attention 2**: Even faster with better parallelism and work partitioning' },
      { type: 'code', language: 'python', code: '# Enable Flash Attention in HuggingFace\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Llama-3-8b",\n    attn_implementation="flash_attention_2",  # Just this!\n    torch_dtype=torch.bfloat16\n)' }
    ],
    summary: ['Reduces memory IO by processing attention in tiles', '2-4x faster, O(N) memory instead of O(N²)', 'Exact computation, not an approximation', 'Enabled with one line in HuggingFace'],
    mentalModel: 'Bringing ingredients to the counter instead of running to the pantry for each one.',
    mistakes: ['Not enabling it when available — free speedup', 'Assuming it changes model outputs — it doesn\'t', 'Not checking GPU compatibility (needs Ampere+)', 'Confusing Flash Attention with attention approximations'],
    exercise: { description: 'Enable Flash Attention.', steps: ['Install flash-attn package', 'Load a model with and without Flash Attention', 'Benchmark generation speed for both', 'Monitor VRAM usage difference'] }
  },
  'speculative-decoding': {
    id: 'speculative-decoding', title: 'Speculative Decoding',
    description: 'Using a small fast model to draft tokens, then a large model to verify them in parallel.',
    sections: [
      { type: 'text', title: 'Draft and Verify', icon: '🏃', content: 'Normal generation: the big model predicts one token at a time. **Speculative decoding** uses a small "draft" model to quickly predict 5-10 tokens ahead. Then the big model verifies all of them in ONE forward pass (which is parallelizable). If the draft was correct, you just generated 5-10 tokens in the time of ~1 — a 2-3x speedup.' },
      { type: 'analogy', title: 'The Editor and Writer', content: 'A fast writer (draft model) writes several paragraphs quickly. An expert editor (big model) reviews them all at once. If the writing is good, the editor approves it instantly. If not, they fix the first wrong sentence and discard the rest.' },
      { type: 'key-point', title: 'Key Properties', content: '**Mathematically identical output** — the big model\'s verification ensures quality matches\\n**2-3x speedup** on average for well-matched draft/target pairs\\n**Best when**: draft model agrees with target model most of the time\\n**No quality loss**: rejected tokens are regenerated by the big model' }
    ],
    summary: ['Small draft model proposes tokens, big model verifies in parallel', 'Mathematically identical output to normal generation', '2-3x speedup with no quality loss', 'Best when draft model is a good match for the target'],
    mentalModel: 'A fast writer drafts, an expert editor reviews in bulk — much faster than the expert writing from scratch.',
    mistakes: ['Using a draft model too different from the target', 'Expecting speedup when the draft model has low acceptance rate', 'Not measuring actual speedup — it varies by task', 'Confusing with model distillation'],
    exercise: { description: 'Understand speculative decoding.', steps: ['Research: which models support speculative decoding?', 'Try vLLM or HuggingFace\'s speculative decoding feature', 'Measure generation speed with and without speculation', 'Try different draft model sizes and measure acceptance rates'] }
  },
  'inference-optimization': {
    id: 'inference-optimization', title: 'Inference Optimization',
    description: 'A toolkit of techniques to make model inference faster and cheaper.',
    sections: [
      { type: 'text', title: 'The Optimization Menu', icon: '🛠️', content: 'There\'s no single silver bullet for fast inference. Instead, you combine multiple techniques. The main levers are: **reduce model size** (quantization), **reduce computation** (Flash Attention, pruning), **avoid redundant work** (KV cache, speculative decoding), **process more at once** (batching), and **use optimized runtimes** (vLLM, TensorRT).' },
      { type: 'comparison', title: 'Techniques Overview', headers: ['Technique', 'Speedup', 'Quality Impact'], rows: [
        ['Quantization (INT4)', '2-4x', 'Minimal'],
        ['Flash Attention', '2-4x', 'None'],
        ['KV Cache', '10-50x', 'None'],
        ['Continuous Batching', '2-5x throughput', 'None'],
        ['Speculative Decoding', '2-3x', 'None'],
        ['Model Distillation', '5-20x', 'Some loss'],
        ['torch.compile', '1.5-2x', 'None']
      ]},
      { type: 'key-point', title: 'Stack Them', content: 'These techniques compound. Quantization + Flash Attention + KV cache + batching together can give 10-50x improvement over a naive implementation. Always measure — the actual speedup depends on your specific model, hardware, and workload.' }
    ],
    summary: ['No single silver bullet — combine multiple techniques', 'Key levers: quantization, Flash Attention, caching, batching', 'Techniques compound for 10-50x total improvement', 'Always benchmark your specific setup'],
    mentalModel: 'A toolbox — each tool helps with a different bottleneck. Use them together for best results.',
    mistakes: ['Optimizing blindly without profiling first', 'Expecting one technique to solve everything', 'Ignoring the bottleneck — is it compute-bound or memory-bound?', 'Not measuring before/after each optimization'],
    exercise: { description: 'Profile and optimize inference.', steps: ['Set up a baseline inference benchmark', 'Apply optimizations one at a time', 'Measure speedup from each', 'Find which combination gives the best speed/quality ratio'] }
  },
  'model-serving': {
    id: 'model-serving', title: 'Model Serving',
    description: 'Running LLMs as APIs that handle multiple concurrent users.',
    sections: [
      { type: 'text', title: 'From Model to API', icon: '🌐', content: 'Model serving is the infrastructure that turns a trained model into a production API. It handles: loading the model, accepting HTTP requests, managing a queue, batching requests for efficiency, streaming responses, and auto-scaling based on demand.' },
      { type: 'comparison', title: 'Serving Frameworks', headers: ['Framework', 'Best For', 'Key Feature'], rows: [
        ['vLLM', 'High throughput', 'PagedAttention, continuous batching'],
        ['TGI (HuggingFace)', 'Easy deployment', 'Docker-based, OpenAI-compatible'],
        ['Ollama', 'Local/dev', 'Simple CLI, model management'],
        ['TensorRT-LLM', 'Max performance', 'NVIDIA-optimized, complex setup']
      ]},
      { type: 'code', language: 'python', code: '# Serve with vLLM (OpenAI-compatible API)\n# pip install vllm\n# python -m vllm.entrypoints.openai.api_server \\\n#   --model meta-llama/Llama-3-8b --port 8000\n\n# Then use it like OpenAI:\nfrom openai import OpenAI\nclient = OpenAI(base_url="http://localhost:8000/v1", api_key="none")\nresponse = client.chat.completions.create(\n    model="meta-llama/Llama-3-8b",\n    messages=[{"role": "user", "content": "Hello!"}]\n)' }
    ],
    summary: ['Model serving turns models into production APIs', 'vLLM is the go-to for high-throughput serving', 'OpenAI-compatible APIs make migration easy', 'Key concerns: batching, streaming, scaling'],
    mentalModel: 'A restaurant kitchen — taking orders (requests), cooking efficiently (batching), and serving dishes (responses).',
    mistakes: ['Not using batching — huge throughput waste', 'Single-request serving in production', 'Not implementing health checks and monitoring', 'Ignoring cold start times'],
    exercise: { description: 'Set up model serving.', steps: ['Install vLLM or Ollama', 'Start an OpenAI-compatible server', 'Send requests using the OpenAI Python client', 'Test with multiple concurrent requests'] }
  },
  'batch-inference': {
    id: 'batch-inference', title: 'Batch Inference',
    description: 'Processing many requests simultaneously for maximum throughput.',
    sections: [
      { type: 'text', title: 'Why Batch?', icon: '📦', content: 'GPUs are massively parallel processors. Sending one request at a time wastes most of the GPU\'s capacity. **Batching** groups multiple requests together to process simultaneously — like a bus carrying 50 people vs 50 individual taxis.\\n\\n**Continuous batching** (used by vLLM) is even smarter: as soon as one request finishes, a new one takes its slot without waiting for the whole batch.' },
      { type: 'analogy', title: 'The Elevator', content: 'Static batching = waiting until the elevator is full before moving. Continuous batching = the elevator moves immediately and picks up/drops off people at each floor. Much more efficient.' },
      { type: 'key-point', title: 'Throughput vs Latency', content: 'Batching increases **throughput** (requests per second) but may increase **latency** (time per request) since each request shares GPU time. The tradeoff depends on your use case: chatbots prioritize latency, batch processing prioritizes throughput.' }
    ],
    summary: ['Batching groups requests for parallel GPU processing', 'Continuous batching is the modern standard (vLLM)', 'Increases throughput 2-5x or more', 'Tradeoff: higher throughput may increase latency'],
    mentalModel: 'A bus vs taxis — one bus carrying many passengers is more efficient than individual rides.',
    mistakes: ['Processing requests one at a time', 'Static batching with variable-length requests', 'Not considering latency impact for interactive use', 'Batch sizes too large for available VRAM'],
    exercise: { description: 'Compare single vs batch inference.', steps: ['Set up a model with vLLM', 'Send 100 requests one at a time, measure total time', 'Send 100 requests concurrently, measure total time', 'Calculate throughput improvement'] }
  },
  'gpu-basics': {
    id: 'gpu-basics', title: 'GPU Basics',
    description: 'Why GPUs are essential for AI and how to choose the right one.',
    sections: [
      { type: 'text', title: 'Why GPUs?', icon: '🎮', content: 'CPUs are great at sequential tasks — one complex calculation at a time. GPUs have thousands of simpler cores that work in parallel. Neural networks involve millions of matrix multiplications that can run simultaneously — perfect for GPUs.\\n\\nA CPU might have 16 cores. An NVIDIA H100 GPU has 18,432 CUDA cores plus 640 Tensor Cores (specialized for AI math). This parallelism makes GPUs 10-100x faster for AI workloads.' },
      { type: 'comparison', title: 'Popular GPUs for AI', headers: ['GPU', 'VRAM', 'Best For', 'Approx. Cost'], rows: [
        ['RTX 4090', '24 GB', 'Local dev, small models', '$1,600'],
        ['A100 40GB', '40 GB', 'Training, serving', '$2-3/hr cloud'],
        ['A100 80GB', '80 GB', 'Large model training', '$3-4/hr cloud'],
        ['H100 80GB', '80 GB', 'Frontier training', '$4-6/hr cloud'],
        ['L40S', '48 GB', 'Inference', '$1.5-2/hr cloud']
      ]},
      { type: 'key-point', title: 'CUDA vs Tensor Cores', content: '**CUDA Cores**: General-purpose GPU computation. Good for everything.\\n**Tensor Cores**: Specialized units that do matrix multiply-accumulate operations much faster. Essential for training and inference at FP16/BF16/INT8 precision.' }
    ],
    summary: ['GPUs are 10-100x faster than CPUs for AI due to parallelism', 'VRAM is the primary constraint for model size', 'Tensor cores are specialized for AI math', 'RTX 4090 for personal use, A100/H100 for production'],
    mentalModel: 'CPU = one brilliant chef. GPU = 1000 prep cooks working simultaneously. AI is prep work.',
    mistakes: ['Buying a GPU with too little VRAM', 'Ignoring tensor core support', 'Not considering memory bandwidth (also matters!)', 'Assuming more CUDA cores always means faster'],
    exercise: { description: 'Assess your GPU needs.', steps: ['Check your current GPU with nvidia-smi', 'Calculate what models fit in your VRAM', 'Compare cloud GPU prices for your workload', 'Determine if you need training or inference GPUs'] }
  },
  'vram-basics': {
    id: 'vram-basics', title: 'VRAM Basics',
    description: 'How to calculate how much GPU memory your model needs.',
    sections: [
      { type: 'text', title: 'The Memory Budget', icon: '🧮', content: 'VRAM (Video RAM) is the GPU\'s memory. Everything must fit: the model weights, KV cache, activations, and (for training) gradients and optimizer states.\\n\\n**Quick formula for inference**: Parameters × bytes_per_param + KV cache\\n- 7B model in FP16: 7B × 2 bytes = 14GB + KV cache\\n- 7B model in INT4: 7B × 0.5 bytes = 3.5GB + KV cache\\n\\n**For training**: Multiply by 4-6x (gradients + optimizer states + activations)' },
      { type: 'comparison', title: 'VRAM Requirements', headers: ['Scenario', 'Formula', '7B Model'], rows: [
        ['Inference FP16', 'params × 2', '14 GB'],
        ['Inference INT4', 'params × 0.5', '3.5 GB'],
        ['LoRA Training', 'params × 2 + overhead', '~18 GB'],
        ['QLoRA Training', 'params × 0.5 + overhead', '~6 GB'],
        ['Full Fine-Tuning', 'params × 2 × 4', '~60 GB']
      ]},
      { type: 'key-point', title: 'When You Don\'t Have Enough', content: '**Quantize**: INT4 uses 4x less VRAM than FP16\\n**CPU Offloading**: Move some layers to CPU RAM (slower but works)\\n**Model Parallelism**: Split model across multiple GPUs\\n**Use llama.cpp**: Runs on CPU with system RAM' }
    ],
    summary: ['VRAM = GPU memory, must fit model + cache + overhead', 'Inference: params × bytes_per_param', 'Training: 4-6x more than inference', 'Quantization is the easiest way to reduce VRAM needs'],
    mentalModel: 'VRAM is your GPU\'s desk size — everything must fit on the desk or it doesn\'t work.',
    mistakes: ['Only counting model size, forgetting KV cache', 'Not accounting for training overhead (4-6x)', 'Running out of VRAM mid-training without checkpoints', 'Not trying quantization before buying more GPUs'],
    exercise: { description: 'Calculate VRAM needs.', steps: ['Pick 3 models of different sizes', 'Calculate VRAM for inference in FP16 and INT4', 'Calculate VRAM for QLoRA training', 'Check if they fit on your GPU'] }
  },
  'latency-vs-quality': {
    id: 'latency-vs-quality', title: 'Latency vs Quality Tradeoffs',
    description: 'Choosing the right balance between response speed and output quality.',
    sections: [
      { type: 'text', title: 'The Tradeoff', icon: '⚖️', content: 'Faster inference usually means lower quality. Bigger models produce better outputs but are slower. Quantized models are faster but slightly less capable. The right choice depends on your use case:\\n\\n**Low latency needed**: Chatbots, autocomplete, real-time features → use smaller/quantized models\\n**High quality needed**: Content generation, medical advice, code review → use larger models, accept slower speed' },
      { type: 'comparison', title: 'Tradeoff Examples', headers: ['Choice', 'Latency', 'Quality'], rows: [
        ['GPT-4 (cloud)', 'High (~2s TTFT)', 'Best'],
        ['LLaMA 70B Q4', 'Medium', 'Very good'],
        ['LLaMA 8B FP16', 'Low-Medium', 'Good'],
        ['Phi-3 Mini Q4', 'Very low', 'Acceptable'],
        ['Speculative decoding', 'Reduced', 'Same as large model']
      ]},
      { type: 'key-point', title: 'Decision Framework', content: 'Ask: **What is the cost of a wrong answer?** High cost (medical, legal) = prioritize quality. Low cost (casual chat, brainstorming) = prioritize speed. Many production systems use a **routing approach**: simple queries go to small/fast models, complex queries go to large/slow models.' }
    ],
    summary: ['Bigger models = better quality but slower', 'Quantization = faster but slight quality loss', 'Choose based on your use case\'s tolerance for errors', 'Routing can give the best of both worlds'],
    mentalModel: 'Fast food vs fine dining — pick based on what the situation demands.',
    mistakes: ['Always using the biggest model regardless of task', 'Always using the smallest model to save costs', 'Not measuring actual quality difference — it may be smaller than expected', 'Not considering routing as an option'],
    exercise: { description: 'Find your optimal tradeoff.', steps: ['Pick a task relevant to your project', 'Test with 3 model sizes: small, medium, large', 'Rate quality of each on 20 test examples', 'Measure latency and find the sweet spot'] }
  }
};
