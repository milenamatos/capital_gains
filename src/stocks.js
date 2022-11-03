const OPERATIONS = require('./operations');
const roundTwoDecimals = require('./utils/round');

let Stocks = class {
  constructor() {
    this.quantity = {};
    this.average = {};
    this.loss = 0;
    this.profit = 0;
    this.currentOperation = {};
    this.operationsType = OPERATIONS;
    this.tax = 0;
  }

  buy() {
    this.calculateNewAverage();

    const { ticker, quantity } = this.currentOperation;
    this.quantity[ticker] += quantity;
  }

  sell() {
    const { quantity, ticker } = this.currentOperation;

    if (this.hasProfit()) {
      this.calculateProfit();
    }
    else {
      this.calculateLoss();
    }

    if (this.loss > 0 && this.profit > 0) {
      this.deduceProfit();
    }

    this.quantity[ticker] -= quantity;
  }

  hasProfit() {
    const { ticker } = this.currentOperation;
     
    return this.currentOperation.cost > this.average[ticker];
  }

  totalAmount() {
    const { cost, quantity } = this.currentOperation;

    return roundTwoDecimals(quantity * cost);
  }

  calculateNewAverage() {
    const { quantity, ticker } = this.currentOperation;
    
    const tickerAverage = this.average[ticker];
    const quantityAverage = this.quantity[ticker];

    const newAverage = ((quantityAverage * tickerAverage) + this.totalAmount()) / (quantityAverage + quantity);

    this.average[ticker] = roundTwoDecimals(newAverage)
  }

  currentOperationResult() {
    const { cost, quantity, ticker } = this.currentOperation;
    const amount = Math.abs(cost - this.average[ticker]) * quantity;
    
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
    const { type, ticker } = operation;
   
    if (!this.quantity[ticker]) {
      this.quantity[ticker] = 0;
    }

    if (!this.average[ticker]) {
      this.average[ticker] = 0;
    }

    if (this.operationsType[type] === this.operationsType.sell) {
      this.sell();
      this.calculateTax();
    } else if (this.operationsType[type] === this.operationsType.buy) {
      this.buy();
    }
  }
}

module.exports = Stocks;