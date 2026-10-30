import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#090d16',
    primaryColor: '#6366f1',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#818cf8',
    lineColor: '#94a3b8',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    actorBkg: '#1e293b',
    actorBorder: '#6366f1',
    actorTextColor: '#f8fafc',
    actorLineColor: '#475569',
    signalColor: '#38bdf8',
    signalTextColor: '#f8fafc',
    labelBoxBkgColor: '#1e293b',
    labelBoxBorderColor: '#475569',
    labelTextColor: '#f8fafc',
    loopTextColor: '#cbd5e1',
    noteBorderColor: '#f59e0b',
    noteBkgColor: '#1e293b',
    noteTextColor: '#fbbf24',
    activationBorderColor: '#6366f1',
    activationBkgColor: 'rgba(99,102,241,0.2)'
  },
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif'
});

export default function MermaidRenderer({ chart, id = 'mermaid-chart' }) {
  const containerRef = useRef(null);
  const [svgHtml, setSvgHtml] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    const renderChart = async () => {
      if (!chart) return;
      setLoading(true);
      setError(null);
      const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

      try {
        const { svg } = await mermaid.render(uniqueId, chart);
        if (!isCancelled) {
          setSvgHtml(svg);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Mermaid render error:", err);
          setError(err?.message || "Failed to render visual diagram");
          setLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div style={{
        padding: '1rem',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        color: '#fca5a5',
        fontSize: '0.8rem'
      }}>
        <div><strong>Diagram Parsing Error:</strong> {error}</div>
        <div style={{ marginTop: '0.4rem', color: '#94a3b8' }}>Check code syntax in the panel below.</div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      background: '#090d16',
      border: '1px solid #1e293b',
      borderRadius: '10px',
      padding: '1.2rem',
      display: 'flex',
      justifyContent: 'center',
      minHeight: '220px',
      position: 'relative'
    }}>
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#818cf8',
          fontSize: '0.8rem',
          padding: '2rem'
        }}>
          Rendering Visual Sequence Diagram...
        </div>
      )}
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: svgHtml }}
        style={{
          width: '100%',
          display: loading ? 'none' : 'flex',
          justifyContent: 'center'
        }}
      />
    </div>
  );
}
