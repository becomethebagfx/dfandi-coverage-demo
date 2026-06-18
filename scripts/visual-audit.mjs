// Visual auditor: walks every route at three viewports, screenshots,
// and runs in-page checks for overflow, nav overflow, and contrast.
// Outputs screenshots/audit/REPORT.md plus PNGs.
import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { dirname, join } from "path";

const BASE = process.env.AUDIT_URL || "https://dfandi-coverage-demo.onrender.com";
const ROUTES = ["/", "/map", "/contractors", "/contractors/sub-tx-08", "/alerts", "/outreach", "/upload", "/settings"];
const VIEWPORTS = [
  { name: "mobile",  width: 375,  height: 812  },
  { name: "tablet",  width: 768,  height: 1024 },
  { name: "desktop", width: 1440, height: 900  },
];
const HEADED = process.env.HEADED === "1";
const OUT = "screenshots/audit";

function safeName(p) {
  return p.replace(/^\//, "root").replace(/\//g, "_").replace(/[^a-z0-9_.-]/gi, "");
}

/** Run inside the page: find issues we care about. */
const PAGE_AUDIT = `
(() => {
  const issues = [];
  const W = window.innerWidth;
  if (document.documentElement.scrollWidth > W + 1) {
    issues.push({ kind: "overflow-x", detail: \`scrollWidth=\${document.documentElement.scrollWidth} > viewport=\${W}\` });
  }
  // Nav overflow: header should not scroll horizontally.
  const header = document.querySelector("header");
  if (header && header.scrollWidth > header.clientWidth + 1) {
    issues.push({ kind: "nav-overflow", detail: \`headerScroll=\${header.scrollWidth} > clientWidth=\${header.clientWidth}\` });
  }
  // Hero contrast: scan h1 visible color vs body bg.
  const h1 = document.querySelector("h1");
  if (h1) {
    const s = getComputedStyle(h1);
    const op = parseFloat(s.opacity || "1");
    if (op < 0.9) issues.push({ kind: "h1-low-opacity", detail: \`opacity=\${op}\` });
    const c = s.color;
    issues.push({ kind: "h1-color", detail: c });
  }
  // Tap targets: links / buttons smaller than 32x32 on mobile only.
  if (W <= 480) {
    const tiny = [...document.querySelectorAll("a, button")]
      .filter(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        return r.height < 30;
      })
      .slice(0, 6)
      .map(el => ({ tag: el.tagName, text: (el.innerText || el.getAttribute("aria-label") || "").slice(0, 40), h: Math.round(el.getBoundingClientRect().height) }));
    if (tiny.length) issues.push({ kind: "tiny-tap-targets", detail: JSON.stringify(tiny) });
  }
  return issues;
})()
`;

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function main() {
  await ensureDir(OUT);
  const browser = await chromium.launch({ headless: !HEADED });
  const findings = [];
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => findings.push({ vp: vp.name, route: "(page)", kind: "js-error", detail: e.message }));
    for (const r of ROUTES) {
      const url = BASE + r;
      const png = join(OUT, `${vp.name}_${safeName(r)}.png`);
      try {
        const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        const status = resp ? resp.status() : 0;
        if (status >= 400) findings.push({ vp: vp.name, route: r, kind: "http-error", detail: \`status=\${status}\` });
        await page.waitForTimeout(500);
        await page.screenshot({ path: png, fullPage: true });
        const issues = await page.evaluate(PAGE_AUDIT);
        for (const it of issues) findings.push({ vp: vp.name, route: r, ...it });
      } catch (e) {
        findings.push({ vp: vp.name, route: r, kind: "navigation-error", detail: String(e).slice(0, 200) });
      }
    }
    await ctx.close();
  }
  await browser.close();

  // Write report
  const lines = ["# Visual audit", "", \`Target: \${BASE}\`, \`Generated: \${new Date().toISOString()}\`, ""];
  if (findings.length === 0) {
    lines.push("No issues detected.");
  } else {
    const grouped = {};
    for (const f of findings) {
      const key = `${f.vp}  ${f.route}`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(f);
    }
    for (const k of Object.keys(grouped).sort()) {
      lines.push(`## ${k}`);
      for (const f of grouped[k]) {
        lines.push(`- **${f.kind}** ${f.detail || ""}`);
      }
      lines.push("");
    }
  }
  await writeFile(join(OUT, "REPORT.md"), lines.join("\n"), "utf-8");
  // Console summary
  console.log(`Audit complete: ${findings.length} findings across ${ROUTES.length * VIEWPORTS.length} captures.`);
  if (findings.length) {
    const counts = {};
    for (const f of findings) counts[f.kind] = (counts[f.kind] || 0) + 1;
    for (const k of Object.keys(counts)) console.log(`  ${k}: ${counts[k]}`);
  }
  process.exit(findings.filter((f) => ["http-error", "js-error", "overflow-x", "nav-overflow"].includes(f.kind)).length > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
