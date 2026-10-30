import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, CheckCircle2, Circle, ArrowLeft, ArrowRight, Code2, 
  Play, BookOpen, Layers, Sparkles, Filter, Check, Copy, ExternalLink,
  Shield, Cpu, Database, Layout, RefreshCw, Terminal, GitBranch, Workflow, ArrowDown, ShieldCheck,
  Compass, Target, MessageSquare
} from 'lucide-react';
// React Track Registries & Demos
import { CATEGORIES } from './react/data/categories';
import { QUESTIONS_DATA } from './react/data/questionsData';
import { DEMO_REGISTRY } from './react/demos/DemoRegistry';
import { getSystemDesign } from './react/data/systemDesignData';
import { getQuestionDeepDive } from './react/data/questionDeepDives';
import { getProblemSourceCode, getCategorySourceFileName } from './react/data/sourceCodeRegistry';

// Node.js Backend Track Registries & Demos
import { NODE_CATEGORIES } from './node/data/nodeCategories';
import { NODE_QUESTIONS_DATA } from './node/data/nodeQuestionsData';
import { getNodeSystemDesign } from './node/data/nodeSystemDesignData';
import { getNodeQuestionDeepDive } from './node/data/nodeQuestionDeepDives';
import { getNodeProblemSourceCode } from './node/data/nodeSourceCodeRegistry';
import { NODE_DEMO_REGISTRY } from './node/demos/NodeDemos';

// Shared Utilities & Viewers
import MermaidRenderer from './shared/MermaidRenderer';
import CodeViewer from './shared/CodeViewer';
import SyntaxCodeBlock from './shared/SyntaxCodeBlock';

// JavaScript Master Track (Topic-wise Notes & 150 Interview Questions)
import JavaScriptMasterView from './javascript/components/JavaScriptMasterView';

// TypeScript Master Track (Topic-wise Notes & 150 Interview Questions)
import TypeScriptMasterView from './typescript/components/TypeScriptMasterView';

// React Master Track (Topic-wise Notes & 250 Interview Questions)
import ReactMasterView from './react/components/ReactMasterView';

// Node.js Master Track (Topic-wise Notes & 250 Interview Questions)
import NodeMasterView from './node/components/NodeMasterView';

// Screening Master Track (Tailored HR & Technical Screening Prep: 100 Qs & Guide)
import ScreeningMasterView from './screening/components/ScreeningMasterView';

// DSA Master Track (90-Day Calendar, 18 Patterns, 150 LeetCode Problems)
import DsaMasterView from './dsa/components/DsaMasterView';

