let Stocks = require('../src/stocks');

const buyOperation = { type: "buy", cost: 10.00, quantity: 100 };

let stocks;
let operation;

describe('Stocks', () => {
  describe('buy', () => {
    beforeAll(() => {
      stocks = new Stocks();
      stocks.registerOperation(buyOperation);
    });

    it('sets correct quantity', () => {
      expect(stocks.quantity).toEqual(100);
    });

    it('calculates correct average', () => {
      expect(stocks.average).toEqual(10.00);
    });

    describe('when there are more operations with different costs', () => {
      it('recalculates average', () => {
        stocks.registerOperation({ ...buyOperation, cost: 20.00 });

        expect(stocks.quantity).toEqual(200);
        expect(stocks.average).toEqual(15.00);
      });
    });
  });

  describe('sell', () => {
    describe('when operations generates profit', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation(buyOperation);

        operation = { type: "sell", cost: 15.00, quantity: 50 };
        stocks.registerOperation(operation);
      });

      it('updates quantity', () => {
        expect(stocks.quantity).toEqual(50);
      });

      it('calculates correct profit', () => {
        expect(stocks.profit).toEqual(250);
        expect(stocks.loss).toEqual(0);
      });

      it('calculates correct tax', () => {
        expect(stocks.tax).toEqual(0);
      });

      describe('when there are more operations', () => {
        it('updates quantity and profit', () => {
          stocks.registerOperation({ ...operation, cost: 20.00 });

          expect(stocks.quantity).toEqual(0);
          expect(stocks.profit).toEqual(500);
        });
      });
    });

    describe('when operations generates loss', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation(buyOperation);

        operation = { type: "sell", cost: 5.00, quantity: 50 };
        stocks.registerOperation(operation);
      });

      it('updates quantity', () => {
        expect(stocks.quantity).toEqual(50);
      });

      it('calculates correct loss', () => {
        expect(stocks.profit).toEqual(0);
        expect(stocks.loss).toEqual(250);
      });

      it('calculates correct tax', () => {
        expect(stocks.tax).toEqual(0);
      });

      describe('when next operations generates profit', () => {
        it('deduces loss from profit', () => {
          stocks.registerOperation({ ...operation, cost: 20.00 });

          expect(stocks.quantity).toEqual(0);
          expect(stocks.loss).toEqual(0);
          expect(stocks.profit).toEqual(250);
        });
      });
    });

    describe('when it needs two operations to deduce all loss', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation(buyOperation);

        operation = { type: "sell", cost: 5.00, quantity: 40 };
        stocks.registerOperation(operation);
      });

      it('updates quantity', () => {
        expect(stocks.quantity).toEqual(60);
      });

      it('calculates correct loss', () => {
        expect(stocks.profit).toEqual(0);
        expect(stocks.loss).toEqual(200);
      });

      it('calculates correct tax', () => {
        expect(stocks.tax).toEqual(0);
      });

      describe('first deduction', () => {
        it('deduces loss from profit', () => {
          stocks.registerOperation({ type: "sell", cost: 15.00, quantity: 30 });

          expect(stocks.quantity).toEqual(30);
          expect(stocks.loss).toEqual(50);
          expect(stocks.profit).toEqual(0);
        });
      });

      describe('second deduction', () => {
        it('deduces loss from profit', () => {
          stocks.registerOperation({ type: "sell", cost: 15.00, quantity: 30 });

          expect(stocks.quantity).toEqual(0);
          expect(stocks.loss).toEqual(0);
          expect(stocks.profit).toEqual(100);
        });
      });
    });

    describe('when operations generates taxes', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation({ type: "buy", cost: 10.00, quantity: 10000 });
        stocks.registerOperation({ type: "sell", cost: 20.00, quantity: 5000 });
      });

      it('calculates correct profit', () => {
        expect(stocks.profit).toEqual(50000);
        expect(stocks.loss).toEqual(0);
      });

      it('calculates correct tax', () => {
        expect(stocks.tax).toEqual("10000.00");
      });
    });
  });

  describe('invalid operation', () => {
    beforeAll(() => {
      stocks = new Stocks();
      stocks.registerOperation({ type: "whatever", cost: 10.00, quantity: 100 });
    });

    it('does nothing', () => {
      expect(stocks.quantity).toEqual(0);
      expect(stocks.profit).toEqual(0);
      expect(stocks.loss).toEqual(0);
    });
  });
});
