// gen_part3.cjs — Clean export of Part 3 (Components & Composition)
const { parts } = require('./build_batch_1_p3_p4.cjs');
const part3 = parts.find(p => p.id === 3);
module.exports = { part3, parts: [part3] };
