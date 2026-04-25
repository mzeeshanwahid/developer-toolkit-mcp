#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { base64EncodeDecode } from "./lib/tools/base64.js";
import { urlEncodeDecode } from "./lib/tools/url-encoder.js";
import { baseConverter } from "./lib/tools/base-converter.js";
import { diffJson } from "./lib/tools/json-diff.js";
import { diffText } from "./lib/tools/text-diff.js";
import { decodeJwt } from "./lib/tools/jwt-decoder.js";
import { verifyJwt } from "./lib/tools/jwt-verifier.js";
import { generateHash } from "./lib/tools/hash-generator.js";
import { generateId } from "./lib/tools/uuid-generator.js";
import { convertTimestamp } from "./lib/tools/timestamp-converter.js";
import { testRegex } from "./lib/tools/regex-tester.js";
import { explainCron } from "./lib/tools/cron-explainer.js";

const server = new McpServer({
  name: "developer-toolkit-mcp",
  description: "A collection of developer tools for encoding, decoding, diffing, and more. Use this MCP to perform common data transformations and comparisons reliably within your LLM workflows.",
  websiteUrl: "https://www.developertoolkit.dev",
  icons: [
    {
      src: "https://www.developertoolkit.dev/assets/images/logo.png",
      mimeType: "image/png",
    }
  ],
  version: "1.0.0",
  title: "Developer Toolkit MCP",
});

// ── Encoding & Decoding ────────────────────────────────────────────────────

