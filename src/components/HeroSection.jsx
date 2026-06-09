function HeroSection({ sections, allTopics, completedTopics, totalTopics, onSelectSection, onSelectTopic }) {
  const sectionColors = {
    'foundations': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    'datasets-training': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'fine-tuning': 'linear-gradient(135deg, #f97316, #ea580c)',
    'inference-optimization': 'linear-gradient(135deg, #06b6d4, #0891b2)',
    'local-ai': 'linear-gradient(135deg, #10b981, #059669)',
    'rag-memory': 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    'agents-workflows': 'linear-gradient(135deg, #f43f5e, #e11d48)',
    'model-types': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'deployment': 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    'evaluation': 'linear-gradient(135deg, #10b981, #06b6d4)',
    'real-world': 'linear-gradient(135deg, #f97316, #f43f5e)',
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-badge">
          ✨ Interactive Learning Platform
        </div>
        <h1 className="hero-title">
          Master <span className="gradient-text">LLM Engineering</span>
          <br />From Zero to Hero
        </h1>
        <p className="hero-subtitle">
          A comprehensive, mentor-guided journey through modern AI engineering.
          Learn transformers, fine-tuning, RAG, agents, and everything in between — explained simply.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">{totalTopics}</div>
            <div className="hero-stat-label">Topics</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">{sections.length}</div>
            <div className="hero-stat-label">Modules</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">{completedTopics.length}</div>
            <div className="hero-stat-label">Completed</div>
          </div>
        </div>
      </section>

      <div className="category-grid">
        {sections.map(section => {
          const sectionCompleted = section.topics.filter(t => completedTopics.includes(t)).length;
          return (
            <div
              key={section.id}
              className="category-card"
              style={{ '--card-accent': sectionColors[section.id] || 'var(--gradient-primary)' }}
              onClick={() => onSelectSection(section.id)}
            >
              <div className="category-card-icon">{section.icon}</div>
              <div className="category-card-title">{section.title}</div>
              <div className="category-card-count">
                {sectionCompleted}/{section.topics.length} topics completed
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default HeroSection;
