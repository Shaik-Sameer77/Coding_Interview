// gen_part2.cjs — Clean export of Part 2 (JSX & Rendering Fundamentals)
const { parts } = require('./build_batch_1_p1_p2.cjs');
const part2 = parts.find(p => p.id === 2);
module.exports = { part2, parts: [part2] };
