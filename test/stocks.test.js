let Stocks = require('../src/stocks');

const buyOperation = { type: "buy", cost: 10.00, quantity: 100, ticker: "TESTE" };

let stocks;
let operation;

describe('Stocks', () => {
  describe('buy', () => {
    beforeAll(() => {
      stocks = new Stocks();
      stocks.registerOperation(buyOperation);
    });

    it('sets correct quantity', () => {
      expect(stocks.quantity).toEqual({
        "TESTE": 100
      });
    });

    it('calculates correct average', () => {
      expect(stocks.average).toEqual({
        "TESTE": 10.00
      });
    });

    describe('when there are more operations with different costs', () => {
      it('recalculates average', () => {
        stocks.registerOperation({ ...buyOperation, cost: 20.00, ticker: "TESTE" });

        expect(stocks.average).toEqual({
          "TESTE": 15.00
        });
        expect(stocks.quantity).toEqual({
          "TESTE": 200
        });
      });
    });

    describe('when there are more operations with different tickers', () => {
      beforeAll(() => {
        stocks.registerOperation({ type: "buy", ticker: "NOVO", cost: 15.00, quantity: 100 });
      })

      it('sets correct quantity', () => {
        expect(stocks.quantity).toEqual({
          "TESTE": 200,
          "NOVO": 100
        });
      });
  
      it('calculates correct average', () => {
        expect(stocks.average).toEqual({
          "TESTE": 15.00,
          "NOVO": 15.00
        });
      });

      describe('when there are more operations with different costs', () => {
        it('recalculates average', () => {
          stocks.registerOperation({ ...buyOperation, cost: 20.00, ticker: "NOVO" });
  
          expect(stocks.average).toEqual({
            "TESTE": 15.00,
            "NOVO": 17.50
          });
          expect(stocks.quantity).toEqual({
            "TESTE": 200,
            "NOVO": 200
          });
        });
      });
    });
  });

  describe('sell', () => {
    describe('when operations generates profit', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation(buyOperation);

        operation = { type: "sell", cost: 15.00, quantity: 50, ticker: "TESTE" };
        stocks.registerOperation(operation);
      });

      it('updates quantity', () => {
        expect(stocks.quantity).toEqual({
          "TESTE": 50
        });
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
          stocks.registerOperation({ ...operation, cost: 20.00, ticker: "TESTE" });

          expect(stocks.quantity).toEqual({
            "TESTE": 0
          });
          expect(stocks.profit).toEqual(500);
        });
      });

      describe('when there are more operations with different tickers', () => {
        beforeAll(() => {
          stocks.registerOperation({ ...buyOperation, cost: 10.00, ticker: "NOVO" });
          stocks.registerOperation({ type: "sell", ticker: "NOVO", cost: 15.00, quantity: 100 });
        })
  
        it('sets correct quantity', () => {
          expect(stocks.quantity).toEqual({
            "TESTE": 0,
            "NOVO": 0
          });
        });
    
        it('calculates correct average', () => {
          expect(stocks.average).toEqual({
            "TESTE": 10.00,
            "NOVO": 10.00
          });
        });

        it('calculates correct profit', () => {
          expect(stocks.profit).toEqual(500);
          expect(stocks.loss).toEqual(0);
        });
      });
    });

    describe('when operations generates loss', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation(buyOperation);

        operation = { type: "sell", cost: 5.00, quantity: 50, ticker: "TESTE" };
        stocks.registerOperation(operation);
      });

      it('updates quantity', () => {
        expect(stocks.quantity).toEqual({
          "TESTE": 50
        });
      });

      it('calculates correct loss', () => {
        expect(stocks.profit).toEqual(0);
        expect(stocks.loss).toEqual(250);
      });

      it('calculates correct tax', () => {
        expect(stocks.tax).toEqual(0);
      });

      describe('when next operation generates loss', () => {
        it('recalculates loss and profit', () => {
          stocks.registerOperation({ ...operation, cost: 5.00, ticker: "TESTE" });

          expect(stocks.quantity).toEqual({
            "TESTE": 0
          });
          expect(stocks.loss).toEqual(500);
          expect(stocks.profit).toEqual(0);
        });
      });

      describe('when operation with different ticker generates loss', () => {
        beforeAll(() => {
          stocks.registerOperation({ ...buyOperation, ticker: "NOVO" });
          stocks.registerOperation({ type: "sell", ticker: "NOVO", cost: 5.00, quantity: 40 });
        });

        it('updates quantity', () => {
          expect(stocks.quantity).toEqual({
            "TESTE": 0,
            "NOVO": 60,
          });
        });
  
        it('calculates correct loss', () => {
          expect(stocks.profit).toEqual(0);
          expect(stocks.loss).toEqual(700);
        });
  
        it('calculates correct tax', () => {
          expect(stocks.tax).toEqual(0);
        });
      });
    });

    describe('when it needs two operations to deduce all loss', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation(buyOperation);

        operation = { type: "sell", cost: 5.00, quantity: 40, ticker: "TESTE" };
        stocks.registerOperation(operation);
      });

      it('updates quantity', () => {
        expect(stocks.quantity).toEqual({
          "TESTE": 60
        });
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
          stocks.registerOperation({ type: "sell", cost: 15.00, quantity: 30, ticker: "TESTE" });

          expect(stocks.quantity).toEqual({
            "TESTE": 30
          });
          expect(stocks.loss).toEqual(50);
          expect(stocks.profit).toEqual(0);
        });
      });

      describe('second deduction', () => {
        it('deduces loss from profit', () => {
          stocks.registerOperation({ type: "sell", cost: 15.00, quantity: 30, ticker: "TESTE" });

          expect(stocks.quantity).toEqual({
            "TESTE": 0
          });
          expect(stocks.loss).toEqual(0);
          expect(stocks.profit).toEqual(100);
        });
      });
    });

    describe('when operations generates taxes', () => {
      beforeAll(() => {
        stocks = new Stocks();
        stocks.registerOperation({ type: "buy", cost: 10.00, quantity: 10000, ticker: "TESTE" });
        stocks.registerOperation({ type: "sell", cost: 20.00, quantity: 5000, ticker: "TESTE" });
      });

      it('calculates correct profit', () => {
        expect(stocks.profit).toEqual(50000);
        expect(stocks.loss).toEqual(0);
      });

      it('calculates correct tax', () => {
        expect(stocks.tax).toEqual(10000);
      });

      describe('when next operation is different ticker', () => {
        beforeAll(() => {
          stocks.registerOperation({ type: "buy", cost: 15.00, quantity: 10000, ticker: "NOVO" });
          stocks.registerOperation({ type: "sell", cost: 30.00, quantity: 10000, ticker: "NOVO" });
        });

        it('calculates correct profit', () => {
          expect(stocks.profit).toEqual(150000);
          expect(stocks.loss).toEqual(0);
        });
  
        it('calculates correct tax', () => {
          expect(stocks.tax).toEqual(30000);
        });
      })
    });
  });

  describe('invalid operation', () => {
    beforeAll(() => {
      stocks = new Stocks();
      stocks.registerOperation({ type: "whatever", cost: 10.00, quantity: 100, ticker: "TESTE" });
    });

    it('does nothing', () => {
      expect(stocks.quantity).toEqual({
        "TESTE": 0
      });
      expect(stocks.profit).toEqual(0);
      expect(stocks.loss).toEqual(0);
    });
  });
});
