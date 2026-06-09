import { memo } from 'react';

const Sidebar = memo(function Sidebar({
  sections,
  allTopics,
  activeTopic,
  completedTopics,
  openSections,
  onTopicSelect,
  onToggleSection,
  onGoHome,
  isOpen,
  progressPercent,
  completedCount,
  totalCount
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={onGoHome}>
          <div className="sidebar-logo-icon">🧠</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">LLM Academy</span>
            <span className="sidebar-logo-subtitle">AI Engineering Guide</span>
          </div>
        </div>
      </div>

      <div className="sidebar-progress">
        <div className="progress-label">
          <span className="progress-text">{completedCount} of {totalCount} completed</span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div className="nav-section" key={section.id}>
            <div
              className="nav-section-header"
              onClick={() => onToggleSection(section.id)}
            >
              <div className="nav-section-left">
                <span className="nav-section-icon">{section.icon}</span>
                <span className="nav-section-title">{section.title}</span>
              </div>
              <span className={`nav-section-chevron ${openSections[section.id] ? 'open' : ''}`}>
                ▶
              </span>
            </div>
            <div className={`nav-section-items ${openSections[section.id] ? 'open' : ''}`}>
              {section.topics.map(topicId => {
                const topic = allTopics[topicId];
                if (!topic) return null;
                const isActive = activeTopic === topicId;
                const isCompleted = completedTopics.includes(topicId);
                return (
                  <button
                    key={topicId}
                    className={`nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => onTopicSelect(topicId)}
                  >
                    <span className="nav-item-dot" />
                    {topic.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
});

export default Sidebar;
