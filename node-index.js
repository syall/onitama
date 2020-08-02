const rl = require('readline-sync');
const platform = require('./src/platform.js');

platform(() => rl.question('> '), (...args) => console.log(...args));
