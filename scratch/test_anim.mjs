import { getAnimationForProblem } from '../src/dsa/utils/dsaAnimationGenerators.js';

const p3 = getAnimationForProblem(3);
console.log('Problem 3 (Sudoku):', p3.title, 'Total steps:', p3.steps.length);
console.log('Problem 3 step 0 has sudokuGrid?', !!p3.steps[0].sudokuGrid);

const p30 = getAnimationForProblem(30);
console.log('Problem 30 (Histogram):', p30.title, 'Total steps:', p30.steps.length);
console.log('Problem 30 step 0 has histogram?', !!p30.steps[0].histogram);

const p39 = getAnimationForProblem(39);
console.log('Problem 39 (Linked List):', p39.title, 'Total steps:', p39.steps.length);
console.log('Problem 39 step 0 has linkedList?', !!p39.steps[0].linkedList);

const p51 = getAnimationForProblem(51);
console.log('Problem 51 (Tree):', p51.title, 'Total steps:', p51.steps.length);
console.log('Problem 51 step 0 has treeVisual?', !!p51.steps[0].treeVisual);

const p85 = getAnimationForProblem(85);
console.log('Problem 85 (Graph Grid):', p85.title, 'Total steps:', p85.steps.length);
console.log('Problem 85 step 0 has graphGrid?', !!p85.steps[0].graphGrid);
