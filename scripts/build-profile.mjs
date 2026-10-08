import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
mkdirSync(assets, { recursive: true });
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`Missing value for ${name}`);
  return args[index + 1];
};

const photo = option('--photo');
const outlines = JSON.parse(readFileSync(join(assets, 'portrait-glyphs.json'), 'utf8'));
if (photo) {
  // Canvas is only needed when changing the source. Normal builds use saved samples.
  const work = mkdtempSync(join(tmpdir(), 'tav0dev-portrait-'));
  try {
    const data = readFileSync(resolve(photo)).toString('base64');
    const type = photo.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    const template = readFileSync(join(root, 'scripts', 'portrait.html'), 'utf8');
    const page = join(work, 'portrait.html');
    writeFileSync(page, template
      .replace('__PHOTO_DATA_URL__', `data:${type};base64,${data}`)
      .replace('__GLYPH_OUTLINES__', JSON.stringify(outlines)));
    const output = execFileSync(option('--browser') || 'chromium', [
      '--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
      '--disable-background-networking', '--no-first-run', '--no-default-browser-check',
      `--user-data-dir=${join(work, 'browser')}`, '--virtual-time-budget=2000',
      '--dump-dom', pathToFileURL(page).href,
    ], { encoding: 'utf8', timeout: 20000, maxBuffer: 8 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    const result = output.match(/<pre id="result">([^<]+)<\/pre>/);
    if (!result) throw new Error('The browser did not return an ASCII portrait.');
    const sampled = JSON.parse(result[1]);
    validatePortrait(sampled);
    writeFileSync(join(assets, 'portrait-tones.json'), `${JSON.stringify(sampled)}\n`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

function validatePortrait(data) {
  const { version, columns, rows, source, font, glyphs, tones } = data;
  if (version !== 3 || !Number.isInteger(columns) || columns < 1 ||
      !Number.isInteger(rows) || rows < 1 || !source?.crop?.width || !source.crop.height ||
      !font?.cellAspect || !Array.isArray(glyphs) || !glyphs.length ||
      glyphs.some(g => typeof g.char !== 'string' || g.char.length !== 1 ||
        !(g.coverage > 0) || !outlines.paths[g.char]) ||
      !Array.isArray(tones) || tones.length !== rows || tones.some(row =>
        !Array.isArray(row) || row.length !== columns || row.some(value =>
          value !== null && (!Number.isInteger(value) || value < 0 || value > 255)))) {
    throw new Error('Invalid portrait samples; regenerate with --photo.');
  }
}

const samples = JSON.parse(readFileSync(join(assets, 'portrait-tones.json'), 'utf8'));
validatePortrait(samples);
const { columns, rows, source, font, tones } = samples;
const glyphs = [...samples.glyphs].sort((a, b) => a.coverage - b.coverage);
// A single monotonic curve for the entire portrait; no local feature adjustments.
const sigmoid = value => 1 / (1 + Math.exp(-6 * (value - .5)));
const black = sigmoid(0);
const toneRange = sigmoid(1) - black;
const portraitTone = luma => (sigmoid(Math.min(1, luma / 235)) - black) / toneRange;
const cells = tones.map(row => row.map(luma => {
  if (luma === null) return { char: ' ', brightness: 0 };
  const density = (.035 + .965 * portraitTone(luma)) * glyphs.at(-1).coverage;
  const glyph = glyphs.find(g => g.coverage >= density) || glyphs.at(-1);
  return { char: glyph.char, brightness: density / glyph.coverage };
}));
const portrait = cells.map(row => row.map(cell => cell.char).join(''));
writeFileSync(join(assets, 'portrait.txt'), `${portrait.map(row => row.trimEnd()).join('\n')}\n`);
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, &quot;Liberation Mono&quot;, monospace';
const text = (x, y, value, size = 15, fill = '#c7d5e2', attrs = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${attrs}>${escape(value)}</text>`;
const ink = '#8bc6df';
const muted = '#9bafbf';
const profile = {
  name: 'Gustavo de Oliveira',
  role: 'AI Engineer / Co-Founder',
  organization: 'Outpost Technologies',
  focus: 'Agents · Integrations · Products',
  stack: 'Python · TypeScript · SQL',
  location: 'São Paulo, Brazil',
};

function ascii(x, y, width = 360) {
  // Match the photograph's crop aspect ratio, independently of font metrics.
  const cellWidth = width / columns;
  const lineHeight = width * source.crop.height / source.crop.width / rows;
  const fontSize = cellWidth / font.cellAspect;
  const scale = fontSize / outlines.unitsPerEm;
  const id = char => `ascii-${char.charCodeAt(0)}`;
  const definitions = glyphs.map(g =>
    `<path id="${id(g.char)}" d="${outlines.paths[g.char]}"/>`).join('');
  // Fixed glyph outlines avoid tiny-font hinting and fallback-font differences.
  // Neutral gray fills also keep the portrait independent of the card's blue ink.
  return `<g id="portrait" aria-hidden="true" transform="translate(${x} ${y})">
<defs>${definitions}</defs>
<g fill="currentColor" stroke="currentColor" stroke-width="${outlines.strokeWidth}" stroke-linejoin="round">${cells.map((row, index) => {
    const content = row.map((cell, column) => {
      if (cell.char === ' ') return '';
      const gray = Math.round(247 * cell.brightness).toString(16).padStart(2, '0');
      return `<use href="#${id(cell.char)}" color="#${gray.repeat(3)}" transform="translate(${(column * cellWidth).toFixed(3)} 0) scale(${scale.toFixed(8)} ${(-scale).toFixed(8)})"/>`;
    }).join('');
    return content ? `<g transform="translate(0 ${((index + .8) * lineHeight).toFixed(3)})">${content}</g>` : '';
  }).join('\n')}</g></g>`;
}

function shell(width, height, content) {
  return `<!-- Generated by scripts/build-profile.mjs. Edit the generator, then rebuild. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">Gustavo de Oliveira — AI Engineer</title>
  <desc id="description">ASCII portrait of Gustavo de Oliveira, based on his photograph. AI Engineer and co-founder at Outpost Technologies in São Paulo, Brazil. Builds agents, integrations, and products using Python, TypeScript, SQL, and AWS.</desc>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" fill="#0d1117" stroke="#303943"/>
  <path d="M1 47H${width - 1}" stroke="#26323d"/>
  <circle cx="23" cy="24" r="4" fill="#617a8a"/><circle cx="39" cy="24" r="4" fill="#8c9fa7"/><circle cx="55" cy="24" r="4" fill="#b6c5c8"/>
  <g font-family="${mono}">
    ${text(77, 29, '~/tav0dev · profile', 12, '#92a6b7')}
    ${content}
  </g>
</svg>
`;
}

const desktop = [
  ascii(28, 66, 330),
  text(402, 139, profile.name, 32, '#e1e9ef', 'font-weight="600"'),
  text(402, 177, profile.role, 21, ink),
  text(402, 207, profile.organization, 17, muted),
  '<path d="M402 240H956" stroke="#26323d"/>',
  text(402, 282, profile.focus, 20),
  text(402, 319, profile.stack, 18, muted),
  text(402, 392, profile.location, 16, muted),
].join('\n');
writeFileSync(join(assets, 'profile.svg'), shell(1000, 460, desktop));

const compact = [
  ascii(18, 70, 220),
  text(263, 104, profile.name, 22, '#e1e9ef', 'font-weight="600"'),
  text(263, 137, profile.role, 18, ink),
  text(263, 164, profile.organization, 17, muted),
  '<path d="M263 189H580" stroke="#26323d"/>',
  text(263, 220, profile.focus, 17),
  text(263, 251, profile.stack, 17, muted),
  text(263, 302, profile.location, 17, muted),
].join('\n');
writeFileSync(join(assets, 'profile-compact.svg'), shell(600, 350, compact));

const mobile = [
  ascii(75, 66, 250),
  text(200, 382, profile.name, 26, '#e1e9ef', 'font-weight="600" text-anchor="middle"'),
  text(200, 417, profile.role, 20, ink, 'text-anchor="middle"'),
  text(200, 447, profile.organization, 18, muted, 'text-anchor="middle"'),
  text(200, 491, profile.focus, 18, '#c7d5e2', 'text-anchor="middle"'),
  text(200, 522, profile.stack, 18, muted, 'text-anchor="middle"'),
  text(200, 553, profile.location, 18, muted, 'text-anchor="middle"'),
].join('\n');
writeFileSync(join(assets, 'profile-mobile.svg'), shell(400, 578, mobile));
console.log('Built desktop, compact, and mobile profile artwork.');
