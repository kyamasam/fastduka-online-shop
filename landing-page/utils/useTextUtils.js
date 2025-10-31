export const normalizeText = (text) => {
  if (!text) return "";
  // Replace \r\n with \n and normalize whitespace
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
};
