export const useAmount = () => {
  return {
    formatAmount: (amount: number, decimals: number, maxDecimals = decimals) =>
      parseFloat(
        (amount / Math.pow(10, decimals)).toFixed(maxDecimals),
      ).toString(),

    parseAmount: (amount: number, decimals: number) =>
      Math.round(amount * Math.pow(10, decimals)),
  };
};
