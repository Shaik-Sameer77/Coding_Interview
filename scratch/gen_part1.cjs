// gen_part1.cjs — Clean export of Part 1 (React Foundations & Architecture)
const { parts } = require('./build_batch_1_p1_p2.cjs');
const part1 = parts.find(p => p.id === 1);
module.exports = { part1, parts: [part1] };
