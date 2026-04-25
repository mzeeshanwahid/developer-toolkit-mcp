# Developer Toolkit MCP

> A privacy-focused [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes 12 battle-tested developer utility tools directly inside your AI assistant. No browser, no copy-paste, no data ever leaving your machine.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-158%20passed-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-100%25%20statements-brightgreen)](vitest.config.ts)
[![MCP SDK](https://img.shields.io/badge/MCP%20SDK-1.12.0-blueviolet)](https://github.com/modelcontextprotocol/typescript-sdk)

---

## Introduction

**Developer Toolkit MCP** gives AI coding assistants (Claude, Cursor, Windsurf, Zed, and any other MCP-compatible client) reliable, deterministic versions of the everyday tasks developers hand to their LLM: encode/decode data, diff files, hash strings, decode tokens, validate regexes, convert timestamps, and more.

LLMs are great at reasoning but they can silently get arithmetic or encoding wrong. This server offloads those operations to correct library implementations so your assistant always returns the right answer, not a hallucinated one.

Want to use these tools without an AI assistant? Visit **[DeveloperToolkit.dev](https://www.developertoolkit.dev)** for the browser-based version.

---

## Privacy First 🔒

Every tool runs **100% locally** on your machine via the MCP stdio transport. No data is sent to any external API. No telemetry. No analytics. Your tokens, secrets, source code, and any other sensitive input never leave your environment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Language | TypeScript 5 |
| MCP SDK | `@modelcontextprotocol/sdk` 1.12 |
| Schema validation | Zod |
| JWT | `jsonwebtoken` |
| Diffing | `diff` |
| Cron parsing | `cronstrue` |
| Unique IDs | `ulid` |
| Testing | Vitest 4 + `@vitest/coverage-v8` |

---

## Tools

| Tool | Description |
|---|---|
| `base64_encode_decode` | Encode a string to Base64 or decode a Base64 string back to plain text |
| `url_encode_decode` | Percent-encode a string for safe URL use, or decode a percent-encoded string |
| `base_converter` | Convert a number between any two bases (2–36) — binary, hex, octal, and more |
| `diff_json` | Compare two JSON strings and return a unified diff of their pretty-printed forms |
| `diff_text` | Produce a unified diff between two plain-text strings |
| `decode_jwt` | Decode a JWT without verifying its signature — returns header, payload, and expiry |
| `verify_jwt` | Verify a JWT's HMAC signature with a secret and return the decoded payload |
| `generate_hash` | Hash a string with MD5, SHA-256, or SHA-512 and return the hex digest |
| `generate_id` | Generate a cryptographically random UUID v4 or a time-sortable ULID |
| `convert_timestamp` | Convert Unix epoch or ISO 8601 dates to UTC, local time, and all representations |
| `test_regex` | Test a regex against a string and return match details including captured groups |
| `explain_cron` | Parse a cron expression and return a plain-English description of its schedule |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A MCP-compatible client (Claude Desktop, Cursor, Windsurf, Zed, etc.)

### 1 - Clone & install

```bash
git clone https://github.com/mzeeshanwahid/developer-toolkit-mcp.git
cd developer-toolkit-mcp
npm install
```

### 2 - Build

```bash
npm run build
```

This compiles TypeScript to `dist/` via `tsc`.

---

## Connecting to Claude Desktop

1. Open **Claude Desktop → Settings → Developer → Edit Config** (`claude_desktop_config.json`).
2. Add the following entry (replace `/absolute/path/to` with the real path to your clone):

```json
{
  "mcpServers": {
    "developer-toolkit": {
      "command": "node",
      "args": ["/absolute/path/to/developer-toolkit-mcp/dist/index.js"]
    }
  }
}
```

3. Restart Claude Desktop. The 12 tools will appear automatically.

> **Tip:** You can also use `npx` to run without cloning once the package is published to npm:
> ```json
> {
>   "mcpServers": {
>     "developer-toolkit": {
>       "command": "npx",
>       "args": ["developer-toolkit-mcp"]
>     }
>   }
> }
> ```

---

## Connecting to Other MCP Clients

The server speaks the standard **MCP stdio transport**, so it works with any compliant client:

| Client | Config location |
|---|---|
| **Cursor** | `.cursor/mcp.json` in your project or `~/.cursor/mcp.json` globally |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` |
| **Zed** | `~/.config/zed/settings.json` under `"context_servers"` |
| **VS Code (Copilot)** | `.vscode/mcp.json` in your workspace |

In all cases, point `command` to `node` and `args` to the absolute path of `dist/index.js`, just like the Claude Desktop example above.

### Inspecting the server locally

```bash
npm run inspect
```

This opens the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) UI so you can manually invoke any tool and inspect its output.

---

## Development

```bash
# Run in dev mode (no build step required)
npm run dev

# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

---

## Code Coverage

All 12 tool implementations are covered by **158 unit tests** across 12 test files.

```
 Test Files  12 passed (12)
      Tests  158 passed (158)
   Duration  498ms

-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   100   |   95.45  |   100   |   100   |
 base-converter.ts |   100   |    100   |   100   |   100   |
 base64.ts         |   100   |    100   |   100   |   100   |
 cron-explainer.ts |   100   |    100   |   100   |   100   |
 hash-generator.ts |   100   |    100   |   100   |   100   |
 json-diff.ts      |   100   |     50   |   100   |   100   |
 jwt-decoder.ts    |   100   |    100   |   100   |   100   |
 jwt-verifier.ts   |   100   |    100   |   100   |   100   |
 regex-tester.ts   |   100   |    100   |   100   |   100   |
 text-diff.ts      |   100   |     50   |   100   |   100   |
 timestamp-conv..  |   100   |    100   |   100   |   100   |
 url-encoder.ts    |   100   |    100   |   100   |   100   |
 uuid-generator.ts |   100   |    100   |   100   |   100   |
-------------------|---------|----------|---------|---------|
```

Coverage thresholds enforced in CI: **100% statements, 100% functions, 100% lines, 95% branches**.

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-new-tool`
3. Make your changes and add tests (**coverage must remain at 100% statements/functions/lines**)
4. Run `npm run test:coverage` to verify
5. Open a pull request with a clear description of what you've added

Please follow the existing code style (each tool lives in its own file under `src/lib/tools/`, exports a single pure function, and has a corresponding test file under `tests/`).

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

**Muhammad Zeeshan**

[LinkedIn](https://www.linkedin.com/in/muhammad-zeeshan-wahid/) · [DeveloperToolkit.dev](https://www.developertoolkit.dev)

> 💡 Prefer a no-setup experience? All tools are available as a free web UI at **[DeveloperToolkit.dev](https://www.developertoolkit.dev)**.
