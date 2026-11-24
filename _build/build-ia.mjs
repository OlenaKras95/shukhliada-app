// Збирає ia.html — знімок IA для перегляду — з шаблону, flows.md і sitemap.md.
// Запуск з кореня репо: node _build/build-ia.mjs
// Змінили sitemap.md, flows.md чи шаблон — перезбираємо в тому самому кроці (бриф §10).
// Діаграми й списки під ними беруться з flows.md дослівно, назви jobs — з матриці в sitemap.md.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tpl = path.join(ROOT, "_build", "ia.template.html");
const flowsPath = path.join(ROOT, "flows.md");
const sitemapPath = path.join(ROOT, "sitemap.md");
const out = path.join(ROOT, "ia.html");
const md = fs.readFileSync(flowsPath, "utf8").replace(/\r\n/g, "\n");
const sitemap = fs.readFileSync(sitemapPath, "utf8").replace(/\r\n/g, "\n");
const REPO = "https://github.com/OlenaKras95/shukhliada-app/blob/main/";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- діаграми ----------
const fences = [...md.matchAll(/```mermaid\n([\s\S]*?)```/g)];
const dark = {
  cOk: "fill:#1f3a2a,stroke:#8fc7a3,color:#e3f1e5",
  cDead: "fill:#3d1f22,stroke:#e57373,color:#fbe4e4",
  cErr: "fill:#3d2e18,stroke:#e8a85b,color:#fff1dc",
  cLoad: "fill:#1c2a40,stroke:#8fb4e8,color:#e7eefa",
  cEmpty: "fill:#2a2824,stroke:#a89f8f,color:#f1efea",
};
let html = fs.readFileSync(tpl, "utf8");
const flowMarkers = [...html.matchAll(/<!--FLOW:(\d+)-->/g)].length;
if (flowMarkers !== fences.length) throw new Error(`FLOW markers ${flowMarkers} != blocks ${fences.length}`);
fences.forEach((m, i) => {
  const code = m[1].replace(/^(\s*classDef\s+(\w+))\s+.*$/gm, (line, head, name) => {
    if (!dark[name]) throw new Error("unknown classDef " + name);
    return `${head} ${dark[name]}`;
  }).trimEnd();
  html = html.replace(`<!--FLOW:${i + 1}-->`, "\n" + esc(code) + "\n");
});

// ---------- розвилки, стани, кінці під діаграмами ----------
function inline(s) {
  let h = esc(s);
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (all, text, href) =>
    `<a href="${/^https?:/.test(href) ? href : REPO + href}">${text}</a>`);
  return h;
}
function listHtml(lines) {
  const ordered = /^\d+\.\s/.test(lines[0]);
  const items = lines.map((l) => `<li>${inline(l.replace(/^(\d+\.|-)\s+/, ""))}</li>`).join("\n");
  return ordered ? `<ol>\n${items}\n</ol>` : `<ul>\n${items}\n</ul>`;
}
const OPEN = { "Кінці": true };
function listsAfter(blockIndex) {
  const start = fences[blockIndex].index + fences[blockIndex][0].length;
  const rest = md.slice(start);
  const stop = rest.search(/\n```mermaid|\n## |\n### |\n---\n/);
  const seg = stop === -1 ? rest : rest.slice(0, stop);
  const parts = [];
  for (const para of seg.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)) {
    const lines = para.split("\n");
    const head = /^\*\*([^*]+):\*\*\s*$/.exec(lines[0]);
    if (head && lines.length > 1) {
      const body = lines.slice(1);
      const label = head[1];
      parts.push(`<details${OPEN[label] ? " open" : ""}><summary>${esc(label)}<span>${body.length}</span></summary>\n${listHtml(body)}\n</details>`);
    } else if (/^\*\*Кліків:\*\*/.test(lines[0])) {
      continue; // кліки вже стоять над діаграмою
    } else {
      parts.push(`<p class="note">${inline(para)}</p>`);
    }
  }
  if (!parts.length) throw new Error("no lists after block " + (blockIndex + 1));
  return parts.join("\n");
}
html = html.replace(/<!--LISTS:(\d+)-->/g, (all, n) => "\n" + listsAfter(+n - 1) + "\n");

// ---------- теги jobs з назвами з матриці трасування ----------
const names = {};
const after = sitemap.slice(sitemap.indexOf("### Матриця: після рішень"));
for (const m of after.matchAll(/^\| \*\*([^*]+)\*\* (.+?) \|/gm)) {
  names[m[1]] = m[2].replace(/\s*`\[\?\]`\s*$/, "").replace(/^·\s*/, "").trim();
}
html = html.replace(/<!--JOBS:([^>]+)-->/g, (all, spec) => spec.trim().split(/\s+/).map((tok) => {
  const isMain = tok.startsWith("*");
  const cond = tok.endsWith("~");
  const code = tok.replace(/^\*/, "").replace(/~$/, "");
  const name = names[code];
  if (!name) throw new Error("no job name for " + code);
  const hyp = code.startsWith("Г");
  const label = code + (hyp ? " [?]" : "") + (cond ? " · умовно" : "");
  const full = code + " — " + name + (hyp ? " (гіпотеза)" : "") + (cond ? ", прив'язано умовно до інтерв'ю" : "");
  const cls = isMain ? "main" : hyp ? "hyp" : "job";
  return `<span class="tag ${cls}" tabindex="0" data-name="${esc(full)}">${esc(label)}<span class="vh"> — ${esc(name)}</span></span>`;
}).join(""));

const left = html.match(/<!--(FLOW|LISTS|JOBS):/);
if (left) throw new Error("unreplaced marker " + left[0]);
fs.writeFileSync(out, html);
console.log("blocks:", fences.length, "jobs:", Object.keys(names).length);
