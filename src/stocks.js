const OPERATIONS = require('./operations');

let Stocks = class {
  constructor() {
    this.quantity = 0;
    this.average = 0;
    this.loss = 0;
    this.profit = 0;
    this.currentOperation = {};
    this.operations = OPERATIONS;
    this.tax = 0;
  }

  buy() {
    this.calculateNewAverage();
    this.quantity += this.currentOperation.quantity;
  }

  sell() {
    const { cost, quantity } = this.currentOperation;

    if (cost < this.average) {
      this.calculateLoss();
    } 
    else {
      this.calculateProfit();
    }   

    if (this.loss > 0 && this.profit > 0) {
      this.deduceProfit();
    }

    this.quantity -= quantity;
  }

  calculateNewAverage() {
    const { cost, quantity } = this.currentOperation;

    this.average = ((this.quantity * this.average) + (quantity * cost)) / (this.quantity + quantity);
  }

  calculateLoss() {
    const { cost, quantity } = this.currentOperation;

    this.loss += (this.average - cost) * quantity;
    this.profit = 0;
  }

  calculateProfit() {
    const { cost, quantity } = this.currentOperation;

    this.profit = (cost - this.average) * quantity;
  }

  calculateTax() {
    const taxPercentange = 0.2;
    const maxProfit = 20000;

    const { cost, quantity } = this.currentOperation;
    const totalAmount = cost * quantity;

    if (totalAmount > maxProfit && cost > this.average) {
      this.tax = (this.profit * taxPercentange).toFixed(2);
    }
  }

  deduceProfit() {
    const higherProfit = this.profit >= this.loss;
    const amountToDeduce = higherProfit ? this.loss : this.loss - this.profit;
    this.profit -= amountToDeduce;
    this.loss -= amountToDeduce;
  }

  registerOperation(operation) {
    this.tax = 0;
    this.currentOperation = operation;
    const { type } = operation;
    
    if (this.operations[type] === this.operations.sell) {
      this.sell();
      this.calculateTax();
    } else if (this.operations[type] === this.operations.buy) {
      this.buy();
    }
  }
}

module.exports = Stocks;