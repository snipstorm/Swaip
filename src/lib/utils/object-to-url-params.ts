export const objectToUrlParams = (
  obj: Record<string, string | number>,
): string => {
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};
