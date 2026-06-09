import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import TopicPage from './components/TopicPage';
import { SECTIONS, ALL_TOPICS } from './data/topics';

function App() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('llm-academy-completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
    return SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: true }), {});
  });

  useEffect(() => {
    localStorage.setItem('llm-academy-completed', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const allTopicIds = SECTIONS.flatMap(s => s.topics);

  const handleTopicSelect = useCallback((topicId) => {
    setActiveTopic(topicId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleSection = useCallback((sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }, []);

  const handleMarkComplete = useCallback((topicId) => {
    setCompletedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(t => t !== topicId);
      }
      return [...prev, topicId];
    });
  }, []);

  const handleNavigate = useCallback((direction) => {
    const currentIndex = allTopicIds.indexOf(activeTopic);
    if (direction === 'prev' && currentIndex > 0) {
      handleTopicSelect(allTopicIds[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < allTopicIds.length - 1) {
      handleTopicSelect(allTopicIds[currentIndex + 1]);
    }
  }, [activeTopic, allTopicIds, handleTopicSelect]);

  const handleGoHome = useCallback(() => {
    setActiveTopic(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentTopicData = activeTopic ? ALL_TOPICS[activeTopic] : null;
  const currentIndex = activeTopic ? allTopicIds.indexOf(activeTopic) : -1;
  const prevTopic = currentIndex > 0 ? ALL_TOPICS[allTopicIds[currentIndex - 1]] : null;
  const nextTopic = currentIndex < allTopicIds.length - 1 ? ALL_TOPICS[allTopicIds[currentIndex + 1]] : null;
  const totalTopics = allTopicIds.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;

  const getSectionForTopic = (topicId) => {
    return SECTIONS.find(s => s.topics.includes(topicId));
  };

  return (
    <div className="app-layout">
      <button
        className="mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <Sidebar
        sections={SECTIONS}
        allTopics={ALL_TOPICS}
        activeTopic={activeTopic}
        completedTopics={completedTopics}
        openSections={openSections}
        onTopicSelect={handleTopicSelect}
        onToggleSection={handleToggleSection}
        onGoHome={handleGoHome}
        isOpen={sidebarOpen}
        progressPercent={progressPercent}
        completedCount={completedTopics.length}
        totalCount={totalTopics}
      />

      <main className="main-content">
        <div className="content-area">
          {activeTopic && currentTopicData ? (
            <TopicPage
              topic={currentTopicData}
              topicIndex={currentIndex + 1}
              section={getSectionForTopic(activeTopic)}
              isCompleted={completedTopics.includes(activeTopic)}
              onMarkComplete={() => handleMarkComplete(activeTopic)}
              prevTopic={prevTopic}
              nextTopic={nextTopic}
              onNavigate={handleNavigate}
            />
          ) : (
            <HeroSection
              sections={SECTIONS}
              allTopics={ALL_TOPICS}
              completedTopics={completedTopics}
              totalTopics={totalTopics}
              onSelectSection={(sectionId) => {
                const section = SECTIONS.find(s => s.id === sectionId);
                if (section && section.topics.length > 0) {
                  handleTopicSelect(section.topics[0]);
                }
              }}
              onSelectTopic={handleTopicSelect}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
