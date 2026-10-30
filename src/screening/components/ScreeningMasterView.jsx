import React, { useState, useMemo, useEffect } from "react";
import {
  MessageSquare,
  Mic,
  DollarSign,
  ShieldAlert,
  Award,
  Clock,
  Search,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  BookOpen,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Target,
  Volume2,
  ShieldCheck,
  Zap,
  Briefcase,
  FileText,
  Send,
  HelpCircle,
  Table,
  CheckSquare,
  ListFilter,
  RotateCcw,
} from "lucide-react";
import {
  FOUNDATION_FINANCE_PHASES,
  FOUNDATION_FINANCE_193_QUESTIONS,
  WHICH_EXAMPLE_FOR_WHICH_QUESTION,
  EIGHT_STEP_SYSTEM_DESIGN_FRAMEWORK,
  PHASE_1_PRACTICE_CHECKLIST,
  FINAL_READINESS_CHECKLIST,
} from "../data/foundationFinanceData";
import {
  SCREENING_CANDIDATE_PROFILE,
  SCREENING_SPEAKING_RULES,
  SCREENING_90S_PITCH,
  SCREENING_SALARY_SCRIPTS,
  SCREENING_DIFFICULT_QUESTIONS,
  SCREENING_EMERGENCY_TOOLKIT,
  SCREENING_QUESTIONS_TO_ASK,
} from "../data/screeningData";
import FormattedMarkdownText from "../../shared/FormattedMarkdownText";
import SyntaxCodeBlock from "../../shared/SyntaxCodeBlock";
import MermaidRenderer from "../../shared/MermaidRenderer";
import FoundationFinanceMasterHub from "./FoundationFinanceMasterHub";
import StarSequenceStudio from "./StarSequenceStudio";

