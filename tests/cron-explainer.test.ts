import { describe, it, expect } from "vitest";
import { explainCron } from "../src/lib/tools/cron-explainer.js";

describe("explainCron", () => {
  describe("valid cron expressions", () => {
    it("explains '* * * * *' as every minute", () => {
      const result = explainCron("* * * * *");
      expect(result).toContain("Schedule: * * * * *");
      expect(result.toLowerCase()).toContain("every minute");
    });

    it("explains '0 9 * * 1-5' as weekday morning", () => {
      const result = explainCron("0 9 * * 1-5");
      expect(result).toContain("Schedule: 0 9 * * 1-5");
      expect(result.toLowerCase()).toContain("9");
    });

    it("explains '0 0 * * *' as daily at midnight", () => {
      const result = explainCron("0 0 * * *");
      expect(result.toLowerCase()).toContain("12:00 am");
    });

    it("explains '0 0 1 * *' as monthly on day 1", () => {
      const result = explainCron("0 0 1 * *");
      // cronstrue outputs 'on day 1 of the month'
      expect(result.toLowerCase()).toContain("day 1");
    });

    it("explains '*/15 * * * *' as every 15 minutes", () => {
      const result = explainCron("*/15 * * * *");
      expect(result.toLowerCase()).toContain("15 minutes");
    });

    it("explains '0 12 * * SUN' as noon on Sunday", () => {
      const result = explainCron("0 12 * * SUN");
      expect(result.toLowerCase()).toContain("sunday");
    });

    it("returns a string containing newline with two sections", () => {
      const result = explainCron("* * * * *");
      expect(result).toContain("\n");
      const [scheduleLine, humanLine] = result.split("\n");
      expect(scheduleLine).toMatch(/^Schedule:/);
      expect(humanLine).toMatch(/^Human-readable:/);
    });

    it("includes the original schedule in the output", () => {
      const schedule = "30 8 * * 1";
      const result = explainCron(schedule);
      expect(result).toContain(schedule);
    });
  });

  describe("invalid cron expressions", () => {
    it("throws for an empty string", () => {
      expect(() => explainCron("")).toThrow();
    });

    it("throws for a string with too few fields", () => {
      expect(() => explainCron("* * *")).toThrow();
    });

    it("throws for invalid minute values", () => {
      expect(() => explainCron("99 * * * *")).toThrow();
    });

    it("throws for invalid hour values", () => {
      expect(() => explainCron("* 25 * * *")).toThrow();
    });

    it("throws for a gibberish string", () => {
      expect(() => explainCron("not-a-cron")).toThrow();
    });
  });
});
