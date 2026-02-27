export const useCopyToClipboard = () => {
  return {
    copyToClipboard: async (text: string) => {
      await navigator.clipboard.writeText(text);
    },
  };
};
