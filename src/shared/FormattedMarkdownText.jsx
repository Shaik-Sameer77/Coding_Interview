import React from 'react';
import SyntaxCodeBlock from './SyntaxCodeBlock';

/**
 * FormattedMarkdownText
 * Parses full markdown prose including:
 * - Fenced code blocks (```javascript ... ```) rendered via SyntaxCodeBlock
 * - LaTeX / Big-O complexity notation ($O(1)$, $O(N)$, $O(N^2)$, etc.)
 * - Markdown tables (| Col 1 | Col 2 |) with responsive styled container
 * - Headings (#, ##, ###, ####)
 * - GitHub Callout Alerts (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT])
 * - Bullet lists, nested lists, and numbered lists
 * - Inline formatting (**bold**, `code`, *italic*, math badges)
 */

function formatMathText(raw) {
  if (!raw) return '';
  return raw
    .replace(/\\log/g, 'log')
    .replace(/\\times/g, '×')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^k/g, 'ᵏ')
    .replace(/\^n/g, 'ⁿ')
    .trim();
}

function getLanguageInfo(langRaw) {
  const clean = (langRaw || '').toLowerCase().trim();
  if (clean === 'jsx' || clean === 'react') return { lang: 'jsx', label: 'React JSX' };
  if (clean === 'tsx') return { lang: 'jsx', label: 'React TSX' };
  if (clean === 'ts' || clean === 'typescript') return { lang: 'typescript', label: 'TypeScript' };
  if (clean === 'json') return { lang: 'json', label: 'JSON' };
  if (clean === 'bash' || clean === 'sh' || clean === 'shell' || clean === 'zsh') return { lang: 'bash', label: 'Terminal / Shell' };
  if (clean === 'html') return { lang: 'jsx', label: 'HTML' };
  if (clean === 'css') return { lang: 'javascript', label: 'CSS' };
  if (clean === 'sql') return { lang: 'javascript', label: 'SQL' };
  return { lang: 'javascript', label: 'JavaScript' };
}

