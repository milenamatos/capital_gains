import { calculateTaxes, calculate } from '../src/taxes';

const operations = [[
  {"operation":"buy", "unit-cost":10, "quantity": 10000, "ticker":"AAPL"},
  {"operation":"buy", "unit-cost":15, "quantity": 10000, "ticker":"MANU"},
  {"operation":"sell", "unit-cost":30, "quantity": 10000, "ticker":"MANU"},
  {"operation":"sell", "unit-cost":5, "quantity": 10000, "ticker":"AAPL"}
]];

const result = [{"tax": "0.00"}, {"tax": "0.00"}, {"tax":"30000.00"}, {"tax":"0.00"}];

describe('Taxes', () => {
  describe('calculateTaxes', () => {
    console.log = jest.fn();

    it('logs correct result', () => {
      calculateTaxes(operations);

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenNthCalledWith(1, JSON.stringify(result));
    });
  });

  describe('calculate', () => {
    it('returns correct tax', () => {
      expect(calculate(operations[0])).toEqual(result);
    });
  });
});
