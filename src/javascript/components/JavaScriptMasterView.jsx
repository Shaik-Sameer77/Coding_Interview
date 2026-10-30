import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckSquare, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import JavaScriptNotesView from './JavaScriptNotesView';
import JavaScriptInterviewView from './JavaScriptInterviewView';
import { JS_INTERVIEW_TOPICS, JS_150_QUESTIONS } from '../data/javascriptInterviewData';

export default function JavaScriptMasterView() {
  const [subTab, setSubTab] = useState('notes'); // 'notes' | 'interview' | 'tracker'

  // Load mastered counts for summary pill
  const masteredIds = (() => {
    try {
      const saved = localStorage.getItem('js_mastered_interview_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const checklistItems = (() => {
    try {
      const saved = localStorage.getItem('js_revision_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  const checklistCount = Object.values(checklistItems).filter(Boolean).length;
  const totalQuestions = JS_150_QUESTIONS.length;

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
              background: subTab === 'notes' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: subTab === 'notes' ? '#f59e0b' : '#94a3b8'
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
              background: subTab === 'interview' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
              color: subTab === 'interview' ? '#60a5fa' : '#94a3b8'
            }}
          >
            <HelpCircle size={16} />
            🎯 {totalQuestions} Interview Questions (Q1–Q{totalQuestions})
            <span style={{ 
              fontSize: '0.7rem', 
              background: 'rgba(59, 130, 246, 0.35)', 
              color: '#93c5fd', 
              padding: '0.1rem 0.45rem', 
              borderRadius: '999px',
              fontWeight: 800
            }}>
              {totalQuestions}
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
            📋 12-Topic Revision Tracker
          </button>
        </div>

        {/* Quick Diagnostic Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem' }}>
          <span style={{ color: '#94a3b8' }}>
            Diagnostic Score: <strong style={{ color: '#10b981' }}>18/20 (90%)</strong>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span style={{ color: '#94a3b8' }}>
            Questions Mastered: <strong style={{ color: '#60a5fa' }}>{masteredIds.length}/{totalQuestions}</strong>
          </span>
        </div>
      </div>

      {/* Main Tab Content */}
      {subTab === 'notes' && (
        <JavaScriptNotesView />
      )}

      {subTab === 'interview' && (
        <JavaScriptInterviewView />
      )}

      {subTab === 'tracker' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <div>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              background: 'rgba(16, 185, 129, 0.2)', 
              color: '#34d399', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '999px' 
            }}>
              SCREENING PREPARATION ROADMAP
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '0.5rem 0 0.25rem 0' }}>
              10-Topic Comprehensive Revision Roadmap
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
              Practice answering each question aloud following the <strong style={{ color: '#f59e0b' }}>Definition → How it works → Code Example → Senior Trade-off</strong> structure.
            </p>
          </div>

          {/* 10 Topic Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {JS_INTERVIEW_TOPICS.map(topic => {
              const startQ = (topic.id - 1) * 15 + 1;
              const endQ = topic.id * 15;
              const topicMasteredCount = masteredIds.filter(id => id >= startQ && id <= endQ).length;
              const topicPercent = Math.round((topicMasteredCount / 15) * 100);

              return (
                <div
                  key={topic.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {topic.range}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: topicPercent === 100 ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
                      {topicMasteredCount} / 15 ({topicPercent}%)
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {topic.id}. {topic.title}
                  </h3>

                  {/* Mini Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.4)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${topicPercent}%`,
                      background: topicPercent === 100 ? '#10b981' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  <button
                    onClick={() => {
                      setSubTab('interview');
                    }}
                    style={{
                      marginTop: '0.25rem',
                      padding: '0.45rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    Open {topic.range} Questions →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
