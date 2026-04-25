# MCP Server: Developer Utilities

## 1. Overview

A **Node.js/TypeScript MCP Server** that exposes 12 developer utility tools to AI agents (Claude Desktop, Cursor, GitHub Copilot). The goal is to let AI agents invoke high-quality, client-side tools directly within chat or terminal workflows — no copy-pasting required.

## 2. Core Value Proposition

| Principle | Description |
|---|---|
| **Agentic Native** | Tools are structured so an AI can decide when to format JSON, decode a JWT, or generate a UUID without manual prompting |
| **Privacy-First** | All logic runs locally — no data leaves the machine during processing |
| **Standardized** | Uses the Model Context Protocol (MCP) for compatibility across all supporting AI clients |

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js v20+ |
| Language | TypeScript |
| Protocol SDK | `@modelcontextprotocol/sdk` |
| Schema Validation | `zod` |
| Transport | `StdioServerTransport` |

## 4. Tool Inventory (12 Tools)

Tools are grouped by category. Each tool provides a capability the AI cannot reliably perform on its own.

### Encoding & Decoding

| Tool Name | Parameters | Implementation | Why it's needed |
|---|---|---|---|
| `base64_encode_decode` | `{ data: string, mode: "encode" \| "decode" }` | `base64.ts` | Reliable for long tokens and binary data in pipelines |
| `url_encode_decode` | `{ data: string, mode: "encode" \| "decode" }` | `url-encoder.ts` | Reliable for complex query strings with special characters |
| `base_converter` | `{ value: string, from: number, to: number }` | `base-converter.ts` | LLMs make arithmetic errors with large number conversions |

### JSON & Text

| Tool Name | Parameters | Implementation | Why it's needed |
|---|---|---|---|
| `diff_json` | `{ oldJson: string, newJson: string }` | `json-diff.ts` | Structured diff for comparing API responses, configs, and test fixtures |
| `diff_text` | `{ oldText: string, newText: string }` | `text-diff.ts` | Unified diff for comparing files or code outputs in review workflows |

### Security & Tokens

| Tool Name | Parameters | Implementation | Why it's needed |
|---|---|---|---|
| `decode_jwt` | `{ token: string }` | `jwt-decoder.ts` | Returns structured claims and expiry from a raw token |
| `verify_jwt` | `{ token: string, secret: string }` | `jwt-verifier.ts` | HMAC signature verification is cryptographic — AI cannot do this |
| `generate_hash` | `{ data: string, algorithm: "md5" \| "sha256" \| "sha512" }` | `hash-generator.ts` | SHA256/MD5 is real computation the AI cannot perform reliably |

### Generators & Converters

| Tool Name | Parameters | Implementation | Why it's needed |
|---|---|---|---|
| `generate_id` | `{ type: "uuid" \| "ulid" }` | `uuid-generator.ts` | AI cannot produce cryptographically random IDs |
| `convert_timestamp` | `{ value: string, to: "utc" \| "local" }` | `timestamp-converter.ts` | Reliable epoch/timezone handling; LLMs have edge-case errors |

### Utilities

| Tool Name | Parameters | Implementation | Why it's needed |
|---|---|---|---|
| `test_regex` | `{ regex: string, text: string, flags: string }` | `regex-tester.ts` | AI can validate a regex against real input before inserting it into code |
| `explain_cron` | `{ schedule: string }` | `cron-explainer.ts` | Parses and returns a human-readable explanation of a cron expression |

### Removed Tools

| Tool | Reason removed |
|---|---|
| `format_json` | AI trivially formats JSON in its own output — no capability gap |
| `preview_markdown` | AI agents work in markdown; MCP clients render it natively. HTML output has no use in an agent workflow |
| `convert_color` | AI can compute hex/rgb/hsl conversions — this is a human-facing web UI utility |

## 5. Architecture & Implementation Rules

### Server Setup

1. Initialize the server with `McpServer` from `@modelcontextprotocol/sdk`
2. Register all 12 tools using `server.tool()`
3. Use `StdioServerTransport` as the entry point for Claude Desktop / Cursor compatibility

### Tool Response Format

Every tool must return the following shape:

```ts
{
  content: [{ type: "text", text: result }]
}
```

For errors, return `isError: true` with a descriptive message so the AI can attempt to correct its input:

```ts
{
  isError: true,
  content: [{ type: "text", text: `Error: ${e.message}` }]
}
```

### Critical Rules

- **No `console.log`** — use `console.error()` only; `stdout` is reserved for the JSON-RPC stream
- **All logic** must be imported from `src/lib/tools/` — no inline implementations in the server file
- **Zod schemas** are required for every tool's argument definition — enables the MCP SDK to generate accurate tool descriptions for the AI

## 6. Project Structure

```
src/
├── index.ts              # Entry point — server init + tool registration
└── lib/
    └── tools/
        ├── base64.ts
        ├── base-converter.ts
        ├── cron-explainer.ts
        ├── hash-generator.ts
        ├── json-diff.ts
        ├── jwt-decoder.ts
        ├── jwt-verifier.ts
        ├── regex-tester.ts
        ├── text-diff.ts
        ├── timestamp-converter.ts
        ├── url-encoder.ts
        └── uuid-generator.ts
```

## 7. Testing & Verification

- Use the **MCP Inspector** (`npx @modelcontextprotocol/inspector`) to interactively test tools before integrating with a client
- Each tool implementation in `src/lib/tools/` should be unit-testable in isolation (pure functions, no side effects)
- Verify the JSON-RPC stream is clean: any stray `console.log` will silently corrupt output and produce cryptic client errors

## 8. Future Considerations

- **Tool discoverability**: Provide rich descriptions and usage examples in each `server.tool()` call so the AI knows *when* to invoke a tool, not just *how*
- **Batching**: For tools like `diff_json` or `generate_hash`, consider supporting array inputs to reduce round-trips in agentic workflows
- **New tools**: Candidates include `parse_url`, `encode_html_entities`, `format_sql`, `minify_js`, and `lint_yaml`
