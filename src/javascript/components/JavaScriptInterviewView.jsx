import React, { useState, useMemo, useEffect } from 'react';
import { 
  HelpCircle, Search, CheckCircle2, Circle, Eye, EyeOff, 
  Copy, Check, Sparkles, Filter, Code2, AlertTriangle, 
  Bookmark, Award, ChevronDown, ChevronUp, Terminal, Lightbulb
} from 'lucide-react';
import { JS_INTERVIEW_TOPICS, JS_150_QUESTIONS } from '../data/javascriptInterviewData';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';

export default function JavaScriptInterviewView() {
  const [selectedTopicId, setSelectedTopicId] = useState('all'); // 'all' or 1..10
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceMode, setPracticeMode] = useState(false); // If true, hide answers by default
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [activeApproaches, setActiveApproaches] = useState({});

  // Mastered questions saved in localStorage
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('js_mastered_interview_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMastered = (id) => {
    setMasteredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('js_mastered_interview_ids', JSON.stringify(next));
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
    return JS_150_QUESTIONS.filter(q => {
      const matchesTopic = selectedTopicId === 'all' || q.topicId === Number(selectedTopicId);
      const matchesQuery = !searchQuery.trim() || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.code && q.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `q${q.id}`.includes(searchQuery.toLowerCase().trim());
      return matchesTopic && matchesQuery;
    });
  }, [selectedTopicId, searchQuery]);

  const masteredCount = masteredIds.length;
  const totalQuestions = JS_150_QUESTIONS.length;
  const progressPercent = Math.round((masteredCount / totalQuestions) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
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
              background: 'rgba(59, 130, 246, 0.25)', 
              color: '#60a5fa', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '999px',
              border: '1px solid rgba(59, 130, 246, 0.4)'
            }}>
              SCREENING PREPARATION
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{totalQuestions} Targeted Questions, DSA & Solutions</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            JavaScript Interview Master Guide ({totalQuestions} Questions)
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Structured framework: <strong style={{ color: '#60a5fa' }}>Definition → Multiple Approaches → Code Examples → Time & Space Complexity</strong>. Answer aloud as if the client is interviewing you!
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
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#60a5fa' }}>{totalQuestions} Total</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mastered</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>{masteredCount} / {totalQuestions} ({progressPercent}%)</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Topics Selector & Search */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {/* Search & Practice Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.5rem 0.85rem',
            flex: 1,
            minWidth: '260px',
            maxWidth: '500px'
          }}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by question, code keyword, or Q# (e.g. Q42, closure, prototype)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Practice Mode Toggle */}
          <button
            onClick={() => setPracticeMode(!practiceMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: practiceMode ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              background: practiceMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: practiceMode ? '#f59e0b' : '#cbd5e1',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem'
            }}
          >
            {practiceMode ? <EyeOff size={15} /> : <Eye size={15} />}
            {practiceMode ? 'Interview Practice Mode: Answers Hidden' : 'Study Mode: Answers Visible'}
          </button>
        </div>

        {/* Topic Pills Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.3rem' }}>
          <button
            onClick={() => setSelectedTopicId('all')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: selectedTopicId === 'all' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)',
              background: selectedTopicId === 'all' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
              color: selectedTopicId === 'all' ? '#60a5fa' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            All Questions (150)
          </button>

          {JS_INTERVIEW_TOPICS.map(topic => {
            const isSelected = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                  color: isSelected ? '#60a5fa' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500
                }}
              >
                {topic.range} · {topic.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Showing {filteredQuestions.length} interview questions
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Click checkmark to track questions you can explain aloud without notes
          </span>
        </div>

        {filteredQuestions.map(q => {
          const isMastered = masteredIds.includes(q.id);
          const isRevealed = !practiceMode || !!revealedQuestions[q.id];

          return (
            <div
              key={q.id}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid',
                borderColor: isMastered ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Question Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <button
                    onClick={() => toggleMastered(q.id)}
                    title={isMastered ? "Mark as unmastered" : "Mark as mastered (can explain aloud)"}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px',
                      display: 'flex'
                    }}
                  >
                    {isMastered ? (
                      <CheckCircle2 size={20} color="#10b981" />
                    ) : (
                      <Circle size={20} color="#64748b" />
                    )}
                  </button>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        Q{q.id}
                      </span>
                      {q.difficulty && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: q.difficulty === 'Senior' || q.difficulty === 'Staff' ? 'rgba(239, 68, 68, 0.15)' : q.difficulty === 'Intermediate' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: q.difficulty === 'Senior' || q.difficulty === 'Staff' ? '#f87171' : q.difficulty === 'Intermediate' ? '#fbbf24' : '#34d399',
                          padding: '0.12rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid currentColor'
                        }}>
                          {q.difficulty}
                        </span>
                      )}
                      {q.category && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#cbd5e1',
                          padding: '0.12rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          {q.category}
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Topic {q.topicId}: {JS_INTERVIEW_TOPICS.find(t => t.id === q.topicId)?.title}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: isMastered ? '#a7f3d0' : '#f8fafc',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {q.question}
                    </h3>
                  </div>
                </div>

                {practiceMode && (
                  <button
                    onClick={() => toggleReveal(q.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      background: isRevealed ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: isRevealed ? '#94a3b8' : '#60a5fa',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                  </button>
                )}
              </div>

              {/* Answer Content (Shown in Study Mode or when Revealed) */}
              {isRevealed ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '0.25rem' }}>
                  {/* Prose Answer */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '1rem',
                    borderRadius: '8px',
                    borderLeft: '3px solid #3b82f6'
                  }}>
                    <FormattedMarkdownText
                      text={q.answer}
                      accentColor="#60a5fa"
                      style={{ fontSize: '0.92rem' }}
                    />
                  </div>

                  {/* Code Snippet (if any) */}
                  {q.code && (
                    <SyntaxCodeBlock 
                      code={q.code} 
                      label={`Q${q.id} · JavaScript Code`} 
                    />
                  )}

                  {/* Multiple Approaches Interactive Tabs (if defined) */}
                  {q.approaches && q.approaches.length > 0 && (
                    <div style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      background: 'rgba(0, 0, 0, 0.35)',
                      padding: '1.1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Solution Approaches ({q.approaches.length} Methods):
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {q.approaches.map((app, appIdx) => {
                            const isSelected = (activeApproaches[q.id] ?? 0) === appIdx;
                            return (
                              <button
                                key={appIdx}
                                onClick={() => setActiveApproaches(prev => ({ ...prev, [q.id]: appIdx }))}
                                style={{
                                  background: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid',
                                  borderColor: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.7rem',
                                  color: isSelected ? '#93c5fd' : '#94a3b8',
                                  fontSize: '0.78rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {app.title || `Approach ${appIdx + 1}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {(() => {
                        const curApp = q.approaches[activeApproaches[q.id] ?? 0] || q.approaches[0];
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc' }}>
                                {curApp.title}
                              </span>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                {curApp.timeComplexity && (
                                  <span style={{
                                    fontSize: '0.72rem',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    color: '#fbbf24',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    border: '1px solid rgba(245, 158, 11, 0.3)'
                                  }}>
                                    Time: {curApp.timeComplexity}
                                  </span>
                                )}
                                {curApp.spaceComplexity && (
                                  <span style={{
                                    fontSize: '0.72rem',
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#34d399',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    border: '1px solid rgba(16, 185, 129, 0.3)'
                                  }}>
                                    Space: {curApp.spaceComplexity}
                                  </span>
                                )}
                              </div>
                            </div>
                            {curApp.explanation && (
                              <FormattedMarkdownText
                                text={curApp.explanation}
                                accentColor="#60a5fa"
                                style={{ fontSize: '0.88rem' }}
                              />
                            )}
                            {curApp.code && (
                              <SyntaxCodeBlock
                                code={curApp.code}
                                label={`${curApp.title} · JavaScript`}
                              />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Table (if any) */}
                  {q.table && (
                    <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <thead>
                          <tr style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                            {q.table.headers.map((h, i) => (
                              <th key={i} style={{ padding: '0.6rem 0.9rem', textAlign: 'left', color: '#60a5fa', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {q.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: rIdx < q.table.rows.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ padding: '0.55rem 0.9rem', color: cIdx === 0 ? '#f8fafc' : '#94a3b8' }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Senior Tip / Executive Callout */}
                  {q.tip && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderLeft: '3px solid #f59e0b',
                      borderRadius: '0 8px 8px 0',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.55rem'
                    }}>
                      <Lightbulb size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '0.85rem', color: '#fef3c7', lineHeight: '1.5' }}>
                        <strong>Interview Tip:</strong> {q.tip}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  onClick={() => toggleReveal(q.id)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px dashed rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: '#60a5fa',
                    fontSize: '0.86rem',
                    fontWeight: 600
                  }}
                >
                  🔒 Answer hidden for self-assessment. Answer aloud first, then click here to check your explanation!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
