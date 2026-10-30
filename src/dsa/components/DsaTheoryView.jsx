import React, { useState } from 'react';
import { BookOpen, Cpu, Layers, Sparkles, AlertTriangle, ArrowRight, Table, Check } from 'lucide-react';
import { DSA_PATTERNS_THEORY, BIG_O_FOUNDATIONS } from '../data/dsaPatternsData';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';
import DsaVisualAnimator from './DsaVisualAnimator';

export default function DsaTheoryView() {
  const [selectedPatternId, setSelectedPatternId] = useState(DSA_PATTERNS_THEORY[0].id);

  const activePattern = DSA_PATTERNS_THEORY.find(p => p.id === selectedPatternId) || DSA_PATTERNS_THEORY[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Big-O Foundations Section */}
      <div style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={20} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
              {BIG_O_FOUNDATIONS.title}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {BIG_O_FOUNDATIONS.summary}
            </span>
          </div>
        </div>

        {/* Complexity Growth Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#1e293b', borderBottom: '2px solid #334155', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Notation</th>
                <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Name</th>
                <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Typical Example</th>
                <th style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>Approx Operations for N = 1,000</th>
              </tr>
            </thead>
            <tbody>
              {BIG_O_FOUNDATIONS.coreComplexities.map((row, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                }}>
                  <td style={{ padding: '0.6rem 0.8rem', color: '#818cf8', fontWeight: 800, fontFamily: 'monospace' }}>
                    {row.notation}
                  </td>
                  <td style={{ padding: '0.6rem 0.8rem', color: '#f8fafc', fontWeight: 600 }}>{row.name}</td>
                  <td style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>{row.example}</td>
                  <td style={{ padding: '0.6rem 0.8rem', color: '#34d399', fontWeight: 700 }}>{row.opsFor1000}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Golden Rules Grid */}
        <div style={{
          background: '#090d16',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 800 }}>
            ⚡ 5 Golden Rules for Calculating Big-O:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
            {BIG_O_FOUNDATIONS.goldenRules.map((rule, idx) => (
              <div key={idx} style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', gap: '0.4rem' }}>
                <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Masterclass Deep Dive */}
      <div style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Pattern Pills Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
          {DSA_PATTERNS_THEORY.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatternId(p.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: selectedPatternId === p.id ? `1px solid ${p.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedPatternId === p.id ? `${p.color}25` : '#1e293b',
                color: selectedPatternId === p.id ? p.color : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Active Pattern Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: activePattern.color, fontWeight: 800 }}>
              {activePattern.name} Pattern Masterclass
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              {activePattern.tagline}
            </span>
          </div>

          {/* Mental Model */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: `4px solid ${activePattern.color}`,
            padding: '1rem',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.85rem',
            color: '#cbd5e1'
          }}>
            <h4 style={{ margin: '0 0 0.4rem 0', color: activePattern.color, fontSize: '0.9rem', fontWeight: 800 }}>
              Mental Model & Intuition
            </h4>
            <FormattedMarkdownText text={activePattern.mentalModel} />
          </div>

          {/* V8 Engine Mechanics */}
          <div style={{
            background: '#090d16',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#cbd5e1'
          }}>
            <FormattedMarkdownText text={activePattern.engineMechanics} />
          </div>

          {/* Interactive Pattern Animator Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color={activePattern.color} />
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.95rem', fontWeight: 800 }}>
                Interactive Visual Simulation: {activePattern.name} in Action
              </h4>
            </div>
            <DsaVisualAnimator
              key={activePattern.id}
              problemId={
                activePattern.id === 'arrays' ? 1 :
                activePattern.id === 'hashing' ? 5 :
                activePattern.id === 'two-pointers' ? 'two-pointers' :
                activePattern.id === 'sliding-window' ? 'sliding-window' :
                activePattern.id === 'stack' ? 23 :
                activePattern.id === 'binary-search' ? 'binary-search' :
                activePattern.id === 'linked-list' ? 39 : 1
              }
              initialPattern={activePattern.id}
            />
          </div>

          {/* Common Variations */}
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '0.9rem', fontWeight: 800 }}>
              Core Pattern Subtypes:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {activePattern.commonPatterns.map((cp, idx) => (
                <div key={idx} style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: '#1e293b',
                  fontSize: '0.82rem',
                  color: '#e2e8f0'
                }}>
                  <FormattedMarkdownText text={cp} />
                </div>
              ))}
            </div>
          </div>

          {/* Beginner Pitfalls */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h4 style={{ margin: '0 0 0.4rem 0', color: '#f87171', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} />
              Beginner Pitfalls & Production Bugs to Avoid
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {activePattern.pitfalls.map((pit, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                  • {pit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
