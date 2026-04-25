import cronstrue from "cronstrue";

export function explainCron(schedule: string): string {
  const human = cronstrue.toString(schedule, { throwExceptionOnParseError: true });
  return `Schedule: ${schedule}\nHuman-readable: ${human}`;
}
