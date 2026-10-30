import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, Search, CheckCircle2, Circle, Eye, EyeOff, 
  Copy, Check, Sparkles, Filter, Code2, AlertTriangle, 
  Bookmark, Award, ChevronDown, ChevronUp, Terminal, Lightbulb, Server,
  Mic, Cpu, MessageSquareQuote
} from 'lucide-react';
import { NODE_INTERVIEW_TOPICS, NODE_250_QUESTIONS } from '../data/nodeInterviewData';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';

export default function NodeInterviewView() {
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceMode, setPracticeMode] = useState(false);
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [activeApproaches, setActiveApproaches] = useState({});

  // Mastered questions saved in localStorage
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('node_mastered_interview_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMastered = (id) => {
    setMasteredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('node_mastered_interview_ids', JSON.stringify(next));
      return next;
    });
  };

  const toggleReveal = (id) => {
    setRevealedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuestions = useMemo(() => {
    return NODE_250_QUESTIONS.filter(q => {
      const matchesTopic = selectedTopicId === 'all' || q.topicId === Number(selectedTopicId);
      const matchesQuery = !searchQuery.trim() || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.memoryModel && q.memoryModel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.code && q.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `q${q.id}`.includes(searchQuery.toLowerCase().trim());
      return matchesTopic && matchesQuery;
    });
  }, [selectedTopicId, searchQuery]);

  const masteredCount = masteredIds.length;
  const progressPercent = Math.round((masteredCount / 250) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              background: 'rgba(16, 185, 129, 0.25)', 
              color: '#34d399', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '999px',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}>
              NODE & EXPRESS QUESTION BANK
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>250 Targeted Questions across 16 Topics</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            Node.js & Express Senior Developer Question Bank (250 Qs)
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Structured 3-Tier Delivery: <strong style={{ color: '#34d399' }}>Concept Definition → Code & Under-the-Hood → Senior Gotchas & Security</strong>. Practice explaining aloud in 60–90 seconds.
          </p>
        </div>

        {/* Mastered Progress Tracker */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '0.9rem 1.4rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Questions</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>250 Total</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mastered</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>{masteredCount} / 250</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Readiness</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b' }}>{progressPercent}%</div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search + Practice Mode Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
        background: '#0a0f1d',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search questions (e.g. 'HMAC', 'backpressure', 'JWT', 'paymentIntent', 'Q42')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem 0.55rem 2.35rem',
              color: '#f8fafc',
              fontSize: '0.86rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Practice Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setPracticeMode(!practiceMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: practiceMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: practiceMode ? '#34d399' : '#94a3b8',
              border: practiceMode ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {practiceMode ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>Practice Mode (Hide Answers)</span>
            {practiceMode && (
              <span style={{ fontSize: '0.65rem', background: '#10b981', color: '#090d16', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                ON
              </span>
            )}
          </button>

          {(selectedTopicId !== 'all' || searchQuery) && (
            <button
              onClick={() => { setSelectedTopicId('all'); setSearchQuery(''); }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.4rem',
        scrollbarWidth: 'thin'
      }}>
        {NODE_INTERVIEW_TOPICS.map(topic => {
          const isActive = selectedTopicId === String(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(String(topic.id))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: isActive ? `1px solid ${topic.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive ? `${topic.color}20` : '#111827',
                color: isActive ? '#f8fafc' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{topic.title}</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                background: isActive ? topic.color : 'rgba(255, 255, 255, 0.06)',
                color: isActive ? '#0a0f1d' : '#64748b',
                fontWeight: 800
              }}>
                {topic.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredQuestions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <HelpCircle size={36} style={{ color: '#64748b', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: '0 0 0.35rem 0' }}>No questions found</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Try adjusting your search query or reset the topic filter.
            </p>
          </div>
        ) : (
          filteredQuestions.map(q => {
            const isMastered = masteredIds.includes(q.id);
            const isHidden = practiceMode && !revealedQuestions[q.id];

            return (
              <div
                key={q.id}
                style={{
                  background: isMastered ? 'rgba(16, 185, 129, 0.04)' : 'rgba(15, 23, 42, 0.7)',
                  border: isMastered ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header: ID, Topic Badge, Mastered Checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#34d399',
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(16, 185, 129, 0.25)'
                    }}>
                      Q{q.id}
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px'
                    }}>
                      {q.topicTitle}
                    </span>
                    {q.difficulty && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: q.difficulty.toLowerCase() === 'staff' 
                          ? 'rgba(236, 72, 153, 0.15)' 
                          : q.difficulty.toLowerCase() === 'senior' 
                            ? 'rgba(168, 85, 247, 0.15)' 
                            : 'rgba(59, 130, 246, 0.15)',
                        color: q.difficulty.toLowerCase() === 'staff'
                          ? '#f472b6'
                          : q.difficulty.toLowerCase() === 'senior'
                            ? '#c084fc'
                            : '#60a5fa',
                        border: `1px solid ${
                          q.difficulty.toLowerCase() === 'staff'
                            ? 'rgba(236, 72, 153, 0.3)'
                            : q.difficulty.toLowerCase() === 'senior'
                              ? 'rgba(168, 85, 247, 0.3)'
                              : 'rgba(59, 130, 246, 0.3)'
                        }`
                      }}>
                        {q.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Mastered Checkbox Button */}
                  <button
                    onClick={() => toggleMastered(q.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: isMastered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: isMastered ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isMastered ? '#34d399' : '#94a3b8',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isMastered ? <CheckCircle2 size={14} style={{ color: '#10b981' }} /> : <Circle size={14} />}
                    <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
                  </button>
                </div>

                {/* Question Title */}
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  margin: 0,
                  lineHeight: '1.45',
                  letterSpacing: '-0.01em'
                }}>
                  {q.question}
                </h3>

                {/* Spoken Pitch Card */}
                {q.pitch && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.04em' }}>
                      <Mic size={14} />
                      <span>SPOKEN PITCH (DELIVER ALOUD IN 30–90 SECONDS)</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.5', fontStyle: 'italic' }}>
                      "{q.pitch}"
                    </div>
                  </div>
                )}

                {/* Memory Model Anchor / How to Tell in Interview */}
                {q.memoryModel && !q.pitch && (
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.95rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    fontSize: '0.82rem',
                    color: '#e0f2fe'
                  }}>
                    <Lightbulb size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#38bdf8', marginRight: '0.35rem' }}>How to deliver this in 60s:</strong>
                      {q.memoryModel}
                    </div>
                  </div>
                )}

                {/* Answer Area (Hidden if Practice Mode is active) */}
                {isHidden ? (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px dashed rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                    <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                      Practice Mode active. Formulate your answer aloud before revealing!
                    </span>
                    <button
                      onClick={() => toggleReveal(q.id)}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid #10b981',
                        color: '#34d399',
                        padding: '0.45rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Reveal Model Answer
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Model Answer */}
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '1rem',
                      borderRadius: '8px',
                      borderLeft: '3px solid #10b981'
                    }}>
                      <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
                        In-Depth Technical Explanation
                      </div>
                      <FormattedMarkdownText
                        text={q.answer}
                        accentColor="#34d399"
                        style={{ fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Under the Hood Runtime Flow / Mechanics */}
                    {q.runtimeBehavior && (
                      <div style={{
                        background: 'rgba(30, 41, 59, 0.45)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
                          <Cpu size={14} />
                          <span>UNDER THE HOOD: RUNTIME FLOW & ENGINE MECHANICS</span>
                        </div>
                        <FormattedMarkdownText
                          text={q.runtimeBehavior}
                          accentColor="#38bdf8"
                          style={{ fontSize: '0.86rem', color: '#cbd5e1' }}
                        />
                      </div>
                    )}

                    {/* Comparison Table if present */}
                    {q.comparisonTable && (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                              <th style={{ padding: '0.5rem 0.75rem', color: '#34d399', fontWeight: 700, width: '220px' }}>Concept</th>
                              <th style={{ padding: '0.5rem 0.75rem', color: '#f8fafc', fontWeight: 700 }}>Comparison & Senior Trade-off</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.comparisonTable.map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <td style={{ padding: '0.5rem 0.75rem', color: '#38bdf8', fontWeight: 600 }}>{row.aspect}</td>
                                <td style={{ padding: '0.5rem 0.75rem', color: '#cbd5e1', lineHeight: '1.45' }}>{row.detail}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Multi-Approach Interactive Tabs (if approaches provided) */}
                    {q.approaches && q.approaches.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {q.approaches.map((app, appIdx) => {
                              const isSelected = (activeApproaches[q.id] || 0) === appIdx;
                              return (
                                <button
                                  key={appIdx}
                                  onClick={() => setActiveApproaches(prev => ({ ...prev, [q.id]: appIdx }))}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                    background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                                    color: isSelected ? '#34d399' : '#94a3b8',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {app.name || `Approach ${appIdx + 1}`}
                                </button>
                              );
                            })}
                          </div>
                          {q.approaches[activeApproaches[q.id] || 0] && (
                            <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.73rem' }}>
                              {q.approaches[activeApproaches[q.id] || 0].timeComplexity && (
                                <span style={{ padding: '0.18rem 0.5rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '4px', color: '#38bdf8', fontWeight: 700 }}>
                                  Time: {q.approaches[activeApproaches[q.id] || 0].timeComplexity}
                                </span>
                              )}
                              {q.approaches[activeApproaches[q.id] || 0].spaceComplexity && (
                                <span style={{ padding: '0.18rem 0.5rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '4px', color: '#c084fc', fontWeight: 700 }}>
                                  Space: {q.approaches[activeApproaches[q.id] || 0].spaceComplexity}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {q.approaches[activeApproaches[q.id] || 0] && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>
                              {q.approaches[activeApproaches[q.id] || 0].description}
                            </p>
                            <SyntaxCodeBlock
                              code={q.approaches[activeApproaches[q.id] || 0].code}
                              language="javascript"
                              filename={`node_q${q.id}_approach${(activeApproaches[q.id] || 0) + 1}.js`}
                            />
                          </div>
                        )}
                      </div>
                    ) : q.code ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Code2 size={13} style={{ color: '#34d399' }} />
                            Production Code Example:
                          </span>
                          <button
                            onClick={() => copyText(q.code, q.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: copiedId === q.id ? '#10b981' : '#94a3b8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.72rem'
                            }}
                          >
                            {copiedId === q.id ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <SyntaxCodeBlock
                          code={q.code}
                          language="javascript"
                          filename={`node_q${q.id}.js`}
                        />
                      </div>
                    ) : null}

                    {/* Pro Tip / Senior Gotcha if present */}
                    {q.tip && (
                      <div style={{
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: '8px',
                        padding: '0.65rem 0.95rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        fontSize: '0.82rem',
                        color: '#fef3c7'
                      }}>
                        <AlertTriangle size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong style={{ color: '#f59e0b', marginRight: '0.35rem' }}>Senior Gotcha & Defense:</strong>
                          {q.tip}
                        </div>
                      </div>
                    )}

                    {/* Proactive Interview Follow-Ups & Answers */}
                    {q.followUps && q.followUps.length > 0 && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        borderRadius: '10px',
                        padding: '0.9rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '0.04em' }}>
                          <MessageSquareQuote size={15} />
                          <span>PROACTIVE INTERVIEW FOLLOW-UPS & ANSWERS</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {q.followUps.map((fu, fuIdx) => (
                            <div key={fuIdx} style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '8px',
                              borderLeft: '3px solid #8b5cf6'
                            }}>
                              <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>
                                Q: {fu.question}
                              </div>
                              <div style={{ fontSize: '0.81rem', color: '#cbd5e1', lineHeight: '1.45' }}>
                                A: {fu.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {practiceMode && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => toggleReveal(q.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#94a3b8',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            cursor: 'pointer'
                          }}
                        >
                          Hide Answer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
