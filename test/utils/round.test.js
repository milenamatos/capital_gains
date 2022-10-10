import roundTwoDecimals from '../../src/utils/round';

describe('Round', () => {
  describe('roundTwoDecimals', () => {
    it('should round number up ', () => {
      expect(roundTwoDecimals(10.66667)).toBe(10.67);
    });

    it('should round number down ', () => {
      expect(roundTwoDecimals(5.41223)).toBe(5.41);
    });
  });
});
