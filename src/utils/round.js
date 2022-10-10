function roundTwoDecimals(value) {
  return Number(Math.round(value + 'e2') + 'e-2');
}

module.exports = roundTwoDecimals;