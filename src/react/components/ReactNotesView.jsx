import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, CheckCircle2, Circle, ChevronRight, Copy, Check,
  Sparkles, AlertTriangle, Lightbulb, Code2, ArrowLeft, ArrowRight,
  Terminal, ShieldCheck, Layers, HelpCircle
} from 'lucide-react';
import { REACT_NOTES_PARTS } from '../data/reactNotesData';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';

export default function ReactNotesView() {
  const [activePartId, setActivePartId] = useState(1);
  const [activeSectionId, setActiveSectionId] = useState('1.1');
  const [searchQuery, setSearchQuery] = useState('');

  // Flattened sections for quick navigation
  const allSections = useMemo(() => {
    return REACT_NOTES_PARTS.flatMap(part => 
      part.sections.map(sec => ({ ...sec, partId: part.id, partTitle: part.title, partBadge: part.badge, partColor: part.color }))
    );
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return allSections;
    const q = searchQuery.toLowerCase();
    return allSections.filter(sec => 
      sec.title.toLowerCase().includes(q) ||
      (sec.content && sec.content.toLowerCase().includes(q)) ||
      (sec.code && sec.code.toLowerCase().includes(q)) ||
      sec.partTitle.toLowerCase().includes(q)
    );
  }, [allSections, searchQuery]);

  const activeSection = useMemo(() => {
    return allSections.find(s => s.id === activeSectionId) || allSections[0];
  }, [allSections, activeSectionId]);

  const currentIndex = allSections.findIndex(s => s.id === activeSection.id);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        border: '1px solid rgba(97, 218, 251, 0.3)',
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
              background: 'rgba(97, 218, 251, 0.25)', 
              color: '#61dafb', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '999px',
              border: '1px solid rgba(97, 218, 251, 0.4)'
            }}>
              CLIENT SCREENING PREPARATION
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Beginner → Senior Developer Notes</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            React.js Master Notes & Architectural Reference
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Foundations, Fiber rendering, Hooks, state taxonomy, performance optimization, TanStack Query, Zustand, Next.js, and senior debugging patterns.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1.25rem',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '0.9rem 1.4rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parts</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#61dafb' }}>{REACT_NOTES_PARTS.length} Parts</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topics</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a855f7' }}>{allSections.length} Sections</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left Sidebar: Search & Topic Navigator */}
        <div style={{
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          position: 'sticky',
          top: '1rem'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search topics (e.g. 'fiber', 'zustand', 'keys')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem 0.45rem 2rem',
                color: '#f8fafc',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Section List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {filteredSections.map(sec => {
              const isActive = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setActivePartId(sec.partId);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: isActive ? `1px solid ${sec.partColor}` : '1px solid transparent',
                    background: isActive ? `${sec.partColor}18` : 'transparent',
                    color: isActive ? '#f8fafc' : '#94a3b8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ lineHeight: '1.4', flex: 1, paddingRight: '0.5rem' }}>
                    {sec.title}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    background: isActive ? sec.partColor : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#090d16' : '#64748b',
                    fontWeight: 800,
                    flexShrink: 0
                  }}>
                    {sec.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Panel: Topic Reader */}
        <div style={{
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minHeight: '600px'
        }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: `${activeSection.partColor}25`,
                color: activeSection.partColor,
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                border: `1px solid ${activeSection.partColor}40`
              }}>
                {activeSection.partTitle}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Section {activeSection.id}
              </span>
            </div>

            <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: '1.3' }}>
              {activeSection.title}
            </h2>
          </div>

          {/* Body Content */}
          <FormattedMarkdownText
            text={activeSection.content}
            accentColor="#61dafb"
            style={{ fontSize: '0.94rem' }}
          />

          {/* Comparison Table if present */}
          {activeSection.comparisonTable && (
            <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.84rem',
                background: '#0d131f',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem 0.95rem', width: '30%', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Concept</th>
                    <th style={{ padding: '0.65rem 0.95rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Behavior & Rules</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSection.comparisonTable.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.65rem 0.95rem', fontWeight: 700, color: activeSection.partColor }}>{row.aspect}</td>
                      <td style={{ padding: '0.65rem 0.95rem', color: '#e2e8f0' }}>{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Code Snippet with SyntaxCodeBlock */}
          {activeSection.code && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem' }}>
                <Code2 size={15} style={{ color: activeSection.partColor }} />
                <span>React Implementation & Pattern:</span>
              </div>
              <SyntaxCodeBlock
                code={activeSection.code}
                language="jsx"
                title={`${activeSection.title} · Code Example`}
              />
            </div>
          )}

          {/* Key Takeaways */}
          {activeSection.keyTakeaways && activeSection.keyTakeaways.length > 0 && (
            <div style={{
              background: 'rgba(97, 218, 251, 0.06)',
              border: '1px solid rgba(97, 218, 251, 0.2)',
              borderRadius: '10px',
              padding: '1rem 1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#61dafb', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
                Key Takeaways for Senior Screening:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.6' }}>
                {activeSection.keyTakeaways.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: 'auto'
          }}>
            {prevSection ? (
              <button
                onClick={() => {
                  setActiveSectionId(prevSection.id);
                  setActivePartId(prevSection.partId);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={16} />
                <span>Previous: {prevSection.title}</span>
              </button>
            ) : <div />}

            {nextSection && (
              <button
                onClick={() => {
                  setActiveSectionId(nextSection.id);
                  setActivePartId(nextSection.partId);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(97, 218, 251, 0.15)',
                  border: '1px solid rgba(97, 218, 251, 0.3)',
                  color: '#61dafb',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>Next: {nextSection.title}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