export default function FormattedMarkdownText({ text, content, style, accentColor = '#38bdf8' }) {
  const markdownSource = text || content;
  if (!markdownSource) return null;

  const renderInline = (str) => {
    if (!str) return null;

    // Tokenize: **bold**, `code`, $$display_math$$, $inline_math$, *italic*, _italic_
    const tokens = str.split(/(\*\*[^*]+?\*\*|__[^_]+?__|`[^`]+?`|\$\$[^\$]+?\$\$|\$[^\$]+?\$|\*[^*]+?\*|_[^_]+?_)/g);

    return tokens.map((token, idx) => {
      // 1. Bold (**text** or __text__)
      if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
        const inner = token.slice(2, -2);
        return (
          <strong key={idx} style={{ color: '#f8fafc', fontWeight: 700 }}>
            {renderInline(inner)}
          </strong>
        );
      }

      // 2. Inline Code (`code`)
      if (token.startsWith('`') && token.endsWith('`')) {
        const inner = token.slice(1, -1);
        return (
          <code
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: accentColor,
              padding: '0.12rem 0.42rem',
              borderRadius: '4px',
              fontSize: '0.86em',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              margin: '0 0.15rem'
            }}
          >
            {inner}
          </code>
        );
      }

      // 3. Math & Big-O Notation ($O(N)$, $O(1)$, $O(N^2)$, etc.)
      if ((token.startsWith('$$') && token.endsWith('$$')) || (token.startsWith('$') && token.endsWith('$'))) {
        const isDouble = token.startsWith('$$');
        const inner = isDouble ? token.slice(2, -2) : token.slice(1, -1);
        const formatted = formatMathText(inner);

        return (
          <span
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              padding: '0.08rem 0.42rem',
              borderRadius: '4px',
              fontSize: '0.88em',
              fontWeight: 700,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              border: '1px solid rgba(56, 189, 248, 0.28)',
              margin: '0 0.18rem',
              verticalAlign: 'baseline',
              letterSpacing: '0.01em',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
          >
            {formatted}
          </span>
        );
      }

      // 4. Italics (*text* or _text_)
      if ((token.startsWith('*') && token.endsWith('*') && !token.startsWith('**')) ||
          (token.startsWith('_') && token.endsWith('_') && !token.startsWith('__'))) {
        const inner = token.slice(1, -1);
        return (
          <em key={idx} style={{ color: '#cbd5e1', fontStyle: 'italic' }}>
            {inner}
          </em>
        );
      }

      // 5. Plain text
      return token;
    });
  };

  // Group lines into blocks: code, table, or single line
  const lines = markdownSource.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for Fenced Code Block: ```lang
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }
      blocks.push({
        type: 'code',
        language: lang,
        code: codeLines.join('\n')
      });
      continue;
    }

    // Check for Markdown Table Block (| Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'table',
        lines: tableLines
      });
      continue;
    }

    // Regular lines (headings, blockquotes, lists, paragraphs, empty)
    blocks.push({
      type: 'line',
      raw: rawLine,
      trimmed: trimmed
    });
    i++;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', ...style }}>
      {blocks.map((block, blockIdx) => {
        // --- 1. CODE BLOCK ---
        if (block.type === 'code') {
          const { lang, label } = getLanguageInfo(block.language);
          return (
            <div key={blockIdx} style={{ margin: '0.35rem 0' }}>
              <SyntaxCodeBlock
                code={block.code}
                language={lang}
                label={label}
                maxHeight="480px"
              />
            </div>
          );
        }

        // --- 2. MARKDOWN TABLE ---
        if (block.type === 'table') {
          const validRows = block.lines.filter(l => !/^[\|\s\-:]+$/.test(l));
          if (validRows.length === 0) return null;

          const parseCells = (rowStr) => {
            return rowStr
              .split('|')
              .slice(1, -1)
              .map(c => c.trim());
          };

          const headerRow = parseCells(validRows[0]);
          const bodyRows = validRows.slice(1).map(parseCells);

          return (
            <div key={blockIdx} style={{
              overflowX: 'auto',
              margin: '0.65rem 0',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#0d131f',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.86rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#94a3b8',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {headerRow.map((h, hIdx) => (
                      <th key={hIdx} style={{
                        padding: '0.65rem 0.95rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        letterSpacing: '-0.01em'
                      }}>
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                    }}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{
                          padding: '0.65rem 0.95rem',
                          color: '#cbd5e1',
                          lineHeight: '1.55'
                        }}>
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // --- 3. REGULAR LINE ---
        const { raw, trimmed } = block;

        // Empty line
        if (!trimmed) {
          return <div key={blockIdx} style={{ height: '0.35rem' }} />;
        }

        // Headings: #, ##, ###, ####
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={blockIdx} style={{
              fontSize: '1.38rem',
              fontWeight: 800,
              color: '#f8fafc',
              margin: '0.9rem 0 0.25rem 0',
              letterSpacing: '-0.02em',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.4rem'
            }}>
              {renderInline(trimmed.slice(2))}
            </h2>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={blockIdx} style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#f8fafc',
              margin: '0.8rem 0 0.2rem 0',
              letterSpacing: '-0.01em'
            }}>
              {renderInline(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={blockIdx} style={{
              fontSize: '1.08rem',
              fontWeight: 700,
              color: '#f1f5f9',
              margin: '0.65rem 0 0.15rem 0'
            }}>
              {renderInline(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={blockIdx} style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: accentColor,
              margin: '0.5rem 0 0.1rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              {renderInline(trimmed.slice(5))}
            </h5>
          );
        }

        // GitHub-Style Callout Alerts (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT])
        const alertMatch = trimmed.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*(.*)$/i);
        if (alertMatch) {
          const alertType = alertMatch[1].toUpperCase();
          const alertContent = alertMatch[2];

          const alertColors = {
            NOTE: { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.06)', label: 'Note', color: '#7dd3fc' },
            TIP: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.06)', label: 'Tip', color: '#6ee7b7' },
            WARNING: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.06)', label: 'Warning', color: '#fcd34d' },
            IMPORTANT: { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.06)', label: 'Important', color: '#fda4af' },
            CAUTION: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.06)', label: 'Caution', color: '#fca5a5' }
          };
          const cfg = alertColors[alertType] || alertColors.NOTE;

          return (
            <div key={blockIdx} style={{
              borderLeft: `4px solid ${cfg.border}`,
              background: cfg.bg,
              padding: '0.6rem 0.95rem',
              borderRadius: '0 8px 8px 0',
              margin: '0.4rem 0',
              border: `1px solid ${cfg.border}25`,
              borderLeftWidth: '4px'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: cfg.color, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                {cfg.label}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6' }}>
                {renderInline(alertContent)}
              </div>
            </div>
          );
        }

        // Standard Blockquote (> note)
        if (trimmed.startsWith('> ')) {
          return (
            <div key={blockIdx} style={{
              borderLeft: `3px solid ${accentColor}`,
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.5rem 0.9rem',
              borderRadius: '0 6px 6px 0',
              margin: '0.35rem 0',
              color: '#cbd5e1',
              fontSize: '0.92rem',
              lineHeight: '1.65'
            }}>
              {renderInline(trimmed.slice(2))}
            </div>
          );
        }

        // Indented sub-bullets (starts with whitespace then - or *)
        const isIndentedBullet = /^(\s{2,}|\t+)[-*]\s+(.*)$/.test(raw);
        if (isIndentedBullet) {
          const match = raw.match(/^(\s{2,}|\t+)[-*]\s+(.*)$/);
          return (
            <div key={blockIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', paddingLeft: '1.65rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', lineHeight: '1.7' }}>○</span>
              <span style={{ color: '#cbd5e1', lineHeight: '1.65', flex: 1, fontSize: '0.92rem' }}>
                {renderInline(match[2])}
              </span>
            </div>
          );
        }

        // Top-level Bullet point: - or *
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={blockIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', paddingLeft: '0.5rem' }}>
              <span style={{ color: accentColor, fontWeight: 700, lineHeight: '1.6' }}>•</span>
              <span style={{ color: '#cbd5e1', lineHeight: '1.65', flex: 1 }}>
                {renderInline(trimmed.slice(2))}
              </span>
            </div>
          );
        }

        // Numbered list item: e.g. 1. or 2)
        const matchNumbered = trimmed.match(/^(\d+[\.\)])\s+(.*)$/);
        if (matchNumbered) {
          const num = matchNumbered[1];
          const rest = matchNumbered[2];
          return (
            <div key={blockIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', paddingLeft: '0.5rem', marginTop: '0.15rem' }}>
              <span style={{ color: accentColor, fontWeight: 700, minWidth: '1.5rem', lineHeight: '1.6' }}>
                {num}
              </span>
              <span style={{ color: '#cbd5e1', lineHeight: '1.65', flex: 1 }}>
                {renderInline(rest)}
              </span>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={blockIdx} style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.68' }}>
            {renderInline(raw)}
          </p>
        );
      })}
    </div>
  );
}
