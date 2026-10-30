import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckSquare, Sparkles, Layers, ShieldCheck, ArrowRight, CheckCircle2, Circle, Code2 } from 'lucide-react';
import ReactNotesView from './ReactNotesView';
import ReactInterviewView from './ReactInterviewView';
import { REACT_STUDY_CHECKLIST } from '../data/reactInterviewData';

export default function ReactMasterView({ onSwitchToMachineCoding }) {
  const [subTab, setSubTab] = useState('notes'); // 'notes' | 'interview' | 'checklist'

  // Mastered counts from localStorage
  const masteredIds = (() => {
    try {
      const saved = localStorage.getItem('react_mastered_interview_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const [checklistState, setChecklistState] = useState(() => {
    try {
      const saved = localStorage.getItem('react_study_checklist_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleChecklistItem = (item) => {
    setChecklistState(prev => {
      const next = { ...prev, [item]: !prev[item] };
      localStorage.setItem('react_study_checklist_state', JSON.stringify(next));
      return next;
    });
  };

  const totalChecklistCount = REACT_STUDY_CHECKLIST.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedChecklistCount = Object.values(checklistState).filter(Boolean).length;
  const checklistPercent = Math.round((completedChecklistCount / totalChecklistCount) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', height: '100%' }}>
      {/* Top Navigation Bar: Strict Separation of Notes vs Interview Questions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#090d16',
        padding: '0.6rem 1rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Sub-Tab Selector */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#111827', padding: '0.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <button
            onClick={() => setSubTab('notes')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: subTab === 'notes' ? 'rgba(97, 218, 251, 0.25)' : 'transparent',
              color: subTab === 'notes' ? '#61dafb' : '#94a3b8'
            }}
          >
            <BookOpen size={16} />
            📖 Topic-wise Notes (Only Notes)
          </button>

          <button
            onClick={() => setSubTab('interview')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: subTab === 'interview' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: subTab === 'interview' ? '#c084fc' : '#94a3b8'
            }}
          >
            <HelpCircle size={16} />
            🎯 250 Interview Questions (Q1–Q250)
            <span style={{ 
              fontSize: '0.7rem', 
              background: 'rgba(168, 85, 247, 0.35)', 
              color: '#e9d5ff', 
              padding: '0.1rem 0.45rem', 
              borderRadius: '999px',
              fontWeight: 800
            }}>
              250
            </span>
          </button>

          <button
            onClick={() => setSubTab('checklist')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: subTab === 'checklist' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: subTab === 'checklist' ? '#34d399' : '#94a3b8'
            }}
          >
            <CheckSquare size={16} />
            📋 35-Point Study Checklist ({completedChecklistCount}/{totalChecklistCount})
          </button>
        </div>

        {/* Quick Link & Progress Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem' }}>
          {onSwitchToMachineCoding && (
            <button
              onClick={onSwitchToMachineCoding}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#818cf8',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Code2 size={14} />
              <span>Jump to 100 Machine Coding UI</span>
            </button>
          )}

          <span style={{ color: '#94a3b8' }}>
            Questions Mastered: <strong style={{ color: '#10b981' }}>{masteredIds.length}/250</strong>
          </span>
        </div>
      </div>

      {/* Main Tab Content */}
      {subTab === 'notes' && (
        <ReactNotesView />
      )}

      {subTab === 'interview' && (
        <ReactInterviewView />
      )}

      {subTab === 'checklist' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                background: 'rgba(97, 218, 251, 0.2)', 
                color: '#61dafb', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '999px',
                border: '1px solid rgba(97, 218, 251, 0.3)'
              }}>
                STRUCTURED SCREENING CHECKLIST
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '0.5rem 0 0.25rem 0' }}>
                React Learning Progress & 35-Topic Mastery Checklist
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                Check off each core concept as you practice explaining it aloud without relying on the document.
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Checklist Progress</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#61dafb' }}>
                {completedChecklistCount} / {totalChecklistCount} Items ({checklistPercent}%)
              </div>
            </div>
          </div>

          {/* 5 Categories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {REACT_STUDY_CHECKLIST.map(category => (
              <div
                key={category.category}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#61dafb', margin: 0, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                  {category.category}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {category.items.map(item => {
                    const isChecked = !!checklistState[item];
                    return (
                      <div
                        key={item}
                        onClick={() => toggleChecklistItem(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isChecked ? (
                          <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                        ) : (
                          <Circle size={16} color="#64748b" style={{ flexShrink: 0 }} />
                        )}
                        <span style={{
                          fontSize: '0.82rem',
                          color: isChecked ? '#f8fafc' : '#cbd5e1',
                          textDecoration: isChecked ? 'line-through' : 'none'
                        }}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 7-Step Progression Roadmap */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '0.5rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.85rem 0' }}>
              How We'll Continue Your Client Screening Preparation
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[
                { step: "1", title: "React Revision & Assessment", desc: "First test conceptual understanding, output reasoning, Hooks, rendering, and debugging without DSA." },
                { step: "2", title: "React Weak-Area Learning", desc: "Target and revisit only the specific topics where diagnostic answers reveal gaps." },
                { step: "3", title: "React with TypeScript", desc: "Props, generics, event types, custom Hooks, component contracts, and typed state management." },
                { step: "4", title: "Project-Based Interview Practice", desc: "Explain actual implementations and solved bugs from your Portfolio, Chrona, and Leshub." },
                { step: "5", title: "Node.js & MongoDB", desc: "Assessment, revision, advanced backend concepts, and database-backed project scenarios." },
                { step: "6", title: "AWS, CDN & Production Engineering", desc: "Deployment, caching, networking, observability logs, and live troubleshooting." },
                { step: "7", title: "DSA & Coding Interviews", desc: "Begin live algorithmic coding after completing the conceptual and project-based preparation." }
              ].map(item => (
                <div key={item.step} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '999px',
                    background: '#61dafb',
                    color: '#090d16',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    flexShrink: 0
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 700 }}>
                      {item.title}
                    </h4>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.45' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