server.tool(
  "base64_encode_decode",
  "Encode a string to Base64 or decode a Base64 string back to plain text. Reliable for long tokens and binary data in pipelines.",
  { data: z.string().describe("The string to encode or decode"), mode: z.enum(["encode", "decode"]) },
  async ({ data, mode }) => {
    try {
      return { content: [{ type: "text", text: base64EncodeDecode(data, mode) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

server.tool(
  "url_encode_decode",
  "Percent-encode a string for safe use in a URL, or decode a percent-encoded string. Handles special characters, Unicode, and reserved URL characters correctly.",
  { data: z.string().describe("The string to encode or decode"), mode: z.enum(["encode", "decode"]) },
  async ({ data, mode }) => {
    try {
      return { content: [{ type: "text", text: urlEncodeDecode(data, mode) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

server.tool(
  "base_converter",
  "Convert a number between any two bases (2–36). Use this for binary/hex/octal conversions where LLM arithmetic errors are a risk.",
  {
    value: z.string().describe("The number to convert, as a string in the source base"),
    from: z.number().int().min(2).max(36).describe("Source base (e.g. 10 for decimal, 16 for hex)"),
    to: z.number().int().min(2).max(36).describe("Target base (e.g. 2 for binary, 16 for hex)"),
  },
  async ({ value, from, to }) => {
    try {
      return { content: [{ type: "text", text: baseConverter(value, from, to) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

// ── JSON & Text ────────────────────────────────────────────────────────────

server.tool(
  "diff_json",
  "Compare two JSON strings and return a unified diff of their pretty-printed representations. Useful for comparing API responses, config files, and test fixtures.",
  {
    oldJson: z.string().describe("The original JSON string"),
    newJson: z.string().describe("The updated JSON string"),
  },
  async ({ oldJson, newJson }) => {
    try {
      return { content: [{ type: "text", text: diffJson(oldJson, newJson) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

server.tool(
  "diff_text",
  "Produce a unified diff between two plain-text strings. Use this for comparing file contents, code outputs, or log snippets in review workflows.",
  {
    oldText: z.string().describe("The original text"),
    newText: z.string().describe("The updated text"),
  },
  async ({ oldText, newText }) => {
    try {
      return { content: [{ type: "text", text: diffText(oldText, newText) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

// ── Security & Tokens ──────────────────────────────────────────────────────

server.tool(
  "decode_jwt",
  "Decode a JWT without verifying its signature. Returns the header, payload claims, and a human-readable expiry status.",
  { token: z.string().describe("The raw JWT string (three dot-separated base64url segments)") },
  async ({ token }) => {
    try {
      const result = decodeJwt(token);
      const text = [
        "=== Header ===",
        JSON.stringify(result.header, null, 2),
        "",
        "=== Payload ===",
        JSON.stringify(result.payload, null, 2),
        "",
        "=== Expiry ===",
        result.expiry,
      ].join("\n");
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

server.tool(
  "verify_jwt",
  "Verify a JWT's HMAC signature using the provided secret and return the decoded payload if valid. Use this to confirm a token hasn't been tampered with.",
  {
    token: z.string().describe("The raw JWT string to verify"),
    secret: z.string().describe("The HMAC secret used to sign the token"),
  },
  async ({ token, secret }) => {
    try {
      const payload = verifyJwt(token, secret);
      return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

server.tool(
  "generate_hash",
  "Hash a string with MD5, SHA-256, or SHA-512 and return the hex digest. Use this for checksums, content fingerprinting, or verifying data integrity.",
  {
    data: z.string().describe("The input string to hash"),
    algorithm: z.enum(["md5", "sha256", "sha512"]).describe("Hashing algorithm to use"),
  },
  async ({ data, algorithm }) => {
    try {
      return { content: [{ type: "text", text: generateHash(data, algorithm) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

// ── Generators & Converters ────────────────────────────────────────────────

server.tool(
  "generate_id",
  "Generate a cryptographically random UUID v4 or a ULID (time-sortable unique ID). Use this whenever a truly random or time-ordered identifier is needed.",
  { type: z.enum(["uuid", "ulid"]).describe("uuid for a random UUID v4, ulid for a time-sortable ULID") },
  async ({ type }) => {
    try {
      return { content: [{ type: "text", text: generateId(type) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

server.tool(
  "convert_timestamp",
  "Convert a Unix epoch (seconds or milliseconds) or an ISO 8601 date string into UTC, local time, and ISO 8601 representations. Handles timezone edge cases reliably.",
  { value: z.string().describe("Unix epoch (seconds or ms) or any parseable date string (e.g. ISO 8601)") },
  async ({ value }) => {
    try {
      const result = convertTimestamp(value);
      const text = [
        `Input:        ${result.input}`,
        `ISO 8601:     ${result.iso8601}`,
        `UTC:          ${result.utc}`,
        `Local:        ${result.local}`,
        `Epoch (s):    ${result.epochSeconds}`,
      ].join("\n");
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

// ── Utilities ──────────────────────────────────────────────────────────────

server.tool(
  "test_regex",
  "Test a regular expression against a string and return match details including captured groups. Use this to validate a regex before inserting it into code.",
  {
    regex: z.string().describe("The regex pattern (without delimiters)"),
    text: z.string().describe("The input string to test against"),
    flags: z.string().default("").describe("Regex flags such as g, i, m, s (empty string for none)"),
  },
  async ({ regex, text, flags }) => {
    try {
      const result = testRegex(regex, text, flags);
      const lines: string[] = [
        `Match: ${result.isMatch ? "yes" : "no"}`,
        `Count: ${result.matchCount}`,
      ];
      if (result.firstMatch.length) {
        lines.push(`First match: ${JSON.stringify(result.firstMatch[0])}`);
        if (result.firstMatch.length > 1) {
          lines.push(`Groups (positional): ${JSON.stringify(result.firstMatch.slice(1))}`);
        }
      }
      if (result.groups) {
        lines.push(`Named groups: ${JSON.stringify(result.groups, null, 2)}`);
      }
      if (result.allMatches.length > 1) {
        lines.push(`All matches: ${JSON.stringify(result.allMatches.map((m) => m[0]))}`);
      }
      return { content: [{ type: "text", text: lines.join("\n") }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

server.tool(
  "explain_cron",
  "Parse a cron expression and return a human-readable English description of when it runs. Use this to explain or verify a cron schedule before deploying it.",
  { schedule: z.string().describe("A standard 5-field cron expression (e.g. '0 9 * * 1-5')") },
  async ({ schedule }) => {
    try {
      return { content: [{ type: "text", text: explainCron(schedule) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Error: ${(e as Error).message}` }] };
    }
  }
);

// ── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
