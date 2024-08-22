export const isEffectivelyZero = (value: string): boolean => {
  const num = parseFloat(value);
  return isNaN(num) || Math.abs(num) < 1e-8;
};
