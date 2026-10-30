// gen_part5.cjs — Clean export of Part 5 (Events & Forms)
const { parts } = require('./build_batch_1_p5_p6_p7.cjs');
const part5 = parts.find(p => p.id === 5);
module.exports = { part5, parts: [part5] };
