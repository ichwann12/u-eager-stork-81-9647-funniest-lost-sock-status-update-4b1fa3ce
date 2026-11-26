import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the output directory: the grader-provided output dir wins,
// then the bot dir, then a local fallback next to this script.
function resolveOutputDir(): string {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (outputDir && outputDir.trim() !== "") {
    return outputDir;
  }
  const botDir = process.env.MAKEFUN_BOT_DIR;
  if (botDir && botDir.trim() !== "") {
    return botDir;
  }
  return join(__dirname, "output");
}

function main(): void {
  const linePath = join(__dirname, "line.txt");
  const raw = readFileSync(linePath, "utf8");
  // The entry must be exactly one line: strip a single trailing newline
  // (LF or CRLF) if present, then reject anything that still contains a
  // line break.
  const line = raw.replace(/\r?\n$/, "");
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error(
      `line.txt must contain exactly one line, found a line break at character ${line.search(/[\r\n]/) + 1}`,
    );
  }
  if (line.length < 1 || line.length > 120) {
    throw new Error(
      `lost-sock status update must be 1-120 characters, got ${line.length} characters`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), line, "utf8");
}

main();
