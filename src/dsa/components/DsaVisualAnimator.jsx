import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward, 
  Settings2, Sparkles, Code2, Layers, Cpu, CheckCircle2, 
  HelpCircle, ArrowRight, Table, Search, Sliders
} from 'lucide-react';
import { 
  getAnimationForProblem, 
  generateContainsDuplicateSteps, 
  generateTwoSumSteps, 
  generateProductExceptSelfSteps,
  generateValidAnagramSteps,
  generateTopKFrequentSteps,
  generateLongestConsecutiveSteps,
  generateTwoPointersSteps,
  generateSlidingWindowSteps,
  generateValidParenthesesSteps,
  generateBinarySearchSteps,
  generateReverseListSteps,
  generateValidSudokuSteps,
  generateHistogramSteps,
  generateLinkedListVisualSteps,
  generateTreeSteps,
  generateNumberIslandsSteps,
  generateDp1DSteps,
  generateKadaneSteps,
  generateMergeIntervalsSteps,
  generateSingleNumberSteps
} from '../utils/dsaAnimationGenerators';
import { 
  SudokuCanvas, 
  HistogramCanvas, 
  LinkedListCanvas, 
  TreeCanvas, 
  GraphGridCanvas 
} from './DsaCustomCanvases';


export default function DsaVisualAnimator({ 
  problemId = 1, 
  initialPattern = 'arrays-hashing',
  compact = false 
}) {
  // Current animation dataset
  const [animationData, setAnimationData] = useState(() => {
    return getAnimationForProblem(problemId, { pattern: initialPattern });
  });

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5, 2
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom inputs state
  const [customArrayStr, setCustomArrayStr] = useState('1, 2, 3, 1');
  const [customTarget, setCustomTarget] = useState(9);
  const [customApproach, setCustomApproach] = useState('optimal');
  const [selectedAlgoPreset, setSelectedAlgoPreset] = useState(String(problemId));

  const timerRef = useRef(null);

  // Sync when problemId changes
  useEffect(() => {
    setSelectedAlgoPreset(String(problemId));
    loadPreset(String(problemId));
  }, [problemId]);

  const loadPreset = (presetKey) => {
    setIsPlaying(false);
    setCurrentStepIdx(0);

    let data;
    switch (presetKey) {
      case '1-optimal':
      case '1':
        setCustomArrayStr('1, 2, 3, 1');
        data = generateContainsDuplicateSteps([1, 2, 3, 1], 'optimal');
        break;
      case '1-brute':
        setCustomArrayStr('1, 2, 3, 1');
        data = generateContainsDuplicateSteps([1, 2, 3, 1], 'bruteforce');
        break;
      case '2':
        setCustomArrayStr('1, 2, 3, 4');
        data = generateProductExceptSelfSteps([1, 2, 3, 4]);
        break;
      case '3':
        data = generateValidSudokuSteps();
        break;
      case '4':
        setCustomArrayStr('a, n, a, g, r, a, m');
        data = generateValidAnagramSteps('anagram', 'nagaram');
        break;
      case '5':
        setCustomArrayStr('2, 7, 11, 15');
        setCustomTarget(9);
        data = generateTwoSumSteps([2, 7, 11, 15], 9);
        break;
      case '7':
        setCustomArrayStr('1, 1, 1, 2, 2, 3');
        setCustomTarget(2);
        data = generateTopKFrequentSteps([1, 1, 1, 2, 2, 3], 2);
        break;
      case '8':
        setCustomArrayStr('100, 4, 200, 1, 3, 2');
        data = generateLongestConsecutiveSteps([100, 4, 200, 1, 3, 2]);
        break;
      case 'two-pointers':
      case '10':
      case '11':
      case '14':
        setCustomArrayStr('r, a, c, e, c, a, r');
        data = generateTwoPointersSteps('racecar');
        break;
      case 'sliding-window':
      case '16':
      case '17':
        setCustomArrayStr('2, 1, 5, 1, 3, 2');
        data = generateSlidingWindowSteps([2, 1, 5, 1, 3, 2], 3);
        break;
      case '23':
      case 'valid-parentheses':
        setCustomArrayStr('(, ), [, ], {, }');
        data = generateValidParenthesesSteps('()[]{}');
        break;
      case '30':
      case 'histogram':
        setCustomArrayStr('2, 1, 5, 6, 2, 3');
        data = generateHistogramSteps([2, 1, 5, 6, 2, 3]);
        break;
      case 'binary-search':
      case '31':
      case '35':
      case '36':
        setCustomArrayStr('1, 3, 5, 7, 9, 11, 13, 15');
        setCustomTarget(9);
        data = generateBinarySearchSteps([1, 3, 5, 7, 9, 11, 13, 15], 9);
        break;
      case '39':
      case 'linked-list':
        setCustomArrayStr('1, 2, 3, 4, 5');
        data = generateLinkedListVisualSteps([1, 2, 3, 4, 5]);
        break;
      case '51':
      case 'tree':
        data = generateTreeSteps();
        break;
      case '85':
      case 'islands':
        data = generateNumberIslandsSteps();
        break;
      case '101':
      case 'dp':
        data = generateDp1DSteps(7, [1, 3, 4]);
        break;
      case '124':
      case 'kadane':
        setCustomArrayStr('-2, 1, -3, 4, -1, 2, 1, -5, 4');
        data = generateKadaneSteps([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
        break;
      case '132':
      case 'intervals':
        data = generateMergeIntervalsSteps();
        break;
      case '144':
      case 'bitwise':
        setCustomArrayStr('4, 1, 2, 1, 2');
        data = generateSingleNumberSteps([4, 1, 2, 1, 2]);
        break;
      default:
        data = getAnimationForProblem(presetKey, { pattern: initialPattern });
        break;
    }
    setAnimationData(data);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    setIsPlaying(false);
    setCurrentStepIdx(0);

    // Parse array
    const parsed = customArrayStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => isNaN(Number(s)) ? s : Number(s));

    let data;
    if (selectedAlgoPreset === '1-optimal' || selectedAlgoPreset === '1') {
      data = generateContainsDuplicateSteps(parsed, 'optimal');
    } else if (selectedAlgoPreset === '1-brute') {
      data = generateContainsDuplicateSteps(parsed, 'bruteforce');
    } else if (selectedAlgoPreset === '2') {
      data = generateProductExceptSelfSteps(parsed);
    } else if (selectedAlgoPreset === '3') {
      data = generateValidSudokuSteps();
    } else if (selectedAlgoPreset === '4') {
      const s = parsed.join('');
      data = generateValidAnagramSteps(s, 'nagaram');
    } else if (selectedAlgoPreset === '5') {
      data = generateTwoSumSteps(parsed, Number(customTarget) || 9);
    } else if (selectedAlgoPreset === '7') {
      data = generateTopKFrequentSteps(parsed, Number(customTarget) || 2);
    } else if (selectedAlgoPreset === '8') {
      data = generateLongestConsecutiveSteps(parsed);
    } else if (selectedAlgoPreset === 'two-pointers' || selectedAlgoPreset === '10' || selectedAlgoPreset === '11') {
      data = generateTwoPointersSteps(parsed.length > 0 ? parsed : 'racecar');
    } else if (selectedAlgoPreset === 'sliding-window' || selectedAlgoPreset === '16' || selectedAlgoPreset === '17') {
      data = generateSlidingWindowSteps(parsed, 3);
    } else if (selectedAlgoPreset === '23') {
      const s = parsed.join('');
      data = generateValidParenthesesSteps(s || '()[]{}');
    } else if (selectedAlgoPreset === '30' || selectedAlgoPreset === 'histogram') {
      data = generateHistogramSteps(parsed.length > 0 ? parsed : [2, 1, 5, 6, 2, 3]);
    } else if (selectedAlgoPreset === 'binary-search' || selectedAlgoPreset === '31' || selectedAlgoPreset === '35') {
      data = generateBinarySearchSteps(parsed, Number(customTarget) || 9);
    } else if (selectedAlgoPreset === '39' || selectedAlgoPreset === 'linked-list') {
      data = generateLinkedListVisualSteps(parsed.length > 0 ? parsed : [1, 2, 3, 4, 5]);
    } else if (selectedAlgoPreset === '51' || selectedAlgoPreset === 'tree') {
      data = generateTreeSteps();
    } else if (selectedAlgoPreset === '85' || selectedAlgoPreset === 'islands') {
      data = generateNumberIslandsSteps();
    } else if (selectedAlgoPreset === '101' || selectedAlgoPreset === 'dp') {
      data = generateDp1DSteps(Number(customTarget) || 7, parsed.length > 0 ? parsed : [1, 3, 4]);
    } else if (selectedAlgoPreset === '124' || selectedAlgoPreset === 'kadane') {
      data = generateKadaneSteps(parsed.length > 0 ? parsed : [-2, 1, -3, 4, -1, 2, 1, -5, 4]);
    } else if (selectedAlgoPreset === '132' || selectedAlgoPreset === 'intervals') {
      data = generateMergeIntervalsSteps();
    } else if (selectedAlgoPreset === '144' || selectedAlgoPreset === 'bitwise') {
      data = generateSingleNumberSteps(parsed.length > 0 ? parsed : [4, 1, 2, 1, 2]);
    } else {
      data = getAnimationForProblem(selectedAlgoPreset, { pattern: initialPattern, array: parsed });
    }

    setAnimationData(data);
    setShowCustomModal(false);
  };

  // Step navigation
  const totalSteps = animationData.steps.length;
  const currentStep = animationData.steps[currentStepIdx] || animationData.steps[0];

  const handleNext = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const togglePlay = () => {
    if (currentStepIdx >= totalSteps - 1) {
      setCurrentStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  // Automatic playback timer
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1400 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalSteps, playbackSpeed]);

  // Code split into lines for synchronized highlighting
  const codeLines = (animationData.codeSnippet || '').split('\n');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      background: '#0d131f',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: compact ? '1rem' : '1.25rem',
      color: '#f8fafc',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* 1. Header & Preset Selector Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              {animationData.title}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Interactive Visual Execution Canvas • Inspired by dsaanimator.com
            </span>
          </div>
        </div>

        {/* Algorithm Preset Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            value={selectedAlgoPreset}
            onChange={(e) => {
              setSelectedAlgoPreset(e.target.value);
              loadPreset(e.target.value);
            }}
            style={{
              background: '#1e293b',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <optgroup label="Arrays & Hashing">
              <option value="1-optimal">LC #217: Contains Duplicate (Hash Set O(N))</option>
              <option value="1-brute">LC #217: Contains Duplicate (Brute Force O(N²))</option>
              <option value="5">LC #1: Two Sum (Hash Map O(N))</option>
              <option value="2">LC #238: Product Except Self (Prefix/Suffix O(N))</option>
              <option value="3">LC #36: Valid Sudoku (9×9 Board & 3×3 Box Hashing)</option>
              <option value="4">LC #242: Valid Anagram (Frequency Balancing O(N))</option>
              <option value="7">LC #347: Top K Frequent Elements (Bucket Sort O(N))</option>
              <option value="8">LC #128: Longest Consecutive Sequence (Hash Set O(N))</option>
            </optgroup>
            <optgroup label="Two Pointers & Sliding Window">
              <option value="two-pointers">LC #125: Valid Palindrome (Converging Pointers)</option>
              <option value="sliding-window">Pattern: Sliding Window (Max Sum Subarray K=3)</option>
            </optgroup>
            <optgroup label="Stack & Monotonic Stack">
              <option value="23">LC #20: Valid Parentheses (LIFO Stack O(N))</option>
              <option value="30">LC #84: Largest Rectangle in Histogram (Monotonic Stack O(N))</option>
            </optgroup>
            <optgroup label="Binary Search">
              <option value="binary-search">LC #704: Binary Search (Halving Space O(log N))</option>
            </optgroup>
            <optgroup label="Linked List & Trees">
              <option value="39">LC #206: Reverse Linked List (In-Place Pointer Rewiring)</option>
              <option value="51">LC #226: Invert Binary Tree (Mirror Reflection & Call Stack)</option>
            </optgroup>
            <optgroup label="Graphs & 2D Matrix">
              <option value="85">LC #200: Number of Islands (2D Grid DFS Flood-Fill)</option>
            </optgroup>
            <optgroup label="Dynamic Programming & Greedy">
              <option value="101">LC #322: Coin Change (1D Bottom-Up DP Table)</option>
              <option value="124">LC #53: Maximum Subarray (Kadane's Greedy Scan)</option>
              <option value="132">LC #56: Merge Intervals (Sorting & Sweep Line)</option>
              <option value="144">LC #136: Single Number (Bitwise XOR Cancellation)</option>
            </optgroup>
          </select>

          <button
            onClick={() => setShowCustomModal(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: showCustomModal ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
              color: showCustomModal ? '#a5b4fc' : '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Sliders size={14} />
            Custom Input
          </button>
        </div>
      </div>

      {/* Custom Input Drawer / Bar */}
      {showCustomModal && (
        <form onSubmit={handleApplyCustom} style={{
          background: '#161f30',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minWidth: '180px' }}>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
              Array Elements (comma separated):
            </label>
            <input
              type="text"
              value={customArrayStr}
              onChange={(e) => setCustomArrayStr(e.target.value)}
              placeholder="e.g. 1, 2, 3, 1"
              style={{
                background: '#0a0f1d',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.35rem 0.6rem',
                color: '#f8fafc',
                fontSize: '0.8rem',
                fontFamily: 'monospace'
              }}
            />
          </div>

          {(selectedAlgoPreset === '5' || selectedAlgoPreset === 'binary-search') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '90px' }}>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                Target:
              </label>
              <input
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                style={{
                  background: '#0a0f1d',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.35rem 0.6rem',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '1.1rem',
              background: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem 1rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Play size={13} fill="#ffffff" />
            Simulate Custom Case
          </button>
        </form>
      )}

      {/* 2. Interactive Control Bar */}
      <div style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Playback Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={handleReset}
            title="Reset to beginning"
            style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              color: '#94a3b8',
              padding: '0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            title="Step Backward"
            style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              color: currentStepIdx === 0 ? '#475569' : '#cbd5e1',
              padding: '0.45rem',
              cursor: currentStepIdx === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SkipBack size={15} />
          </button>

          <button
            onClick={togglePlay}
            style={{
              background: isPlaying ? '#ef4444' : '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '0.45rem 1.15rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: isPlaying ? '0 0 14px rgba(239, 68, 68, 0.4)' : '0 0 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            {isPlaying ? (
              <>
                <Pause size={15} fill="#ffffff" />
                Pause
              </>
            ) : (
              <>
                <Play size={15} fill="#ffffff" />
                {currentStepIdx >= totalSteps - 1 ? 'Replay' : 'Play'}
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx >= totalSteps - 1}
            title="Step Forward"
            style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              color: currentStepIdx >= totalSteps - 1 ? '#475569' : '#cbd5e1',
              padding: '0.45rem',
              cursor: currentStepIdx >= totalSteps - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SkipForward size={15} />
          </button>
        </div>

        {/* Timeline Slider & Step Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '220px' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Step <span style={{ color: '#818cf8', fontWeight: 800 }}>{currentStepIdx + 1}</span> of {totalSteps}
          </span>
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStepIdx}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIdx(Number(e.target.value));
            }}
            style={{
              flex: 1,
              accentColor: '#6366f1',
              cursor: 'pointer',
              height: '5px'
            }}
          />
        </div>

        {/* Playback Speed Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#090d16', padding: '0.2rem', borderRadius: '6px' }}>
          {[0.5, 1, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              style={{
                background: playbackSpeed === speed ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: playbackSpeed === speed ? '#a5b4fc' : '#64748b',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Stage: Split Visual Canvas (Left) + Synchronized Code (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1.35fr) minmax(320px, 0.95fr)',
        gap: '1rem',
        alignItems: 'stretch'
      }}>
        {/* LEFT COLUMN: Interactive Visual Canvas */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          {/* SPECIALIZED CANVASES (Sudoku, Histogram, Linked List, Binary Tree, 2D Graph Grid) */}
          {currentStep.sudokuGrid ? (
            <SudokuCanvas data={currentStep.sudokuGrid} />
          ) : currentStep.histogram ? (
            <HistogramCanvas data={currentStep.histogram} />
          ) : currentStep.linkedList ? (
            <LinkedListCanvas data={currentStep.linkedList} />
          ) : currentStep.treeVisual ? (
            <TreeCanvas data={currentStep.treeVisual} />
          ) : currentStep.graphGrid ? (
            <GraphGridCanvas data={currentStep.graphGrid} />
          ) : (
            /* A. ARRAY VISUALIZATION ROW */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>
                  {currentStep.arrayLabel || 'Input Array'} [Length: {currentStep.array?.length || 0}]
                </span>
                {currentStep.isComplete && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: currentStep.isSuccess ? '#10b981' : '#f59e0b',
                    background: currentStep.isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {currentStep.isSuccess ? '✅ Condition Met / Complete' : '⚠️ Search Complete'}
                  </span>
                )}
              </div>

              {/* Array Canvas Container */}
              <div style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1.5rem 1rem 1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowX: 'auto',
                minHeight: '140px',
                justifyContent: 'center'
              }}>
                {/* TOP POINTERS ROW */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  minHeight: '26px',
                  marginBottom: '4px'
                }}>
                  {currentStep.array?.map((_, idx) => {
                    const topPointers = currentStep.pointers?.filter(p => p.index === idx && p.position === 'top') || [];
                    return (
                      <div
                        key={idx}
                        style={{
                          width: '54px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          position: 'relative'
                        }}
                      >
                        {topPointers.map((p, pIdx) => (
                          <div
                            key={pIdx}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              animation: 'bounce 0.6s infinite alternate'
                            }}
                          >
                            <span style={{
                              background: p.color || '#38bdf8',
                              color: '#0f172a',
                              fontSize: '0.68rem',
                              fontWeight: 900,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              boxShadow: `0 0 10px ${p.color}80`,
                              whiteSpace: 'nowrap'
                            }}>
                              {p.name}
                            </span>
                            <span style={{ color: p.color || '#38bdf8', fontSize: '0.7rem', lineHeight: '0.6rem' }}>▼</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* ARRAY BOXES ROW */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {currentStep.array?.map((val, idx) => {
                    const state = currentStep.elementStates?.[idx];
                    
                    // Color coding per state
                    let borderColor = 'rgba(255, 255, 255, 0.15)';
                    let bgColor = '#1e293b';
                    let textColor = '#f8fafc';
                    let transform = 'scale(1)';
                    let opacity = 1;

                    if (state === 'active') {
                      borderColor = '#38bdf8';
                      bgColor = 'rgba(56, 189, 248, 0.2)';
                      textColor = '#38bdf8';
                      transform = 'scale(1.08)';
                    } else if (state === 'comparing') {
                      borderColor = '#f59e0b';
                      bgColor = 'rgba(245, 158, 11, 0.2)';
                      textColor = '#fbbf24';
                      transform = 'scale(1.08)';
                    } else if (state === 'matched') {
                      borderColor = '#10b981';
                      bgColor = 'rgba(16, 185, 129, 0.25)';
                      textColor = '#34d399';
                      transform = 'scale(1.12)';
                    } else if (state === 'in-window') {
                      borderColor = '#a855f7';
                      bgColor = 'rgba(168, 85, 247, 0.18)';
                      textColor = '#c084fc';
                    } else if (state === 'stored') {
                      borderColor = 'rgba(99, 102, 241, 0.4)';
                      bgColor = 'rgba(99, 102, 241, 0.12)';
                      textColor = '#a5b4fc';
                    } else if (state === 'eliminated') {
                      borderColor = 'rgba(255, 255, 255, 0.05)';
                      bgColor = '#090d16';
                      textColor = '#475569';
                      opacity = 0.35;
                    }

                    return (
                      <div
                        key={idx}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '10px',
                          border: `2px solid ${borderColor}`,
                          background: bgColor,
                          color: textColor,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.15rem',
                          position: 'relative',
                          transform,
                          opacity,
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: state === 'active' ? '0 0 16px rgba(56, 189, 248, 0.4)' :
                                     state === 'matched' ? '0 0 20px rgba(16, 185, 129, 0.5)' :
                                     state === 'comparing' ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none'
                        }}
                      >
                        <span>{val}</span>
                        <span style={{
                          position: 'absolute',
                          bottom: '-18px',
                          fontSize: '0.65rem',
                          color: '#64748b',
                          fontFamily: 'monospace'
                        }}>
                          [{idx}]
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM POINTERS ROW */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  minHeight: '26px',
                  marginTop: '22px'
                }}>
                  {currentStep.array?.map((_, idx) => {
                    const bottomPointers = currentStep.pointers?.filter(p => p.index === idx && p.position === 'bottom') || [];
                    return (
                      <div
                        key={idx}
                        style={{
                          width: '54px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-start'
                        }}
                      >
                        {bottomPointers.map((p, pIdx) => (
                          <div
                            key={pIdx}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <span style={{ color: p.color || '#ec4899', fontSize: '0.7rem', lineHeight: '0.6rem' }}>▲</span>
                            <span style={{
                              background: p.color || '#ec4899',
                              color: '#ffffff',
                              fontSize: '0.68rem',
                              fontWeight: 900,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              boxShadow: `0 0 10px ${p.color}80`,
                              whiteSpace: 'nowrap'
                            }}>
                              {p.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* B. AUXILIARY DATA STRUCTURES (Hash Set, Hash Map, or Extra Arrays) */}
          {currentStep.hashSet && (
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 800 }}>
                  🗄️ {currentStep.hashSet.title}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Size: {currentStep.hashSet.items.length} items
                </span>
              </div>
              <div style={{
                display: 'flex',
                gap: '0.4rem',
                flexWrap: 'wrap',
                minHeight: '38px',
                alignItems: 'center',
                background: '#090d16',
                borderRadius: '8px',
                padding: '0.4rem 0.6rem'
              }}>
                {currentStep.hashSet.items.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                    Set is empty (O(1) lookups ready)
                  </span>
                ) : (
                  currentStep.hashSet.items.map((item, idx) => {
                    const isLastActionTarget = currentStep.hashSet.lastAction?.value === item;
                    return (
                      <span
                        key={idx}
                        style={{
                          background: isLastActionTarget ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.2)',
                          color: isLastActionTarget ? '#34d399' : '#cbd5e1',
                          border: isLastActionTarget ? '1px solid #10b981' : '1px solid rgba(99, 102, 241, 0.4)',
                          borderRadius: '6px',
                          padding: '0.2rem 0.55rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          fontFamily: 'monospace'
                        }}
                      >
                        {item}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {currentStep.hashMap && (
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>
                  🗺️ {currentStep.hashMap.title}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {currentStep.hashMap.entries.length} key-value pairs
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '0.4rem',
                background: '#090d16',
                borderRadius: '8px',
                padding: '0.5rem',
                minHeight: '44px'
              }}>
                {currentStep.hashMap.entries.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                    Map is currently empty
                  </span>
                ) : (
                  currentStep.hashMap.entries.map((entry, idx) => {
                    const isMatched = currentStep.hashMap.lastLookup?.key === entry.key && currentStep.hashMap.lastLookup?.found;
                    return (
                      <div
                        key={idx}
                        style={{
                          background: isMatched ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                          border: isMatched ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          padding: '0.25rem 0.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        <span style={{ color: '#38bdf8', fontWeight: 800 }}>{entry.key}</span>
                        <span style={{ color: '#64748b' }}>➔</span>
                        <span style={{ color: '#f59e0b', fontWeight: 800 }}>{entry.value}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {currentStep.auxArrays && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentStep.auxArrays.map((aux, aIdx) => (
                <div key={aIdx} style={{
                  background: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.9rem'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 800, display: 'block', marginBottom: '0.4rem' }}>
                    {aux.label}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
                    {aux.array.map((val, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: '42px',
                          height: '36px',
                          borderRadius: '6px',
                          background: aux.activeIndex === idx ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                          border: aux.activeIndex === idx ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: aux.activeIndex === idx ? '#f472b6' : '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* C. LIVE VARIABLES HUD */}
          {currentStep.variables && currentStep.variables.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              background: '#111827',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, alignSelf: 'center' }}>
                WATCH HUD:
              </span>
              {currentStep.variables.map((v, vIdx) => (
                <div
                  key={vIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '5px',
                    fontSize: '0.74rem'
                  }}
                >
                  <span style={{ color: '#94a3b8' }}>{v.name}:</span>
                  <span style={{ color: '#f8fafc', fontWeight: 800, fontFamily: 'monospace' }}>
                    {String(v.value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* D. PLAIN ENGLISH STEP EXPLANATION BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '0.9rem 1.1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              background: '#6366f1',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <HelpCircle size={15} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800, marginBottom: '0.2rem' }}>
                EXPLANATION • STEP {currentStepIdx + 1}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {currentStep.explanation}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Synchronized Code Line Highlighter */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Code Header */}
          <div style={{
            background: '#111827',
            padding: '0.6rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code2 size={15} color="#818cf8" />
              <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 800 }}>
                Synchronized Code Execution
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace' }}>
              Line {currentStep.codeLine || 1}
            </span>
          </div>

          {/* Code Viewer with Live Highlight */}
          <div style={{
            padding: '0.75rem 0',
            overflowY: 'auto',
            fontFamily: 'Consolas, Monaco, "Fira Code", monospace',
            fontSize: '0.82rem',
            lineHeight: '1.6rem',
            flex: 1
          }}>
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === currentStep.codeLine;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 0.75rem',
                    background: isActive ? 'rgba(99, 102, 241, 0.22)' : 'transparent',
                    borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    fontWeight: isActive ? 700 : 400,
                    transition: 'background 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '28px',
                    color: isActive ? '#818cf8' : '#475569',
                    userSelect: 'none',
                    fontSize: '0.72rem',
                    textAlign: 'right',
                    marginRight: '0.75rem'
                  }}>
                    {lineNum}
                  </span>
                  {isActive && (
                    <span style={{ color: '#818cf8', marginRight: '0.4rem', fontSize: '0.75rem' }}>
                      ▶
                    </span>
                  )}
                  <span style={{ whiteSpace: 'pre', overflowX: 'auto' }}>
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
