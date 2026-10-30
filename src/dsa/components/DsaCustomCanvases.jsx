// src/dsa/components/DsaCustomCanvases.jsx
// Interactive Custom Canvas Renderers for Specialized DSA Problems:
// 1. SudokuCanvas: 9x9 interactive grid with 3x3 block borders and conflict detection
// 2. HistogramCanvas: Vertical bar chart with monotonic stack, width spans, and maxArea HUD
// 3. LinkedListCanvas: Animated node chain with pointer rewiring (prev, curr, next, null)
// 4. TreeCanvas: Hierarchical binary tree node layout with call stack and active traversal
// 5. GraphGridCanvas: 2D matrix with island land/water detection and DFS flood-fill

import React from 'react';
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, CornerDownRight, 
  Layers, Compass, Grid, GitCommit, Split
} from 'lucide-react';

// ============================================================================
// 1. SUDOKU 9x9 BOARD CANVAS
// ============================================================================
export function SudokuCanvas({ data }) {
  if (!data || !data.board) return null;

  const { board, activeRow, activeCol, activeBox, activeVal, status, seenInRow, seenInCol, seenInBox } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      {/* Top Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Grid size={15} color="#818cf8" />
          <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800 }}>
            9×9 Sudoku Board Validator
          </span>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            [Evaluating: Row {activeRow >= 0 ? activeRow : '-'}, Col {activeCol >= 0 ? activeCol : '-'}, Box {activeBox >= 0 ? activeBox : '-'}]
          </span>
        </div>

        <span style={{
          fontSize: '0.74rem',
          fontWeight: 800,
          color: status === 'duplicate' ? '#ef4444' : '#10b981',
          background: status === 'duplicate' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          padding: '0.2rem 0.6rem',
          borderRadius: '6px',
          border: status === 'duplicate' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          {status === 'duplicate' ? '⚠️ Conflict: Duplicate in Box/Row/Col' : '✓ Invariant Maintained (No Collisions)'}
        </span>
      </div>

      {/* Main 9x9 Board */}
      <div style={{
        background: '#090d16',
        border: '3px solid #4f46e5',
        borderRadius: '12px',
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 0 25px rgba(79, 70, 229, 0.25)',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, minmax(28px, 38px))',
          gridTemplateRows: 'repeat(9, minmax(28px, 38px))',
          gap: '2px',
          background: '#1e293b',
          border: '2px solid #334155',
          borderRadius: '6px',
          padding: '2px'
        }}>
          {board.map((row, r) =>
            row.map((cellVal, c) => {
              const bIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
              const isActive = r === activeRow && c === activeCol;
              const isInActiveRow = r === activeRow;
              const isInActiveCol = c === activeCol;
              const isInActiveBox = bIdx === activeBox && activeBox >= 0;

              // Border styling for 3x3 box boundaries
              const borderRight = (c % 3 === 2 && c !== 8) ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)';
              const borderBottom = (r % 3 === 2 && r !== 8) ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)';

              let bg = '#111827';
              let color = '#cbd5e1';
              let transform = 'scale(1)';

              if (isActive) {
                bg = status === 'duplicate' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)';
                color = '#ffffff';
                transform = 'scale(1.15)';
              } else if (isInActiveBox) {
                bg = 'rgba(99, 102, 241, 0.16)';
              } else if (isInActiveRow || isInActiveCol) {
                bg = 'rgba(56, 189, 248, 0.08)';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    color: cellVal !== '.' ? (isActive ? '#38bdf8' : color) : '#475569',
                    fontSize: cellVal !== '.' ? '1rem' : '0.8rem',
                    fontWeight: cellVal !== '.' ? 800 : 400,
                    borderRight,
                    borderBottom,
                    transform,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive ? '0 0 12px #38bdf8' : 'none',
                    zIndex: isActive ? 10 : 1
                  }}
                >
                  {cellVal !== '.' ? cellVal : '·'}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Verification Sets HUD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.6rem'
      }}>
        <div style={{ background: '#111827', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.3rem' }}>
            Row {activeRow >= 0 ? activeRow : '-'} Set ({seenInRow?.length || 0}/9)
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {seenInRow && seenInRow.length > 0 ? (
              seenInRow.map((d, i) => (
                <span key={i} style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  {d}
                </span>
              ))
            ) : <span style={{ fontSize: '0.72rem', color: '#475569' }}>Empty</span>}
          </div>
        </div>

        <div style={{ background: '#111827', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.3rem' }}>
            Col {activeCol >= 0 ? activeCol : '-'} Set ({seenInCol?.length || 0}/9)
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {seenInCol && seenInCol.length > 0 ? (
              seenInCol.map((d, i) => (
                <span key={i} style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  {d}
                </span>
              ))
            ) : <span style={{ fontSize: '0.72rem', color: '#475569' }}>Empty</span>}
          </div>
        </div>

        <div style={{ background: '#111827', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.3rem' }}>
            3×3 Box {activeBox >= 0 ? activeBox : '-'} Set ({seenInBox?.length || 0}/9)
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {seenInBox && seenInBox.length > 0 ? (
              seenInBox.map((d, i) => (
                <span key={i} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.75rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  {d}
                </span>
              ))
            ) : <span style={{ fontSize: '0.72rem', color: '#475569' }}>Empty</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. LARGEST RECTANGLE IN HISTOGRAM CANVAS
// ============================================================================
export function HistogramCanvas({ data }) {
  if (!data || !data.heights) return null;

  const { heights, activeIndex, stack, poppedIndex, currentHeight, leftBound, rightBound, currentWidth, currentArea, maxArea } = data;
  const maxBar = Math.max(...heights, 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      {/* Top Metric Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={15} color="#ec4899" />
          <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800 }}>
            Monotonic Stack Histogram
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Stack: [{stack.join(', ')}]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '6px',
            padding: '0.2rem 0.6rem',
            fontSize: '0.75rem',
            color: '#fbbf24',
            fontWeight: 800
          }}>
            Candidate Area: {currentArea > 0 ? `${currentHeight} × ${currentWidth} = ${currentArea}` : '-'}
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '6px',
            padding: '0.2rem 0.6rem',
            fontSize: '0.75rem',
            color: '#34d399',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Trophy size={13} color="#10b981" />
            Max Area: {maxArea}
          </div>
        </div>
      </div>

      {/* Histogram Bar Chart */}
      <div style={{
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.75rem 1.5rem 1rem 1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '0.75rem',
        minHeight: '220px',
        overflowX: 'auto',
        position: 'relative'
      }}>
        {heights.map((h, idx) => {
          const isCurrentScan = idx === activeIndex;
          const isInStack = stack.includes(idx);
          const isPopped = idx === poppedIndex;
          const isWithinSpan = poppedIndex !== null && idx >= leftBound && idx < rightBound;

          const barHeightPx = Math.max(18, Math.round((h / maxBar) * 140));

          let bg = '#1e293b';
          let border = '1px solid rgba(255, 255, 255, 0.1)';
          let shadow = 'none';

          if (isPopped) {
            bg = 'linear-gradient(180deg, #f59e0b, #d97706)';
            border = '2px solid #fbbf24';
            shadow = '0 0 18px rgba(245, 158, 11, 0.6)';
          } else if (isWithinSpan) {
            bg = 'rgba(236, 72, 153, 0.35)';
            border = '1px dashed #ec4899';
          } else if (isCurrentScan) {
            bg = '#38bdf8';
            border = '2px solid #7dd3fc';
            shadow = '0 0 16px rgba(56, 189, 248, 0.5)';
          } else if (isInStack) {
            bg = '#6366f1';
            border = '1px solid #818cf8';
          }

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
                minWidth: '46px'
              }}
            >
              {/* Height Label */}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: isPopped ? '#fbbf24' : isCurrentScan ? '#38bdf8' : '#cbd5e1'
              }}>
                {h}
              </span>

              {/* Bar Rect */}
              <div
                style={{
                  width: '46px',
                  height: `${barHeightPx}px`,
                  background: bg,
                  border,
                  borderRadius: '6px 6px 0 0',
                  boxShadow: shadow,
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isInStack && (
                  <span style={{ fontSize: '0.65rem', color: '#ffffff', fontWeight: 900 }}>
                    STK
                  </span>
                )}
              </div>

              {/* Index Label */}
              <span style={{
                fontSize: '0.7rem',
                color: '#64748b',
                fontFamily: 'monospace'
              }}>
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 3. LINKED LIST NODE CHAIN CANVAS
// ============================================================================
export function LinkedListCanvas({ data }) {
  if (!data || !data.nodes) return null;

  const { nodes, prevIdx, currIdx, nextIdx } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitCommit size={15} color="#38bdf8" />
          <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800 }}>
            Linked List Pointer Chain Visualizer
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.72rem' }}>
          <span style={{ background: '#a855f720', color: '#c084fc', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
            prev: {prevIdx !== null ? `Node(${nodes[prevIdx]?.val})` : 'null'}
          </span>
          <span style={{ background: '#38bdf820', color: '#38bdf8', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
            curr: {currIdx !== null ? `Node(${nodes[currIdx]?.val})` : 'null'}
          </span>
          <span style={{ background: '#f59e0b20', color: '#fbbf24', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
            next: {nextIdx !== null ? `Node(${nodes[nextIdx]?.val})` : 'null'}
          </span>
        </div>
      </div>

      {/* Nodes and Links */}
      <div style={{
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        minHeight: '140px'
      }}>
        {nodes.map((node, idx) => {
          const isCurr = idx === currIdx;
          const isPrev = idx === prevIdx;
          const isNext = idx === nextIdx;

          return (
            <React.Fragment key={node.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* Pointer Tags on Top */}
                <div style={{ position: 'absolute', top: '-28px', display: 'flex', gap: '0.2rem' }}>
                  {isPrev && (
                    <span style={{ background: '#a855f7', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900, padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                      prev
                    </span>
                  )}
                  {isCurr && (
                    <span style={{ background: '#38bdf8', color: '#090d16', fontSize: '0.65rem', fontWeight: 900, padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                      curr
                    </span>
                  )}
                  {isNext && (
                    <span style={{ background: '#f59e0b', color: '#090d16', fontSize: '0.65rem', fontWeight: 900, padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                      next
                    </span>
                  )}
                </div>

                {/* Node Pill */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: isCurr ? 'rgba(56, 189, 248, 0.25)' : node.isReversed ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                  border: isCurr ? '2px solid #38bdf8' : node.isReversed ? '2px solid #10b981' : '2px solid #334155',
                  color: isCurr ? '#38bdf8' : node.isReversed ? '#34d399' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  boxShadow: isCurr ? '0 0 16px rgba(56, 189, 248, 0.5)' : 'none',
                  transition: 'all 0.2s ease'
                }}>
                  {node.val}
                </div>
              </div>

              {/* Connecting Arrow */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: node.isReversed ? '#10b981' : '#64748b',
                fontWeight: 900,
                fontSize: '1.2rem',
                padding: '0 0.3rem'
              }}>
                {node.isReversed ? '⮌' : '➔'}
              </div>
            </React.Fragment>
          );
        })}

        {/* Final NULL terminator */}
        <div style={{
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          background: '#111827',
          border: '1px dashed #475569',
          color: '#64748b',
          fontSize: '0.8rem',
          fontWeight: 800,
          fontFamily: 'monospace'
        }}>
          NULL
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. BINARY TREE CANVAS
// ============================================================================
export function TreeCanvas({ data }) {
  if (!data || !data.nodes) return null;

  const { nodes, activeNodeId, callStack } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      {/* Top Header & Call Stack */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Split size={15} color="#10b981" />
          <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800 }}>
            Hierarchical Binary Tree Canvas
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Recursion Stack:</span>
          {callStack && callStack.length > 0 ? (
            callStack.map((call, i) => (
              <span key={i} style={{ background: '#6366f120', color: '#a5b4fc', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                {call}
              </span>
            ))
          ) : <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Unwound (Returned)</span>}
        </div>
      </div>

      {/* Tree Visualization Box */}
      <div style={{
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        minHeight: '220px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        {/* Level 0: Root */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {nodes.filter(n => n.level === 0).map(node => (
            <TreeNode key={node.id} node={node} isActive={node.id === activeNodeId} />
          ))}
        </div>

        {/* Level 1: Left & Right Subtrees */}
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '70%' }}>
          {nodes.filter(n => n.level === 1).map(node => (
            <TreeNode key={node.id} node={node} isActive={node.id === activeNodeId} />
          ))}
        </div>

        {/* Level 2: Leaves */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
          {nodes.filter(n => n.level === 2).map(node => (
            <TreeNode key={node.id} node={node} isActive={node.id === activeNodeId} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TreeNode({ node, isActive }) {
  const isVisited = node.state === 'visited';

  return (
    <div style={{
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      background: isActive ? 'rgba(56, 189, 248, 0.3)' : isVisited ? 'rgba(16, 185, 129, 0.25)' : '#1e293b',
      border: isActive ? '2px solid #38bdf8' : isVisited ? '2px solid #10b981' : '2px solid #475569',
      color: isActive ? '#38bdf8' : isVisited ? '#34d399' : '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '0.95rem',
      boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.6)' : 'none',
      transition: 'all 0.2s ease'
    }}>
      {node.val}
    </div>
  );
}

// ============================================================================
// 5. 2D GRAPH GRID CANVAS (NUMBER OF ISLANDS)
// ============================================================================
export function GraphGridCanvas({ data }) {
  if (!data || !data.grid) return null;

  const { grid, activeR, activeC, islandCount, status } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={15} color="#06b6d4" />
          <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800 }}>
            2D Graph Grid • DFS Flood-Fill
          </span>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            [Scanning: ({activeR >= 0 ? activeR : '-'}, {activeC >= 0 ? activeC : '-'})]
          </span>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '6px',
          padding: '0.2rem 0.6rem',
          fontSize: '0.75rem',
          color: '#34d399',
          fontWeight: 800
        }}>
          🏝️ Islands Count: {islandCount}
        </div>
      </div>

      {/* 2D Grid Cells */}
      <div style={{
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        overflowX: 'auto'
      }}>
        {grid.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: '0.4rem' }}>
            {row.map((val, c) => {
              const isActive = r === activeR && c === activeC;
              const isLand = val === '1';
              const isSunk = val === 'S';

              let bg = '#0f172a'; // water
              let color = '#475569';
              let border = '1px solid rgba(255, 255, 255, 0.05)';

              if (isActive) {
                bg = '#38bdf8';
                color = '#090d16';
                border = '2px solid #ffffff';
              } else if (isLand) {
                bg = 'rgba(245, 158, 11, 0.25)';
                color = '#fbbf24';
                border = '1px solid #f59e0b';
              } else if (isSunk) {
                bg = 'rgba(6, 182, 212, 0.25)';
                color = '#22d3ee';
                border = '1px solid #06b6d4';
              }

              return (
                <div
                  key={c}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    background: bg,
                    border,
                    color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 14px #38bdf8' : 'none'
                  }}
                >
                  <span>{isLand ? '1' : isSunk ? 'S' : '0'}</span>
                  <span style={{ fontSize: '0.55rem', opacity: 0.6, fontFamily: 'monospace' }}>
                    {r},{c}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
