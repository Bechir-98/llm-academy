import CodeBlock from './CodeBlock';

function renderTextWithBold(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function ContentSection({ section, index }) {
  switch (section.type) {
    case 'text':
      return (
        <div className="content-section">
          {section.title && (
            <h2 className="section-title">
              <span className="section-icon">{section.icon || '📖'}</span>
              {section.title}
            </h2>
          )}
          {section.content.split('\\n').map((para, i) => (
            <p className="content-text" key={i}>
              {renderTextWithBold(para)}
            </p>
          ))}
        </div>
      );

    case 'analogy':
      return (
        <div className="info-card analogy">
          <div className="info-card-label">💡 Real-World Analogy{section.title ? `: ${section.title}` : ''}</div>
          <div className="info-card-content">
            {section.content.split('\\n').map((para, i) => (
              <p key={i} style={{ marginBottom: i < section.content.split('\\n').length - 1 ? '8px' : 0 }}>
                {renderTextWithBold(para)}
              </p>
            ))}
          </div>
        </div>
      );

    case 'key-point':
      return (
        <div className="info-card key-point">
          <div className="info-card-label">🔑 Key Point{section.title ? `: ${section.title}` : ''}</div>
          <div className="info-card-content">
            {section.content.split('\\n').map((para, i) => (
              <p key={i} style={{ marginBottom: i < section.content.split('\\n').length - 1 ? '8px' : 0 }}>
                {renderTextWithBold(para)}
              </p>
            ))}
          </div>
        </div>
      );

    case 'warning':
      return (
        <div className="info-card warning">
          <div className="info-card-label">⚠️ Important{section.title ? `: ${section.title}` : ''}</div>
          <div className="info-card-content">
            {section.content.split('\\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '8px' }}>
                {renderTextWithBold(para)}
              </p>
            ))}
          </div>
        </div>
      );

    case 'success':
      return (
        <div className="info-card success">
          <div className="info-card-label">✅ Pro Tip{section.title ? `: ${section.title}` : ''}</div>
          <div className="info-card-content">
            {section.content.split('\\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '8px' }}>
                {renderTextWithBold(para)}
              </p>
            ))}
          </div>
        </div>
      );

    case 'code':
      return <CodeBlock language={section.language} code={section.code} />;

    case 'diagram':
      return (
        <div className="diagram-box">
          <pre>{section.content}</pre>
          {section.label && <div className="diagram-label">{section.label}</div>}
        </div>
      );

    case 'comparison':
      return (
        <div className="content-section">
          {section.title && <h3 className="section-title" style={{ fontSize: '18px' }}>{section.title}</h3>}
          <table className="comparison-table">
            <thead>
              <tr>
                {section.headers.map((h, i) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => <td key={ci}>{renderTextWithBold(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'list':
      return (
        <div className="content-section">
          {section.title && (
            <h3 className="section-title" style={{ fontSize: '18px' }}>
              {section.icon && <span className="section-icon">{section.icon}</span>}
              {section.title}
            </h3>
          )}
          <ul className="icon-list">
            {section.items.map((item, i) => (
              <li key={i}>
                <span className="icon">{item.icon || '▸'}</span>
                <span>{renderTextWithBold(item.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

function TopicPage({ topic, topicIndex, section, isCompleted, onMarkComplete, prevTopic, nextTopic, onNavigate }) {
  if (!topic) return null;

  return (
    <div className="topic-page">
      <div className="topic-header">
        <div className="topic-breadcrumb">
          {section && (
            <>
              <span>{section.icon}</span>
              <span className="topic-breadcrumb-section">{section.title}</span>
              <span>/</span>
            </>
          )}
          <span>Topic {topicIndex}</span>
        </div>
        <div className="topic-number">{topicIndex}</div>
        <h1 className="topic-title">{topic.title}</h1>
        <p className="topic-description">{topic.description}</p>
      </div>

      {topic.sections && topic.sections.map((s, i) => (
        <ContentSection key={i} section={s} index={i} />
      ))}

      {topic.summary && (
        <div className="summary-box">
          <h3>📝 Summary</h3>
          <ul>
            {topic.summary.map((point, i) => (
              <li key={i}>{renderTextWithBold(point)}</li>
            ))}
          </ul>
        </div>
      )}

      {topic.mentalModel && (
        <div className="mental-model">
          <h4>🧠 Mental Model</h4>
          <p>{renderTextWithBold(topic.mentalModel)}</p>
        </div>
      )}

      {topic.mistakes && (
        <div className="mistakes-box">
          <h4>🚫 Beginner Mistakes to Avoid</h4>
          <ul>
            {topic.mistakes.map((m, i) => (
              <li key={i}>{renderTextWithBold(m)}</li>
            ))}
          </ul>
        </div>
      )}

      {topic.exercise && (
        <div className="exercise-box">
          <h4>🏋️ Exercise / Mini Project</h4>
          <p style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {renderTextWithBold(topic.exercise.description)}
          </p>
          <ol>
            {topic.exercise.steps.map((step, i) => (
              <li key={i}>{renderTextWithBold(step)}</li>
            ))}
          </ol>
        </div>
      )}

      <button
        className={`mark-complete-btn ${isCompleted ? 'completed' : ''}`}
        onClick={onMarkComplete}
      >
        {isCompleted ? '✓ Completed' : '○ Mark as Complete'}
      </button>

      <div className="topic-nav">
        {prevTopic ? (
          <button className="topic-nav-btn prev" onClick={() => onNavigate('prev')}>
            <span style={{ fontSize: '18px' }}>←</span>
            <div>
              <div className="topic-nav-label">Previous</div>
              <div className="topic-nav-title">{prevTopic.title}</div>
            </div>
          </button>
        ) : <div />}
        {nextTopic ? (
          <button className="topic-nav-btn next" onClick={() => onNavigate('next')}>
            <span style={{ fontSize: '18px' }}>→</span>
            <div>
              <div className="topic-nav-label">Next</div>
              <div className="topic-nav-title">{nextTopic.title}</div>
            </div>
          </button>
        ) : <div />}
      </div>
    </div>
  );
}

export default TopicPage;
