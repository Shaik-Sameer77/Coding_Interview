import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, Search, CheckCircle2, Circle, Eye, EyeOff, 
  Copy, Check, Sparkles, Filter, Code2, AlertTriangle, 
  Bookmark, Award, ChevronDown, ChevronUp, Terminal, Lightbulb
} from 'lucide-react';
import { TS_INTERVIEW_PARTS, TS_150_QUESTIONS } from '../data/typescriptInterviewData';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';

export default function TypeScriptInterviewView() {
  const [selectedPartId, setSelectedPartId] = useState('all'); // 'all' or 1..11
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceMode, setPracticeMode] = useState(false); // If true, hide answers by default
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [activeApproaches, setActiveApproaches] = useState({});

  // Mastered questions saved in localStorage
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ts_mastered_interview_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMastered = (id) => {
    setMasteredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('ts_mastered_interview_ids', JSON.stringify(next));
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
    return TS_150_QUESTIONS.filter(q => {
      const matchesPart = selectedPartId === 'all' || q.partId === Number(selectedPartId);
      const matchesQuery = !searchQuery.trim() || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.code && q.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `q${q.id}`.includes(searchQuery.toLowerCase().trim());
      return matchesPart && matchesQuery;
    });
  }, [selectedPartId, searchQuery]);

  const masteredCount = masteredIds.length;
  const progressPercent = Math.round((masteredCount / 150) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
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
              background: 'rgba(56, 189, 248, 0.25)', 
              color: '#38bdf8', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.4)'
            }}>
              CLIENT SCREENING PREPARATION
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>150 Precision TypeScript Questions & Solutions</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            TypeScript Interview Master Question Bank (150 Questions)
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Framework: <strong style={{ color: '#38bdf8' }}>Rule/Definition → Code Example → Output/Behavior → Interview Strategy</strong>. Practice aloud in 30–90 seconds per question.
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
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>150 Total</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mastered</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>{masteredCount} / 150</div>
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
            placeholder="Search questions (e.g., 'unknown', 'satisfies', 'keyof', 'Q37', 'generic')..."
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
              background: practiceMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: practiceMode ? '#38bdf8' : '#94a3b8',
              border: practiceMode ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
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
              <span style={{ fontSize: '0.65rem', background: '#38bdf8', color: '#090d16', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                ON
              </span>
            )}
          </button>

          {/* Reset All Filters */}
          {(selectedPartId !== 'all' || searchQuery) && (
            <button
              onClick={() => { setSelectedPartId('all'); setSearchQuery(''); }}
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

      {/* Part Filter Pills (11 Parts) */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.4rem',
        scrollbarWidth: 'thin'
      }}>
        {TS_INTERVIEW_PARTS.map(part => {
          const isActive = selectedPartId === String(part.id);
          return (
            <button
              key={part.id}
              onClick={() => setSelectedPartId(String(part.id))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: isActive ? `1px solid ${part.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive ? `${part.color}20` : '#0b1120',
                color: isActive ? '#f8fafc' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{part.title}</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '0.1rem 0.35rem',
                borderRadius: '999px',
                background: isActive ? part.color : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? '#090d16' : '#cbd5e1',
                fontWeight: 800
              }}>
                {part.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredQuestions.length === 0 ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: '#0b1120',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <HelpCircle size={36} style={{ color: '#475569', marginBottom: '0.75rem' }} />
            <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', margin: '0 0 0.35rem 0' }}>No matching questions found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Try adjusting your search terms or clearing the part filter.
            </p>
          </div>
        ) : (
          filteredQuestions.map(q => {
            const isMastered = masteredIds.includes(q.id);
            const isRevealed = !practiceMode || !!revealedQuestions[q.id];
            const partMeta = TS_INTERVIEW_PARTS.find(p => p.id === q.partId) || { color: '#38bdf8' };

            return (
              <div
                key={q.id}
                style={{
                  background: '#0b1120',
                  border: isMastered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.35rem 1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  transition: 'border 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Header row: Question Number + Section Pill + Mastered Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      background: `${partMeta.color}25`,
                      color: partMeta.color,
                      border: `1px solid ${partMeta.color}50`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px'
                    }}>
                      Q{q.id}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                      {q.section}
                    </span>
                    {q.difficulty && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: q.difficulty === 'Senior' || q.difficulty === 'Lead' ? 'rgba(239, 68, 68, 0.15)' : q.difficulty === 'Intermediate' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: q.difficulty === 'Senior' || q.difficulty === 'Lead' ? '#f87171' : q.difficulty === 'Intermediate' ? '#fbbf24' : '#34d399',
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
                  </div>

                  {/* Actions: Reveal toggle (in practice mode) + Copy + Mastered toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {practiceMode && (
                      <button
                        onClick={() => toggleReveal(q.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: isRevealed ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: isRevealed ? '#38bdf8' : '#94a3b8',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                        {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                      </button>
                    )}

                    <button
                      onClick={() => copyText(`${q.question}\n\n${q.answer}\n\n${q.code || ''}`, q.id)}
                      title="Copy Question & Answer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: copiedId === q.id ? '#10b981' : '#94a3b8',
                        borderRadius: '6px',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      {copiedId === q.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === q.id ? 'Copied' : 'Copy'}
                    </button>

                    <button
                      onClick={() => toggleMastered(q.id)}
                      title={isMastered ? "Mark as Revise" : "Mark as Mastered"}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: isMastered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: isMastered ? '#10b981' : '#64748b',
                        border: isMastered ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isMastered ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      {isMastered ? 'Mastered' : 'Mark Strong'}
                    </button>
                  </div>
                </div>

                {/* The Question */}
                <h2 style={{
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  margin: 0,
                  lineHeight: '1.45'
                }}>
                  {q.question}
                </h2>

                {/* Answer Area (Hidden if Practice Mode and Not Revealed) */}
                {isRevealed ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {/* Interview Answer */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      padding: '0.9rem 1.15rem',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${partMeta.color}`,
                      color: '#e2e8f0',
                      fontSize: '0.88rem',
                      lineHeight: '1.6'
                    }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: partMeta.color, fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                        Interview Answer (30–90 Seconds Pitch)
                      </div>
                      <FormattedMarkdownText
                        text={q.answer}
                        accentColor={partMeta.color}
                        style={{ fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Comparison Table if present */}
                    {q.comparisonTable && (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.82rem',
                          background: '#090d16',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                          <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', textAlign: 'left' }}>
                              <th style={{ padding: '0.55rem 0.85rem', width: '30%', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Concept</th>
                              <th style={{ padding: '0.55rem 0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Behavior & Rules</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.comparisonTable.map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                <td style={{ padding: '0.55rem 0.85rem', fontWeight: 700, color: '#38bdf8' }}>{row.aspect}</td>
                                <td style={{ padding: '0.55rem 0.85rem', color: '#cbd5e1' }}>{row.detail}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Diagnostic: Incorrect vs Correct Code comparison */}
                    {q.incorrectCode && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        padding: '0.9rem'
                      }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase' }}>
                          <AlertTriangle size={14} color="#f87171" />
                          ❌ Compiler Diagnostic & Error Reproduction:
                        </div>
                        <SyntaxCodeBlock
                          code={q.incorrectCode}
                          language="typescript"
                          title="Compiler Error Snippet"
                        />
                        {q.diagnosticError && (
                          <div style={{
                            fontSize: '0.78rem',
                            color: '#fca5a5',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '6px',
                            fontFamily: 'monospace'
                          }}>
                            {q.diagnosticError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Multiple Approaches Interactive Tabs (For Coding Problems) */}
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
                                    background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid',
                                    borderColor: isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.7rem',
                                    color: isSelected ? '#38bdf8' : '#94a3b8',
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
                                  accentColor="#38bdf8"
                                  style={{ fontSize: '0.88rem' }}
                                />
                              )}
                              {curApp.code && (
                                <SyntaxCodeBlock
                                  code={curApp.code}
                                  language="typescript"
                                  title={`${curApp.title} · TypeScript`}
                                />
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Standard Code Example (if no multi-approaches defined) */}
                    {q.code && (!q.approaches || q.approaches.length === 0) && (
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.74rem',
                          color: '#94a3b8',
                          fontWeight: 600,
                          marginBottom: '0.35rem'
                        }}>
                          <Code2 size={13} style={{ color: '#38bdf8' }} />
                          <span>TypeScript Code & Compiler Behavior:</span>
                        </div>
                        <SyntaxCodeBlock
                          code={q.code}
                          language="typescript"
                          title={`TypeScript Example · Q${q.id}`}
                        />
                      </div>
                    )}

                    {/* Compiler vs Runtime Mechanics Callout */}
                    {q.runtimeBehavior && (
                      <div style={{
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        borderRadius: '8px',
                        padding: '0.85rem 1rem'
                      }}>
                        <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '0.04em' }}>
                          ⚡ Compiler Checking vs Runtime Execution:
                        </div>
                        <FormattedMarkdownText
                          text={q.runtimeBehavior}
                          accentColor="#818cf8"
                          style={{ fontSize: '0.85rem' }}
                        />
                      </div>
                    )}

                    {/* Key points if present */}
                    {q.keyPoints && q.keyPoints.length > 0 && (
                      <div style={{
                        background: 'rgba(56, 189, 248, 0.06)',
                        border: '1px solid rgba(56, 189, 248, 0.18)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem'
                      }}>
                        <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                          Key Points for Interviewer:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                          {q.keyPoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Follow-up Interview Questions */}
                    {q.followUps && q.followUps.length > 0 && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '0.9rem 1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}>
                        <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Potential Interview Follow-Ups ({q.followUps.length} Questions):
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {q.followUps.map((fu, fIdx) => (
                            <div key={fIdx} style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '6px',
                              borderLeft: '3px solid #38bdf8'
                            }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                                Q: {fu.q}
                              </div>
                              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                                A: {fu.a}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Senior Tip / Advice */}
                    {q.tip && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: '8px',
                        padding: '0.65rem 0.95rem'
                      }}>
                        <Lightbulb size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '0.81rem', color: '#fcd34d', lineHeight: '1.5' }}>
                          <strong>Senior Engineer Tip: </strong>{q.tip}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    padding: '1.2rem',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px dashed rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.84rem' }}>
                      Practice answering aloud in 30–90 seconds before checking the solution.
                    </p>
                    <button
                      onClick={() => toggleReveal(q.id)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Click to Reveal Solution
                    </button>
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
