'use strict';

let a = 5;
let b = 6;
let c = 7;
let d = 8;

const MAX = 14;

let x = (r1, r2) => {
  return r1 + r2 <= MAX;
};

console.log(x(a, b));
console.log(x(b, c));
console.log(x(c, d));