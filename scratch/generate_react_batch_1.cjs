// generate_react_batch_1.cjs — Clean export of Batch 1 (Parts 1 to 7)
const { parts: p1_p2 } = require('./build_batch_1_p1_p2.cjs');
const { parts: p3_p4 } = require('./build_batch_1_p3_p4.cjs');
const { parts: p5_p6_p7 } = require('./build_batch_1_p5_p6_p7.cjs');

const allBatch1Parts = [...p1_p2, ...p3_p4, ...p5_p6_p7];

module.exports = { parts: allBatch1Parts };
