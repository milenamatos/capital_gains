const OPERATIONS = require('./operations');
const roundTwoDecimals = require('./utils/round');

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
    const { quantity } = this.currentOperation;

    if (this.hasProfit()) {
      this.calculateProfit();
    }
    else {
      this.calculateLoss();
    }

    if (this.loss > 0 && this.profit > 0) {
      this.deduceProfit();
    }

    this.quantity -= quantity;
  }

  hasProfit() {
    return this.currentOperation.cost > this.average;
  }

  totalAmount() {
    const { cost, quantity } = this.currentOperation;

    return roundTwoDecimals(quantity * cost);
  }

  calculateNewAverage() {
    const { quantity } = this.currentOperation;

    const newAverage = ((this.quantity * this.average) + this.totalAmount()) / (this.quantity + quantity);

    this.average = roundTwoDecimals(newAverage)
  }

  currentOperationResult() {
    const { cost, quantity } = this.currentOperation;
    const amount = Math.abs(cost - this.average) * quantity;
    
    return roundTwoDecimals(amount);
  }

  calculateLoss() {
    this.loss += this.currentOperationResult();
    this.profit = 0;
  }

  calculateProfit() {
    this.profit = this.currentOperationResult();
  }

  calculateTax() {
    const taxPercentange = 0.2;
    const maxProfit = 20000;

    if (this.totalAmount() > maxProfit && this.hasProfit()) {
      this.tax = roundTwoDecimals(this.profit * taxPercentange);
    }
  }

  deduceProfit() {
    const higherProfit = this.profit >= this.loss;
    const amountToDeduce = higherProfit ? this.loss : this.profit;
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