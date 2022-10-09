import { calculateTaxes, calculate } from '../src/taxes';

const operations = [[
  { "operation": "buy", "unit-cost": 10.00, "quantity": 100 },
  { "operation": "sell", "unit-cost": 15.00, "quantity": 50 },
  { "operation": "sell", "unit-cost": 15.00, "quantity": 50 }
]];

const result = [{ "tax": 0 }, { "tax": 0 }, { "tax": 0 }];

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
