import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-tomorrow.css';
import { Copy, Check, Code2, FileCode, Terminal } from 'lucide-react';

export default function CodeViewer({ code, fileName, category }) {
  const [copied, setCopied] = useState(false);

  const highlightedHtml = useMemo(() => {
    if (!code) return '';
    try {
      const grammar = Prism.languages.jsx || Prism.languages.javascript;
      return Prism.highlight(code, grammar, 'jsx');
    } catch {
      return code;
    }
  }, [code]);

  const lines = useMemo(() => {
    return highlightedHtml.split('\n');
  }, [highlightedHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Code Editor Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1rem',
        background: '#161b22',
        borderBottom: '1px solid #30363d'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* macOS window controls */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.4rem' }}>
            <FileCode size={14} color="#58a6ff" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e6edf3', fontFamily: 'monospace' }}>
              {fileName || 'Component.jsx'}
            </span>
          </div>

          <span style={{
            fontSize: '0.7rem',
            color: '#8b949e',
            background: 'rgba(110, 118, 129, 0.15)',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            border: '1px solid rgba(110, 118, 129, 0.2)'
          }}>
            {lines.length} lines
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#7ee787',
            background: 'rgba(46, 160, 67, 0.15)',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px'
          }}>
            React JSX
          </span>

          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              background: copied ? '#238636' : '#21262d',
              color: '#f0f6fc',
              border: '1px solid #363b42',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? <Check size={13} color="#fff" /> : <Copy size={13} color="#8b949e" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div style={{
        maxHeight: '620px',
        overflowY: 'auto',
        overflowX: 'auto',
        background: '#0d1117',
        fontFamily: 'JetBrains Mono, Fira Code, Consolas, Menlo, monospace',
        fontSize: '0.8rem',
        lineHeight: 1.6
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'auto' }}>
          <tbody>
            {lines.map((lineHtml, idx) => (
              <tr key={idx} style={{ 
                verticalAlign: 'top',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(110, 118, 129, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Line number gutter */}
                <td style={{
                  userSelect: 'none',
                  textAlign: 'right',
                  padding: '0 1rem 0 0.8rem',
                  color: '#484f58',
                  fontSize: '0.75rem',
                  width: '48px',
                  minWidth: '48px',
                  borderRight: '1px solid #21262d'
                }}>
                  {idx + 1}
                </td>
                {/* Code content */}
                <td style={{
                  padding: '0 1.2rem',
                  whiteSpace: 'pre',
                  color: '#e6edf3'
                }}>
                  <span dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
