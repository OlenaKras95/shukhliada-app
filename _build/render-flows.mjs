// Малює діаграми з flows.md у SVG заздалегідь, щоб ia.html не тягнув Mermaid з CDN і показував схеми без JavaScript.
// Викликає build-ia.mjs сам, коли діаграми у flows.md змінилися; окремо: node _build/render-flows.mjs
// Потрібен Chrome або Edge на комп'ютері (шлях можна задати змінною BROWSER). Результат — _build/flows-svg.json, його комітимо.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CACHE = path.join(ROOT, "_build", "flows-svg.json");
export const MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs";
// Ті самі налаштування, що були в ia.html, коли Mermaid малював у браузері.
export const CONFIG = {
  startOnLoad: false,
  theme: "base",
  securityLevel: "strict",
  htmlLabels: false,
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  themeVariables: {
    darkMode: false, background: "#ffffff", primaryColor: "#f3f3f5", primaryTextColor: "#1d1d1f",
    primaryBorderColor: "#9a9aa3", secondaryColor: "#ffffff", tertiaryColor: "#ffffff",
    lineColor: "#6b6b73", edgeLabelBackground: "#ffffff", fontSize: "14px",
  },
  flowchart: { useMaxWidth: false, htmlLabels: false, curve: "basis", wrappingWidth: 220 },
};

export function readBlocks() {
  const md = fs.readFileSync(path.join(ROOT, "flows.md"), "utf8").replace(/\r\n/g, "\n");
  return [...md.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1].trimEnd());
}
export const hashOf = (blocks) =>
  crypto.createHash("sha256").update(JSON.stringify({ blocks, CONFIG, MERMAID })).digest("hex").slice(0, 16);

function findBrowser() {
  const c = [
    process.env.BROWSER,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("Не знайшов Chrome чи Edge. Задай шлях: BROWSER=/шлях/до/браузера node _build/build-ia.mjs");
  return hit;
}

export function render(blocks) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shukhliada-flows-"));
  const page = path.join(dir, "render.html");
  const ents = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  fs.writeFileSync(page, `<!doctype html><meta charset="utf-8"><body>
<script type="application/json" id="src">${ents(JSON.stringify(blocks))}</script>
<pre id="out">pending</pre>
<script type="module">
import mermaid from ${JSON.stringify(MERMAID)};
mermaid.initialize(${JSON.stringify(CONFIG)});
const blocks = JSON.parse(document.getElementById("src").textContent);
const svgs = [];
try {
  for (let i = 0; i < blocks.length; i++) svgs.push((await mermaid.render("flow-" + (i + 1), blocks[i])).svg);
  document.getElementById("out").textContent = "OK" + JSON.stringify(svgs);
} catch (e) { document.getElementById("out").textContent = "ERR" + e; }
</script></body>`);
  const browser = findBrowser();
  const dom = execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--user-data-dir=${path.join(dir, "profile")}`, "--virtual-time-budget=30000", "--dump-dom",
    pathToFileURL(page).href,
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 120000 });
  fs.rmSync(dir, { recursive: true, force: true });
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
  if (!m) throw new Error("Браузер не повернув результат");
  const txt = m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  if (txt.startsWith("ERR")) throw new Error("Mermaid: " + txt.slice(3));
  if (!txt.startsWith("OK")) throw new Error("Mermaid не встиг намалювати діаграми (" + txt.slice(0, 40) + ")");
  const svgs = JSON.parse(txt.slice(2));
  if (svgs.length !== blocks.length) throw new Error(`SVG ${svgs.length} != блоків ${blocks.length}`);
  return svgs;
}

// Повертає SVG з кешу або малює наново, якщо діаграми змінилися.
export function getSvgs({ force = false } = {}) {
  const blocks = readBlocks();
  const hash = hashOf(blocks);
  if (!force && fs.existsSync(CACHE)) {
    const c = JSON.parse(fs.readFileSync(CACHE, "utf8"));
    if (c.hash === hash) return c.svgs;
  }
  const svgs = render(blocks);
  fs.writeFileSync(CACHE, JSON.stringify({ hash, mermaid: MERMAID, svgs }, null, 0) + "\n");
  console.log("діаграми намальовано наново:", svgs.length);
  return svgs;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  getSvgs({ force: true });
}
