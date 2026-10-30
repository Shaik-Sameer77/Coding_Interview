// Source Code Registry for all 100 Senior Machine Coding Problems
// Dynamically extracts the exact production implementation and architecture
// doc block for each problem from the corresponding category source file.

const rawCategoryFiles = import.meta.glob('../demos/category*.jsx', { 
  query: '?raw', 
  import: 'default', 
  eager: true 
});

const CATEGORY_FILE_MAP = {
  overlays: '../demos/category1_overlays.jsx',
  forms: '../demos/category2_forms.jsx',
  enterprise: '../demos/category3_enterprise.jsx',
  tables: '../demos/category4_grids_tables.jsx',
  systems: '../demos/category5_systems_visuals.jsx',
  hooks: '../demos/category6_custom_hooks.jsx',
  polyfills: '../demos/category7_polyfills_utils.jsx',
  async: '../demos/category8_async_network.jsx',
  media: '../demos/category9_media_mini_apps.jsx',
  security: '../demos/category10_security_perf.jsx'
};

export function getProblemSourceCode(category, id) {
  const filePath = CATEGORY_FILE_MAP[category];
  const fileContent = rawCategoryFiles[filePath];

  if (!fileContent) {
    return `// Source file not loaded for category: ${category}`;
  }

  const marker = `PROBLEM #${id}:`;
  const idx = fileContent.indexOf(marker);
  if (idx === -1) {
    return `// Code block for Problem #${id} not found in ${filePath}`;
  }

  // Find the preceding JSDoc comment start '/**'
  const startComment = fileContent.lastIndexOf('/**', idx);
  const start = startComment !== -1 ? startComment : idx;

  // Find the next problem's start marker or end of file
  const afterStart = fileContent.slice(idx + marker.length);
  const nextProblemMatch = afterStart.search(/(\/\*\*[\s\S]*?PROBLEM\s*#\d+:|\/\*\*\s*\n\s*\*\s*====)/);

  if (nextProblemMatch === -1) {
    return fileContent.slice(start).trim();
  }

  return fileContent.slice(start, idx + marker.length + nextProblemMatch).trim();
}

export function getCategorySourceFileName(category) {
  return CATEGORY_FILE_MAP[category]?.replace('../demos/', '') || 'unknown.jsx';
}
