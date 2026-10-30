// gen_part7.cjs — Clean export of Part 7 (useEffect Deep-Dive)
const { parts } = require('./build_batch_1_p5_p6_p7.cjs');
const part7 = parts.find(p => p.id === 7);
module.exports = { part7, parts: [part7] };
