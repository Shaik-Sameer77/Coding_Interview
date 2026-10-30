// gen_part4.cjs — Clean export of Part 4 (State & Rendering)
const { parts } = require('./build_batch_1_p3_p4.cjs');
const part4 = parts.find(p => p.id === 4);
module.exports = { part4, parts: [part4] };
