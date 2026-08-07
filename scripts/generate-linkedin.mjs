import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { loadConfig, repositoryRoot } from "./lib/config.mjs";
import { getPalette, samplePortrait, createAsciiTspans } from "./lib/hero.mjs";

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
    }
  });
}

async function generateLinkedInBanner() {
  const config = await loadConfig();
  const colors = await getPalette(config.appearance.palette);
  const portraitPath = resolve(repositoryRoot, "portrait.png");
  
  // LinkedIn Banner is exactly 1584x396
  const width = 1584;
  const height = 396;
  
  // Portrait logic
  const portraitBuffer = await readFile(portraitPath);
  // Scale portrait columns/rows for the banner height
  // We want it to be about 350px tall. 350 / 6 = ~58 rows
  const portraitData = await samplePortrait(portraitBuffer, 90, 58);
  const asciiTspans = createAsciiTspans(portraitData, {
    x: 1000,
    y: 40,
    lineHeight: 6,
    fontSize: 6.5
  });

  const quote = "icarus laughed as he fell, for he knew to fall means to have once soared";
  const name = config.profile.name;
  const headline = config.profile.headline;
  const username = config.profile.username;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${colors.blue}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="${colors.bg}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="scanline" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="${colors.cyan}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="ascii-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${colors.cyan}" />
      <stop offset="50%" stop-color="${colors.cyan}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${colors.blue}" stop-opacity="0.4" />
    </linearGradient>
    <style>
      .bg { fill: ${colors.bg}; }
      .mono { font-family: 'Courier New', Consolas, monospace; }
      .ascii { font-family: 'Courier New', Consolas, monospace; font-size: 6.5px; letter-spacing: -0.15px; fill: url(#ascii-gradient); }
      .title { font-size: 42px; font-weight: 700; fill: ${colors.cyan}; text-shadow: 0 0 8px ${colors.cyan}80; }
      .subtitle { font-size: 24px; font-weight: 600; fill: ${colors.foreground}; letter-spacing: 1px; }
      .handle { font-size: 18px; fill: ${colors.blue}; letter-spacing: 2px; }
      .quote { font-size: 14px; fill: ${colors.muted}; font-style: italic; }
      .grid { stroke: ${colors.cyan}; stroke-opacity: 0.08; stroke-width: 1; }
      text, tspan { white-space: pre; }
    </style>
  </defs>
  
  <rect class="bg" width="${width}" height="${height}" />
  <rect width="${width}" height="${height}" fill="url(#glow)" />
  
  <!-- Grid Pattern -->
  <g class="grid">
    ${Array.from({length: 40}).map((_, i) => `<line x1="0" y1="${i * 40}" x2="${width}" y2="${i * 40}" />`).join('')}
    ${Array.from({length: 160}).map((_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${height}" />`).join('')}
  </g>

  <!-- Portrait -->
  <text class="ascii">${asciiTspans}</text>
  
  <!-- Left content -->
  <g class="mono" transform="translate(180, 160)">
    <text x="0" y="0" class="handle">github.com/${escapeXml(username)}</text>
    <text x="0" y="50" class="title">${escapeXml(name)}</text>
    <text x="0" y="90" class="subtitle">&lt; ${escapeXml(headline).trim()} /&gt;</text>
    <text x="0" y="140" class="quote">"${escapeXml(quote)}"</text>
  </g>

  <!-- Fake Scanline -->
  <rect x="0" y="150" width="${width}" height="40" fill="url(#scanline)" />
</svg>
`;

  const outputSvgPath = resolve(repositoryRoot, "linkedin-banner.svg");
  const outputPngPath = resolve(repositoryRoot, "linkedin-banner.png");
  
  await writeFile(outputSvgPath, svg);
  console.log("Saved linkedin-banner.svg");

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPngPath);
  console.log("Saved linkedin-banner.png (Use this for LinkedIn)");
}

generateLinkedInBanner().catch(console.error);
