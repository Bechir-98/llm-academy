export const deploymentTopics = {
  'local-inference': { id: 'local-inference', title: 'Local Inference', description: 'Running AI models on your own machine for privacy, control, and cost savings.',
    sections: [
      { type: 'text', title: 'Your Personal AI', icon: '🏠', content: 'Running models locally means your data never leaves your machine. No API costs, no rate limits, no privacy concerns. With quantized models and tools like Ollama, you can run capable LLMs on a laptop.' },
      { type: 'comparison', title: 'Local vs Cloud', headers: ['Aspect', 'Local', 'Cloud API'], rows: [['Privacy','Complete','Data goes to provider'],['Cost','Hardware only','Per-token pricing'],['Speed','Depends on hardware','Usually faster'],['Model choice','Any open model','Provider\'s models only'],['Setup','Some effort','Instant']] },
      { type: 'code', language: 'bash', code: '# Easiest way: Ollama\nollama run llama3\n\n# Or with Python\nfrom openai import OpenAI\nclient = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")\nresponse = client.chat.completions.create(\n    model="llama3", messages=[{"role":"user","content":"Hello!"}]\n)' },
      { type: 'key-point', title: 'Hardware Requirements', content: 'Rule of thumb for GGUF models: you need roughly **1GB RAM per billion parameters at Q4**. So a 7B model needs ~4-5GB, a 13B needs ~8-10GB. For GPU acceleration, you need VRAM. Mac unified memory counts for both.' }
    ],
    summary: ['Complete privacy — data never leaves your machine', 'No API costs or rate limits', 'Ollama makes it as easy as one command', 'Need sufficient RAM/VRAM for your model size'],
    mentalModel: 'A home kitchen vs eating out — full control, privacy, and no bills, but you provide the equipment.', mistakes: ['Trying to run models too large for your hardware', 'Not using quantized versions (GGUF Q4)', 'Forgetting about GPU acceleration options', 'Not trying Ollama first (easiest path)'],
    exercise: { description: 'Set up local AI.', steps: ['Install Ollama', 'Run: ollama run llama3', 'Build a simple Python app using the local API', 'Compare response quality with a cloud API'] }
  },
  'on-device-ai': { id: 'on-device-ai', title: 'On-Device AI', description: 'Running AI models directly on phones, tablets, and edge devices.',
    sections: [
      { type: 'text', title: 'AI in Your Pocket', icon: '📱', content: 'On-device AI runs models directly on phones and tablets — no internet needed. Apple, Google, and Qualcomm all have dedicated AI chips in their latest processors. Models like Phi-3 Mini and Gemma 2B are designed for this: small enough for mobile but capable enough to be useful.' },
      { type: 'key-point', title: 'Deployment Frameworks', content: '**CoreML**: Apple\'s framework for iOS/macOS\\n**TensorFlow Lite**: Google\'s mobile framework\\n**ONNX Runtime**: Cross-platform, Microsoft\\n**MediaPipe**: Google\'s on-device ML pipeline\\n**ExecuTorch**: Meta\'s PyTorch mobile runtime' },
      { type: 'comparison', title: 'On-Device vs Cloud', headers: ['Aspect', 'On-Device', 'Cloud'], rows: [['Latency','Ultra-low (no network)','Depends on connection'],['Privacy','Data stays on device','Data sent to server'],['Model size','Limited (1-4B params)','Unlimited'],['Offline','Works offline','Needs internet'],['Cost','Free after deployment','Per-query pricing']] }
    ],
    summary: ['AI running directly on phones/edge with no internet needed', 'Frameworks: CoreML, TF Lite, ONNX, ExecuTorch', 'Limited to small models (1-4B parameters)', 'Benefits: ultra-low latency, privacy, offline capability'],
    mentalModel: 'A calculator built into your phone — always available, no internet needed, but can\'t solve everything.', mistakes: ['Trying to run too-large models on device', 'Not optimizing/quantizing for mobile', 'Ignoring battery and thermal constraints', 'Not testing on actual devices (emulators lie)'],
    exercise: { description: 'Explore on-device AI.', steps: ['Research which models fit on your phone', 'Try an on-device AI demo app', 'Compare latency with a cloud API', 'Consider: what use cases benefit most from on-device?'] }
  },
  'api-serving': { id: 'api-serving', title: 'API Serving', description: 'Building REST APIs to serve LLM models to applications.',
    sections: [
      { type: 'text', title: 'Models as Services', icon: '🌐', content: 'To use a model in production, you wrap it in an API. Clients send HTTP requests, the server runs inference, and streams back responses. Key concerns: streaming (token-by-token), load balancing, rate limiting, and authentication.' },
      { type: 'code', language: 'python', code: '# FastAPI + vLLM serving\nfrom fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\nfrom vllm import LLM, SamplingParams\n\napp = FastAPI()\nllm = LLM(model="meta-llama/Llama-3-8b")\n\n@app.post("/chat")\nasync def chat(prompt: str):\n    params = SamplingParams(temperature=0.7, max_tokens=512)\n    output = llm.generate([prompt], params)\n    return {"response": output[0].outputs[0].text}\n\n# Or just use vLLM\'s built-in OpenAI-compatible server:\n# python -m vllm.entrypoints.openai.api_server --model llama3 --port 8000' },
      { type: 'key-point', title: 'Production Checklist', content: '**Streaming**: Send tokens as they\'re generated (SSE)\\n**Rate Limiting**: Prevent abuse\\n**Authentication**: API keys or OAuth\\n**Health Checks**: /health endpoint for monitoring\\n**Logging**: Track requests, latency, errors\\n**Load Balancing**: Distribute across multiple GPU workers' }
    ],
    summary: ['Wrap models in REST APIs for production use', 'vLLM\'s built-in server is the easiest approach', 'Must handle streaming, rate limiting, auth', 'Monitor health, latency, and errors'],
    mentalModel: 'A restaurant kitchen with a waiter — the API takes orders (requests), the kitchen cooks (inference), the waiter delivers (response).', mistakes: ['Not implementing streaming (users wait for full response)', 'No rate limiting (one user can overload the system)', 'Not monitoring latency and error rates', 'Missing health check endpoints'],
    exercise: { description: 'Build an API server.', steps: ['Start vLLM\'s OpenAI-compatible server', 'Build a simple client that calls the API', 'Add streaming support', 'Test with multiple concurrent requests'] }
  },
  'cloud-gpus': { id: 'cloud-gpus', title: 'Cloud GPUs', description: 'Renting GPU compute for training and inference without buying hardware.',
    sections: [
      { type: 'text', title: 'GPU Rental', icon: '☁️', content: 'An NVIDIA H100 costs ~$30,000 to buy. Cloud GPU providers let you rent them by the hour: $2-6/hr for an A100, $4-8/hr for an H100. Providers: RunPod, Lambda Labs, AWS, Google Cloud, Azure, Together AI.' },
      { type: 'comparison', title: 'GPU Options', headers: ['GPU', 'VRAM', 'Best For', 'Cloud Cost/hr'], rows: [['T4','16 GB','Small inference','$0.50-1'],['A10G','24 GB','Medium inference','$1-1.50'],['L40S','48 GB','Large inference','$1.50-2'],['A100 40GB','40 GB','Training','$2-3'],['A100 80GB','80 GB','Large training','$3-4'],['H100','80 GB','Frontier work','$4-8']] },
      { type: 'key-point', title: 'Spot vs On-Demand', content: '**On-demand**: Pay full price, guaranteed availability\\n**Spot/Preemptible**: 50-80% cheaper but can be interrupted anytime\\n**Reserved**: Commit for months, get discount\\n\\nUse spot for fault-tolerant training (with checkpoints). Use on-demand for serving.' }
    ],
    summary: ['Rent GPUs by the hour instead of buying', 'A100 ~$3/hr, H100 ~$5/hr', 'Spot instances = 50-80% cheaper but interruptible', 'Key providers: RunPod, Lambda, AWS, GCP'],
    mentalModel: 'Like renting a car vs buying — pay only when you need it.', mistakes: ['Using on-demand when spot would work (save 50-80%)', 'Not saving checkpoints when using spot instances', 'Over-provisioning GPU (using H100 for small models)', 'Not comparing prices across providers'],
    exercise: { description: 'Evaluate cloud GPU options.', steps: ['Compare prices across RunPod, Lambda, and AWS for A100', 'Calculate: for your workload, is spot or on-demand cheaper?', 'Estimate monthly cost for your training/inference needs', 'Try a free-tier or trial GPU to test your workflow'] }
  },
  'edge-ai': { id: 'edge-ai', title: 'Edge AI Basics', description: 'Running AI on IoT devices, embedded systems, and at the network edge.',
    sections: [
      { type: 'text', title: 'AI at the Edge', icon: '📡', content: '**Edge AI** runs models on devices close to where data is generated — security cameras, factory sensors, autonomous vehicles, drones — rather than sending data to the cloud. Benefits: ultra-low latency, privacy, works offline, reduces bandwidth.' },
      { type: 'key-point', title: 'Key Technologies', content: '**TinyML**: ML on microcontrollers (Arduino, ESP32)\\n**ONNX Runtime**: Efficient cross-platform inference\\n**TensorRT**: NVIDIA\'s inference optimizer for edge GPUs\\n**NVIDIA Jetson**: Edge AI hardware platform\\n**Qualcomm AI Engine**: For mobile/IoT chips' },
      { type: 'comparison', title: 'Edge vs Cloud AI', headers: ['Aspect', 'Edge AI', 'Cloud AI'], rows: [['Latency','<10ms','50-500ms'],['Privacy','Data stays local','Data sent to cloud'],['Internet','Not needed','Required'],['Model size','Tiny (KB-MB)','Unlimited'],['Use cases','Real-time, embedded','Complex, large-scale']] }
    ],
    summary: ['AI running on devices close to the data source', 'Ultra-low latency, works offline, preserves privacy', 'Technologies: TinyML, ONNX, TensorRT, Jetson', 'Limited to small, optimized models'],
    mentalModel: 'A security guard on-site vs calling a remote monitoring center — the on-site guard responds instantly.', mistakes: ['Trying to run LLMs on edge devices (too big)', 'Not optimizing models for target hardware', 'Ignoring power consumption constraints', 'Not testing in real-world conditions'],
    exercise: { description: 'Explore edge AI.', steps: ['Research NVIDIA Jetson or Raspberry Pi AI projects', 'Try running a small model on edge hardware', 'Measure latency vs cloud inference', 'Identify use cases where edge AI is essential'] }
  }
};
