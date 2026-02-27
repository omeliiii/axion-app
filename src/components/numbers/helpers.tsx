export const getLang = () => {
  if (navigator.languages != undefined) return navigator.languages[0];
  return navigator.language;
};

export const whatDecimalSeparator = () => {
  const n = 1.1;
  const s = n.toLocaleString().substring(1, 2);
  return s;
};