export default function App() {
  const [track, setTrack] = useState('react'); // 'react' | 'node'
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'systemDesign' | 'blueprint' | 'code'
  const [copied, setCopied] = useState(false);
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Solved state in localStorage per track
  const [solvedReactIds, setSolvedReactIds] = useState(() => {
    try {
      const saved = localStorage.getItem('senior_react_solved');
      return saved ? JSON.parse(saved) : [1, 2, 11, 21, 31, 51, 66];
    } catch {
      return [1, 2, 11, 21, 31, 51, 66];
    }
  });

  const [solvedNodeIds, setSolvedNodeIds] = useState(() => {
    try {
      const saved = localStorage.getItem('senior_node_solved');
      return saved ? JSON.parse(saved) : [1, 2, 11, 14];
    } catch {
      return [1, 2, 11, 14];
    }
  });

  const solvedIds = track === 'react' ? solvedReactIds : solvedNodeIds;

  useEffect(() => {
    setActiveStepIndex(0);
  }, [selectedId]);

  useEffect(() => {
    try {
      if (track === 'react') {
        localStorage.setItem('senior_react_solved', JSON.stringify(solvedReactIds));
      } else {
        localStorage.setItem('senior_node_solved', JSON.stringify(solvedNodeIds));
      }
    } catch (e) {
      console.error(e);
    }
  }, [track, solvedReactIds, solvedNodeIds]);

  const toggleSolved = (id) => {
    if (track === 'react') {
      setSolvedReactIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSolvedNodeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }
  };

  // Keyboard navigation: j/k or Left/Right
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['javascript', 'typescript', 'react-notes', 'node-master', 'screening', 'dsa'].includes(track)) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'k') {
        setSelectedId(prev => Math.min(prev + 1, 100));
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        setSelectedId(prev => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [track]);

  const activeQuestionsData = track === 'node' ? NODE_QUESTIONS_DATA : QUESTIONS_DATA;
  const activeCategoriesData = track === 'node' ? NODE_CATEGORIES : CATEGORIES;

  const filteredQuestions = useMemo(() => {
    return activeQuestionsData.filter(q => {
      const matchesCat = activeCategory === 'all' || q.category === activeCategory;
      const matchesSearch = 
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        q.id.toString() === search.trim();
      return matchesCat && matchesSearch;
    });
  }, [activeQuestionsData, search, activeCategory]);

  const currentQ = useMemo(() => {
    return activeQuestionsData.find(q => q.id === selectedId) || activeQuestionsData[0];
  }, [activeQuestionsData, selectedId]);

  const deepDive = useMemo(() => {
    return track === 'react' ? getQuestionDeepDive(currentQ) : getNodeQuestionDeepDive(currentQ);
  }, [track, currentQ]);

  const currentDesign = useMemo(() => {
    return track === 'react' ? getSystemDesign(currentQ) : getNodeSystemDesign(currentQ);
  }, [track, currentQ]);

  const DemoComponent = useMemo(() => {
    if (track === 'react') {
      return DEMO_REGISTRY[currentQ.demoId] || (() => (
        <div style={{ padding: '2rem', color: '#94a3b8' }}>Live demonstration ready in codebase.</div>
      ));
    }
    return NODE_DEMO_REGISTRY[currentQ.demoId] || (() => (
      <div style={{ padding: '2rem', color: '#94a3b8' }}>Node.js backend execution harness active in codebase.</div>
    ));
  }, [track, currentQ]);

  const progressPercent = Math.round((solvedIds.length / 100) * 100);

  const sourceCode = useMemo(() => {
    return track === 'react' 
      ? getProblemSourceCode(currentQ.category, currentQ.id)
      : getNodeProblemSourceCode(currentQ.category, currentQ.id);
  }, [track, currentQ]);

  const copyCode = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyMermaid = () => {
    if (currentDesign?.sequenceDiagram?.mermaid) {
      navigator.clipboard.writeText(currentDesign.sequenceDiagram.mermaid);
      setCopiedMermaid(true);
      setTimeout(() => setCopiedMermaid(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0b0f19', color: '#f8fafc', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.75rem 1.5rem', 
        background: '#111827', 
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: track === 'react' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: track === 'react' ? '0 0 15px rgba(99,102,241,0.5)' : '0 0 15px rgba(16,185,129,0.5)'
          }}>
            <Terminal size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Senior {track === 'react' ? 'React & Frontend' : 'Node.js & Backend'} Machine Coding Suite
              <span className="badge-live">{track === 'react' ? '100 REACT' : '100 NODE.JS'}</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Chrona, LesHub & Enterprise Production Scenarios • Interactive Runner & Interview Blueprints
            </span>
          </div>
        </div>

        {/* Center: Track Switcher */}
        <div style={{ display: 'flex', background: '#090d16', padding: '0.2rem', borderRadius: '8px', border: '1px solid #1e293b', gap: '0.2rem', overflowX: 'auto', maxWidth: '68vw' }}>
          <button
            onClick={() => { setTrack('react'); setSelectedId(1); setActiveCategory('all'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'react' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: track === 'react' ? '#818cf8' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚛️ React UI (100)</span>
          </button>
          <button
            onClick={() => { setTrack('react-notes'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'react-notes' ? 'rgba(97, 218, 251, 0.25)' : 'transparent',
              color: track === 'react-notes' ? '#61dafb' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚛️ React Master (Notes & 250 Qs)</span>
          </button>
          <button
            onClick={() => { setTrack('node-master'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'node-master' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: track === 'node-master' ? '#34d399' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🟢 Node.js Master (Notes & 250 Qs)</span>
          </button>
          <button
            onClick={() => { setTrack('node'); setSelectedId(1); setActiveCategory('all'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'node' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: track === 'node' ? '#06b6d4' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🟢 Node.js Backend (100)</span>
          </button>
          <button
            onClick={() => { setTrack('javascript'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'javascript' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: track === 'javascript' ? '#f59e0b' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📜 JavaScript Master (Notes & 200 Qs)</span>
          </button>
          <button
            onClick={() => { setTrack('typescript'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'typescript' ? 'rgba(49, 120, 198, 0.25)' : 'transparent',
              color: track === 'typescript' ? '#60a5fa' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🔷 TypeScript Master (Notes & 150 Qs)</span>
          </button>
          <button
            onClick={() => { setTrack('screening'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: track === 'screening' ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'screening' ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.3), rgba(129, 140, 248, 0.3))' : 'transparent',
              color: track === 'screening' ? '#38bdf8' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🎯 Screening Prep (100 Qs & Guide)</span>
          </button>
          <button
            onClick={() => { setTrack('dsa'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: track === 'dsa' ? '1px solid rgba(129, 140, 248, 0.6)' : '1px solid transparent',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: track === 'dsa' ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.35), rgba(168, 85, 247, 0.35))' : 'transparent',
              color: track === 'dsa' ? '#c7d2fe' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚡ 90-Day DSA Master (150 Qs)</span>
          </button>
        </div>

        {/* Progress Tracker Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {track === 'dsa' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 800 }}>
                ⚡ DSA Master: 90 Days • 18 Patterns • 150 LeetCode
              </span>
            </div>
          ) : track === 'screening' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                🎯 Screening: 100 Qs + Salary & Intro Playbook
              </span>
            </div>
          ) : track === 'node-master' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                Node.js Master: 24 Parts + 250 Interview Qs
              </span>
            </div>
          ) : track === 'react-notes' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(97, 218, 251, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(97, 218, 251, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: '#61dafb', fontWeight: 700 }}>
                React Master: 21 Parts + 250 Interview Qs
              </span>
            </div>
          ) : track === 'typescript' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(49, 120, 198, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(49, 120, 198, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>
                TypeScript Master: 22 Notes + 150 Interview Qs
              </span>
            </div>
          ) : track === 'javascript' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
                JavaScript Master: 10 Sections + 200 Qs
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                Progress: <span style={{ color: track === 'react' ? '#818cf8' : '#34d399' }}>{solvedIds.length} / 100</span> ({progressPercent}%)
              </span>
              <div style={{ width: '120px', height: '8px', background: '#1f2937', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${progressPercent}%`,
                  background: track === 'react' ? 'linear-gradient(90deg, #6366f1, #a855f7)' : 'linear-gradient(90deg, #10b981, #06b6d4)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Body Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {track === 'dsa' ? (
          <div style={{ flex: 1, padding: '1.25rem 2rem', overflowY: 'auto' }}>
            <DsaMasterView />
          </div>
        ) : track === 'screening' ? (
          <div style={{ flex: 1, padding: '1.25rem 2rem', overflowY: 'auto' }}>
            <ScreeningMasterView />
          </div>
        ) : track === 'node-master' ? (
          <div style={{ flex: 1, padding: '1.25rem 2rem', overflowY: 'auto' }}>
            <NodeMasterView onSwitchToMachineCoding={() => setTrack('node')} />
          </div>
        ) : track === 'react-notes' ? (
          <div style={{ flex: 1, padding: '1.25rem 2rem', overflowY: 'auto' }}>
            <ReactMasterView onSwitchToMachineCoding={() => setTrack('react')} />
          </div>
        ) : track === 'javascript' ? (
          <div style={{ flex: 1, padding: '1.25rem 2rem', overflowY: 'auto' }}>
            <JavaScriptMasterView />
          </div>
        ) : track === 'typescript' ? (
          <div style={{ flex: 1, padding: '1.25rem 2rem', overflowY: 'auto' }}>
            <TypeScriptMasterView />
          </div>
        ) : (
          <>
            {/* Left Sidebar: Problem Navigator */}
            <aside style={{ 
          width: '360px', 
          background: '#0d131f', 
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', 
          flexDirection: 'column',
          flexShrink: 0
        }}>
          {/* Search & Category Filter Bar */}
          <div style={{ padding: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keyword, tag, or #ID..."
                style={{
                  width: '100%',
                  padding: '0.45rem 0.6rem 0.45rem 2rem',
                  background: '#161f30',
                  border: '1px solid #293548',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.6rem',
                background: '#161f30',
                border: '1px solid #293548',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '0.75rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All 10 Tiers (100 Problems)</option>
              {activeCategoriesData.map(c => (
                <option key={c.id} value={c.id}>{c.title} ({c.range})</option>
              ))}
            </select>
          </div>

          {/* Problem List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.4rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', padding: '0.4rem 0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Showing {filteredQuestions.length} Questions (Use j/k to navigate)
            </div>
            {filteredQuestions.map(q => {
              const isSelected = q.id === selectedId;
              const isSolved = solvedIds.includes(q.id);

              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedId(q.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                    border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSolved(q.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    title={isSolved ? "Mark unpracticed" : "Mark practiced"}
                  >
                    {isSolved ? (
                      <CheckCircle2 size={16} color="#10b981" />
                    ) : (
                      <Circle size={16} color="#475569" />
                    )}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#818cf8' : '#94a3b8' }}>
                        #{q.id}
                      </span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: isSelected ? 600 : 500, 
                        color: isSelected ? '#f8fafc' : '#cbd5e1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {q.title}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    background: q.difficulty === 'Principal' ? 'rgba(239,68,68,0.2)' : q.difficulty === 'Staff' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
                    color: q.difficulty === 'Principal' ? '#f87171' : q.difficulty === 'Staff' ? '#fbbf24' : '#60a5fa'
                  }}>
                    {q.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Main Content Pane */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0b0f19' }}>
          {/* Question Header Bar */}
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(17, 24, 39, 0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#818cf8', background: 'rgba(99,102,241,0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.3)' }}>
                  Problem #{currentQ.id}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                  {currentQ.category.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#1f2937', color: '#cbd5e1', border: '1px solid #374151' }}>
                  Level: {currentQ.difficulty}
                </span>
                <button
                  onClick={() => toggleSolved(currentQ.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: solvedIds.includes(currentQ.id) ? 'rgba(16,185,129,0.2)' : '#1e293b',
                    color: solvedIds.includes(currentQ.id) ? '#34d399' : '#94a3b8',
                    fontWeight: 600
                  }}
                >
                  <CheckCircle2 size={13} />
                  {solvedIds.includes(currentQ.id) ? 'Practiced ✓' : 'Mark as Practiced'}
                </button>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#f8fafc' }}>
                {currentQ.title}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {currentQ.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '9999px', color: '#94a3b8' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prev / Next Nav Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={selectedId <= 1}
                onClick={() => setSelectedId(s => Math.max(s - 1, 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.4rem 0.8rem',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: selectedId <= 1 ? '#475569' : '#cbd5e1',
                  cursor: selectedId <= 1 ? 'default' : 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} /> Prev (j)
              </button>
              <button
                disabled={selectedId >= 100}
                onClick={() => setSelectedId(s => Math.min(s + 1, 100))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.4rem 0.8rem',
                  background: '#6366f1',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: selectedId >= 100 ? 'default' : 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Next (k) <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            padding: '0.5rem 1.5rem', 
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: '#0d131f'
          }}>
            {[
              { id: 'demo', label: 'Interactive Live Demo', icon: Play },
              { id: 'systemDesign', label: 'System Design & Sequence Flow', icon: GitBranch },
              { id: 'blueprint', label: 'Senior Interview Blueprint & Traps', icon: BookOpen },
              { id: 'code', label: 'Architecture & Implementation', icon: Code2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                    color: isActive ? '#818cf8' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '6px 6px 0 0'
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {/* TAB 1: Live Interactive Demo */}
            {activeTab === 'demo' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '780px' }}>
                <div className="glass-panel" style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                        Runnable Component Playground
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Ready to interact & test live edge cases
                    </span>
                  </div>

                  {/* Component Render */}
                  <div style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DemoComponent />
                  </div>
                </div>

                {/* Quick Senior Highlights Card */}
                <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} color="#6366f1" /> Why this problem matters in Senior Machine Coding Rounds:
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                    {currentQ.description}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: System Design & Sequence Flow */}
            {activeTab === 'systemDesign' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', maxWidth: '860px' }}>
                {/* Header Banner */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: '12px',
                  padding: '1rem 1.4rem'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Workflow size={18} color="#818cf8" />
                      System Architecture & Execution Lifeline
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                      Interactive actor lifeline, state machines, DOM boundaries, and microtask flow.
                    </p>
                  </div>
                  <button
                    onClick={copyMermaid}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.85rem',
                      background: copiedMermaid ? '#10b981' : '#1e293b',
                      color: '#fff',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      transition: '0.2s'
                    }}
                  >
                    {copiedMermaid ? <Check size={14} /> : <Copy size={14} />}
                    {copiedMermaid ? 'Mermaid Copied!' : 'Copy Mermaid Code'}
                  </button>
                </div>

                {/* System Design Architecture Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
                  {/* Component Hierarchy */}
                  <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #6366f1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      <Layout size={15} color="#818cf8" />
                      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                        Component Hierarchy & Boundaries
                      </h4>
                    </div>
                    <div style={{
                      background: '#090d16',
                      border: '1px solid #1e293b',
                      borderRadius: '6px',
                      padding: '0.7rem 0.9rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#cbd5e1',
                      lineHeight: 1.6
                    }}>
                      {currentDesign.systemDesign.componentHierarchy}
                    </div>
                  </div>

                  {/* Browser & Web APIs */}
                  <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #ec4899' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      <Cpu size={15} color="#f472b6" />
                      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                        Native Browser & DOM APIs
                      </h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {currentDesign.systemDesign.browserApis.map((api, idx) => (
                        <li key={idx} style={{ lineHeight: 1.4 }}>
                          <code style={{ color: '#f472b6', background: 'rgba(236,72,153,0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                            {api}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* State Model */}
                  <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      <Database size={15} color="#34d399" />
                      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                        State & Ref Store Model
                      </h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(currentDesign.systemDesign.stateModel).map(([key, desc]) => (
                        <div key={key} style={{ fontSize: '0.78rem', background: '#090d16', padding: '0.5rem 0.7rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                          <span style={{ color: '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>{key}</span>: <span style={{ color: '#cbd5e1' }}>{desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invariants & Safety Guarantees */}
                  <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      <ShieldCheck size={15} color="#fbbf24" />
                      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                        Architectural Invariants & Guarantees
                      </h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {currentDesign.systemDesign.invariants.map((inv, idx) => (
                        <li key={idx} style={{ lineHeight: 1.4 }}>{inv}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Interactive Sequence Diagram Lifeline */}
                <div className="glass-panel" style={{ padding: '1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <GitBranch size={16} color="#818cf8" />
                        Interactive Sequence Diagram Lifeline
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                        Step through the runtime message flow between actors to see how state transitions propagate.
                      </p>
                    </div>

                    {/* Step simulator controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                        disabled={activeStepIndex === 0}
                        style={{
                          padding: '0.3rem 0.6rem',
                          background: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          color: activeStepIndex === 0 ? '#475569' : '#f8fafc',
                          cursor: activeStepIndex === 0 ? 'default' : 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        Prev Step
                      </button>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, minWidth: '70px', textAlign: 'center' }}>
                        Step {activeStepIndex + 1} of {currentDesign.sequenceDiagram.steps.length}
                      </span>
                      <button
                        onClick={() => setActiveStepIndex(prev => Math.min(currentDesign.sequenceDiagram.steps.length - 1, prev + 1))}
                        disabled={activeStepIndex >= currentDesign.sequenceDiagram.steps.length - 1}
                        style={{
                          padding: '0.3rem 0.6rem',
                          background: '#6366f1',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#fff',
                          cursor: activeStepIndex >= currentDesign.sequenceDiagram.steps.length - 1 ? 'default' : 'pointer',
                          opacity: activeStepIndex >= currentDesign.sequenceDiagram.steps.length - 1 ? 0.4 : 1,
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        Next Step ➔
                      </button>
                    </div>
                  </div>

                  {/* Actor Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem', padding: '0.6rem', background: '#090d16', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', alignSelf: 'center', marginRight: '0.4rem' }}>
                      Lifeline Actors:
                    </span>
                    {currentDesign.sequenceDiagram.actors.map((actor, idx) => {
                      const colors = ['#818cf8', '#38bdf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];
                      const c = colors[idx % colors.length];
                      return (
                        <span key={actor} style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          background: `${c}15`,
                          color: c,
                          border: `1px solid ${c}40`
                        }}>
                          {actor}
                        </span>
                      );
                    })}
                  </div>

                  {/* Step Timeline Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {currentDesign.sequenceDiagram.steps.map((st, idx) => {
                      const isCurrent = idx === activeStepIndex;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveStepIndex(idx)}
                          style={{
                            display: 'flex',
                            gap: '0.9rem',
                            padding: '0.8rem 1rem',
                            background: isCurrent ? 'rgba(99,102,241,0.14)' : 'rgba(15,23,42,0.6)',
                            border: isCurrent ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            transform: isCurrent ? 'translateX(4px)' : 'none'
                          }}
                        >
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isCurrent ? '#6366f1' : '#1e293b',
                            color: isCurrent ? '#fff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            flexShrink: 0
                          }}>
                            {st.step}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#93c5fd' }}>{st.from}</span>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>➔</span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa' }}>{st.to}</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginLeft: '0.3rem' }}>
                                {st.action}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                              {st.detail}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mermaid Visual Sequence Diagram */}
                <div className="glass-panel" style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Workflow size={16} color="#818cf8" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                        Visual Sequence Diagram (Rendered SVG)
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Interactive Lifeline Rendered via Mermaid.js
                    </span>
                  </div>

                  {/* Render Visual SVG */}
                  <MermaidRenderer 
                    chart={currentDesign.sequenceDiagram.mermaid} 
                    id={`chart-${currentQ.id}`} 
                  />

                  {/* Raw Mermaid Syntax Collapsible */}
                  <details style={{ marginTop: '0.8rem' }}>
                    <summary style={{ fontSize: '0.75rem', color: '#818cf8', cursor: 'pointer', userSelect: 'none', fontWeight: 600 }}>
                      ▶ View / Copy Raw Mermaid Source Code
                    </summary>
                    <div style={{ marginTop: '0.5rem' }}>
                      <SyntaxCodeBlock 
                        code={currentDesign.sequenceDiagram.mermaid} 
                        label="Mermaid Sequence Flow" 
                        language="javascript" 
                      />
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* TAB 2: Senior Interview Blueprint */}
            {activeTab === 'blueprint' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '820px' }}>
                {/* Real-World Use Cases & UX Rationale Card */}
                <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: '4px solid #38bdf8' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', margin: '0 0 0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Compass size={16} /> 🎯 Real-World Use Cases & UX Rationale (Why Not The Naive Way?):
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 0.8rem 0' }}>
                    {deepDive.uxRationale}
                  </p>
                  {deepDive.realWorldUseCases && deepDive.realWorldUseCases.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {deepDive.realWorldUseCases.map((uc, idx) => (
                        <div key={idx} style={{ 
                          background: 'rgba(15, 23, 42, 0.6)', 
                          padding: '0.6rem 0.8rem', 
                          borderRadius: '6px', 
                          border: '1px solid rgba(255,255,255,0.06)' 
                        }}>
                          <span style={{ color: '#93c5fd', fontWeight: 700, fontSize: '0.8rem' }}>• {uc.title}: </span>
                          <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{uc.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Senior Interview Questions & Model Answers Card */}
                {deepDive.interviewQA && deepDive.interviewQA.length > 0 && (
                  <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: '4px solid #a855f7' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#c084fc', margin: '0 0 0.8rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MessageSquare size={16} /> 🎙️ Senior Interview Questions & In-Depth Model Answers:
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {deepDive.interviewQA.map((qa, idx) => (
                        <div key={idx} style={{ 
                          background: 'rgba(15, 23, 42, 0.75)', 
                          border: '1px solid rgba(168, 85, 247, 0.25)', 
                          borderRadius: '8px', 
                          padding: '0.9rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ 
                              background: 'rgba(168, 85, 247, 0.2)', 
                              color: '#c084fc', 
                              padding: '0.15rem 0.45rem', 
                              borderRadius: '4px', 
                              fontSize: '0.72rem', 
                              fontWeight: 800,
                              flexShrink: 0 
                            }}>
                              Q{idx + 1}
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4 }}>
                              {qa.question}
                            </span>
                          </div>
                          <div style={{ 
                            background: '#090d16', 
                            padding: '0.7rem 0.85rem', 
                            borderRadius: '6px', 
                            border: '1px solid #1e293b', 
                            fontSize: '0.8rem', 
                            color: '#cbd5e1', 
                            lineHeight: 1.6 
                          }}>
                            <strong style={{ color: '#34d399' }}>Senior Model Answer: </strong>
                            {qa.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edge Cases Section */}
                <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: '4px solid #f59e0b' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', margin: '0 0 0.8rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    ⚠️ Senior Traps & Critical Edge Cases Tested:
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    {currentQ.seniorEdgeCases.map((edge, idx) => (
                      <li key={idx} style={{ lineHeight: 1.5 }}>
                        {edge}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Architecture & Performance */}
                <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: '4px solid #6366f1' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8', margin: '0 0 0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    🏗️ Architecture, Lifecycle & Performance Blueprint:
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    {currentQ.architectureSummary}
                  </p>
                </div>

                {/* Interview Talking Script */}
                <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: '4px solid #10b981' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', margin: '0 0 0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    🎙️ Interviewer Talking Script & Trade-off Defense:
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    "{currentQ.interviewTalkingPoints}"
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Reference Implementation with Syntax-Highlighted IDE Viewer */}
            {activeTab === 'code' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '880px' }}>
                <CodeViewer 
                  code={sourceCode} 
                  fileName={track === 'react' ? `src/react/demos/${getCategorySourceFileName(currentQ.category)}` : `src/node/data/nodeSourceCodeRegistry.js`}
                  category={currentQ.category}
                />
              </div>
            )}
          </div>
        </main>
          </>
        )}
      </div>
    </div>
  );
}
