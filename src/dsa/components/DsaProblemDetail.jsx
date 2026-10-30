import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, ExternalLink, Code2, Layers, Cpu, 
  Lightbulb, Sparkles, HelpCircle, Check, Copy, ArrowRight,
  Zap, Table, BookOpen, MessageSquare
} from 'lucide-react';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import DsaVisualAnimator from './DsaVisualAnimator';

export default function DsaProblemDetail({ problem, isSolved, onToggleSolved }) {
  const [activeApproachIdx, setActiveApproachIdx] = useState(0);
  const [language, setLanguage] = useState('js'); // 'js' | 'ts'
  const [activeTab, setActiveTab] = useState('approaches'); // 'overview' | 'approaches' | 'dryrun' | 'comparison' | 'pitch' | 'quiz'
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!problem) return null;

  const currentApproach = problem.approaches[activeApproachIdx] || problem.approaches[0];
  const activeCode = language === 'js' ? currentApproach.codeJS : currentApproach.codeTS;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuizSelect = (idx) => {
    if (!quizSubmitted) {
      setSelectedQuizAnswer(idx);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer !== null) {
      setQuizSubmitted(true);
    }
  };

  const handleQuizReset = () => {
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const difficultyColor = 
    problem.difficulty === 'Easy' ? '#10b981' :
    problem.difficulty === 'Medium' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '100%', paddingBottom: '3rem' }}>
      {/* Top Problem Header Card */}
      <div style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              DAY {problem.day}
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {problem.pattern}
            </span>
            <span style={{
              background: `${difficultyColor}20`,
              color: difficultyColor,
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {problem.difficulty}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
              Problem #{problem.id}
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {problem.title}
          </h2>

          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            {problem.summary}
          </p>
        </div>

        {/* Action Buttons: Mark Solved & LeetCode Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              background: '#1e293b',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: '1px solid rgba(56, 189, 248, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <ExternalLink size={14} />
            LeetCode
          </a>

          <button
            onClick={() => onToggleSolved(problem.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              background: isSolved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: isSolved ? '#34d399' : '#cbd5e1',
              transition: 'all 0.15s ease'
            }}
          >
            {isSolved ? <CheckCircle2 size={16} color="#10b981" /> : <Circle size={16} />}
            {isSolved ? 'Mastered' : 'Mark Mastered'}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        background: '#090d16',
        padding: '0.4rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <button
          onClick={() => setActiveTab('animator')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: activeTab === 'animator' ? '1px solid rgba(129, 140, 248, 0.7)' : '1px solid rgba(99, 102, 241, 0.25)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            background: activeTab === 'animator' ? 'rgba(99, 102, 241, 0.35)' : 'rgba(99, 102, 241, 0.1)',
            color: activeTab === 'animator' ? '#ffffff' : '#a5b4fc',
            boxShadow: activeTab === 'animator' ? '0 0 14px rgba(99, 102, 241, 0.4)' : 'none'
          }}
        >
          <Sparkles size={15} color="#818cf8" />
          🎬 Visual Animator
        </button>

        <button
          onClick={() => setActiveTab('approaches')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: activeTab === 'approaches' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            background: activeTab === 'approaches' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            color: activeTab === 'approaches' ? '#a5b4fc' : '#94a3b8'
          }}
        >
          <Code2 size={15} />
          Approaches & Code ({problem.approaches.length})
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: activeTab === 'overview' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            background: activeTab === 'overview' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            color: activeTab === 'overview' ? '#34d399' : '#94a3b8'
          }}
        >
          <Lightbulb size={15} />
          Problem Intuition & Rules
        </button>

        <button
          onClick={() => setActiveTab('dryrun')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: activeTab === 'dryrun' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            background: activeTab === 'dryrun' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            color: activeTab === 'dryrun' ? '#fbbf24' : '#94a3b8'
          }}
        >
          <Table size={15} />
          Step-by-Step Dry Run
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: activeTab === 'comparison' ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            background: activeTab === 'comparison' ? 'rgba(236, 72, 153, 0.25)' : 'transparent',
            color: activeTab === 'comparison' ? '#f472b6' : '#94a3b8'
          }}
        >
          <Layers size={15} />
          Trade-offs Comparison
        </button>

        <button
          onClick={() => setActiveTab('pitch')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: activeTab === 'pitch' ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            background: activeTab === 'pitch' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
            color: activeTab === 'pitch' ? '#22d3ee' : '#94a3b8'
          }}
        >
          <MessageSquare size={15} />
          Spoken Pitch & Q&A
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: activeTab === 'quiz' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            background: activeTab === 'quiz' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
            color: activeTab === 'quiz' ? '#c084fc' : '#94a3b8'
          }}
        >
          <HelpCircle size={15} />
          Recall Test
        </button>
      </div>

      {/* TAB CONTENT 0: VISUAL ANIMATOR */}
      {activeTab === 'animator' && (
        <DsaVisualAnimator problemId={problem.id} initialPattern={problem.pattern} />
      )}

      {/* TAB CONTENT 1: APPROACHES & CODE */}
      {activeTab === 'approaches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Approach Pills & Language Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.8rem',
            background: '#111827',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            {/* Approach Selector Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {problem.approaches.map((app, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveApproachIdx(idx)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: activeApproachIdx === idx ? '1px solid #6366f1' : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: activeApproachIdx === idx ? 'rgba(99, 102, 241, 0.25)' : '#1e293b',
                    color: activeApproachIdx === idx ? '#c7d2fe' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {app.badge}
                </button>
              ))}
            </div>

            {/* Language Selector (JS vs TS) & Complexities */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Time:</span>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  {currentApproach.timeComplexity}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Space:</span>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  {currentApproach.spaceComplexity}
                </span>
              </div>

              <div style={{ display: 'flex', background: '#090d16', padding: '0.2rem', borderRadius: '6px', border: '1px solid #334155' }}>
                <button
                  onClick={() => setLanguage('js')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: language === 'js' ? '#f59e0b' : 'transparent',
                    color: language === 'js' ? '#0b0f19' : '#94a3b8'
                  }}
                >
                  JS
                </button>
                <button
                  onClick={() => setLanguage('ts')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: language === 'ts' ? '#3b82f6' : 'transparent',
                    color: language === 'ts' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  TS
                </button>
              </div>
            </div>
          </div>

          {/* Approach Intuition Callout */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            borderLeft: '4px solid #6366f1',
            padding: '0.85rem 1rem',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.85rem',
            color: '#cbd5e1'
          }}>
            <strong style={{ color: '#818cf8' }}>Approach Core Strategy: </strong>
            {currentApproach.intuition}
          </div>

          {/* Code Viewer with Copy Button */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#1e293b',
              padding: '0.4rem 1rem',
              borderRadius: '8px 8px 0 0',
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontWeight: 700
            }}>
              <span>{language === 'js' ? 'JavaScript Implementation' : 'TypeScript Implementation'}</span>
              <button
                onClick={handleCopyCode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  fontSize: '0.72rem'
                }}
              >
                {copiedCode ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <SyntaxCodeBlock code={activeCode} language={language === 'js' ? 'javascript' : 'typescript'} />
          </div>

          {/* Detailed Line-by-Line Breakdown */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} color="#6366f1" />
              Line-by-Line Execution Mechanics
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentApproach.lineByLine.map((lineDesc, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '0.6rem',
                  alignItems: 'flex-start',
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  <span style={{ color: '#818cf8', fontWeight: 800, minWidth: '20px' }}>#{idx + 1}</span>
                  <FormattedMarkdownText text={lineDesc} />
                </div>
              ))}
            </div>

            {/* Asymptotic Derivation */}
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: '#090d16',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.8rem',
              color: '#94a3b8'
            }}>
              <FormattedMarkdownText text={currentApproach.complexityDerivation} />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PROBLEM OVERVIEW, INTUITION & RULES */}
      {activeTab === 'overview' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Card 1: Core Problem Rules & Invariants */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(99, 102, 241, 0.06))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Layers size={16} color="#34d399" />
              </div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>
                🎯 Core Problem Rules & Invariants
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Mathematical guarantees and operational constraints that must remain true throughout execution:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.2rem' }}>
              {(problem.rules || [
                '1. Scale Threshold: Input size scales up to N = 10^5 elements. An O(N²) solution will trigger Time Limit Exceeded (TLE).',
                '2. Invariant Guarantee: Establish a monotonic invariant or set state that holds true before and after each iteration.',
                '3. Boundary Protection: Handle edge conditions (empty inputs, single elements, negative integers) before memory allocation.',
                '4. Mutability Rule: Do not mutate input collections unless explicitly instructed by problem specification.'
              ]).map((rule, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '0.6rem',
                  alignItems: 'flex-start',
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <span style={{ color: '#10b981', fontWeight: 800, minWidth: '20px' }}>§{idx + 1}</span>
                  <FormattedMarkdownText text={rule} />
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: First-Principles Intuition & Mental Model */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.06))',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lightbulb size={16} color="#818cf8" />
              </div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>
                💡 First-Principles Intuition & Architectural Mental Model
              </h3>
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.65' }}>
              <FormattedMarkdownText text={problem.intuition || `To solve ${problem.title}, analyze what repetitive work is performed by the brute-force baseline. Under ${problem.pattern}, we eliminate redundant operations by establishing an invariant state, achieving optimal performance.`} />
            </div>
          </div>

          {/* Card 3: Interview Recognition Signals */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={16} color="#f59e0b" />
              </div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>
                🧭 FAANG & Senior Screening Clues (How to Spot This Pattern)
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(problem.interviewClues || [
                `Keywords: Look for clues like 'find duplicate', 'sorted array', 'contiguous subarray', or 'next greater element'.`,
                `Input Scale: If N <= 10^5, you must achieve O(N) or O(N log N). State the brute-force first, then immediately propose the optimal path.`,
                `Space Constraints: Always ask the interviewer whether O(1) auxiliary memory is preferred over O(N) speed.`
              ]).map((clue, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '0.6rem',
                  alignItems: 'flex-start',
                  fontSize: '0.84rem',
                  color: '#e2e8f0',
                  background: 'rgba(245, 158, 11, 0.05)',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(245, 158, 11, 0.15)'
                }}>
                  <span style={{ color: '#fbbf24', fontWeight: 800 }}>•</span>
                  <FormattedMarkdownText text={clue} />
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Prerequisites & Foundation */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h4 style={{ margin: 0, color: '#818cf8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Prerequisites & Foundation
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(problem.prerequisites || ['Array indexing & loops', 'Time & Space complexity']).map((p, idx) => (
                <span key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#e2e8f0',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>

          {/* Card 5: Problem Statement */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={16} color="#818cf8" />
              Problem Statement & Input/Output Constraints
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' }}>
              <FormattedMarkdownText text={problem.problemStatement} />
            </div>
          </div>

          {/* Card 6: Edge Cases & Boundary Traps */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HelpCircle size={16} color="#f87171" />
              <h4 style={{ margin: 0, color: '#f87171', fontSize: '0.95rem', fontWeight: 800 }}>
                ⚠️ Edge Cases & Boundary Traps Checklist
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {(problem.edgeCases || [
                'Empty collection or null reference -> return base case value immediately.',
                'Single-element collection -> verify that loop termination condition handles N = 1 correctly.',
                'All duplicate elements or all unique elements -> ensure no infinite iteration loops occur.',
                'Integer boundaries -> guard against numeric overflow when calculating midpoints.'
              ]).map((edge, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                  fontSize: '0.82rem',
                  color: '#fca5a5'
                }}>
                  <span style={{ fontWeight: 800 }}>!</span>
                  <span>{edge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: STEP-BY-STEP DRY RUN */}
      {activeTab === 'dryrun' && (
        <div style={{
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
              Trace Execution: {currentApproach.name}
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Step-by-step register & memory state
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#1e293b', borderBottom: '2px solid #334155', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Step</th>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>State / Variables</th>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Action / Condition</th>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {currentApproach.dryRun.map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                  }}>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#818cf8', fontWeight: 800 }}>#{row.step}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#e2e8f0', fontFamily: 'monospace' }}>{row.state}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>{row.action}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#34d399', fontWeight: 600 }}>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: TRADE-OFFS COMPARISON */}
      {activeTab === 'comparison' && (
        <div style={{
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
            Comprehensive Trade-offs Comparison
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#1e293b', borderBottom: '2px solid #334155', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Approach</th>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Time Complexity</th>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Space Complexity</th>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Pros</th>
                  <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Cons</th>
                </tr>
              </thead>
              <tbody>
                {problem.comparisonTable.map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                  }}>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#818cf8', fontWeight: 700 }}>{row.approach}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#34d399', fontWeight: 800 }}>{row.time}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#38bdf8', fontWeight: 800 }}>{row.space}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#a7f3d0' }}>{row.pros}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#fca5a5' }}>{row.cons}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: SPOKEN INTERVIEW PITCH & FOLLOW-UPS */}
      {activeTab === 'pitch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Verbal Pitch Script Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(99, 102, 241, 0.1))',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '10px',
            padding: '1.25rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} />
              Spoken 60-Second Interview Pitch (Read Aloud)
            </h4>
            <div style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: '1.6' }}>
              <FormattedMarkdownText text={problem.interviewPitch} />
            </div>
          </div>

          {/* Follow-up Questions Accordion */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
              Anticipated Follow-Up Questions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {problem.followUps.map((fu, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}>
                  <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    Q: {fu.question}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.5' }}>
                    <FormattedMarkdownText text={fu.answer} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: RECALL QUIZ */}
      {activeTab === 'quiz' && (
        <div style={{
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase' }}>
              Concept Recall Challenge
            </span>
            <h3 style={{ margin: '0.35rem 0 0 0', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700 }}>
              {problem.recallQuiz.question}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {problem.recallQuiz.options.map((opt, idx) => {
              let btnBg = '#1e293b';
              let btnBorder = '1px solid rgba(255, 255, 255, 0.06)';
              let textColor = '#cbd5e1';

              if (quizSubmitted) {
                if (idx === problem.recallQuiz.correctIndex) {
                  btnBg = 'rgba(16, 185, 129, 0.2)';
                  btnBorder = '1px solid #10b981';
                  textColor = '#34d399';
                } else if (selectedQuizAnswer === idx) {
                  btnBg = 'rgba(239, 68, 68, 0.2)';
                  btnBorder = '1px solid #ef4444';
                  textColor = '#f87171';
                }
              } else if (selectedQuizAnswer === idx) {
                btnBg = 'rgba(99, 102, 241, 0.25)';
                btnBorder = '1px solid #6366f1';
                textColor = '#818cf8';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizSelect(idx)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: btnBorder,
                    background: btnBg,
                    color: textColor,
                    textAlign: 'left',
                    cursor: quizSubmitted ? 'default' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedQuizAnswer === null}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: selectedQuizAnswer === null ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  background: selectedQuizAnswer === null ? '#334155' : '#6366f1',
                  color: '#ffffff'
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleQuizReset}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  background: 'transparent',
                  color: '#cbd5e1'
                }}
              >
                Try Again
              </button>
            )}
          </div>

          {quizSubmitted && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              background: selectedQuizAnswer === problem.recallQuiz.correctIndex ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${selectedQuizAnswer === problem.recallQuiz.correctIndex ? '#10b981' : '#ef4444'}`,
              fontSize: '0.85rem',
              color: '#f8fafc'
            }}>
              <strong style={{ color: selectedQuizAnswer === problem.recallQuiz.correctIndex ? '#34d399' : '#f87171' }}>
                {selectedQuizAnswer === problem.recallQuiz.correctIndex ? '✓ Correct!' : '✗ Incorrect!'}
              </strong>
              <div style={{ marginTop: '0.35rem', color: '#cbd5e1' }}>
                {problem.recallQuiz.explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
