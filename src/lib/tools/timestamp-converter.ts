export interface TimestampResult {
  input: string;
  utc: string;
  local: string;
  epochSeconds: number;
  iso8601: string;
}

export function convertTimestamp(value: string): TimestampResult {
  let date: Date;

  const asNumber = Number(value);
  if (!isNaN(asNumber) && value.trim() !== "") {
    // Treat values < 1e12 as seconds, otherwise as milliseconds
    date = asNumber < 1e12 ? new Date(asNumber * 1000) : new Date(asNumber);
  } else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) {
    throw new Error(`Cannot parse timestamp: "${value}"`);
  }

  return {
    input: value,
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    epochSeconds: Math.floor(date.getTime() / 1000),
    iso8601: date.toISOString(),
  };
}
