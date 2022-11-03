let Stocks = require('./stocks');

function calculateTaxes(operationsList) {
  operationsList.forEach((operations) => {
    const taxes = calculate(operations);
    const stringResult = JSON.stringify(taxes);
    console.log(stringResult);
  });
};

function calculate(operations) {
  let stocks = new Stocks();

  return operations.map((operation) => {
    const { operation: type, "unit-cost": cost, quantity, ticker } = operation;
    const formattedOperation = { type, cost, quantity, ticker };

    stocks.registerOperation(formattedOperation);

    return { tax: stocks.tax.toFixed(2) };
  });
};

module.exports = {
  calculateTaxes,
  calculate,
};