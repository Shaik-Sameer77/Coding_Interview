import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, Code2, BookOpen, Search, CheckCircle2, Circle, 
  Sparkles, Layers, Filter, Check, Trophy
} from 'lucide-react';
import DsaCalendarView from './DsaCalendarView';
import DsaProblemDetail from './DsaProblemDetail';
import DsaTheoryView from './DsaTheoryView';
import DsaVisualAnimator from './DsaVisualAnimator';
import { DSA_PROBLEMS_CATALOG } from '../data/dsaProblemsRegistry';
import { getDsaProblemDetails } from '../data/dsaSolutionsRegistry';
import { DSA_PATTERNS } from '../data/dsaCalendarData';

export default function DsaMasterView() {
  const [subTab, setSubTab] = useState('calendar'); // 'calendar' | 'solver' | 'theory'
  const [selectedProblemId, setSelectedProblemId] = useState(1);
  const [searchProblem, setSearchProblem] = useState('');
  const [patternFilter, setPatternFilter] = useState('all');

  // Load solved state from localStorage
  const [solvedIds, setSolvedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('senior_dsa_solved');
      return saved ? JSON.parse(saved) : [1]; // Default problem 1 unlocked/solved
    } catch {
      return [1];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('senior_dsa_solved', JSON.stringify(solvedIds));
    } catch (e) {
      console.error(e);
    }
  }, [solvedIds]);

  const toggleSolved = (id) => {
    setSolvedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectProblemFromCalendar = (id) => {
    setSelectedProblemId(id);
    setSubTab('solver');
  };

  // Filtered problems list for Solver mode
  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS_CATALOG.filter(p => {
      const matchesPattern = patternFilter === 'all' || p.pattern === patternFilter;
      const matchesSearch = !searchProblem.trim() || 
        p.title.toLowerCase().includes(searchProblem.toLowerCase()) ||
        String(p.id).includes(searchProblem);
      return matchesPattern && matchesSearch;
    });
  }, [patternFilter, searchProblem]);

  const activeProblemData = useMemo(() => {
    return getDsaProblemDetails(selectedProblemId);
  }, [selectedProblemId]);

  const totalCount = DSA_PROBLEMS_CATALOG.length;
  const solvedCount = solvedIds.length;
  const percentComplete = Math.round((solvedCount / totalCount) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', height: '100%' }}>
      {/* Top Track Header Bar */}
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
            onClick={() => setSubTab('calendar')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: subTab === 'calendar' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: subTab === 'calendar' ? '#818cf8' : '#94a3b8'
            }}
          >
            <Calendar size={15} />
            📅 90-Day Calendar & Progress
          </button>

          <button
            onClick={() => setSubTab('solver')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: subTab === 'solver' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: subTab === 'solver' ? '#34d399' : '#94a3b8'
            }}
          >
            <Code2 size={15} />
            ⚡ Problem Solver & Deep-Dive (150 Qs)
          </button>

          <button
            onClick={() => setSubTab('theory')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: subTab === 'theory' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: subTab === 'theory' ? '#f59e0b' : '#94a3b8'
            }}
          >
            <BookOpen size={15} />
            🧠 Big-O & Pattern Masterclass
          </button>

          <button
            onClick={() => setSubTab('animator')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: subTab === 'animator' ? '1px solid rgba(129, 140, 248, 0.6)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: subTab === 'animator' ? 'rgba(99, 102, 241, 0.35)' : 'rgba(99, 102, 241, 0.12)',
              color: subTab === 'animator' ? '#ffffff' : '#a5b4fc',
              boxShadow: subTab === 'animator' ? '0 0 14px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            <Sparkles size={15} color="#818cf8" />
            🎬 Visual Algorithm Studio
          </button>
        </div>

        {/* Solved Progress Counter Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '0.35rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <Trophy size={15} color="#10b981" />
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>
              {solvedCount} / {totalCount} Solved ({percentComplete}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Render Branch */}
      {subTab === 'calendar' && (
        <DsaCalendarView
          solvedIds={solvedIds}
          onToggleSolved={toggleSolved}
          onSelectProblem={handleSelectProblemFromCalendar}
        />
      )}

      {subTab === 'theory' && (
        <DsaTheoryView />
      )}

      {subTab === 'animator' && (
        <DsaVisualAnimator problemId={selectedProblemId} />
      )}

      {subTab === 'solver' && (
        <div style={{ display: 'flex', gap: '1.25rem', height: 'calc(100vh - 130px)', minHeight: '600px' }}>
          {/* Left Problem Navigator Sidebar */}
          <aside style={{
            width: '320px',
            minWidth: '320px',
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Search and Category Filter */}
            <div style={{ padding: '0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#090d16', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <Search size={14} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search 150 problems..."
                  value={searchProblem}
                  onChange={(e) => setSearchProblem(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f8fafc',
                    fontSize: '0.78rem',
                    width: '100%'
                  }}
                />
              </div>

              <select
                value={patternFilter}
                onChange={(e) => setPatternFilter(e.target.value)}
                style={{
                  background: '#090d16',
                  color: '#cbd5e1',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.78rem',
                  outline: 'none'
                }}
              >
                <option value="all">All 18 Patterns ({DSA_PROBLEMS_CATALOG.length})</option>
                {DSA_PATTERNS.map((p) => (
                  <option key={p.id} value={p.name}>{p.name} ({p.count})</option>
                ))}
              </select>
            </div>

            {/* Scrollable Problem Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {filteredProblems.map((prob) => {
                const isSelected = selectedProblemId === prob.id;
                const isSolved = solvedIds.includes(prob.id);
                const diffColor = prob.difficulty === 'Easy' ? '#10b981' : prob.difficulty === 'Medium' ? '#f59e0b' : '#ef4444';

                return (
                  <div
                    key={prob.id}
                    onClick={() => setSelectedProblemId(prob.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSolved(prob.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {isSolved ? (
                          <CheckCircle2 size={16} color="#10b981" />
                        ) : (
                          <Circle size={16} color="#475569" />
                        )}
                      </button>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: isSelected ? '#ffffff' : '#e2e8f0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          #{prob.id}. {prob.title}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          Day {prob.day} • {prob.pattern}
                        </span>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.68rem',
                      color: diffColor,
                      background: `${diffColor}15`,
                      padding: '0.1rem 0.35rem',
                      borderRadius: '3px',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {prob.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right Main Problem Detail View */}
          <main style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            <DsaProblemDetail
              problem={activeProblemData}
              isSolved={solvedIds.includes(selectedProblemId)}
              onToggleSolved={toggleSolved}
            />
          </main>
        </div>
      )}
    </div>
  );
}
