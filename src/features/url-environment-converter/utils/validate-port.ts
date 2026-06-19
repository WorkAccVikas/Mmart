export const isValidPort = (port: number | string): boolean => {
  const n = Number(port);
  return Number.isInteger(n) && n > 0 && n <= 65535;
};
