import React, { useState, useMemo } from 'react';
import { 
  Calendar, CheckCircle2, Circle, Filter, Sparkles, 
  Search, RefreshCw, Trophy, BookOpen, Layers
} from 'lucide-react';
import { DSA_CALENDAR_DAYS, DSA_PATTERNS } from '../data/dsaCalendarData';
import { DSA_PROBLEMS_CATALOG } from '../data/dsaProblemsRegistry';

export default function DsaCalendarView({ solvedIds, onToggleSolved, onSelectProblem }) {
  const [selectedPattern, setSelectedPattern] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSolved, setFilterSolved] = useState('all'); // 'all' | 'solved' | 'unsolved'

  const catalogMap = useMemo(() => {
    const map = new Map();
    DSA_PROBLEMS_CATALOG.forEach(p => map.set(p.id, p));
    return map;
  }, []);

  // Filter days
  const filteredDays = useMemo(() => {
    return DSA_CALENDAR_DAYS.filter(day => {
      // Pattern filter
      if (selectedPattern !== 'all' && day.pattern.toLowerCase() !== selectedPattern.toLowerCase()) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = day.title.toLowerCase().includes(query);
        const matchesPattern = day.pattern.toLowerCase().includes(query);
        const matchesProblems = day.problemIds.some(pid => {
          const prob = catalogMap.get(pid);
          return prob && prob.title.toLowerCase().includes(query);
        });
        if (!matchesTitle && !matchesPattern && !matchesProblems) return false;
      }

      // Solved filter
      if (filterSolved === 'solved') {
        if (day.isReview) return false;
        const allSolved = day.problemIds.length > 0 && day.problemIds.every(pid => solvedIds.includes(pid));
        if (!allSolved) return false;
      } else if (filterSolved === 'unsolved') {
        if (day.isReview) return false;
        const hasUnsolved = day.problemIds.some(pid => !solvedIds.includes(pid));
        if (!hasUnsolved) return false;
      }

      return true;
    });
  }, [selectedPattern, searchQuery, filterSolved, solvedIds, catalogMap]);

  const totalProblems = DSA_PROBLEMS_CATALOG.length;
  const totalSolvedCount = solvedIds.length;
  const progressPercent = Math.round((totalSolvedCount / totalProblems) * 100);

  const getPatternColor = (patternName) => {
    const found = DSA_PATTERNS.find(p => p.name.toLowerCase() === patternName.toLowerCase());
    return found ? found.color : '#64748b';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Calendar Stats Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #111827 0%, #1e1b4b 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Calendar size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              90-Day DSA Mastery Calendar
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              150 High-Frequency LeetCode Problems • 18 Core Patterns • Structured Active Recall & Review Days
            </span>
          </div>
        </div>

        {/* Progress Bar & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '180px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Curriculum Mastery</span>
              <span style={{ color: '#818cf8', fontWeight: 800 }}>{totalSolvedCount} / {totalProblems} ({progressPercent}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#111827',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#090d16', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #1e293b', minWidth: '240px' }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search Day, Problem, or Pattern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '0.82rem',
              width: '100%'
            }}
          />
        </div>

        {/* Solved Filter */}
        <div style={{ display: 'flex', gap: '0.3rem', background: '#090d16', padding: '0.2rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
          {['all', 'unsolved', 'solved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterSolved(f)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                background: filterSolved === f ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: filterSolved === f ? '#818cf8' : '#94a3b8'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Filter Tags Row */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        <button
          onClick={() => setSelectedPattern('all')}
          style={{
            padding: '0.35rem 0.8rem',
            borderRadius: '999px',
            border: selectedPattern === 'all' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
            background: selectedPattern === 'all' ? 'rgba(99, 102, 241, 0.2)' : '#111827',
            color: selectedPattern === 'all' ? '#c7d2fe' : '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All 18 Patterns
        </button>
        {DSA_PATTERNS.map((pat) => (
          <button
            key={pat.id}
            onClick={() => setSelectedPattern(pat.name)}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              border: selectedPattern === pat.name ? `1px solid ${pat.color}` : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedPattern === pat.name ? `${pat.color}25` : '#111827',
              color: selectedPattern === pat.name ? pat.color : '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {pat.name} ({pat.count})
          </button>
        ))}
      </div>

      {/* 90-Day Interactive Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {filteredDays.map((day) => {
          const patColor = getPatternColor(day.pattern);
          const isAllSolvedInDay = !day.isReview && day.problemIds.length > 0 && day.problemIds.every(pid => solvedIds.includes(pid));

          return (
            <div
              key={day.day}
              style={{
                background: day.isReview ? '#0f172a' : '#111827',
                borderRadius: '10px',
                border: isAllSolvedInDay 
                  ? '1px solid rgba(16, 185, 129, 0.5)' 
                  : day.isReview 
                    ? '1px solid rgba(100, 116, 139, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                position: 'relative',
                boxShadow: isAllSolvedInDay ? '0 0 15px rgba(16, 185, 129, 0.08)' : 'none'
              }}
            >
              {/* Day Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    color: '#f8fafc',
                    background: '#1e293b',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    DAY {day.day}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: patColor,
                    background: `${patColor}15`,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px'
                  }}>
                    {day.pattern}
                  </span>
                </div>

                {isAllSolvedInDay && (
                  <CheckCircle2 size={16} color="#10b981" />
                )}
              </div>

              {/* Review Day Description */}
              {day.isReview ? (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(100, 116, 139, 0.1)',
                  border: '1px dashed rgba(100, 116, 139, 0.3)',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <RefreshCw size={14} color="#38bdf8" />
                  <span><strong>{day.title}</strong>: Redo and test spaced recall on {day.reviewRange}.</span>
                </div>
              ) : (
                /* Problems List in Day */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {day.problemIds.map((pid) => {
                    const prob = catalogMap.get(pid);
                    if (!prob) return null;
                    const isSolved = solvedIds.includes(pid);
                    const diffColor = prob.difficulty === 'Easy' ? '#10b981' : prob.difficulty === 'Medium' ? '#f59e0b' : '#ef4444';

                    return (
                      <div
                        key={pid}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: isSolved ? 'rgba(16, 185, 129, 0.08)' : '#1e293b',
                          padding: '0.45rem 0.65rem',
                          borderRadius: '6px',
                          border: isSolved ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(255, 255, 255, 0.04)',
                          gap: '0.5rem'
                        }}
                      >
                        <div 
                          onClick={() => onSelectProblem(pid)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            cursor: 'pointer',
                            flex: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>#{pid}</span>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: isSolved ? '#a7f3d0' : '#f1f5f9',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {prob.title}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            color: diffColor,
                            background: `${diffColor}15`,
                            padding: '0.1rem 0.35rem',
                            borderRadius: '3px',
                            fontWeight: 700
                          }}>
                            {prob.difficulty[0]}
                          </span>

                          <button
                            onClick={() => onToggleSolved(pid)}
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
