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
    const { operation: type, "unit-cost": cost, quantity } = operation;
    const formattedOperation = { type, cost, quantity };
    
    stocks.registerOperation(formattedOperation);
    
    return { tax: stocks.tax };
  });
};


module.exports = calculateTaxes;