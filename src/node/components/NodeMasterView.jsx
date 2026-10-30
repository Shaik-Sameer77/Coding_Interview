import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckSquare, Sparkles, Layers, ShieldCheck, ArrowRight, CheckCircle2, Circle, Code2, Server } from 'lucide-react';
import NodeNotesView from './NodeNotesView';
import NodeInterviewView from './NodeInterviewView';
import { NODE_STUDY_CHECKLIST } from '../data/nodeInterviewData';

export default function NodeMasterView({ onSwitchToMachineCoding }) {
  const [subTab, setSubTab] = useState('notes'); // 'notes' | 'interview' | 'checklist'

  // Mastered counts from localStorage
  const masteredIds = (() => {
    try {
      const saved = localStorage.getItem('node_mastered_interview_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const [checklistState, setChecklistState] = useState(() => {
    try {
      const saved = localStorage.getItem('node_study_checklist_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleChecklistItem = (item) => {
    setChecklistState(prev => {
      const next = { ...prev, [item]: !prev[item] };
      localStorage.setItem('node_study_checklist_state', JSON.stringify(next));
      return next;
    });
  };

  const totalChecklistCount = NODE_STUDY_CHECKLIST.reduce((acc, cat) => acc + cat.items.length, 0);
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
              background: subTab === 'notes' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: subTab === 'notes' ? '#34d399' : '#94a3b8'
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
              background: subTab === 'interview' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: subTab === 'interview' ? '#06b6d4' : '#94a3b8'
            }}
          >
            <HelpCircle size={16} />
            🎯 250 Interview Questions (Q1–Q250)
            <span style={{ 
              fontSize: '0.7rem', 
              background: 'rgba(6, 182, 212, 0.35)', 
              color: '#cffafe', 
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
              background: subTab === 'checklist' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: subTab === 'checklist' ? '#fbbf24' : '#94a3b8'
            }}
          >
            <CheckSquare size={16} />
            📋 28-Point Study Checklist ({completedChecklistCount}/{totalChecklistCount})
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
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Code2 size={14} />
              <span>Jump to 100 Node Backend Coding</span>
            </button>
          )}

          <span style={{ color: '#94a3b8' }}>
            Questions Mastered: <strong style={{ color: '#10b981' }}>{masteredIds.length}/250</strong>
          </span>
        </div>
      </div>

      {/* Main Tab Content */}
      {subTab === 'notes' && (
        <NodeNotesView />
      )}

      {subTab === 'interview' && (
        <NodeInterviewView />
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
                background: 'rgba(16, 185, 129, 0.2)', 
                color: '#34d399', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '999px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                STRUCTURED SCREENING CHECKLIST
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '0.5rem 0 0.25rem 0' }}>
                Node.js & Express Learning Progress & 28-Topic Mastery Checklist
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                Check off each core concept as you practice explaining it aloud without relying on the document.
              </p>
            </div>

            {/* Progress Badge */}
            <div style={{
              background: '#090d16',
              padding: '0.8rem 1.4rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Checklist Progress</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                  {completedChecklistCount} / {totalChecklistCount}
                </div>
              </div>
              <div style={{ width: '50px', height: '50px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fbbf24' }}>{checklistPercent}%</span>
              </div>
            </div>
          </div>

          {/* Checklist Categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
            {NODE_STUDY_CHECKLIST.map((category, catIdx) => (
              <div
                key={catIdx}
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#34d399',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Layers size={16} />
                  <span>{category.category}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {category.items.map((item, itemIdx) => {
                    const isChecked = !!checklistState[item];
                    return (
                      <div
                        key={itemIdx}
                        onClick={() => toggleChecklistItem(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                          border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.04)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isChecked ? (
                          <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                        ) : (
                          <Circle size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                        )}
                        <span style={{
                          fontSize: '0.84rem',
                          color: isChecked ? '#f8fafc' : '#94a3b8',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          fontWeight: isChecked ? 600 : 400
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
        </div>
      )}
    </div>
  );
}
