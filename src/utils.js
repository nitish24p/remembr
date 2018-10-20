export const getFontSize = (level) => {
  const suffix = 'px';
  let size;
  if (level <=2) {
    size = 12;
  }
  else if (level < 4) {
    size = 8;
  }
  else {
    size = 7;
  }

  return size + suffix;
};