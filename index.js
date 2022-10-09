const calculateTaxes = require('./src/taxes');
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin, 
  output: process.stdout,
  terminal: false
});

let operationsList = [];

function start() {
  calculateTaxes(operationsList);
  operationsList = [];
}

rl.on('line', (line) => {
  try {
    if (line.trim() == "") {
      start();
    } else {
      const operations = JSON.parse(line);
      operationsList.push(operations);
    }
  } catch (e) {
    console.log(e);
  }
});

rl.once('close', () => {
  start();
});