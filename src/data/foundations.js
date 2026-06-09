export const foundationsTopics = {
  'llm-basics': {
    id: 'llm-basics',
    title: 'LLM Basics',
    description: 'What Large Language Models are, how they predict the next word, and why they feel like magic.',
    sections: [
      { type: 'text', title: 'What is an LLM?', icon: '🤖', content: 'A **Large Language Model** (LLM) is a computer program that has read billions of pages of text and learned patterns in language. Think of it as a super-powered autocomplete — the same feature on your phone keyboard that suggests the next word, but taken to an extreme level.\\n\\nWhen you type "The weather today is" your phone might suggest "nice" or "sunny." An LLM does the same thing, but it can write entire essays, answer questions, write code, and even reason through problems — all by predicting one word (actually one **token**) at a time.\\n\\nThe "Large" in LLM refers to two things: the enormous amount of text it was trained on (often the entire internet), and the huge number of **parameters** (adjustable numbers) inside the model — ranging from a few billion to hundreds of billions.' },
      { type: 'analogy', title: 'The Library Analogy', content: 'Imagine a person who has read every book in every library in the world. They cannot look up exact pages anymore, but they remember patterns, styles, facts, and relationships between ideas. When you ask them a question, they don\'t "search" for the answer — they reconstruct it from all the patterns they absorbed. That\'s essentially what an LLM does. It has "compressed" the knowledge from its training data into patterns stored in its parameters.' },
      { type: 'key-point', title: 'Next-Token Prediction', content: 'At its core, an LLM does ONE thing: given some text, predict the most likely next piece of text. It does this over and over — predicting one token, adding it to the text, then predicting the next, and so on. A 500-word response means the model made roughly 650+ individual predictions in sequence.' },
      { type: 'code', language: 'python', code: '# Conceptually, this is what an LLM does:\nprompt = "The capital of France is"\n\n# The model calculates probabilities for every possible next token:\n# "Paris" -> 95.2%\n# "Lyon"  -> 1.1%\n# "a"     -> 0.8%\n# ...thousands more options\n\n# It picks one (usually the most likely) and repeats:\noutput = "Paris"  # Now the text is "The capital of France is Paris"\n# Then it predicts the next token after "Paris": "." -> 87%\n# And so on...' },
      { type: 'comparison', title: 'LLMs vs Traditional Software', headers: ['Feature', 'Traditional Software', 'LLM'], rows: [
        ['How it works', 'Follows exact rules written by programmers', 'Learned patterns from data'],
        ['Handling new inputs', 'Crashes or errors if input is unexpected', 'Gives a best-guess response'],
        ['Creativity', 'Zero — only does what\'s coded', 'Can generate novel text, ideas, code'],
        ['Accuracy', '100% correct for programmed cases', 'Usually right but can make mistakes'],
        ['Example', 'Calculator app', 'ChatGPT']
      ]}
    ],
    summary: [
      'LLMs are programs that learned language patterns from massive amounts of text',
      'They work by predicting the next token, one at a time',
      'They don\'t "know" things — they\'ve learned statistical patterns',
      'The "Large" refers to both training data size and parameter count',
      'They can generate text, answer questions, write code, and more'
    ],
    mentalModel: 'Think of an LLM as the world\'s most well-read autocomplete. It doesn\'t understand like a human — it predicts based on patterns from trillions of words.',
    mistakes: [
      'Thinking LLMs actually "understand" or "think" — they predict patterns, not reason like humans',
      'Trusting LLM outputs as always factual — they can confidently generate wrong information',
      'Believing LLMs store and retrieve exact documents — they store compressed patterns, not files',
      'Expecting LLMs to be consistent — the same prompt can give different answers each time'
    ],
    exercise: { description: 'Get hands-on with an LLM to understand next-token prediction.', steps: [
      'Go to ChatGPT or any free LLM and type: "Complete this sentence: The best way to learn programming is"',
      'Run the same prompt 5 times and note how the answers differ — this shows the probabilistic nature',
      'Try giving the model an incomplete sentence with an obvious next word, like "Water is ___" — see how it predicts the obvious token',
      'Ask it a factual question and then verify the answer — notice how it can sometimes be confidently wrong'
    ]}
  },

  'how-ai-models-work': {
    id: 'how-ai-models-work',
    title: 'How AI Models Work',
    description: 'Understanding neural networks, layers, weights, and how machines learn from data.',
    sections: [
      { type: 'text', title: 'The Brain Inspiration', icon: '🧬', content: 'AI models are inspired by how our brains work. Your brain has billions of tiny cells called **neurons** connected to each other. When you learn something new — like recognizing a cat — certain connections between neurons get stronger. AI models work similarly.\\n\\nAn **artificial neural network** is made of layers of virtual "neurons" (just math functions). Data flows through these layers, and the connections between neurons have **weights** — numbers that determine how much influence one neuron has on the next. Learning means adjusting these weights until the network produces the right outputs.' },
      { type: 'diagram', content: 'Input Layer      Hidden Layers       Output Layer\n   ┌─┐          ┌─┐    ┌─┐            ┌─┐\n   │●│──────────│●│────│●│────────────│●│ → "cat"\n   ├─┤     ╱    ├─┤    ├─┤      ╲     ├─┤\n   │●│────╱─────│●│────│●│───────╲────│●│ → "dog"\n   ├─┤  ╱╱     ├─┤    ├─┤        ╲   └─┘\n   │●│─╱───────│●│────│●│─────────╲\n   └─┘         └─┘    └─┘\n  (pixels)   (patterns) (features)  (prediction)', label: 'A simple neural network: data flows left to right through layers' },
      { type: 'analogy', title: 'The Cooking Analogy', content: 'Imagine you\'re learning to bake the perfect cake. Each ingredient amount is a **weight**. At first, you guess: 2 cups flour, 1 cup sugar. You taste it — too sweet! So you reduce sugar (adjust weight). You try again — too dry! Add more butter (adjust another weight). After hundreds of attempts, you find the perfect recipe. That\'s exactly how neural networks learn: they try, measure the error, adjust weights, and repeat — thousands or millions of times.' },
      { type: 'key-point', title: 'Three Key Concepts', content: '**Weights**: Numbers that control the strength of connections between neurons. A model with 7 billion parameters has 7 billion of these adjustable numbers.\\n\\n**Bias**: An extra number added at each neuron that helps shift the output. Think of it as a starting point.\\n\\n**Activation Function**: A rule that decides whether a neuron should "fire" (pass its signal forward). It adds non-linearity — without it, the network could only learn simple straight-line patterns.' },
      { type: 'text', title: 'How Learning Happens', icon: '📚', content: 'Training a neural network follows a loop called **gradient descent**:\\n\\n1. **Forward Pass**: Send data through the network and get a prediction\\n2. **Loss Calculation**: Measure how wrong the prediction was (using a "loss function")\\n3. **Backward Pass (Backpropagation)**: Calculate which weights caused the most error\\n4. **Weight Update**: Slightly adjust those weights to reduce the error\\n5. **Repeat**: Do this millions of times with different data\\n\\nEach complete pass through all training data is called an **epoch**. Modern LLMs train for many epochs on trillions of tokens.' }
    ],
    summary: [
      'Neural networks are layers of math functions inspired by brain neurons',
      'Weights are the adjustable numbers that store learned knowledge',
      'Learning = repeatedly adjusting weights to reduce prediction errors',
      'Forward pass makes predictions; backward pass (backpropagation) fixes errors',
      'Modern LLMs have billions of weights organized in sophisticated architectures'
    ],
    mentalModel: 'A neural network is like a massive recipe with billions of ingredient amounts (weights). Training is the process of tasting and adjusting until the recipe is perfect.',
    mistakes: [
      'Thinking AI models work like databases that store and look up answers',
      'Confusing model size (parameters) with intelligence — bigger isn\'t always better',
      'Assuming training is a one-time thing — it\'s an iterative process with many cycles',
      'Believing each neuron in AI works like a brain neuron — it\'s a very loose analogy'
    ],
    exercise: { description: 'Visualize how a neural network learns.', steps: [
      'Visit playground.tensorflow.org — a free interactive neural network visualizer',
      'Choose the "spiral" dataset (the hardest pattern to learn)',
      'Start with 1 hidden layer and 2 neurons — click play and watch it fail',
      'Add more layers and neurons and retrain — see how it learns more complex patterns'
    ]}
  },

  'tokens': {
    id: 'tokens',
    title: 'Tokens',
    description: 'The smallest pieces of text that LLMs actually read and write — not characters, not words, but tokens.',
    sections: [
      { type: 'text', title: 'What Are Tokens?', icon: '🧩', content: 'Humans read text as words and sentences. LLMs read text as **tokens** — small chunks that can be words, parts of words, or even single characters. Think of tokens as the "atoms" of language for AI models.\\n\\nThe word "hello" is usually 1 token. The word "understanding" might be split into "under" + "stand" + "ing" — 3 tokens. A space before a word is often included in the token, so " hello" (with a leading space) is one token.\\n\\nWhy not just use individual characters? Because that would be incredibly inefficient. The sentence "I love pizza" is 12 characters but only about 3-4 tokens. Using characters would make the model\'s job much harder and slower.' },
      { type: 'diagram', content: '"ChatGPT is amazing at writing code"\n\n  Token 1: "Chat"\n  Token 2: "G"\n  Token 3: "PT"\n  Token 4: " is"\n  Token 5: " amazing"\n  Token 6: " at"\n  Token 7: " writing"\n  Token 8: " code"\n\n  = 8 tokens for a 6-word sentence', label: 'How a sentence gets broken into tokens (actual tokenization may vary by model)' },
      { type: 'key-point', title: 'Why Tokens Matter', content: 'Tokens affect everything: **cost** (APIs charge per token), **speed** (more tokens = slower), **context limits** (models can only process a fixed number of tokens at once), and **output quality** (how text is split affects what the model "sees").\\n\\nA rough rule of thumb: **1 token ≈ 4 characters** or **¾ of a word** in English. So 1,000 tokens ≈ 750 words.' },
      { type: 'analogy', title: 'LEGO Bricks', content: 'Think of tokens like LEGO bricks. You could build everything from individual tiny dots (characters), but it would take forever. Instead, you use pre-made shapes (tokens) of different sizes — some small, some large — that snap together efficiently. Common combinations get their own special brick. Rare combinations use smaller, generic bricks.' },
      { type: 'code', language: 'python', code: '# Using OpenAI\'s tiktoken to see tokens in action\nimport tiktoken\n\nenc = tiktoken.encoding_for_model("gpt-4")\n\ntext = "Hello, world! LLMs are fascinating."\ntokens = enc.encode(text)\n\nprint(f"Text: {text}")\nprint(f"Number of tokens: {len(tokens)}")\nprint(f"Token IDs: {tokens}")\n\n# Decode each token to see the pieces:\nfor t in tokens:\n    print(f"  Token {t} -> \'{enc.decode([t])}\'")\n\n# Output:\n# Text: Hello, world! LLMs are fascinating.\n# Number of tokens: 8\n# Token IDs: [9906, 11, 1917, 0, 445, 11237, 527, 25679, 13]' }
    ],
    summary: [
      'Tokens are chunks of text — the smallest unit LLMs work with',
      'They can be whole words, subwords, or characters',
      'Roughly 1 token ≈ 4 characters or ¾ of a word in English',
      'Everything in LLMs is measured in tokens: cost, speed, and context limits',
      'Common words = fewer tokens; rare/technical words = more tokens'
    ],
    mentalModel: 'Tokens are like LEGO bricks for language. Common words get big convenient bricks; rare words get assembled from smaller pieces.',
    mistakes: [
      'Assuming 1 word = 1 token — many words are split into multiple tokens',
      'Ignoring that different models use different tokenizers — token counts vary',
      'Forgetting that non-English languages often use MORE tokens per word',
      'Not counting tokens before sending to an API — leads to surprise costs or truncation'
    ],
    exercise: { description: 'Explore how tokenization works with a real tokenizer.', steps: [
      'Visit platform.openai.com/tokenizer (OpenAI\'s free tokenizer tool)',
      'Type a simple English sentence and count the tokens',
      'Try the same sentence in another language (Arabic, Chinese, etc.) — notice more tokens',
      'Type a code snippet and see how code gets tokenized differently from prose'
    ]}
  },

  'tokenization': {
    id: 'tokenization',
    title: 'Tokenization',
    description: 'The process of converting raw text into tokens that an LLM can process.',
    sections: [
      { type: 'text', title: 'The Tokenization Process', icon: '⚙️', content: 'Before an LLM can read your text, it needs to convert it into numbers — because computers only understand numbers. **Tokenization** is the process of breaking text into tokens and mapping each token to a unique number (an ID).\\n\\nEvery LLM has a fixed **vocabulary** — a dictionary of all tokens it knows. GPT-4 has about 100,000 tokens in its vocabulary. If a word isn\'t in the vocabulary, it gets split into smaller pieces that are.\\n\\nThe most common tokenization method is called **Byte-Pair Encoding (BPE)**. Here\'s how it works: start with individual characters, then repeatedly merge the most common pair of characters into a new token. "t" + "h" → "th", "th" + "e" → "the". After many merges, you get a vocabulary of common subwords.' },
      { type: 'diagram', content: 'Step 1: Start with characters\n  "l o w e r" "l o w e s t" "n e w e r"\n\nStep 2: Most common pair is "e"+"r" → merge to "er"\n  "l o w er" "l o w e s t" "n e w er"\n\nStep 3: Next common pair "l"+"o" → merge to "lo"\n  "lo w er" "lo w e s t" "n e w er"\n\nStep 4: "lo"+"w" → merge to "low"\n  "low er" "low e s t" "n e w er"\n\n...and so on until vocabulary size is reached', label: 'Byte-Pair Encoding (BPE) builds tokens by merging common character pairs' },
      { type: 'comparison', title: 'Popular Tokenizers', headers: ['Tokenizer', 'Used By', 'Vocab Size', 'Key Feature'], rows: [
        ['tiktoken', 'GPT-3.5, GPT-4', '~100K', 'Fast, byte-level BPE'],
        ['SentencePiece', 'LLaMA, Mistral', '32K-64K', 'Language-agnostic, works on raw text'],
        ['WordPiece', 'BERT', '~30K', 'Prefix-based splitting (##)'],
        ['HF Tokenizers', 'Many open-source', 'Varies', 'Fast Rust-based, flexible']
      ]},
      { type: 'code', language: 'python', code: '# See tokenization in action with HuggingFace\nfrom transformers import AutoTokenizer\n\ntokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b")\n\ntext = "Tokenization is surprisingly important!"\ntokens = tokenizer.tokenize(text)\nids = tokenizer.encode(text)\n\nprint(f"Original: {text}")\nprint(f"Tokens: {tokens}")\nprint(f"IDs: {ids}")\n\n# Decode back to text\nprint(f"Decoded: {tokenizer.decode(ids)}")' },
      { type: 'key-point', title: 'Special Tokens', content: 'Tokenizers add special tokens that help the model understand structure: **[BOS]** (Beginning of Sequence), **[EOS]** (End of Sequence), **[PAD]** (Padding for batching), and sometimes **[INST]** or **<|user|>** for chat formatting. These are crucial for the model to know where messages start and end.' }
    ],
    summary: [
      'Tokenization converts text into numbers (token IDs) that models can process',
      'BPE is the most common method — it builds vocabulary by merging frequent character pairs',
      'Different models use different tokenizers with different vocabularies',
      'Special tokens mark boundaries like start/end of text and user/assistant turns',
      'Tokenization quality directly impacts model performance'
    ],
    mentalModel: 'Tokenization is like a translator that converts human language into the model\'s number language. Each model has its own phrasebook (vocabulary).',
    mistakes: [
      'Using the wrong tokenizer for a model — each model needs its specific tokenizer',
      'Ignoring special tokens when formatting inputs for chat models',
      'Assuming all languages tokenize equally — CJK and Arabic use way more tokens',
      'Not considering tokenization when calculating costs or context limits'
    ],
    exercise: { description: 'Compare tokenizers to see how they differ.', steps: [
      'Install tiktoken and transformers: pip install tiktoken transformers',
      'Tokenize the same sentence with GPT-4\'s tiktoken and LLaMA\'s tokenizer',
      'Compare token counts and how words are split differently',
      'Try tokenizing emoji, code, and non-English text to see the differences'
    ]}
  },

  'context-windows': {
    id: 'context-windows',
    title: 'Context Windows',
    description: 'The maximum amount of text an LLM can "see" and work with at one time.',
    sections: [
      { type: 'text', title: 'What is a Context Window?', icon: '📏', content: 'Every LLM has a limit on how much text it can process at once. This limit is called the **context window** (or context length). It\'s measured in tokens and includes EVERYTHING — your input, the conversation history, system prompts, AND the model\'s output.\\n\\nThink of it as the model\'s "working memory." Just like you can only keep so many things in your head at once, the model can only work with a fixed amount of text. Once you exceed the context window, the oldest information gets dropped or the request fails.' },
      { type: 'analogy', title: 'The Desk Analogy', content: 'Imagine your desk has limited space. You can spread out a certain number of papers (tokens) at once. If you need to look at a new document but your desk is full, you have to remove some papers to make room. The context window is the size of your desk — bigger desk means you can see more documents simultaneously, but there\'s always a limit.' },
      { type: 'comparison', title: 'Context Window Sizes', headers: ['Model', 'Context Window', 'Roughly Equivalent To'], rows: [
        ['GPT-3 (original)', '2,048 tokens', '~1,500 words (3 pages)'],
        ['GPT-3.5 Turbo', '16,384 tokens', '~12,000 words (24 pages)'],
        ['GPT-4', '128,000 tokens', '~96,000 words (a novel)'],
        ['Claude 3.5', '200,000 tokens', '~150,000 words (2-3 novels)'],
        ['Gemini 1.5 Pro', '1,000,000 tokens', '~750,000 words (15 novels)']
      ]},
      { type: 'key-point', title: 'Context = Input + Output', content: 'A common mistake: the context window is shared between input AND output. If your model has a 4,096 token context window and your prompt uses 3,000 tokens, the model can only generate up to 1,096 tokens in its response. This is why very long prompts sometimes produce truncated answers.' },
      { type: 'text', title: 'Why Can\'t We Just Make It Infinite?', icon: '🤔', content: 'The attention mechanism in transformers (which we\'ll learn about soon) has a cost that grows **quadratically** with context length. Double the context = 4x the compute. This means longer contexts are exponentially more expensive in terms of memory and processing time.\\n\\nResearchers are constantly working on techniques like **RoPE scaling**, **ALiBi**, and **sliding window attention** to extend context windows without the full cost. But there\'s always a tradeoff between context length and speed/cost.' }
    ],
    summary: [
      'Context window = maximum tokens a model can process at once',
      'It includes everything: system prompt + user input + conversation history + output',
      'Bigger context windows let you work with longer documents but cost more',
      'The cost of attention grows quadratically with context length',
      'Modern models range from 4K to 1M+ tokens'
    ],
    mentalModel: 'The context window is the model\'s desk size — it can only spread out so many papers at once. Bigger desk = more info visible, but also more expensive.',
    mistakes: [
      'Forgetting that output tokens count toward the context limit',
      'Stuffing the entire context with input and leaving no room for the response',
      'Assuming the model remembers previous conversations — each API call starts fresh',
      'Not realizing that quality often degrades in the middle of very long contexts ("lost in the middle" problem)'
    ],
    exercise: { description: 'Experience context window limits first-hand.', steps: [
      'Use ChatGPT and paste a very long document (5,000+ words) followed by a question',
      'Ask a detail from the beginning, middle, and end of the document',
      'Notice if the model handles the beginning and end better than the middle',
      'Try splitting the document into smaller chunks and asking about each separately'
    ]}
  },

  'embeddings': {
    id: 'embeddings',
    title: 'Embeddings',
    description: 'How AI turns words and sentences into numbers (vectors) that capture meaning.',
    sections: [
      { type: 'text', title: 'What Are Embeddings?', icon: '📐', content: 'Computers can\'t directly understand words. They need numbers. **Embeddings** are the solution — they convert words, sentences, or documents into lists of numbers (called **vectors**) that capture the meaning of the text.\\n\\nThe magic is that similar meanings produce similar numbers. The embedding for "king" will be numerically close to "queen" but far from "pizza." This lets computers do math with meaning — something that sounds impossible but works incredibly well.' },
      { type: 'analogy', title: 'The GPS Coordinates Analogy', content: 'Think of embeddings like GPS coordinates for meaning. Just as GPS coordinates (latitude, longitude) place cities on a map where nearby cities have similar coordinates, embeddings place words in a "meaning space" where similar words are close together.\\n\\n"Paris" and "London" would be near each other (both capitals). "Paris" and "microwave" would be far apart. But instead of 2 dimensions (lat/long), embeddings use hundreds or thousands of dimensions to capture many aspects of meaning.' },
      { type: 'diagram', content: '  Meaning Space (simplified to 2D)\n\n  "queen" ★         ★ "king"\n                ★ "prince"\n  "duchess" ★\n\n\n           ★ "car"\n  "truck" ★    ★ "bus"\n\n\n                    ★ "pizza"\n           ★ "pasta"\n  "sushi" ★', label: 'Words with similar meanings cluster together in embedding space' },
      { type: 'code', language: 'python', code: '# Generate embeddings using OpenAI\nfrom openai import OpenAI\nclient = OpenAI()\n\ndef get_embedding(text):\n    response = client.embeddings.create(\n        input=text,\n        model="text-embedding-3-small"\n    )\n    return response.data[0].embedding\n\n# Get embeddings for two sentences\nemb1 = get_embedding("I love dogs")\nemb2 = get_embedding("I adore puppies")\nemb3 = get_embedding("The stock market crashed")\n\n# Calculate similarity (cosine similarity)\nimport numpy as np\ndef cosine_sim(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nprint(cosine_sim(emb1, emb2))  # ~0.92 (very similar!)\nprint(cosine_sim(emb1, emb3))  # ~0.35 (not similar)' },
      { type: 'key-point', title: 'Why Embeddings Matter', content: 'Embeddings are the foundation of: **Semantic search** (finding relevant documents by meaning, not keywords), **RAG** (Retrieval-Augmented Generation), **Recommendation systems**, **Clustering** similar documents, and **Classification**. They\'re one of the most practically useful concepts in all of AI.' }
    ],
    summary: [
      'Embeddings convert text into numerical vectors that capture meaning',
      'Similar meanings produce similar vectors (close in space)',
      'They typically have hundreds to thousands of dimensions',
      'They enable semantic search, RAG, and many AI applications',
      'Different embedding models produce different quality representations'
    ],
    mentalModel: 'Embeddings are GPS coordinates for meaning — every piece of text gets a location in "meaning space" where similar things are neighbors.',
    mistakes: [
      'Using the wrong embedding model for your task — different models excel at different things',
      'Comparing embeddings from different models — they live in different spaces',
      'Ignoring embedding dimensions — higher isn\'t always better for your use case',
      'Not normalizing embeddings before calculating similarity'
    ],
    exercise: { description: 'Experiment with embeddings to see semantic similarity.', steps: [
      'Use OpenAI\'s API or a free alternative to generate embeddings for 10 different sentences',
      'Group sentences into pairs: similar meaning, opposite meaning, and unrelated',
      'Calculate cosine similarity between all pairs',
      'Verify that similar sentences have high similarity scores and unrelated ones have low scores'
    ]}
  },

  'transformers': {
    id: 'transformers',
    title: 'Transformers',
    description: 'The revolutionary architecture behind ChatGPT, LLaMA, and virtually every modern LLM.',
    sections: [
      { type: 'text', title: 'The Architecture That Changed Everything', icon: '🏗️', content: 'In 2017, Google published a paper called **"Attention Is All You Need"** that introduced the **Transformer** architecture. It replaced older approaches (RNNs, LSTMs) and became the foundation for virtually every modern AI model — GPT, BERT, LLaMA, Claude, Gemini — they\'re all Transformers.\\n\\nBefore Transformers, AI models processed text one word at a time, in order — like reading a book word by word. Transformers can look at ALL words simultaneously and figure out which words relate to each other. This **parallelism** made them much faster to train and much better at understanding context.' },
      { type: 'analogy', title: 'The Meeting Room Analogy', content: 'Imagine a meeting where people speak one at a time (old approach — RNNs). It\'s slow, and by the time person #20 speaks, everyone forgot what person #1 said.\\n\\nNow imagine everyone writes their point on a whiteboard simultaneously (Transformer approach). Everyone can see everyone else\'s point and draw connections. Person #20 can directly reference person #1. This is much faster and produces better understanding.' },
      { type: 'diagram', content: '       The Transformer Architecture (Simplified)\n\n       ┌─────────────────────────────────┐\n       │        OUTPUT PROBABILITIES      │\n       └────────────────┬────────────────┘\n                        │\n       ┌────────────────┴────────────────┐\n       │         Linear + Softmax        │\n       └────────────────┬────────────────┘\n                        │\n       ┌────────────────┴────────────────┐\n       │    Transformer Block × N        │\n       │  ┌───────────────────────────┐  │\n       │  │  Multi-Head Attention     │  │\n       │  │  + Add & Normalize        │  │\n       │  │  Feed-Forward Network     │  │\n       │  │  + Add & Normalize        │  │\n       │  └───────────────────────────┘  │\n       └────────────────┬────────────────┘\n                        │\n       ┌────────────────┴────────────────┐\n       │   Token Embeddings + Position   │\n       └────────────────┬────────────────┘\n                        │\n       ┌────────────────┴────────────────┐\n       │          INPUT TOKENS           │\n       └─────────────────────────────────┘', label: 'Data flows upward through stacked transformer blocks' },
      { type: 'comparison', title: 'Three Types of Transformers', headers: ['Type', 'Example', 'Best For'], rows: [
        ['Encoder-only', 'BERT', 'Understanding text (classification, search)'],
        ['Decoder-only', 'GPT, LLaMA', 'Generating text (chatbots, writing)'],
        ['Encoder-Decoder', 'T5, BART', 'Translation, summarization']
      ]},
      { type: 'key-point', title: 'Key Components', content: 'Each Transformer block has two main parts:\\n\\n**1. Self-Attention**: Lets each token "look at" every other token to understand context. "The cat sat on the mat because **it** was tired" — attention helps "it" understand that it refers to "the cat."\\n\\n**2. Feed-Forward Network (FFN)**: Processes each token independently through a small neural network. This is where much of the "knowledge" is stored — factual information, language patterns, etc.' }
    ],
    summary: [
      'Transformers process all tokens simultaneously instead of one-by-one',
      'They use self-attention to find relationships between all words',
      'They were introduced in 2017 and power all modern LLMs',
      'Decoder-only transformers (like GPT) are used for text generation',
      'They stack multiple identical blocks — more blocks = more capacity'
    ],
    mentalModel: 'A Transformer is like a room full of people who can all read each other\'s notes simultaneously (attention) and then individually think about what they read (feed-forward). Stack many such rooms for deeper understanding.',
    mistakes: [
      'Confusing Transformers (the architecture) with the Transformers library (HuggingFace\'s Python package)',
      'Thinking transformers process text sequentially — their power comes from parallelism',
      'Not understanding that LLMs only use the decoder part of the original architecture',
      'Assuming more layers always means better — there are diminishing returns'
    ],
    exercise: { description: 'Visualize how transformers process text.', steps: [
      'Visit the BertViz tool (bertviz.io) to see attention patterns visually',
      'Input a sentence like "The animal didn\'t cross the street because it was too wide"',
      'Look at which words "it" pays attention to — does it attend to "street" or "animal"?',
      'Try different sentences and see how attention patterns change'
    ]}
  },

  'attention-mechanism': {
    id: 'attention-mechanism',
    title: 'Attention Mechanism',
    description: 'How transformers figure out which words are related to each other using Query, Key, and Value.',
    sections: [
      { type: 'text', title: 'The Heart of Transformers', icon: '🎯', content: 'The **attention mechanism** is what makes transformers so powerful. It answers the question: "For each word in a sentence, which other words should it pay attention to?"\\n\\nIn "The cat sat on the mat because **it** was tired," the word "it" needs to know it refers to "cat" — not "mat." The attention mechanism calculates this automatically by computing how "related" every pair of words is.' },
      { type: 'analogy', title: 'The Library Research Analogy', content: 'Imagine you\'re researching a topic in a library:\\n\\n- Your **Query (Q)** is your research question: "Tell me about climate change effects on oceans"\\n- Each book\'s **Key (K)** is its title/summary: "Ocean Temperature Trends", "Italian Cooking", "Marine Biology"\\n- Each book\'s **Value (V)** is its actual content\\n\\nYou compare your Query against every Key to find which books are relevant (high attention score). Then you read the Values of the relevant books. That\'s exactly how attention works — Q finds relevant K\'s, then reads their V\'s.' },
      { type: 'diagram', content: '  How Attention Works (Simplified)\n\n  Input: "The cat sat"\n\n  Each word generates 3 vectors: Q, K, V\n\n  For the word "sat":\n  1. Create Query: "What am I looking for?"\n  2. Compare Query against all Keys:\n     sat.Q × The.K = 0.1  (low attention)\n     sat.Q × cat.K = 0.7  (high attention!)\n     sat.Q × sat.K = 0.2  (some self-attention)\n  3. Use scores to weight Values:\n     Output = 0.1×The.V + 0.7×cat.V + 0.2×sat.V\n\n  Result: "sat" now carries context about "cat"', label: 'Attention computes relevance scores between all token pairs' },
      { type: 'key-point', title: 'Multi-Head Attention', content: 'One attention "head" can only capture one type of relationship. **Multi-head attention** runs several attention operations in parallel, each learning different patterns:\\n\\n- Head 1 might learn grammatical relationships (subject-verb)\\n- Head 2 might learn positional relationships (adjacent words)\\n- Head 3 might learn semantic relationships (synonyms, references)\\n\\nGPT-3 uses 96 attention heads. Each head sees a different "perspective" of the text.' },
      { type: 'code', language: 'python', code: '# Simplified attention calculation\nimport numpy as np\n\ndef attention(Q, K, V):\n    """Scaled dot-product attention"""\n    d_k = K.shape[-1]  # dimension of keys\n    \n    # Step 1: Compare queries against keys\n    scores = np.matmul(Q, K.T) / np.sqrt(d_k)\n    \n    # Step 2: Convert to probabilities (softmax)\n    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)\n    \n    # Step 3: Weighted sum of values\n    output = np.matmul(weights, V)\n    \n    return output, weights\n\n# The formula: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) × V' }
    ],
    summary: [
      'Attention lets each token figure out which other tokens are relevant to it',
      'It uses three vectors per token: Query (what I\'m looking for), Key (what I offer), Value (my content)',
      'Attention scores = how well each Query matches each Key',
      'Multi-head attention captures different types of relationships in parallel',
      'The formula is: softmax(QK^T / √d_k) × V'
    ],
    mentalModel: 'Attention is like a researcher (Query) scanning book titles (Keys) to find relevant books, then reading their content (Values). Multiple researchers (heads) look for different things simultaneously.',
    mistakes: [
      'Thinking attention is a simple keyword match — it\'s learned and context-dependent',
      'Confusing Q, K, V with the input tokens — they\'re linear projections (transformations) of the input',
      'Forgetting the scaling factor (√d_k) — without it, large dimensions cause extreme softmax values',
      'Assuming attention is always correct — it can attend to wrong tokens, especially in longer contexts'
    ],
    exercise: { description: 'Understand attention by building intuition.', steps: [
      'Take the sentence: "The dog chased the ball because it was fun"',
      'Manually decide: for the word "it", which words should get high attention? Why?',
      'Now try: "The dog chased the ball because it was round" — does "it" refer to the same thing?',
      'Realize that attention must learn these subtle differences from data'
    ]}
  },

  'parameters': {
    id: 'parameters',
    title: 'Parameters',
    description: 'The billions of numbers inside a model that store everything it has learned.',
    sections: [
      { type: 'text', title: 'What Are Parameters?', icon: '🔢', content: 'When people say a model has "7 billion parameters," they mean it contains 7 billion adjustable numbers. These numbers are the **weights** and **biases** in the neural network — they\'re what the model learned during training.\\n\\nThink of parameters as the model\'s "memory." Every fact, pattern, language rule, and ability is encoded across these billions of numbers. No single parameter stores a fact — knowledge is distributed across many parameters working together.' },
      { type: 'analogy', title: 'The Brain Synapses Analogy', content: 'Your brain has about 100 trillion synapses (connections between neurons). Each synapse has a "strength" that determines how much one neuron influences another. These strengths are what allow you to recognize faces, understand language, and ride a bike.\\n\\nModel parameters are like these synaptic strengths — billions of numbers that collectively encode knowledge and abilities. Just as you can\'t point to one synapse and say "this stores my name," you can\'t point to one parameter and say "this knows the capital of France."' },
      { type: 'comparison', title: 'Model Sizes', headers: ['Model', 'Parameters', 'VRAM Needed (FP16)', 'Quality Level'], rows: [
        ['Phi-3 Mini', '3.8B', '~8 GB', 'Good for simple tasks'],
        ['LLaMA 3 8B', '8B', '~16 GB', 'Strong general purpose'],
        ['LLaMA 3 70B', '70B', '~140 GB', 'Excellent, near-frontier'],
        ['GPT-4 (estimated)', '~1.8T (MoE)', '~1000+ GB', 'Frontier quality'],
        ['LLaMA 3 405B', '405B', '~810 GB', 'Top-tier open source']
      ]},
      { type: 'key-point', title: 'Where Do Parameters Live?', content: 'Parameters are stored in different parts of the transformer:\\n\\n- **Embedding layers**: Convert tokens to vectors (~2-5% of parameters)\\n- **Attention layers (Q, K, V, Output matrices)**: Enable tokens to relate to each other (~30-35% of parameters)\\n- **Feed-forward networks (FFN)**: Store factual knowledge and patterns (~60-65% of parameters)\\n\\nThis is why most of a model\'s "knowledge" lives in the FFN layers.' },
      { type: 'text', title: 'Bigger = Better? Not Always', icon: '📊', content: 'More parameters generally means more knowledge capacity, but there are diminishing returns. A 70B model isn\'t 10x better than a 7B model. Also, **data quality matters more than model size**. A well-trained 7B model on excellent data can outperform a poorly trained 70B model.\\n\\nThe trend is moving toward smaller but better-trained models. Phi-3 (3.8B) outperforms models 10x its size because it was trained on very high-quality data.' }
    ],
    summary: [
      'Parameters are the billions of numbers (weights + biases) that store learned knowledge',
      'Knowledge is distributed across parameters, not stored in individual ones',
      'More parameters = more capacity, but quality of training data matters more',
      'Most parameters (~60%) live in feed-forward layers, which store factual knowledge',
      'Each parameter typically uses 2 bytes (FP16) or 4 bytes (FP32) of memory'
    ],
    mentalModel: 'Parameters are like billions of volume knobs on a massive mixing board. Each knob alone does little, but together they produce the entire "sound" (intelligence) of the model.',
    mistakes: [
      'Equating more parameters with "smarter" — training data quality matters more',
      'Not considering VRAM when choosing a model — bigger models need expensive GPUs',
      'Ignoring that parameter count affects inference speed — bigger = slower',
      'Assuming all parameters are equally important — many can be removed with minimal quality loss'
    ],
    exercise: { description: 'Understand model sizes and their practical implications.', steps: [
      'Research: How many parameters do GPT-4, Claude 3, LLaMA 3, and Phi-3 have?',
      'Calculate the memory needed for each (parameters × 2 bytes for FP16)',
      'Check what GPU you have (or could rent) and determine which models would fit',
      'Find a benchmark comparison showing that some small models beat larger ones'
    ]}
  },

  'training-vs-inference': {
    id: 'training-vs-inference',
    title: 'Training vs Inference',
    description: 'The two phases of an AI model\'s life: learning from data vs. generating responses.',
    sections: [
      { type: 'text', title: 'Two Phases, Two Purposes', icon: '⚡', content: '**Training** is when the model learns from data. It sees billions of text examples, makes predictions, checks how wrong it was, and adjusts its parameters. This happens once (or occasionally for updates) and is extremely expensive — GPT-4 reportedly cost over $100 million to train.\\n\\n**Inference** is when the trained model generates responses to your questions. Every time you use ChatGPT, that\'s inference. It uses the frozen (fixed) parameters learned during training to predict tokens. This is much cheaper per use but happens millions of times.' },
      { type: 'analogy', title: 'The Student Analogy', content: 'Training is like a student spending 4 years in university — reading textbooks, doing exercises, taking exams, learning from mistakes. It\'s a long, expensive process.\\n\\nInference is like that same graduate working at a job — using their education to solve problems quickly. They don\'t study anymore; they apply what they learned. Each task (inference) is quick and cheap, but relies entirely on the quality of their education (training).' },
      { type: 'comparison', title: 'Training vs Inference Comparison', headers: ['Aspect', 'Training', 'Inference'], rows: [
        ['Purpose', 'Learn patterns from data', 'Generate responses to prompts'],
        ['Cost', 'Millions of dollars', 'Fractions of a cent per query'],
        ['Duration', 'Weeks to months', 'Milliseconds to seconds'],
        ['Hardware', '1000s of GPUs in parallel', '1-8 GPUs typically'],
        ['Parameters', 'Being adjusted constantly', 'Frozen (fixed)'],
        ['Data needed', 'Trillions of tokens', 'Just the user\'s prompt'],
        ['Frequency', 'Once (or rarely)', 'Millions of times per day']
      ]},
      { type: 'key-point', title: 'Forward Pass vs. Backward Pass', content: '**Forward pass** (used in both): Data flows through the network to produce a prediction.\\n\\n**Backward pass** (training only): After the forward pass, the error is calculated and sent backward through the network. Each parameter\'s contribution to the error is computed (via **backpropagation**), and parameters are slightly adjusted.\\n\\nInference only needs the forward pass, which is why it\'s much faster and cheaper than training.' },
      { type: 'text', title: 'The Training Pipeline', icon: '🔄', content: 'Modern LLMs go through multiple training stages:\\n\\n**1. Pre-training**: Learn language from massive text data (most expensive)\\n**2. Supervised Fine-Tuning (SFT)**: Learn to follow instructions from curated examples\\n**3. RLHF/DPO**: Learn human preferences — what makes a "good" vs "bad" response\\n\\nEach stage uses different data and objectives, progressively making the model more helpful and aligned with human expectations.' }
    ],
    summary: [
      'Training = learning from data (expensive, done once); Inference = generating responses (cheap, done constantly)',
      'Training adjusts parameters; inference uses frozen parameters',
      'Training needs thousands of GPUs for weeks; inference needs 1-8 GPUs for seconds',
      'The forward pass happens in both; the backward pass only in training',
      'Modern LLMs have multi-stage training: pre-training → SFT → RLHF'
    ],
    mentalModel: 'Training is like going to school (expensive, takes years, learn everything). Inference is like answering questions at work (quick, cheap, use what you learned).',
    mistakes: [
      'Thinking the model "learns" during inference — it doesn\'t, parameters are frozen',
      'Underestimating training costs — even fine-tuning can cost hundreds to thousands of dollars',
      'Confusing inference speed with model quality — faster doesn\'t mean worse',
      'Not realizing that inference optimization is a separate and important field'
    ],
    exercise: { description: 'Experience the difference between training and inference.', steps: [
      'Use any free LLM (ChatGPT, Claude) and note how fast it responds — that\'s inference',
      'Look up training costs for GPT-4, LLaMA 3, and Mistral — notice the huge difference',
      'Research how many GPUs were used and for how long',
      'Calculate the ratio: training cost vs. cost-per-inference — appreciate the economics'
    ]}
  },

  'open-vs-closed-source': {
    id: 'open-vs-closed-source',
    title: 'Open vs Closed Source Models',
    description: 'Understanding the tradeoffs between models you can download and models you can only access through APIs.',
    sections: [
      { type: 'text', title: 'Two Worlds of AI', icon: '🔓', content: '**Closed-source models** (like GPT-4, Claude, Gemini) are owned by companies. You can only access them through APIs — you can\'t see their code, weights, or training data. The company controls everything.\\n\\n**Open-source/Open-weight models** (like LLaMA, Mistral, Qwen) release their model weights publicly. You can download them, run them locally, fine-tune them, and even build products with them. Some release training code and data too.\\n\\nNote: "Open-weight" is more accurate than "open-source" for most models, since they release the weights but not always the training code and data.' },
      { type: 'comparison', title: 'Side-by-Side Comparison', headers: ['Factor', 'Open-Source', 'Closed-Source'], rows: [
        ['Cost', 'Free to download; pay for compute', 'Pay per token via API'],
        ['Privacy', 'Data stays on your machines', 'Data goes to the provider'],
        ['Customization', 'Full fine-tuning, modification', 'Limited to prompting'],
        ['Quality (top-end)', 'Very good (LLaMA 405B)', 'Best available (GPT-4, Claude)'],
        ['Control', 'Full control over everything', 'Subject to provider\'s rules'],
        ['Support', 'Community-driven', 'Enterprise support available'],
        ['Speed to deploy', 'Need infrastructure setup', 'API call and done'],
        ['Examples', 'LLaMA 3, Mistral, Qwen, Gemma', 'GPT-4, Claude, Gemini']
      ]},
      { type: 'key-point', title: 'When to Use Which?', content: '**Choose open-source when**: Privacy is critical (healthcare, finance), you need to fine-tune for a specific task, you want to avoid vendor lock-in, or you want to minimize long-term costs at scale.\\n\\n**Choose closed-source when**: You need the absolute best quality, you want to ship fast without infrastructure, your usage volume is low, or you need enterprise support and guarantees.' },
      { type: 'text', title: 'The Open-Source Ecosystem is Booming', icon: '🚀', content: 'The gap between open and closed models is shrinking fast. In 2023, open models were far behind GPT-4. By 2024-2025, models like LLaMA 3 405B and Qwen 2.5 72B are competitive with GPT-4 on many benchmarks.\\n\\nMeta\'s strategy with LLaMA has been transformative — giving away state-of-the-art models for free, letting the community improve them. Mistral AI from France has also been releasing excellent open models.\\n\\nThe future likely involves using a mix: closed-source for the hardest tasks and open-source for everything else.' }
    ],
    summary: [
      'Closed-source: access via API only; best quality; less control',
      'Open-source: download and run locally; full control; slightly lower quality at the top end',
      'The quality gap is shrinking rapidly',
      'Open-source is better for privacy, customization, and long-term costs',
      'Most practitioners use a mix of both'
    ],
    mentalModel: 'Closed-source = renting an apartment (convenient, maintained for you, landlord\'s rules). Open-source = owning your home (full control, you maintain it, your rules).',
    mistakes: [
      'Assuming open-source means lower quality — top open models rival GPT-4',
      'Ignoring licensing terms — some "open" models have restrictions on commercial use',
      'Not considering infrastructure costs — running open models requires GPUs',
      'Defaulting to closed-source without evaluating if open-source meets your needs'
    ],
    exercise: { description: 'Compare open and closed models on a real task.', steps: [
      'Pick a task: summarization, code generation, or question answering',
      'Test it with GPT-4 (closed) and LLaMA 3 via Ollama (open)',
      'Compare quality, speed, and note any differences',
      'Calculate: what would each cost at 1 million requests per month?'
    ]}
  }
};
