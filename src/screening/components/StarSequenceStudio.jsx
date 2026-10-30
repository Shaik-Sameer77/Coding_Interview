import React, { useState, useMemo } from 'react';
import {
  Layers, Search, Copy, Check, Zap, ShieldCheck, ChevronRight,
  Code2, ArrowRight, Play, BookOpen, Clock, Activity, Database,
  Cpu, Lock, Server, Sparkles, Filter
} from 'lucide-react';
import { STAR_INTERVIEW_TOPICS } from '../data/starInterviewMatrixData';
import MermaidRenderer from '../../shared/MermaidRenderer';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';

export default function StarSequenceStudio() {
  const [selectedTopicId, setSelectedTopicId] = useState(1);
  const [activePitchType, setActivePitchType] = useState('primary'); // 'primary' | 'backup'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return STAR_INTERVIEW_TOPICS;
    const q = searchQuery.toLowerCase();
    return STAR_INTERVIEW_TOPICS.filter(t =>
      t.topic.toLowerCase().includes(q) ||
      t.primaryQuestion.toLowerCase().includes(q) ||
      t.backupQuestion.toLowerCase().includes(q) ||
      t.bestExampleTitle.toLowerCase().includes(q) ||
      t.backupExampleTitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeTopic = useMemo(() => {
    return STAR_INTERVIEW_TOPICS.find(t => t.id === selectedTopicId) || STAR_INTERVIEW_TOPICS[0];
  }, [selectedTopicId]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const currentStar = activePitchType === 'primary' ? activeTopic.primaryStar : activeTopic.backupStar;
  const currentTitle = activePitchType === 'primary' ? activeTopic.bestExampleTitle : activeTopic.backupExampleTitle;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(129, 140, 248, 0.25)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Phase 2 Technical Screening Master
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>14 Core Topics & System Design Sequence Flows</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
              STAR Method & System Design Sequence Studio
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, maxWidth: '850px', lineHeight: 1.5 }}>
              Rotate between your battle-tested projects (<strong>Chrona</strong>, <strong>LesHub</strong>, and <strong>Portfolio</strong>).
              Every topic includes the real behavioral questions, complete S-T-A-R proof, a 60–90 second spoken script,
              and a live architectural sequence diagram showing exact cross-layer mechanics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search topics, questions, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                  color: '#f8fafc',
                  fontSize: '0.84rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* 14 Topic Quick Pill Bar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingTop: '1.25rem',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'thin'
        }}>
          {filteredTopics.map((topic) => {
            const isSelected = topic.id === activeTopic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setActivePitchType('primary');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)'
                    : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected
                    ? '1px solid #818cf8'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#f8fafc' : '#94a3b8',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  background: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}>
                  {topic.id}
                </span>
                <span>{topic.topic}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* Selected Topic Header Card */}
        <div style={{
          background: '#0d131f',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                background: '#6366f1',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                Topic {activeTopic.id} of 14
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {activeTopic.topic}
              </h2>
            </div>

            {/* Primary vs Backup Toggle */}
            <div style={{
              display: 'flex',
              background: '#090d16',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '3px'
            }}>
              <button
                onClick={() => setActivePitchType('primary')}
                style={{
                  background: activePitchType === 'primary' ? '#38bdf8' : 'transparent',
                  color: activePitchType === 'primary' ? '#04101e' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>⭐ Best Example (Primary Pitch)</span>
              </button>
              <button
                onClick={() => setActivePitchType('backup')}
                style={{
                  background: activePitchType === 'backup' ? '#818cf8' : 'transparent',
                  color: activePitchType === 'backup' ? '#04101e' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>🛡️ Backup Example</span>
              </button>
            </div>
          </div>

          {/* Question Callouts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '0.85rem'
          }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Primary Interview Question
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.4 }}>
                "{activeTopic.primaryQuestion}"
              </div>
            </div>

            <div style={{
              background: 'rgba(129, 140, 248, 0.05)',
              border: '1px solid rgba(129, 140, 248, 0.25)',
              borderRadius: '10px',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Alternative / Follow-up Angle
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#cbd5e1', lineHeight: 1.4 }}>
                "{activeTopic.backupQuestion}"
              </div>
            </div>
          </div>
        </div>

        {/* Selected Story Title & 60-90s Spoken Pitch Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 24, 39, 0.95) 0%, rgba(13, 19, 31, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: activePitchType === 'primary' ? '#38bdf8' : '#818cf8', textTransform: 'uppercase' }}>
                {activePitchType === 'primary' ? 'Primary Focus Story' : 'Secondary Backup Story'}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
                {currentTitle}
              </h3>
            </div>

            <button
              onClick={() => copyToClipboard(currentStar.spokenPitch, `pitch-${activeTopic.id}-${activePitchType}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {copiedKey === `pitch-${activeTopic.id}-${activePitchType}` ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              <span>{copiedKey === `pitch-${activeTopic.id}-${activePitchType}` ? 'Copied Pitch!' : 'Copy 60-90s Spoken Pitch'}</span>
            </button>
          </div>

          {/* Spoken Pitch Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            borderLeft: '4px solid #38bdf8',
            borderRadius: '0 10px 10px 0',
            padding: '1rem 1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Spoken Delivery Script (60–90 Seconds • What to Say Aloud)
              </span>
            </div>
            <div style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {currentStar.spokenPitch}
            </div>
          </div>
        </div>

        {/* S-T-A-R Structured Breakdown Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {/* Situation */}
          <div style={{
            background: '#0d131f',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, background: 'rgba(239, 68, 68, 0.2)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>S</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Situation & Context</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {currentStar.situation}
            </div>
          </div>

          {/* Task */}
          <div style={{
            background: '#0d131f',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, background: 'rgba(245, 158, 11, 0.2)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>T</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Task & Responsibility</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {currentStar.task}
            </div>
          </div>

          {/* Action */}
          <div style={{
            background: '#0d131f',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            gridColumn: 'span 2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, background: 'rgba(59, 130, 246, 0.2)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>A</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Specific Technical Actions</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {currentStar.action}
            </div>
          </div>

          {/* Result */}
          <div style={{
            background: '#0d131f',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            gridColumn: 'span 2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, background: 'rgba(16, 185, 129, 0.2)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>R</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Measurable Business & Engineering Result</span>
            </div>
            <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5, fontWeight: 500 }}>
              {currentStar.result}
            </div>
          </div>
        </div>

        {/* SYSTEM DESIGN SEQUENCE DIAGRAM */}
        <div style={{
          background: '#0d131f',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#c084fc" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                System Design Sequence Architecture (Live Visual Flow)
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(168, 85, 247, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
              Interactive Sequence Diagram (Client $\to$ Gateway $\to$ Service $\to$ DB)
            </span>
          </div>

          <div style={{
            background: '#070a12',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '1rem',
            overflowX: 'auto'
          }}>
            <MermaidRenderer
              key={`diag-${activeTopic.id}-${activePitchType}`}
              chart={activeTopic.mermaidDiagram}
              id={`mermaid-seq-${activeTopic.id}`}
            />
          </div>
        </div>

        {/* CODE & ARCHITECTURAL CONTRACT */}
        <div style={{
          background: '#0d131f',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code2 size={18} color="#60a5fa" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Production Code & Architectural Contract
            </h3>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Exact code pattern, hook, or SQL stored procedure running in production for this architecture.
          </div>
          <SyntaxCodeBlock
            code={activeTopic.architectureContract}
            language={activeTopic.architectureContract.includes('CREATE PROCEDURE') ? 'sql' : 'javascript'}
          />
        </div>

      </div>
    </div>
  );
}
