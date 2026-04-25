export function baseConverter(value: string, from: number, to: number): string {
  if (from < 2 || from > 36 || to < 2 || to > 36) {
    throw new Error("Base must be between 2 and 36");
  }
  const decimal = parseInt(value, from);
  if (isNaN(decimal)) {
    throw new Error(`Invalid value "${value}" for base ${from}`);
  }
  return decimal.toString(to).toUpperCase();
}
