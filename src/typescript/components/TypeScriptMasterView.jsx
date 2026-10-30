import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckSquare, Sparkles, Layers, ShieldCheck, Calendar, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import TypeScriptNotesView from './TypeScriptNotesView';
import TypeScriptInterviewView from './TypeScriptInterviewView';
import { TS_INTERVIEW_PARTS, TS_STUDY_SESSIONS } from '../data/typescriptInterviewData';

export default function TypeScriptMasterView() {
  const [subTab, setSubTab] = useState('notes'); // 'notes' | 'interview' | 'tracker'

  // Mastered counts from localStorage
  const masteredIds = (() => {
    try {
      const saved = localStorage.getItem('ts_mastered_interview_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const [sessionChecklist, setSessionChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('ts_study_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleSession = (sessionNum) => {
    setSessionChecklist(prev => {
      const next = { ...prev, [sessionNum]: !prev[sessionNum] };
      localStorage.setItem('ts_study_checklist', JSON.stringify(next));
      return next;
    });
  };

  const completedSessions = Object.values(sessionChecklist).filter(Boolean).length;

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
              background: subTab === 'notes' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
              color: subTab === 'notes' ? '#38bdf8' : '#94a3b8'
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
              background: subTab === 'interview' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: subTab === 'interview' ? '#818cf8' : '#94a3b8'
            }}
          >
            <HelpCircle size={16} />
            🎯 150 Interview Questions (Q1–Q150)
            <span style={{ 
              fontSize: '0.7rem', 
              background: 'rgba(99, 102, 241, 0.35)', 
              color: '#c7d2fe', 
              padding: '0.1rem 0.45rem', 
              borderRadius: '999px',
              fontWeight: 800
            }}>
              150
            </span>
          </button>

          <button
            onClick={() => setSubTab('tracker')}
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
              background: subTab === 'tracker' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: subTab === 'tracker' ? '#34d399' : '#94a3b8'
            }}
          >
            <CheckSquare size={16} />
            📋 6-Session Study Roadmap ({completedSessions}/6)
          </button>
        </div>

        {/* Quick Diagnostic / Progress Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem' }}>
          <span style={{ color: '#94a3b8' }}>
            Stack: <strong style={{ color: '#38bdf8' }}>TS · React · Node · NestJS</strong>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span style={{ color: '#94a3b8' }}>
            Questions Mastered: <strong style={{ color: '#10b981' }}>{masteredIds.length}/150</strong>
          </span>
        </div>
      </div>

      {/* Main Tab Content */}
      {subTab === 'notes' && (
        <TypeScriptNotesView />
      )}

      {subTab === 'interview' && (
        <TypeScriptInterviewView />
      )}

      {subTab === 'tracker' && (
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
                background: 'rgba(56, 189, 248, 0.2)', 
                color: '#38bdf8', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '999px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                STRUCTURED CLIENT SCREENING ROADMAP
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '0.5rem 0 0.25rem 0' }}>
                TypeScript 6-Session Revision Plan
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                Do not try to memorize all 150 questions in one sitting. Complete one session at a time, explain concepts aloud in 30–90 seconds, and verify code behavior.
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
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {completedSessions} / 6 Sessions ({Math.round((completedSessions / 6) * 100)}%)
              </div>
            </div>
          </div>

          {/* 6 Study Sessions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {TS_STUDY_SESSIONS.map(s => {
              const isChecked = !!sessionChecklist[s.session];
              return (
                <div
                  key={s.session}
                  style={{
                    background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                    border: isChecked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.15)',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '6px'
                    }}>
                      {s.range}
                    </span>
                    <button
                      onClick={() => toggleSession(s.session)}
                      style={{
                        background: isChecked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: isChecked ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                        color: isChecked ? '#10b981' : '#94a3b8',
                        borderRadius: '6px',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {isChecked ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      {isChecked ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {s.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {s.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                    {s.topics.map((t, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#94a3b8',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSubTab('interview')}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>Practice {s.range} Questions</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* 7-Step Client Screening Progression Strategy */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '0.5rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.85rem 0' }}>
              How We'll Prepare For Your Client Screening
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[
                { step: "1", title: "TypeScript Diagnostic Assessment", desc: "Conceptual questions and output prediction without DSA to calibrate baseline." },
                { step: "2", title: "Targeted Verbal Revision", desc: "Revisit every weak topic and explain it aloud naturally in 30–90 seconds." },
                { step: "3", title: "React & React + TypeScript", desc: "Components, typed props, hooks, custom generics, state, refs, and event typing." },
                { step: "4", title: "Node.js & NestJS + TypeScript", desc: "APIs, DTOs, ValidationPipe, dependency injection, async pipelines, and service error contracts." },
                { step: "5", title: "MongoDB / Mongoose + TypeScript", desc: "Typed schemas, models, queries, document interfaces, indexes, and data validation." },
                { step: "6", title: "Project-Based Interview Practice", desc: "Connect concepts directly to your Portfolio Platform, Chrona, and Leshub implementations." },
                { step: "7", title: "DSA & Coding Interviews", desc: "Transition to algorithmic problems and live coding once conceptual foundations are mastered." }
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
                    background: '#38bdf8',
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

            <div style={{
              marginTop: '1.25rem',
              padding: '0.9rem 1.2rem',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <ShieldCheck size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <div style={{ color: '#fde68a', fontSize: '0.84rem', lineHeight: '1.5' }}>
                <strong>Critical Senior Distinction to Remember:</strong> TypeScript helps verify types at development time, but it does NOT replace runtime validation, application security, or integration testing. Always emphasize runtime schema validation (Zod, class-validator) when discussing NestJS APIs and database operations.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
