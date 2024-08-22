export const shortenTokenAddress = (
  address: string,
  startLength = 5,
  endLength = 5,
): string => {
  if (address.length <= startLength + endLength) {
    return address;
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
};