const getQuestionTypeBadgeStyle = (type) => {
  if (!type) return { bg: "rgba(148, 163, 184, 0.15)", text: "#94a3b8", border: "rgba(148, 163, 184, 0.3)" };
  if (type.includes("Performance")) return { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" };
  if (type.includes("Crisis")) return { bg: "rgba(244, 63, 94, 0.18)", text: "#fb7185", border: "rgba(244, 63, 94, 0.4)" };
  if (type.includes("Security")) return { bg: "rgba(239, 68, 68, 0.16)", text: "#f87171", border: "rgba(239, 68, 68, 0.35)" };
  if (type.includes("Concurrency") || type.includes("Locking")) return { bg: "rgba(168, 85, 247, 0.16)", text: "#c084fc", border: "rgba(168, 85, 247, 0.35)" };
  if (type.includes("Data Integrity") || type.includes("ACID")) return { bg: "rgba(16, 185, 129, 0.16)", text: "#34d399", border: "rgba(16, 185, 129, 0.35)" };
  if (type.includes("Architecture") || type.includes("Scalability")) return { bg: "rgba(99, 102, 241, 0.16)", text: "#818cf8", border: "rgba(99, 102, 241, 0.35)" };
  if (type.includes("Debugging")) return { bg: "rgba(234, 179, 8, 0.16)", text: "#fde047", border: "rgba(234, 179, 8, 0.35)" };
  if (type.includes("Auth") || type.includes("Session")) return { bg: "rgba(56, 189, 248, 0.16)", text: "#38bdf8", border: "rgba(56, 189, 248, 0.35)" };
  if (type.includes("Frontend")) return { bg: "rgba(6, 182, 212, 0.16)", text: "#22d3ee", border: "rgba(6, 182, 212, 0.35)" };
  if (type.includes("Testing") || type.includes("Quality")) return { bg: "rgba(34, 197, 94, 0.16)", text: "#4ade80", border: "rgba(34, 197, 94, 0.35)" };
  if (type.includes("DevOps") || type.includes("Deployment")) return { bg: "rgba(249, 115, 22, 0.16)", text: "#fb923c", border: "rgba(249, 115, 22, 0.35)" };
  if (type.includes("Culture")) return { bg: "rgba(59, 130, 246, 0.16)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" };
  return { bg: "rgba(148, 163, 184, 0.15)", text: "#cbd5e1", border: "rgba(148, 163, 184, 0.3)" };
};

export default function ScreeningMasterView() {
  const [activeTab, setActiveTab] = useState("foundationFinance"); // 'foundationFinance' | 'questions' | 'storyMatrix' | 'systemDesign' | 'checklists' | 'pitch' | 'salary' | 'difficult' | 'emergency' | 'askRecruiter'
  const [selectedSection, setSelectedSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'mastered' | 'unmastered'
  const [expandedIds, setExpandedIds] = useState(
    () =>
      new Set([
        1, 2, 14, 15, 67, 91, 96, 102, 114, 129, 143, 153, 169, 178, 191,
      ]),
  );
  const [copiedId, setCopiedId] = useState(null);
  const [copiedScript, setCopiedScript] = useState(null);

  // Mastered Questions LocalStorage State (Foundation Finance 193 Qs)
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem("foundation_finance_mastered_ids");
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem("screening_mastered_ids");
      return oldSaved
        ? JSON.parse(oldSaved)
        : [1, 2, 14, 15, 67, 91, 96, 102, 114, 129, 143, 153, 169, 178, 191];
    } catch {
      return [1, 2, 14, 15, 67, 91, 96, 102, 114, 129, 143, 153, 169, 178, 191];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "foundation_finance_mastered_ids",
        JSON.stringify(masteredIds),
      );
    } catch (e) {
      console.error(e);
    }
  }, [masteredIds]);

  const toggleMastered = (id, e) => {
    e?.stopPropagation();
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredQuestions.map((q) => q.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Questions across all 193
  const filteredQuestions = useMemo(() => {
    return FOUNDATION_FINANCE_193_QUESTIONS.filter((q) => {
      // Phase / Section filter
      if (
        selectedSection !== "all" &&
        q.phaseId !== parseInt(selectedSection, 10)
      ) {
        return false;
      }
      // Difficulty filter
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === "mastered" && !masteredIds.includes(q.id)) {
        return false;
      }
      if (statusFilter === "unmastered" && masteredIds.includes(q.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inQuestion = q.question.toLowerCase().includes(query);
        const inPitch = (q.directPitch || "").toLowerCase().includes(query);
        const inAnswer = (q.spokenAnswer || "").toLowerCase().includes(query);
        const inCategory = (q.category || "").toLowerCase().includes(query);
        const inId =
          q.id.toString() === query.replace("#", "").replace("q", "");
        return inQuestion || inPitch || inAnswer || inCategory || inId;
      }
      return true;
    });
  }, [
    selectedSection,
    difficultyFilter,
    statusFilter,
    searchQuery,
    masteredIds,
  ]);

  const masteredCount = masteredIds.length;
  const totalCount = FOUNDATION_FINANCE_193_QUESTIONS.length;
  const progressPercent = Math.round((masteredCount / totalCount) * 100);

  // Timer State for 90s Pitch Practice
  const [pitchTimer, setPitchTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setPitchTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto",
        color: "#f8fafc",
      }}
    >
      {/* 1. HERO BANNER: Foundation Finance 13-Phase Masterclass Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #090f1d 0%, #0d172e 50%, #112247 100%)",
          border: "1px solid rgba(56, 189, 248, 0.28)",
          borderRadius: "16px",
          padding: "1.5rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-40px",
            width: "260px",
            height: "260px",
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1.25rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              maxWidth: "780px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                  color: "#090d16",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Foundation Finance Masterclass
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <Briefcase size={14} color="#38bdf8" />
                {SCREENING_CANDIDATE_PROFILE.name} &bull;{" "}
                {SCREENING_CANDIDATE_PROFILE.role} (
                {SCREENING_CANDIDATE_PROFILE.experienceYears})
              </span>
              <span
                style={{
                  background: "rgba(234, 179, 8, 0.15)",
                  color: "#facc15",
                  border: "1px solid rgba(234, 179, 8, 0.3)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "6px",
                }}
              >
                Full Stack Developer &bull; Hyderabad (Hybrid)
              </span>
            </div>

            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0.2rem 0",
                letterSpacing: "-0.02em",
              }}
            >
              Full Stack Developer Interview Masterclass
            </h1>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#94a3b8",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              The complete preparation guide — every question, model spoken
              answer, coaching tip, and follow-up arranged in the exact order of
              a real interview. Grounded in{" "}
              <strong style={{ color: "#e2e8f0" }}>Sameer&apos;s</strong>{" "}
              authentic production architectures:{" "}
              <span style={{ color: "#38bdf8" }}>Chrona</span> (bulk JSON_TABLE,
              auth cookies), <span style={{ color: "#818cf8" }}>LesHub</span>{" "}
              (multi-tenant CRM, Kendo Scheduler, Dutch i18n), and{" "}
              <span style={{ color: "#34d399" }}>Portfolio Platform</span>{" "}
              (Stripe/Razorpay, AES response fix).
            </p>
          </div>

          {/* Mastered Progress Widget */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              minWidth: "240px",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  fontWeight: 600,
                }}
              >
                Mastery Progress
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#38bdf8",
                }}
              >
                {masteredCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                background: "#1e293b",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  background:
                    "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                color: "#64748b",
              }}
            >
              <span>{totalCount} Questions</span>
              <span>13 Interview Phases</span>
            </div>
          </div>
        </div>

        {/* Anchor Projects Summary Ribbon */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0.85rem",
          }}
        >
          {SCREENING_CANDIDATE_PROFILE.projects.map((proj, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color:
                      idx === 0 ? "#38bdf8" : idx === 1 ? "#818cf8" : "#34d399",
                  }}
                >
                  {proj.name}
                </span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "#64748b",
                    background: "#1e293b",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "4px",
                  }}
                >
                  {proj.stack.split(",").slice(0, 3).join(", ")}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#cbd5e1",
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                {proj.highlights[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SUB-TABS NAVIGATION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          background: "#090d16",
          padding: "0.4rem",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          overflowX: "auto",
        }}
      >
        {[
          {
            id: "foundationFinance",
            label: "🏢 Foundation Finance Hub",
            badge: "Tomorrow ⭐",
          },
          {
            id: "questions",
            label: `🎯 ${totalCount} Questions (13 Phases)`,
            badge: `${totalCount} Qs`,
          },
          {
            id: "storyMatrix",
            label: "📊 14 STAR System Design Matrix",
            badge: "14 Flows ⭐",
          },
          {
            id: "systemDesign",
            label: "🏛️ 8-Step System Design",
            badge: "Phase 10 Guide",
          },
          {
            id: "checklists",
            label: "✅ Interview Checklists",
            badge: "Phase 1 & 13",
          },
          { id: "pitch", label: "🎙️ 90s Introduction Pitch", badge: "Crucial" },
          {
            id: "salary",
            label: "💰 Salary Negotiation (₹15 LPA)",
            badge: "₹6L ➔ ₹15L",
          },
          {
            id: "difficult",
            label: "🛡️ Tenure & Title Defense",
            count: SCREENING_DIFFICULT_QUESTIONS.length,
          },
          {
            id: "emergency",
            label: "⚡ Speaking Rules & Freeze Kit",
            count: "5+5",
          },
          {
            id: "askRecruiter",
            label: "❓ Questions to Ask",
            count: SCREENING_QUESTIONS_TO_ASK.length,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 0.95rem",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 700,
                background: isActive
                  ? "linear-gradient(90deg, #1e293b, #334155)"
                  : "transparent",
                color: isActive ? "#38bdf8" : "#94a3b8",
                borderBottom: isActive
                  ? "2px solid #38bdf8"
                  : "2px solid transparent",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    background: "#38bdf8",
                    color: "#090d16",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: 800,
                  }}
                >
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: "0.68rem",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#cbd5e1",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT VIEWS */}

      {/* TAB 0: FOUNDATION FINANCE MASTER HUB */}
      {activeTab === "foundationFinance" && <FoundationFinanceMasterHub />}

      {/* TAB A: 193 QUESTIONS (13 PHASES) */}
      {activeTab === "questions" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Phase Filter Pills (All 13 Phases) */}
          <div
            style={{
              display: "flex",
              gap: "0.45rem",
              overflowX: "auto",
              paddingBottom: "0.4rem",
            }}
          >
            <button
              onClick={() => setSelectedSection("all")}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: selectedSection === "all" ? "#38bdf8" : "#1e293b",
                background:
                  selectedSection === "all"
                    ? "rgba(56, 189, 248, 0.15)"
                    : "#0d131f",
                color: selectedSection === "all" ? "#38bdf8" : "#94a3b8",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              All 13 Phases ({totalCount} Qs)
            </button>
            {FOUNDATION_FINANCE_PHASES.map((s) => {
              const isSel = selectedSection === s.id.toString();
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSection(s.id.toString())}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isSel ? s.color : "#1e293b",
                    background: isSel ? `${s.color}22` : "#0d131f",
                    color: isSel ? s.color : "#94a3b8",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: s.color,
                    }}
                  />
                  {s.title.replace("Phase ", "P")} ({s.count} Qs)
                </button>
              );
            })}
          </div>

          {/* Search, Filter Bar, and Expand/Collapse Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.85rem",
              background: "#0d131f",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              flexWrap: "wrap",
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 200 questions by keyword, topic, or #ID (e.g. quote-to-invoice, JSON_TABLE, webhook, closure, #17)..."
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem 0.5rem 2.25rem",
                  background: "#161f30",
                  border: "1px solid #293548",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.82rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                background: "#161f30",
                border: "1px solid #293548",
                borderRadius: "6px",
                color: "#cbd5e1",
                fontSize: "0.78rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Levels</option>
              <option value="Senior">Senior Level</option>
              <option value="Senior/Lead">Senior / Lead</option>
              <option value="Mid">Mid Level</option>
              <option value="Junior/Mid">Junior / Mid</option>
              <option value="Core">Core Opening</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                background: "#161f30",
                border: "1px solid #293548",
                borderRadius: "6px",
                color: "#cbd5e1",
                fontSize: "0.78rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Progress ({totalCount})</option>
              <option value="mastered">Mastered Only ({masteredCount})</option>
              <option value="unmastered">
                Unmastered ({totalCount - masteredCount})
              </option>
            </select>

            {/* Expand / Collapse All Buttons */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={expandAll}
                style={{
                  padding: "0.45rem 0.7rem",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  color: "#cbd5e1",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                style={{
                  padding: "0.45rem 0.7rem",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  color: "#cbd5e1",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Questions Counter Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.8rem",
              color: "#64748b",
              padding: "0 0.25rem",
            }}
          >
            <span>
              Showing{" "}
              <strong style={{ color: "#e2e8f0" }}>
                {filteredQuestions.length}
              </strong>{" "}
              of {totalCount} Questions
            </span>
            <span>
              Click any question to view its Model Spoken Answer, Coaching Tips,
              Code, and Follow-ups
            </span>
          </div>

          {/* Questions List */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {filteredQuestions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  background: "#0d131f",
                  borderRadius: "12px",
                  border: "1px solid #1e293b",
                  color: "#94a3b8",
                }}
              >
                <p style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>
                  No questions match your current filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSection("all");
                    setDifficultyFilter("all");
                    setStatusFilter("all");
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#38bdf8",
                    color: "#090d16",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const isExpanded = expandedIds.has(q.id);
                const isMastered = masteredIds.includes(q.id);
                const phaseMeta = FOUNDATION_FINANCE_PHASES.find(
                  (s) => s.id === q.phaseId,
                ) || { color: "#38bdf8" };
                const typeStyle = getQuestionTypeBadgeStyle(q.questionType);
                const isFirstOfPhase =
                  (selectedSection === "all" &&
                    !searchQuery.trim() &&
                    (idx === 0 ||
                      q.phaseId !== filteredQuestions[idx - 1].phaseId)) ||
                  (selectedSection !== "all" && idx === 0);

                return (
                  <React.Fragment key={q.id}>
                    {isFirstOfPhase && (
                      <div
                        style={{
                          marginTop: idx === 0 ? "0.25rem" : "1.75rem",
                          marginBottom: "0.65rem",
                          background:
                            "linear-gradient(135deg, rgba(30, 41, 59, 0.75), rgba(15, 23, 42, 0.95))",
                          border: `1px solid ${phaseMeta.color}40`,
                          borderLeft: `5px solid ${phaseMeta.color}`,
                          borderRadius: "12px",
                          padding: "1rem 1.35rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "1rem",
                          boxShadow: `0 4px 20px ${phaseMeta.color}15`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            flex: 1,
                            minWidth: "280px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 900,
                                color: phaseMeta.color,
                                background: `${phaseMeta.color}22`,
                                padding: "0.2rem 0.55rem",
                                borderRadius: "5px",
                              }}
                            >
                              MODULE {phaseMeta.id} &bull; {phaseMeta.range}
                            </span>
                            <h2
                              style={{
                                margin: 0,
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                color: "#f8fafc",
                              }}
                            >
                              {phaseMeta.title}
                            </h2>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.82rem",
                              color: "#94a3b8",
                              lineHeight: 1.4,
                            }}
                          >
                            {phaseMeta.description}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "#cbd5e1",
                              background: "#1e293b",
                              padding: "0.3rem 0.75rem",
                              borderRadius: "6px",
                              fontWeight: 700,
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            {phaseMeta.count} Questions
                          </span>
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        background: "#0d131f",
                        border: `1px solid ${isExpanded ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.08)"}`,
                        borderRadius: "12px",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        boxShadow: isExpanded
                          ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                          : "none",
                      }}
                    >
                      {/* Question Header Card */}
                      <div
                        onClick={() => toggleExpand(q.id)}
                        style={{
                          padding: "1rem 1.25rem",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "1rem",
                          cursor: "pointer",
                          background: isExpanded
                            ? "rgba(56, 189, 248, 0.03)"
                            : "transparent",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.85rem",
                            flex: 1,
                          }}
                        >
                          <button
                            onClick={(e) => toggleMastered(q.id, e)}
                            title={
                              isMastered
                                ? "Mark as unmastered"
                                : "Mark as mastered"
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "0.15rem 0 0 0",
                              color: isMastered ? "#10b981" : "#475569",
                            }}
                          >
                            {isMastered ? (
                              <CheckCircle2 size={20} />
                            ) : (
                              <Circle size={20} />
                            )}
                          </button>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.35rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 800,
                                  color: phaseMeta.color,
                                  background: `${phaseMeta.color}18`,
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "4px",
                                }}
                              >
                                Q{q.id}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  color: "#94a3b8",
                                  background: "#161f30",
                                  padding: "0.15rem 0.45rem",
                                  borderRadius: "4px",
                                }}
                              >
                                {q.phaseTitle.split(":")[1]?.trim() ||
                                  q.phaseTitle}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  color: "#cbd5e1",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  padding: "0.15rem 0.45rem",
                                  borderRadius: "4px",
                                }}
                              >
                                {q.category}
                              </span>
                              {q.questionType && (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 800,
                                    color: typeStyle.text,
                                    background: typeStyle.bg,
                                    border: `1px solid ${typeStyle.border}`,
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "4px",
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  {q.questionType}
                                </span>
                              )}
                              {q.projectTag && (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 800,
                                    color: "#38bdf8",
                                    background: "rgba(56, 189, 248, 0.12)",
                                    border: "1px solid rgba(56, 189, 248, 0.3)",
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                  }}
                                >
                                  <Briefcase size={11} />
                                  {q.projectTag}
                                </span>
                              )}
                            </div>

                            <h3
                              style={{
                                fontSize: "0.96rem",
                                fontWeight: 700,
                                color: isMastered ? "#94a3b8" : "#f8fafc",
                                textDecoration: isMastered
                                  ? "line-through"
                                  : "none",
                                margin: 0,
                                lineHeight: 1.4,
                              }}
                            >
                              {q.question}
                            </h3>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                `Question: ${q.question}\n\nModel Answer:\n${q.spokenAnswer || q.directPitch}\n\nKey Takeaway:\n${q.keyTakeaway}`,
                                q.id,
                              );
                            }}
                            title="Copy question and model answer"
                            style={{
                              background: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "6px",
                              padding: "0.35rem 0.55rem",
                              color: copiedId === q.id ? "#10b981" : "#94a3b8",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              fontSize: "0.72rem",
                            }}
                          >
                            {copiedId === q.id ? (
                              <Check size={14} />
                            ) : (
                              <Copy size={14} />
                            )}
                            <span>{copiedId === q.id ? "Copied" : "Copy"}</span>
                          </button>

                          <div style={{ color: "#64748b" }}>
                            {isExpanded ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Answer Body */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: "1rem 1.25rem 1.25rem 1.25rem",
                            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            background: "#090e17",
                          }}
                        >
                          {/* 0A. Underlying Interviewer Evaluation Cause */}
                          {q.evaluationCause && (
                            <div
                              style={{
                                background: "rgba(56, 189, 248, 0.05)",
                                border: "1px solid rgba(56, 189, 248, 0.22)",
                                borderRadius: "8px",
                                padding: "0.65rem 0.95rem",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.65rem",
                              }}
                            >
                              <Target
                                size={16}
                                color="#38bdf8"
                                style={{ flexShrink: 0, marginTop: "2px" }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.15rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 800,
                                    color: "#38bdf8",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                  }}
                                >
                                  Interviewer Evaluation Intent / Cause
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.82rem",
                                    color: "#bae6fd",
                                    lineHeight: 1.45,
                                  }}
                                >
                                  {q.evaluationCause}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 0B. Structured S-T-A-R Breakdown (Only for Technical Q14–Q200) */}
                          {q.star && (
                            <div
                              style={{
                                background: "rgba(15, 23, 42, 0.85)",
                                border: "1px solid rgba(129, 140, 248, 0.25)",
                                borderRadius: "10px",
                                padding: "0.95rem 1.15rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.45rem",
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    color: "#818cf8",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                  }}
                                >
                                  <Sparkles size={15} />
                                  Structured S-T-A-R Delivery Breakdown
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    color: "#94a3b8",
                                    background: "rgba(129, 140, 248, 0.1)",
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(129, 140, 248, 0.25)",
                                  }}
                                >
                                  Technical Screening Model
                                </span>
                              </div>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                  gap: "0.65rem",
                                }}
                              >
                                {/* S */}
                                <div
                                  style={{
                                    background: "rgba(56, 189, 248, 0.05)",
                                    border: "1px solid rgba(56, 189, 248, 0.2)",
                                    borderRadius: "8px",
                                    padding: "0.75rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      fontWeight: 800,
                                      color: "#38bdf8",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        background: "#38bdf8",
                                        color: "#0f172a",
                                        borderRadius: "50%",
                                        width: "16px",
                                        height: "16px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.65rem",
                                        fontWeight: 900,
                                      }}
                                    >
                                      S
                                    </span>
                                    Situation
                                  </span>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "0.82rem",
                                      color: "#e2e8f0",
                                      lineHeight: 1.45,
                                    }}
                                  >
                                    {q.star.situation}
                                  </p>
                                </div>

                                {/* T */}
                                <div
                                  style={{
                                    background: "rgba(168, 85, 247, 0.05)",
                                    border: "1px solid rgba(168, 85, 247, 0.2)",
                                    borderRadius: "8px",
                                    padding: "0.75rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      fontWeight: 800,
                                      color: "#c084fc",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        background: "#c084fc",
                                        color: "#0f172a",
                                        borderRadius: "50%",
                                        width: "16px",
                                        height: "16px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.65rem",
                                        fontWeight: 900,
                                      }}
                                    >
                                      T
                                    </span>
                                    Task
                                  </span>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "0.82rem",
                                      color: "#e2e8f0",
                                      lineHeight: 1.45,
                                    }}
                                  >
                                    {q.star.task}
                                  </p>
                                </div>

                                {/* A */}
                                <div
                                  style={{
                                    background: "rgba(16, 185, 129, 0.05)",
                                    border: "1px solid rgba(16, 185, 129, 0.2)",
                                    borderRadius: "8px",
                                    padding: "0.75rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      fontWeight: 800,
                                      color: "#34d399",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        background: "#34d399",
                                        color: "#0f172a",
                                        borderRadius: "50%",
                                        width: "16px",
                                        height: "16px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.65rem",
                                        fontWeight: 900,
                                      }}
                                    >
                                      A
                                    </span>
                                    Action
                                  </span>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "0.82rem",
                                      color: "#e2e8f0",
                                      lineHeight: 1.45,
                                    }}
                                  >
                                    {q.star.action}
                                  </p>
                                </div>

                                {/* R */}
                                <div
                                  style={{
                                    background: "rgba(245, 158, 11, 0.05)",
                                    border: "1px solid rgba(245, 158, 11, 0.2)",
                                    borderRadius: "8px",
                                    padding: "0.75rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      fontWeight: 800,
                                      color: "#fbbf24",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        background: "#fbbf24",
                                        color: "#0f172a",
                                        borderRadius: "50%",
                                        width: "16px",
                                        height: "16px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.65rem",
                                        fontWeight: 900,
                                      }}
                                    >
                                      R
                                    </span>
                                    Result
                                  </span>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "0.82rem",
                                      color: "#e2e8f0",
                                      lineHeight: 1.45,
                                    }}
                                  >
                                    {q.star.result}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 0C. Live Visual System Design Sequence Diagram (Only for Technical Q14–Q200) */}
                          {q.mermaidDiagram && (
                            <div
                              style={{
                                background: "#090d16",
                                border: "1px solid rgba(99, 102, 241, 0.28)",
                                borderRadius: "10px",
                                padding: "0.95rem 1.15rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  flexWrap: "wrap",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.45rem",
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    color: "#818cf8",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                  }}
                                >
                                  <Layers size={15} />
                                  Live Visual System Design Sequence Diagram
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    color: "#94a3b8",
                                    background: "rgba(99, 102, 241, 0.12)",
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "4px",
                                    border:
                                      "1px solid rgba(99, 102, 241, 0.25)",
                                  }}
                                >
                                  Step-by-Step Architecture Flow
                                </span>
                              </div>

                              <div
                                style={{
                                  background: "#060911",
                                  borderRadius: "8px",
                                  padding: "0.75rem",
                                  overflowX: "auto",
                                  border: "1px solid rgba(255, 255, 255, 0.05)",
                                }}
                              >
                                <MermaidRenderer
                                  chart={q.mermaidDiagram}
                                  id={`seq-q-${q.id}`}
                                />
                              </div>
                            </div>
                          )}

                          {/* 1. Spoken Model Answer (Blue Box) */}
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(129, 140, 248, 0.05) 100%)",
                              border: "1px solid rgba(56, 189, 248, 0.28)",
                              borderRadius: "10px",
                              padding: "1rem 1.15rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.4rem",
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  color: "#38bdf8",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                <Volume2 size={16} />
                                Model Answer (Practise speaking aloud in first
                                person)
                              </span>
                              <span
                                style={{ fontSize: "0.7rem", color: "#94a3b8" }}
                              >
                                60–90 Seconds
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "0.92rem",
                                color: "#e2e8f0",
                                lineHeight: 1.6,
                                margin: 0,
                                fontWeight: 450,
                                whiteSpace: "pre-line",
                              }}
                            >
                              {q.spokenAnswer || q.directPitch}
                            </div>
                          </div>

                          {/* 2. Coaching Tip / Warning (Yellow Box) */}
                          {q.coachingTip && (
                            <div
                              style={{
                                background: "rgba(234, 179, 8, 0.07)",
                                border: "1px solid rgba(234, 179, 8, 0.28)",
                                borderRadius: "8px",
                                padding: "0.75rem 1rem",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.65rem",
                              }}
                            >
                              <AlertCircle
                                size={18}
                                color="#facc15"
                                style={{ flexShrink: 0, marginTop: "2px" }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.15rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 800,
                                    color: "#facc15",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.03em",
                                  }}
                                >
                                  Coaching Tip / What Not to Claim
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.84rem",
                                    color: "#fef08a",
                                    lineHeight: 1.45,
                                  }}
                                >
                                  {q.coachingTip}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 3. Follow-Up Questions (Follow-up ▸) */}
                          {q.followUps && q.followUps.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.4rem",
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  color: "#f43f5e",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                <Target size={15} />
                                Likely Follow-Up Questions & Model Answers
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.5rem",
                                }}
                              >
                                {q.followUps.map((fu, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      background: "#0d1527",
                                      border:
                                        "1px solid rgba(244, 63, 94, 0.22)",
                                      borderRadius: "8px",
                                      padding: "0.75rem 1rem",
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "0.35rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: 700,
                                        fontSize: "0.84rem",
                                        color: "#fda4af",
                                      }}
                                    >
                                      Follow-up ▸ {fu.question}
                                    </span>
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: "0.82rem",
                                        color: "#cbd5e1",
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      {fu.answer}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Code Snippet (Grey Code Box) */}
                          {(q.codeSnippet || q.codeOrPattern) && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.4rem",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.4rem",
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  color: "#818cf8",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                <Zap size={15} />
                                Code / Architectural Implementation Snippet
                              </span>
                              <SyntaxCodeBlock
                                code={q.codeSnippet || q.codeOrPattern}
                                language="javascript"
                              />
                            </div>
                          )}

                          {/* 5. Key Takeaway / Evaluated Standard */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.65rem",
                              background: "rgba(16, 185, 129, 0.08)",
                              border: "1px solid rgba(16, 185, 129, 0.25)",
                              borderRadius: "8px",
                              padding: "0.65rem 0.95rem",
                            }}
                          >
                            <ShieldCheck
                              size={18}
                              color="#10b981"
                              style={{ flexShrink: 0 }}
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.15rem",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 800,
                                  color: "#34d399",
                                  textTransform: "uppercase",
                                }}
                              >
                                What the Interviewer is Evaluating / Key
                                Takeaway
                              </span>
                              <span
                                style={{
                                  fontSize: "0.84rem",
                                  color: "#e2e8f0",
                                  fontWeight: 600,
                                }}
                              >
                                {q.keyTakeaway}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB B: 14 STAR SYSTEM DESIGN SEQUENCE STUDIO (Phase 2 Master Matrix) */}
      {activeTab === "storyMatrix" && <StarSequenceStudio />}

      {/* TAB C: 8-STEP SYSTEM DESIGN FRAMEWORK (Phase 10 Guide) */}
      {activeTab === "systemDesign" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 0.5rem 0",
              }}
            >
              Phase 10 Study Guide: Eight-Step Framework for Any System Design
              Question
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Use this universal 8-step structure whenever asked to design
              high-scale systems (like Q167 Loan Application System or Q168
              Notification Platform). Never jump directly into drawing
              databases; start with clarifying requirements and scale
              constraints.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {EIGHT_STEP_SYSTEM_DESIGN_FRAMEWORK.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0d131f",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: "10px",
                  padding: "1.1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#a855f7",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                    }}
                  >
                    {step.step}
                  </span>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#f8fafc",
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#cbd5e1",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: INTERVIEW CHECKLISTS (Phase 1 & Phase 13) */}
      {activeTab === "checklists" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Phase 1 Practice Checklist */}
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#38bdf8",
                margin: 0,
              }}
            >
              Phase 1 Practice Checklist (Oral Readiness)
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
              Practise the answers in Phase 1 aloud. Aim for roughly 60–90
              seconds for main answers, with shorter follow-ups.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {PHASE_1_PRACTICE_CHECKLIST.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "6px",
                  }}
                >
                  <CheckSquare size={16} color="#38bdf8" />
                  <span style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 13 Final Readiness Checklist */}
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(20, 184, 166, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#14b8a6",
                margin: 0,
              }}
            >
              Phase 13 Final Interview Readiness Checklist
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
              Comprehensive syllabus coverage across all 13 phases.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {FINAL_READINESS_CHECKLIST.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "6px",
                  }}
                >
                  <CheckCircle2 size={16} color="#14b8a6" />
                  <span style={{ fontSize: "0.83rem", color: "#e2e8f0" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB E: 90S PITCH */}
      {activeTab === "pitch" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  margin: "0 0 0.35rem 0",
                }}
              >
                90-Second Introduction Pitch Practice
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
                Deliver this script calmly when the interviewer asks:
                &ldquo;Tell me about yourself&rdquo; or &ldquo;Walk me through
                your resume&rdquo;.
              </p>
            </div>

            {/* Practice Timer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "#161f30",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #293548",
              }}
            >
              <Clock size={18} color="#38bdf8" />
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: pitchTimer > 90 ? "#f43f5e" : "#38bdf8",
                  minWidth: "45px",
                }}
              >
                {formatTimer(pitchTimer)}
              </span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                style={{
                  padding: "0.35rem 0.75rem",
                  background: timerRunning ? "#f43f5e" : "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                {timerRunning ? "Pause" : "Start Timer"}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setPitchTimer(0);
                }}
                style={{
                  padding: "0.35rem 0.65rem",
                  background: "#334155",
                  color: "#cbd5e1",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* 5 Anchors */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "0.85rem",
            }}
          >
            {SCREENING_90S_PITCH.anchors.map((anchor, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0d131f",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#38bdf8",
                    textTransform: "uppercase",
                  }}
                >
                  {anchor.title}
                </span>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: "#cbd5e1",
                    margin: 0,
                    lineHeight: 1.45,
                  }}
                >
                  {anchor.text}
                </p>
              </div>
            ))}
          </div>

          {/* Full Spoken Script */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#38bdf8",
                  textTransform: "uppercase",
                }}
              >
                Full Spoken Verbatim Script
              </span>
              <button
                onClick={() =>
                  copyToClipboard(SCREENING_90S_PITCH.fullScript, "full_pitch")
                }
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  padding: "0.35rem 0.65rem",
                  color: copiedId === "full_pitch" ? "#10b981" : "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                }}
              >
                {copiedId === "full_pitch" ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
                <span>
                  {copiedId === "full_pitch" ? "Copied" : "Copy Full Script"}
                </span>
              </button>
            </div>
            <p
              style={{
                fontSize: "0.94rem",
                color: "#f8fafc",
                lineHeight: 1.65,
                margin: 0,
                fontWeight: 450,
              }}
            >
              &ldquo;{SCREENING_90S_PITCH.fullScript}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* TAB F: SALARY NEGOTIATION */}
      {activeTab === "salary" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(234, 179, 8, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  margin: "0 0 0.35rem 0",
                }}
              >
                Salary Negotiation Playbook (Target: ₹15 LPA)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
                Anchor to value and market standards for a Lead Full Stack
                Developer who owns performance and architectures.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.65rem" }}>
              <span
                style={{
                  background: "#161f30",
                  border: "1px solid #293548",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                }}
              >
                Current:{" "}
                <strong style={{ color: "#f8fafc" }}>
                  {SCREENING_SALARY_SCRIPTS.currentCTC}
                </strong>
              </span>
              <span
                style={{
                  background: "rgba(234, 179, 8, 0.15)",
                  border: "1px solid rgba(234, 179, 8, 0.3)",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  color: "#facc15",
                }}
              >
                Target: <strong>{SCREENING_SALARY_SCRIPTS.targetCTC}</strong>
              </span>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {SCREENING_SALARY_SCRIPTS.scenarios.map((sc, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0d131f",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "1.15rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    color: "#facc15",
                  }}
                >
                  {sc.q}
                </span>
                <div
                  style={{
                    background: "#090e17",
                    padding: "0.85rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(234, 179, 8, 0.2)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.88rem",
                      color: "#f8fafc",
                      lineHeight: 1.55,
                    }}
                  >
                    &ldquo;{sc.script}&rdquo;
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    fontStyle: "italic",
                  }}
                >
                  💡 Coaching Note: {sc.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB G: TENURE & TITLE DEFENSE */}
      {activeTab === "difficult" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(244, 63, 94, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 0.35rem 0",
              }}
            >
              Tenure & Title Defense Playbook
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
              Defend your February 2026 tenure at Tayseer Technologies and your
              Lead title calmly with authentic evidence.
            </p>
          </div>

          {SCREENING_DIFFICULT_QUESTIONS.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#0d131f",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "1.15rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  color: "#fda4af",
                }}
              >
                {item.q}
              </span>
              <div
                style={{
                  background: "#090e17",
                  padding: "0.85rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(244, 63, 94, 0.2)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.88rem",
                    color: "#f8fafc",
                    lineHeight: 1.55,
                  }}
                >
                  &ldquo;{item.script}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB H: SPEAKING RULES & FREEZE KIT */}
      {activeTab === "emergency" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* 5 Speaking Rules */}
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#10b981",
                margin: 0,
              }}
            >
              The 5 Golden Speaking Rules
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "0.85rem",
              }}
            >
              {SCREENING_SPEAKING_RULES.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#161f30",
                    padding: "0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #293548",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "0.84rem",
                      color: "#34d399",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {r.rule}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      color: "#cbd5e1",
                      lineHeight: 1.45,
                    }}
                  >
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Freeze Recovery Kit */}
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(249, 115, 22, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#f97316",
                margin: 0,
              }}
            >
              Emergency Freeze Recovery Kit (5 Scripts)
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              {SCREENING_EMERGENCY_TOOLKIT.map((em, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#161f30",
                    padding: "0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #293548",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#fdba74",
                    }}
                  >
                    Scenario: {em.scenario}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "#f8fafc",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{em.phrase}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB I: QUESTIONS TO ASK */}
      {activeTab === "askRecruiter" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              background: "#0d131f",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 0.35rem 0",
              }}
            >
              Questions to Ask Foundation Finance / Recruiter
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
              Demonstrate senior architectural engagement and mutual evaluation.
            </p>
          </div>

          {SCREENING_QUESTIONS_TO_ASK.map((q, idx) => (
            <div
              key={idx}
              style={{
                background: "#0d131f",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "1.15rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#38bdf8",
                  textTransform: "uppercase",
                }}
              >
                {q.category}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#f8fafc",
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                &ldquo;{q.q}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
