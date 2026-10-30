import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, CheckCircle2, Circle, ChevronRight, Copy, Check,
  Sparkles, AlertTriangle, Lightbulb, Code2, ArrowLeft, ArrowRight,
  Terminal, ShieldCheck, Layers, HelpCircle, Eye, EyeOff
} from 'lucide-react';
import { TS_NOTES_METADATA, TS_SECTIONS } from '../data/typescriptNotesData';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';

export default function TypeScriptNotesView() {
  const [activeSectionId, setActiveSectionId] = useState('what-is-ts');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhaseFilter, setActivePhaseFilter] = useState('all'); // 'all' or 1..4
  const [revealedCheckpoints, setRevealedCheckpoints] = useState({});

  // Interactive 6-session progress in localStorage
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('ts_study_sessions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleSession = (sessionId) => {
    setCompletedSessions(prev => {
      const next = { ...prev, [sessionId]: !prev[sessionId] };
      localStorage.setItem('ts_study_sessions', JSON.stringify(next));
      return next;
    });
  };

  const toggleCheckpointReveal = (idx) => {
    setRevealedCheckpoints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredSections = useMemo(() => {
    return TS_SECTIONS.filter(sec => {
      const matchesPhase = activePhaseFilter === 'all' || sec.phase === Number(activePhaseFilter);
      const q = searchQuery.toLowerCase();
      const matchesQuery = !searchQuery.trim() ||
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        `sec ${sec.number}`.includes(q) ||
        sec.subsections.some(sub => 
          sub.title.toLowerCase().includes(q) ||
          (sub.content && sub.content.toLowerCase().includes(q)) ||
          (sub.code && sub.code.toLowerCase().includes(q))
        );
      return matchesPhase && matchesQuery;
    });
  }, [searchQuery, activePhaseFilter]);

  const activeSection = useMemo(() => {
    return TS_SECTIONS.find(s => s.id === activeSectionId) || TS_SECTIONS[0];
  }, [activeSectionId]);

  const currentIndex = TS_SECTIONS.findIndex(s => s.id === activeSection.id);
  const prevSection = TS_SECTIONS[currentIndex - 1];
  const nextSection = TS_SECTIONS[currentIndex + 1];

  const totalSessions = 6;
  const completedSessionsCount = Object.values(completedSessions).filter(Boolean).length;
  const sessionPercent = Math.round((completedSessionsCount / totalSessions) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', height: '100%' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(49, 120, 198, 0.18) 0%, rgba(99, 102, 241, 0.1) 100%)',
        border: '1px solid rgba(49, 120, 198, 0.35)',
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
              fontWeight: 800, 
              background: 'rgba(49, 120, 198, 0.25)', 
              color: '#60a5fa', 
              padding: '0.2rem 0.65rem', 
              borderRadius: '999px',
              border: '1px solid rgba(49, 120, 198, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span style={{ color: '#93c5fd' }}>TS</span> SCREENING PREP
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{TS_NOTES_METADATA.level}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            {TS_NOTES_METADATA.title}
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            {TS_NOTES_METADATA.subtitle} — {TS_NOTES_METADATA.purpose}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '0.9rem 1.4rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sections</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#60a5fa' }}>{TS_SECTIONS.length} Modules</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Study Progress</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>{sessionPercent}%</div>
          </div>
        </div>
      </div>

      {/* 4 Phases Navigation Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '0.8rem'
      }}>
        {TS_NOTES_METADATA.phases.map(phase => {
          const isSelected = activePhaseFilter === phase.number;
          return (
            <button
              key={phase.number}
              onClick={() => setActivePhaseFilter(isSelected ? 'all' : phase.number)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: isSelected ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isSelected ? '#93c5fd' : '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Phase {phase.number}
                </span>
                {isSelected && (
                  <span style={{ fontSize: '0.68rem', background: '#3b82f6', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    Active
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                {phase.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: '1.4' }}>
                {phase.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', minHeight: '650px' }}>
        
        {/* Left Sidebar: Table of Contents */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          maxHeight: 'calc(100vh - 220px)',
          overflowY: 'auto'
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.45rem 0.75rem'
          }}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search TypeScript notes (e.g. satisfies, infer, dto)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.82rem',
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.2rem 0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sections ({filteredSections.length})
            </span>
            {activePhaseFilter !== 'all' && (
              <button 
                onClick={() => setActivePhaseFilter('all')}
                style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}
              >
                Show All
              </button>
            )}
          </div>

          {/* Section Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {filteredSections.map(sec => {
              const isActive = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: isActive ? '#60a5fa' : '#cbd5e1',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isActive ? '#60a5fa' : '#64748b',
                    minWidth: '24px'
                  }}>
                    {sec.number}.
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: isActive ? 700 : 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {sec.title}
                    </div>
                    <div style={{ 
                      fontSize: '0.72rem', 
                      color: '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: '0.1rem'
                    }}>
                      Phase {sec.phase} · {sec.subsections.length} topics
                    </div>
                  </div>
                  {isActive && <ChevronRight size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Column */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2rem 2.25rem',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 220px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Section Header */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                background: 'rgba(59, 130, 246, 0.15)', 
                color: '#60a5fa', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '6px'
              }}>
                SECTION {activeSection.number} · PHASE {activeSection.phase}
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
              {activeSection.title}
            </h2>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#94a3b8', lineHeight: '1.6' }}>
              {activeSection.summary}
            </p>
          </div>

          {/* Subsections List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {activeSection.subsections.map((sub, idx) => (
              <div key={sub.id || idx} style={{
                background: 'rgba(30, 41, 59, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {/* Subsection Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
                  {sub.title}
                </h3>

                {/* Prose Content */}
                {sub.content && (
                  <FormattedMarkdownText
                    text={sub.content}
                    accentColor="#3b82f6"
                    style={{ fontSize: '0.92rem' }}
                  />
                )}

                {/* Table (if any) */}
                {sub.table && (
                  <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                          {sub.table.headers.map((h, i) => (
                            <th key={i} style={{ 
                              padding: '0.7rem 1rem', 
                              textAlign: 'left', 
                              color: '#60a5fa', 
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              fontWeight: 700
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sub.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} style={{ 
                            borderBottom: rIdx < sub.table.rows.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                            background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                          }}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ 
                                padding: '0.65rem 1rem', 
                                color: cIdx === 0 ? '#f8fafc' : '#94a3b8',
                                fontWeight: cIdx === 0 ? 600 : 400
                              }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Code Snippet 1 (Syntax Highlighted) */}
                {sub.code && (
                  <SyntaxCodeBlock 
                    code={sub.code} 
                    language="typescript"
                    label={`${sub.title} · TypeScript`}
                  />
                )}

                {/* Content After Code (if any) */}
                {sub.contentAfterCode && (
                  <FormattedMarkdownText
                    text={sub.contentAfterCode}
                    accentColor="#3b82f6"
                    style={{ fontSize: '0.92rem' }}
                  />
                )}

                {/* Code Snippet 2 (Syntax Highlighted) */}
                {sub.code2 && (
                  <SyntaxCodeBlock 
                    code={sub.code2} 
                    language="typescript"
                    label={`${sub.title} (Part 2) · TypeScript`}
                  />
                )}

                {/* Bullet Points (if any) */}
                {sub.bulletPoints && (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {sub.bulletPoints.map((pt, pIdx) => (
                      <li key={pIdx} style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Interactive 6 Sessions Checklist (for Section 22) */}
                {sub.sessions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {sub.sessions.map((sess) => {
                      const isDone = !!completedSessions[sess.id];
                      return (
                        <div
                          key={sess.id}
                          onClick={() => toggleSession(sess.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.85rem',
                            padding: '0.9rem 1.1rem',
                            background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid',
                            borderColor: isDone ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.06)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ marginTop: '2px' }}>
                            {isDone ? (
                              <CheckCircle2 size={18} color="#10b981" />
                            ) : (
                              <Circle size={18} color="#64748b" />
                            )}
                          </div>
                          <div>
                            <div style={{
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: isDone ? '#6ee7b7' : '#e2e8f0',
                              textDecoration: isDone ? 'line-through' : 'none'
                            }}>
                              {sess.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                              {sess.topics}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 10 Revision Checkpoints with Revealable Answers (Section 22) */}
                {sub.checkpoints && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
                    {sub.checkpoints.map((cp, cIdx) => {
                      const isRevealed = !!revealedCheckpoints[cIdx];
                      return (
                        <div
                          key={cIdx}
                          style={{
                            background: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.6rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', lineHeight: '1.4' }}>
                              {cp.q}
                            </div>
                            <button
                              onClick={() => toggleCheckpointReveal(cIdx)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '6px',
                                background: isRevealed ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: isRevealed ? '#94a3b8' : '#60a5fa',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                              {isRevealed ? 'Hide' : 'Check Answer'}
                            </button>
                          </div>

                          {isRevealed && (
                            <div style={{
                              fontSize: '0.88rem',
                              color: '#a7f3d0',
                              lineHeight: '1.5',
                              padding: '0.75rem',
                              background: 'rgba(16, 185, 129, 0.08)',
                              borderRadius: '6px',
                              borderLeft: '3px solid #10b981'
                            }}>
                              <strong>Executive Answer:</strong> {cp.ans}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Interview Answer Callout */}
                {sub.interviewAnswer && (
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderLeft: '4px solid #3b82f6',
                    borderRadius: '0 8px 8px 0',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <Lightbulb size={14} color="#60a5fa" />
                      Executive Interview Answer
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.5', fontStyle: 'italic' }}>
                      "{sub.interviewAnswer}"
                    </div>
                  </div>
                )}

                {/* Warning / Tip Callout */}
                {sub.callout && (
                  <div style={{
                    background: sub.callout.type === 'warning' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    borderLeft: `4px solid ${sub.callout.type === 'warning' ? '#ef4444' : '#f59e0b'}`,
                    borderRadius: '0 8px 8px 0',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem'
                  }}>
                    <AlertTriangle size={16} color={sub.callout.type === 'warning' ? '#ef4444' : '#f59e0b'} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                      {sub.callout.text}
                    </div>
                  </div>
                )}

                {/* Informational Note */}
                {sub.note && (
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    ℹ️ {sub.note}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Navigation: Previous / Next Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {prevSection ? (
              <button
                onClick={() => setActiveSectionId(prevSection.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                <ArrowLeft size={16} />
                Prev: {prevSection.number}. {prevSection.title}
              </button>
            ) : <div />}

            {nextSection ? (
              <button
                onClick={() => setActiveSectionId(nextSection.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(49, 120, 198, 0.2)',
                  border: '1px solid rgba(49, 120, 198, 0.45)',
                  borderRadius: '8px',
                  padding: '0.6rem 1.1rem',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                Next: {nextSection.number}. {nextSection.title}
                <ArrowRight size={16} />
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
