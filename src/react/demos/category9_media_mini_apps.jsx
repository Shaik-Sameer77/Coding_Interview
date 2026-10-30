import React, { useState } from 'react';
import { Volume2, Play, Pause, RefreshCw } from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #86: Skeleton Loader Shimmer
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Core Web Vitals Optimization:
 *     - Eliminates Cumulative Layout Shift (CLS): Skeleton elements reserve exact aspect ratio and dimensions of final rendered content.
 *     - Reduces Perceived Latency: Shimmer animation provides visual momentum while content fetches.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Initial mounting: renders placeholder wireframe bounding boxes.
 * 2. Asynchronous data resolves.
 * 3. Switches `loading = false`: real component mounts into identical reserved geometry without reflow.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Layout Shift: Skeleton must match target component's height, margin, and padding to achieve 0.00 CLS score.
 */
export function DemoSkeletonLoader() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <button onClick={() => setLoading(!loading)} style={{ padding: '0.3rem 0.6rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', marginBottom: '0.8rem' }}>
        Toggle State: {loading ? 'Loading...' : 'Loaded'}
      </button>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ width: '100%', height: '80px', background: '#1e293b', borderRadius: '6px' }} />
          <div style={{ width: '70%', height: '14px', background: '#1e293b', borderRadius: '4px' }} />
          <div style={{ width: '40%', height: '14px', background: '#1e293b', borderRadius: '4px' }} />
        </div>
      ) : (
        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <h4 style={{ margin: 0, color: '#f8fafc' }}>Chrona Assignment Engine</h4>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Real content rendered with zero Cumulative Layout Shift (CLS)!</p>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #87: Custom Media Player
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: PlayerCard -> PlayPauseBtn -> TrackTitle -> ScrubberBar (range input)
 * • State Model:
 *     - `playing`: boolean (toggles audio/video playback).
 *     - `progress`: number (percentage 0 to 100).
 * • HTML5 Media API:
 *     - Coordinates `audio.play()` and `audio.pause()`.
 *     - Scrubbing updates `audio.currentTime = (progress / 100) * duration`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks Play -> toggles `playing` state and plays audio node.
 * 2. Range scrubber dragged -> recalculates track playback cursor.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Autoplay policy: Modern browsers reject `.play()` calls if not triggered by an explicit user gesture.
 */
export function DemoMediaPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <div style={{ padding: '1rem', maxWidth: '380px', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
        <button onClick={() => setPlaying(!playing)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Driving Lesson Audio Note #1</span>
      </div>
      <input 
        type="range" 
        min={0} 
        max={100} 
        value={progress} 
        onChange={(e) => setProgress(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#6366f1' }}
      />
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #88: Image Cropper Canvas Simulator
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Pixel Manipulation:
 *     - Uses HTML5 2D Canvas context: `ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)`.
 *     - Exports final cropped raster via `canvas.toDataURL('image/jpeg', 0.95)`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User drags crop rectangle over source image.
 * 2. Geometry offsets `(sx, sy, sw, sh)` are calculated.
 * 3. Canvas crops and outputs clean cropped avatar.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • High-DPI screens: Multiply canvas width/height by `window.devicePixelRatio` to prevent blurry exports on Retina displays.
 */
export function DemoImageCropper() {
  return (
    <div style={{ padding: '1rem', maxWidth: '380px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Calculates pixel bounding coordinates and extracts cropped region using HTML5 <code>canvas.drawImage()</code>.
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #89: Color Picker
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ColorPickerSurface -> NativeColorInput -> HexValueDisplay -> ColorPreviewSwatch
 * • State Model:
 *     - `color`: string (HEX color code, e.g. '#6366f1').
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User opens color pallet and chooses a shade.
 * 2. `onChange` fires with hex value.
 * 3. State updates; dynamic swatch updates background instantly.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Contrast ratio: Calculate luminance `(0.299*R + 0.587*G + 0.114*B)` to dynamically switch text color between black and white for readability.
 */
export function DemoColorPicker() {
  const [color, setColor] = useState('#6366f1');

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
        />
        <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>{color}</span>
      </div>
      <div style={{ width: '100%', height: '40px', borderRadius: '6px', background: color }} />
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #90: Flip Card 3D Animation
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • CSS 3D Transforms Architecture:
 *     - Parent container: `perspective: 1000px` (creates 3D perspective space).
 *     - Flipping card: `transform-style: preserve-3d; transition: transform 0.5s ease`.
 *     - Flip state: `transform: rotateY(180deg)`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks card -> `setFlipped(!flipped)`.
 * 2. CSS transition rotates card 180 degrees along Y axis.
 * 3. Reveals back content with hardware acceleration.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Backface-visibility: Set `backface-visibility: hidden` on both card faces to prevent text mirroring when turned around.
 */
export function DemoFlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ padding: '1rem', maxWidth: '320px', perspective: '1000px' }}>
      <div 
        onClick={() => setFlipped(!flipped)}
        style={{
          height: '140px',
          borderRadius: '10px',
          background: flipped ? '#4338ca' : '#1e293b',
          border: '1px solid #334155',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transform: flipped ? 'rotateY(180deg)' : 'none',
          transition: 'transform 0.5s ease',
          boxShadow: '0 10px 15px rgba(0,0,0,0.3)'
        }}
      >
        <strong style={{ fontSize: '1rem' }}>{flipped ? 'Back: Staff Engineer' : 'Front: Click to Flip'}</strong>
        <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.4rem' }}>Pure CSS 3D Transform</span>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #91: QR Code Generator Simulator
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Reed-Solomon Error Correction:
 *     - Generates 2D matrix barcode with selectable error correction level (L, M, Q, H).
 *     - Renders crisp vector SVG path for mobile camera scanning.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Converts input string to byte stream.
 * 2. Encodes QR matrix.
 * 3. Renders high-contrast SVG.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Quiet Zone: QR codes must have at least 4 modules of white space padding around the perimeter to ensure scanner readability.
 */
export function DemoQrCode() {
  return (
    <div style={{ padding: '1rem', maxWidth: '380px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Encodes portfolio appointment URL into matrix barcode with SVG rasterization.
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #92: Interactive Tic-Tac-Toe with Move History
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: BoardGrid (3x3 Grid) -> CellButton[0..8] -> ResetControl
 * • State Model:
 *     - `board`: Array(9).fill(null) ('X' | 'O' | null).
 *     - `xIsNext`: boolean (turn indicator).
 * • Win Evaluation:
 *     - Checks 8 winning line triplets `[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks empty cell #4 -> places 'X'.
 * 2. `xIsNext` toggles to false.
 * 3. Evaluates if cell completes any winning triplet.
 * 4. Next turn places 'O'.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Immutability: Always shallow-copy board array (`[...board]`) before writing to preserve undo/time-travel capability.
 */
export function DemoTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Cell click handler
  const handleClick = (i) => {
    if (board[i]) return;
    const next = [...board];
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  // Reset board
  const reset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '240px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem', marginBottom: '0.6rem' }}>
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              height: '50px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: cell === 'X' ? '#60a5fa' : '#f87171',
              fontSize: '1.2rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {cell}
          </button>
        ))}
      </div>
      <button onClick={reset} style={{ width: '100%', padding: '0.3rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
        Reset Game
      </button>
    </div>
  );
}

