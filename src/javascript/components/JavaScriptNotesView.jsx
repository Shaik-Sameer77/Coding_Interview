import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  Circle,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Code2,
  ArrowLeft,
  ArrowRight,
  Terminal,
  Bookmark,
  HelpCircle,
  Layers,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { JS_NOTES_METADATA, JS_SECTIONS } from "../data/javascriptNotesData";
import SyntaxCodeBlock from "../../shared/SyntaxCodeBlock";
import FormattedMarkdownText from "../../shared/FormattedMarkdownText";

export default function JavaScriptNotesView() {
  const [activeSectionId, setActiveSectionId] = useState("fundamentals");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Interactive checklist state saved in localStorage
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("js_revision_checklist");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheck = (itemId) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      localStorage.setItem("js_revision_checklist", JSON.stringify(next));
      return next;
    });
  };

  const copySnippet = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filter sections by search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return JS_SECTIONS;
    const q = searchQuery.toLowerCase();
    return JS_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.subsections.some(
          (sub) =>
            sub.title.toLowerCase().includes(q) ||
            (sub.content && sub.content.toLowerCase().includes(q)) ||
            (sub.code && sub.code.toLowerCase().includes(q)),
        ),
    );
  }, [searchQuery]);

  const activeSection = useMemo(() => {
    return JS_SECTIONS.find((s) => s.id === activeSectionId) || JS_SECTIONS[0];
  }, [activeSectionId]);

  const currentIndex = JS_SECTIONS.findIndex((s) => s.id === activeSection.id);
  const prevSection = JS_SECTIONS[currentIndex - 1];
  const nextSection = JS_SECTIONS[currentIndex + 1];

  const totalChecklistItems = 11;
  const completedChecklistCount =
    Object.values(checkedItems).filter(Boolean).length;
  const checklistPercentage = Math.round(
    (completedChecklistCount / totalChecklistItems) * 100,
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          borderRadius: "16px",
          padding: "1.5rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
        }}
      >
        <div style={{ maxWidth: "650px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.4rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                background: "rgba(245, 158, 11, 0.2)",
                color: "#f59e0b",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                border: "1px solid rgba(245, 158, 11, 0.4)",
              }}
            >
              SCREENING PREPARATION
            </span>
            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
              {JS_NOTES_METADATA.level}
            </span>
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#f8fafc",
              margin: "0 0 0.35rem 0",
              letterSpacing: "-0.02em",
            }}
          >
            {JS_NOTES_METADATA.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#cbd5e1",
              lineHeight: "1.5",
            }}
          >
            {JS_NOTES_METADATA.subtitle} — {JS_NOTES_METADATA.purpose}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            background: "rgba(15, 23, 42, 0.65)",
            padding: "0.9rem 1.4rem",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Chapters
            </div>
            <div
              style={{ fontSize: "1.35rem", fontWeight: 800, color: "#f59e0b" }}
            >
              {JS_SECTIONS.length} Modules
            </div>
          </div>
          <div
            style={{ width: "1px", background: "rgba(255, 255, 255, 0.1)" }}
          />
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Checklist
            </div>
            <div
              style={{ fontSize: "1.35rem", fontWeight: 800, color: "#10b981" }}
            >
              {checklistPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Topic-Wise Master Notes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "1.5rem",
          minHeight: "650px",
        }}
      >
        {/* Left Column: Chapters Navigation */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "1.1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            maxHeight: "calc(100vh - 220px)",
            overflowY: "auto",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "0.45rem 0.75rem",
            }}
          >
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search notes (e.g. tdz, weakmap, event loop)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "#f8fafc",
                fontSize: "0.82rem",
                outline: "none",
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "0.2rem 0.4rem",
            }}
          >
            Table of Contents ({filteredSections.length})
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
          >
            {filteredSections.map((sec) => {
              const isActive = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.65rem",
                    padding: "0.65rem 0.8rem",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isActive
                      ? "rgba(245, 158, 11, 0.4)"
                      : "transparent",
                    background: isActive
                      ? "rgba(245, 158, 11, 0.12)"
                      : "transparent",
                    color: isActive ? "#f59e0b" : "#cbd5e1",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: isActive ? "#f59e0b" : "#64748b",
                      minWidth: "22px",
                    }}
                  >
                    {sec.number}.
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: isActive ? 700 : 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sec.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: "0.1rem",
                      }}
                    >
                      {sec.subsections.length} subtopics
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight
                      size={15}
                      color="#f59e0b"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chapter Content View */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem 2.25rem",
            overflowY: "auto",
            maxHeight: "calc(100vh - 220px)",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {/* Chapter Header */}
          <div
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.4rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "6px",
                }}
              >
                CHAPTER {activeSection.number}
              </span>
            </div>
            <h2
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 0.5rem 0",
              }}
            >
              {activeSection.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "0.92rem",
                color: "#94a3b8",
                lineHeight: "1.6",
              }}
            >
              {activeSection.summary}
            </p>
          </div>

          {/* Subsections */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {activeSection.subsections.map((sub, idx) => (
              <div
                key={sub.id || idx}
                style={{
                  background: "rgba(30, 41, 59, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Subsection Title */}
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#e2e8f0",
                    margin: 0,
                  }}
                >
                  {sub.title}
                </h3>

                {/* Prose Content */}
                {sub.content && (
                  <FormattedMarkdownText
                    text={sub.content}
                    accentColor="#f59e0b"
                    style={{ fontSize: "0.92rem" }}
                  />
                )}

                {/* Table (if any) */}
                {sub.table && (
                  <div
                    style={{
                      overflowX: "auto",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.84rem",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "rgba(0, 0, 0, 0.4)" }}>
                          {sub.table.headers.map((h, i) => (
                            <th
                              key={i}
                              style={{
                                padding: "0.7rem 1rem",
                                textAlign: "left",
                                color: "#f59e0b",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.1)",
                                fontWeight: 700,
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sub.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            style={{
                              borderBottom:
                                rIdx < sub.table.rows.length - 1
                                  ? "1px solid rgba(255, 255, 255, 0.05)"
                                  : "none",
                              background:
                                rIdx % 2 === 0
                                  ? "transparent"
                                  : "rgba(255, 255, 255, 0.02)",
                            }}
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                style={{
                                  padding: "0.65rem 1rem",
                                  color: cIdx === 0 ? "#f8fafc" : "#94a3b8",
                                  fontWeight: cIdx === 0 ? 600 : 400,
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Code Snippet 1 */}
                {sub.code && (
                  <SyntaxCodeBlock
                    code={sub.code}
                    label={`${sub.title} · JavaScript`}
                  />
                )}

                {/* Content After Code (if any) */}
                {sub.contentAfterCode && (
                  <FormattedMarkdownText
                    text={sub.contentAfterCode}
                    accentColor="#f59e0b"
                    style={{ fontSize: "0.92rem" }}
                  />
                )}

                {/* Code Snippet 2 (if any) */}
                {sub.code2 && (
                  <SyntaxCodeBlock
                    code={sub.code2}
                    label={`${sub.title} (Part 2) · JavaScript`}
                  />
                )}

                {/* Bullet Points (if any) */}
                {sub.bulletPoints && (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                    }}
                  >
                    {sub.bulletPoints.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        style={{
                          fontSize: "0.88rem",
                          color: "#cbd5e1",
                          lineHeight: "1.5",
                        }}
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Interactive Checklist (for Topic 17) */}
                {sub.checklist && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {sub.checklist.map((item) => {
                      const isDone = !!checkedItems[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            padding: "0.75rem 1rem",
                            background: isDone
                              ? "rgba(16, 185, 129, 0.1)"
                              : "rgba(0, 0, 0, 0.25)",
                            border: "1px solid",
                            borderColor: isDone
                              ? "rgba(16, 185, 129, 0.35)"
                              : "rgba(255, 255, 255, 0.06)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {isDone ? (
                            <CheckCircle2 size={18} color="#10b981" />
                          ) : (
                            <Circle size={18} color="#64748b" />
                          )}
                          <span
                            style={{
                              fontSize: "0.88rem",
                              color: isDone ? "#6ee7b7" : "#e2e8f0",
                              textDecoration: isDone ? "line-through" : "none",
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Interview Answer Callout */}
                {sub.interviewAnswer && (
                  <div
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      borderLeft: "4px solid #3b82f6",
                      borderRadius: "0 8px 8px 0",
                      padding: "0.85rem 1.1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#60a5fa",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <Lightbulb size={14} color="#60a5fa" />
                      Executive Interview Answer
                    </div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: "#e2e8f0",
                        lineHeight: "1.5",
                        fontStyle: "italic",
                      }}
                    >
                      "{sub.interviewAnswer}"
                    </div>
                  </div>
                )}

                {/* Warning / Tip Callout */}
                {sub.callout && (
                  <div
                    style={{
                      background:
                        sub.callout.type === "warning"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                      borderLeft: `4px solid ${sub.callout.type === "warning" ? "#ef4444" : "#f59e0b"}`,
                      borderRadius: "0 8px 8px 0",
                      padding: "0.85rem 1.1rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.6rem",
                    }}
                  >
                    <AlertTriangle
                      size={16}
                      color={
                        sub.callout.type === "warning" ? "#ef4444" : "#f59e0b"
                      }
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    <div
                      style={{
                        fontSize: "0.86rem",
                        color: "#e2e8f0",
                        lineHeight: "1.5",
                      }}
                    >
                      {sub.callout.text}
                    </div>
                  </div>
                )}

                {/* Informational Note */}
                {sub.note && (
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#94a3b8",
                      fontStyle: "italic",
                    }}
                  >
                    ℹ️ {sub.note}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Navigation Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {prevSection ? (
              <button
                onClick={() => setActiveSectionId(prevSection.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                <ArrowLeft size={16} />
                Prev: {prevSection.number}. {prevSection.title}
              </button>
            ) : (
              <div />
            )}

            {nextSection ? (
              <button
                onClick={() => setActiveSectionId(nextSection.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  borderRadius: "8px",
                  padding: "0.6rem 1.1rem",
                  color: "#f59e0b",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Next: {nextSection.number}. {nextSection.title}
                <ArrowRight size={16} />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
