import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import { Copy, Check, FileCode, Terminal, Code2 } from 'lucide-react';

export default function SyntaxCodeBlock({ 
  code, 
  language = 'javascript', 
  label = 'JavaScript',
  showLineNumbers = true,
  maxHeight = '520px'
}) {
  const [copied, setCopied] = useState(false);

  const cleanCode = useMemo(() => {
    return (code || '').trim();
  }, [code]);

  const highlightedHtml = useMemo(() => {
    if (!cleanCode) return '';
    try {
      const l = (language || '').toLowerCase().trim();
      const lang = (l === 'jsx' || l === 'react' || l === 'tsx' || l === 'html')
        ? 'jsx'
        : (l === 'ts' || l === 'typescript')
        ? 'typescript'
        : (l === 'json')
        ? 'json'
        : (l === 'bash' || l === 'sh' || l === 'shell' || l === 'zsh')
        ? 'bash'
        : 'javascript';

      const grammar = Prism.languages[lang] || Prism.languages.javascript;
      return Prism.highlight(cleanCode, grammar, lang);
    } catch {
      return cleanCode;
    }
  }, [cleanCode, language]);

  const lines = useMemo(() => {
    return highlightedHtml.split('\n');
  }, [highlightedHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      margin: '0.4rem 0'
    }}>
      {/* Code Window Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.9rem',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* macOS window controls */}
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Code2 size={13} color="#79c0ff" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e6edf3', fontFamily: 'monospace' }}>
              {label}
            </span>
          </div>

          <span style={{
            fontSize: '0.68rem',
            color: '#8b949e',
            background: 'rgba(110, 118, 129, 0.15)',
            padding: '0.1rem 0.45rem',
            borderRadius: '999px',
            border: '1px solid rgba(110, 118, 129, 0.2)'
          }}>
            {lines.length} {lines.length === 1 ? 'line' : 'lines'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.65rem',
            background: copied ? '#238636' : 'rgba(255, 255, 255, 0.05)',
            color: copied ? '#fff' : '#c9d1d9',
            border: '1px solid',
            borderColor: copied ? '#2ea043' : '#30363d',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 600,
            transition: 'all 0.15s ease'
          }}
        >
          {copied ? <Check size={12} color="#fff" /> : <Copy size={12} color="#8b949e" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code Editor Body */}
      <div style={{
        maxHeight: maxHeight,
        overflowY: 'auto',
        overflowX: 'auto',
        background: '#0d1117',
        fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: '0.82rem',
        lineHeight: 1.6,
        padding: '0.6rem 0'
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'auto' }}>
          <tbody>
            {lines.map((lineHtml, idx) => (
              <tr 
                key={idx} 
                style={{ verticalAlign: 'top', transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(110, 118, 129, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {showLineNumbers && (
                  <td style={{
                    userSelect: 'none',
                    textAlign: 'right',
                    padding: '0 0.85rem 0 0.75rem',
                    color: '#484f58',
                    fontSize: '0.74rem',
                    width: '38px',
                    minWidth: '38px',
                    borderRight: '1px solid #21262d'
                  }}>
                    {idx + 1}
                  </td>
                )}
                <td style={{
                  padding: showLineNumbers ? '0 1rem' : '0 1rem',
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
