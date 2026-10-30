import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, CheckCircle2, Circle, ChevronRight, Copy, Check,
  Sparkles, AlertTriangle, Lightbulb, Code2, ArrowLeft, ArrowRight,
  Terminal, ShieldCheck, Layers, HelpCircle, Server
} from 'lucide-react';
import { NODE_NOTES_PARTS } from '../data/nodeNotesData';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';

export default function NodeNotesView() {
  const [activePartId, setActivePartId] = useState(1);
  const [activeSectionId, setActiveSectionId] = useState('1.1');
  const [searchQuery, setSearchQuery] = useState('');

  // Flattened sections for quick navigation
  const allSections = useMemo(() => {
    return NODE_NOTES_PARTS.flatMap(part => 
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
              BACKEND SDE SCREENING PREPARATION
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Beginner → Senior Architect Notes</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            Node.js & Express Master Notes & Architecture Guide
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Libuv internals, Event Loop mechanics, Streams, Express middleware, JWT auth & rotation, HMAC webhooks, Stripe/Razorpay payments, CORS/Helmet security, and graceful shutdowns.
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
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>{NODE_NOTES_PARTS.length} Parts</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topics</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#06b6d4' }}>{allSections.length} Sections</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left Sidebar: Search & Topic Navigator */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxHeight: 'calc(100vh - 220px)',
          overflowY: 'auto'
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search notes (e.g. 'streams', 'jwt', 'webhook')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem 0.45rem 2.1rem',
                color: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {NODE_NOTES_PARTS.map(part => {
              const partSections = part.sections.filter(s => 
                !searchQuery.trim() || filteredSections.some(fs => fs.id === s.id)
              );
              if (partSections.length === 0) return null;

              return (
                <div key={part.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: part.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.2rem 0.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    <span>{part.title}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {partSections.map(sec => {
                      const isSelected = activeSection.id === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => {
                            setActiveSectionId(sec.id);
                            setActivePartId(part.id);
                          }}
                          style={{
                            textAlign: 'left',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                            color: isSelected ? '#34d399' : '#cbd5e1',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                            {sec.title}
                          </span>
                          {isSelected && <ChevronRight size={14} style={{ color: '#34d399', flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area: Detailed Section View */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minHeight: '600px'
        }}>
          {/* Header */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                color: activeSection.partColor || '#34d399', 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '4px' 
              }}>
                {activeSection.partTitle}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Section {activeSection.id}</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              {activeSection.title}
            </h2>
          </div>

          {/* Section Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Rich Markdown Formatted content */}
            <FormattedMarkdownText
              text={activeSection.content}
              accentColor="#34d399"
              style={{ fontSize: '0.94rem' }}
            />

            {/* Comparison Table if present */}
            {activeSection.comparisonTable && (
              <div style={{ margin: '0.5rem 0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <th style={{ padding: '0.6rem 0.8rem', color: '#34d399', fontWeight: 700, width: '220px' }}>Aspect / Concept</th>
                      <th style={{ padding: '0.6rem 0.8rem', color: '#f8fafc', fontWeight: 700 }}>Architectural Detail & Trade-off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSection.comparisonTable.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#38bdf8', fontWeight: 600 }}>{row.aspect}</td>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Code Block if present */}
            {activeSection.code && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  marginBottom: '0.4rem',
                  fontWeight: 600
                }}>
                  <Code2 size={14} style={{ color: '#34d399' }} />
                  <span>Production Implementation:</span>
                </div>
                <SyntaxCodeBlock
                  code={activeSection.code}
                  language="javascript"
                  filename={`${activeSection.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.js`}
                />
              </div>
            )}
          </div>

          {/* Bottom Next/Previous Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.25rem',
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
                  borderRadius: '8px',
                  padding: '0.5rem 0.9rem',
                  color: '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} />
                <span>Previous: {prevSection.title}</span>
              </button>
            ) : <div />}

            {nextSection ? (
              <button
                onClick={() => {
                  setActiveSectionId(nextSection.id);
                  setActivePartId(nextSection.partId);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.9rem',
                  color: '#34d399',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <span>Next: {nextSection.title}</span>
                <ArrowRight size={14} />
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
