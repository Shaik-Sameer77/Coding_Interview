const fs = require('fs');
const path = require('path');
const metadata = require('./build_screening_metadata.cjs');

console.log('Starting compilation of enhanced Screening Question Bank (100 Questions with Clear Picture Standard)...');

// Helper to format full markdown explanation
function buildClearPictureMarkdown({
  interviewerMindset,
  whatToReadFirst,
  stepByStepFlow,
  practicalSteps,
  productionTable,
  followUps,
  screeningTakeaway
}) {
  let md = '';

  if (interviewerMindset) {
    md += `## 1. Interviewer Expectation & Mindset\n${interviewerMindset}\n\n`;
  }

  if (whatToReadFirst && whatToReadFirst.length > 0) {
    md += `## 2. What Should You Read / Inspect Before Implementing?\n\nWhen entering an existing codebase, do not start coding immediately. Inspect these 5 critical architectural layers first:\n\n`;
    whatToReadFirst.forEach((item, idx) => {
      md += `${idx + 1}. **${item.layer}**\n${item.description}\n*Example/Inspection*: \`${item.example}\`\n\n`;
    });
  }

  if (stepByStepFlow && stepByStepFlow.length > 0) {
    md += `## 3. How the Operation Works Internally (Step-by-Step Flow)\n\n`;
    stepByStepFlow.forEach((step, idx) => {
      md += `${idx + 1}. **${step.title}**\n${step.detail}\n\n`;
    });
  }

  if (practicalSteps && practicalSteps.length > 0) {
    md += `## 4. Practical Implementation using React + NestJS + TypeORM + SQL\n\n`;
    practicalSteps.forEach((step) => {
      md += `### ${step.stepTitle}\n\n${step.explanation}\n\n`;
      if (step.code) {
        md += `\`\`\`${step.lang || 'javascript'}\n${step.code}\n\`\`\`\n\n`;
      }
      if (step.callout) {
        md += `> [!NOTE]\n> ${step.callout}\n\n`;
      }
    });
  }

  if (productionTable && productionTable.length > 0) {
    md += `## 5. What Makes this Production-Ready?\n\n| Concern | What I Would Implement in Production | Architectural Defense |\n| :--- | :--- | :--- |\n`;
    productionTable.forEach(row => {
      md += `| **${row.concern}** | ${row.implementation} | ${row.defense} |\n`;
    });
    md += `\n`;
  }

  if (followUps && followUps.length > 0) {
    md += `## 6. Follow-Up Questions They Might Ask & Exact Senior Answers\n\n`;
    followUps.forEach((f, idx) => {
      md += `**Q${idx + 1}. ${f.q}**\n\n*Spoken Answer*: "${f.a}"\n\n`;
    });
  }

  if (screeningTakeaway) {
    md += `## 7. What You Should Remember for the Screening\n\n${screeningTakeaway}\n`;
  }

  return md.trim();
}

// 10 Section Definitions
const SECTIONS = [
  { id: 1, title: "Section 1 — End-to-End Feature Development", range: "Q1–Q10", count: 10, color: "#38bdf8" },
  { id: 2, title: "Section 2 — Frontend, React & UI Decisions", range: "Q11–Q20", count: 10, color: "#818cf8" },
  { id: 3, title: "Section 3 — React & Next.js Technical Decisions", range: "Q21–Q30", count: 10, color: "#60a5fa" },
  { id: 4, title: "Section 4 — Backend & REST APIs", range: "Q31–Q40", count: 10, color: "#34d399" },
  { id: 5, title: "Section 5 — Database, ORM & Performance", range: "Q41–Q50", count: 10, color: "#fbbf24" },
  { id: 6, title: "Section 6 — Authentication, Security & Payments", range: "Q51–Q60", count: 10, color: "#f87171" },
  { id: 7, title: "Section 7 — Project Troubleshooting Stories", range: "Q61–Q70", count: 10, color: "#ec4899" },
  { id: 8, title: "Section 8 — Testing & Quality Assurance", range: "Q71–Q80", count: 10, color: "#10b981" },
  { id: 9, title: "Section 9 — Git, CI/CD, Deployment & AWS", range: "Q81–Q90", count: 10, color: "#f97316" },
  { id: 10, title: "Section 10 — Architecture, Scenarios & Leadership", range: "Q91–Q100", count: 10, color: "#a855f7" }
];

module.exports = {
  buildClearPictureMarkdown,
  SECTIONS
};
console.log('Loaded buildClearPictureMarkdown helper successfully.');
