import OPERATIONS from '../src/operations';

describe('Operations', () => {
  describe('buy', () => {
    it('maps correct buy string', () => {
      expect(OPERATIONS.buy).toBe('buy');
    });
  });

  describe('sell', () => {
    it('maps correct sell string', () => {
      expect(OPERATIONS.sell).toBe('sell');
    });
  });

  describe('invalid', () => {
    it('maps correct invalid value', () => {
      expect(OPERATIONS.invalid).toBeFalsy();
    });
  });
});
