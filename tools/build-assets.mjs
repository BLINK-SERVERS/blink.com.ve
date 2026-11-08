// Genera los rasters e iconos de la landing del ecosistema a partir del
// isotipo aprobado. Requiere playwright-core (se toma del repo Pay) y Chromium.
//
//   CHROMIUM_PATH=/usr/bin/chromium node tools/build-assets.mjs

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(
  "/home/prodz/Documents/Qoder/2026-10-31/88381b6f/Pay/package.json",
);
const { chromium } = require("playwright-core");

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const AZUL = "#007AFF";
const BLANCO = "#FFFEFB";

const OJO_GUINO = "M 122 164 H 178 C 198 164 224 164 224 198 C 224 232 198 232 178 232 H 122 C 102 232 76 232 76 198 C 76 164 102 164 122 164 Z";
const OJO_ABIERTO = "M 436 182 A 68 68 0 1 1 299.99 182 A 68 68 0 1 1 436 182 Z";
const BOCA = "M 212 286 H 300 C 331.55 286 340.42 286 337.5 314 C 332.064081 366.125250 298 398 256 398 C 214 398 179.935919 366.125250 174.5 314 C 171.58 286 180.45 286 212 286 Z";

function isotipo(ancho, cx = 512, cy = 512, color = BLANCO) {
  const k = ancho / 360;
  return `<g transform="translate(${cx} ${cy}) scale(${k.toFixed(5)}) translate(-256 -256)" fill="${color}">
    <path d="${OJO_GUINO}"/>
    <path d="${OJO_ABIERTO}"/>
    <path d="${BOCA}"/>
  </g>`;
}

function icono(radio, anchoIsotipo, ancho = 1024) {
  const esquina = radio === null ? "" : ` rx="${radio}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${ancho}" viewBox="0 0 ${ancho} ${ancho}" fill="none">
  <rect width="${ancho}" height="${ancho}"${esquina} fill="${AZUL}"/>
  ${isotipo(anchoIsotipo, ancho / 2, ancho / 2)}
</svg>
`;
}

// Lockup de Blink (POS) para la imagen OG: mismas paths del maestro.
const LOCKUP = `<g transform="translate(-0 193.14)" fill="currentColor">
  <path d="M92.42 0C131.74 0 159.77 -23.82 159.77 -57.06C159.77 -75.42 146.25 -89.19 127.15 -93.28L127.27 -94.15C151.46 -98.99 168.7 -116.85 168.7 -140.55C168.7 -162.5 150.35 -179 116.48 -179H38.08L0 0ZM76.29 -149.48H100.35C115.36 -149.48 123.18 -142.78 123.18 -132.23C123.18 -118.22 111.27 -108.05 93.28 -108.05H67.61ZM51.48 -32.25 61.28 -78.65H88.69C105.56 -78.65 114.25 -71.33 114.25 -59.17C114.25 -43.04 101.59 -32.25 82 -32.25Z"/>
  <path d="M158.52 0H201.31L241.48 -188.8H198.68Z"/>
  <path d="M278.02 -150.59C290.18 -150.59 299.73 -160.27 299.73 -171.81C299.73 -183.47 290.18 -193.14 278.02 -193.14C265.86 -193.14 256.31 -183.47 256.31 -171.81C256.31 -160.27 265.86 -150.59 278.02 -150.59ZM219.97 0H262.76L291.54 -135.09H248.74Z"/>
  <path d="M280.52 0H323.07L340.06 -79.64C343.16 -94.65 354.33 -104.57 367.48 -104.57C379.63 -104.57 387.94 -97.13 387.94 -86.21C387.94 -83.36 387.57 -80.38 386.95 -76.54L370.7 0H413.12L430.62 -83.24C431.86 -89.19 432.48 -94.77 432.48 -99.73C432.48 -122.68 415.73 -138.31 391.42 -138.31C373.06 -138.31 356.31 -129.63 347.01 -114.5H346.02L350.48 -135.09H309.3Z"/>
  <path d="M472.81 0 482.01 -43.64 495.19 -56.39 519.32 0H565.59L529.72 -80.98L592.12 -143.15H542.75L493 -90.7H492L513.16 -189.69H470.49L430.13 0Z"/>
</g>
<g transform="translate(630.08 5.24) scale(0.6616) translate(-76 -114)" fill="currentColor">
  <path d="${OJO_GUINO}"/>
  <path d="${OJO_ABIERTO}"/>
  <path d="${BOCA}"/>
</g>`;

function og() {
  const anchoLockup = 560;
  const k = anchoLockup / 869;
  const x = (1200 - anchoLockup) / 2;
  const y = 208;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1E90FF"/>
      <stop offset="0.55" stop-color="${AZUL}"/>
      <stop offset="1" stop-color="#0062CC"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fondo)"/>
  <g transform="translate(${x} ${y}) scale(${k.toFixed(5)})" color="${BLANCO}">${LOCKUP}</g>
  <text x="600" y="470" text-anchor="middle" font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="600" fill="${BLANCO}" fill-opacity="0.95">Blink Pay · Blink POS</text>
  <text x="600" y="520" text-anchor="middle" font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif" font-size="22" fill="${BLANCO}" fill-opacity="0.72">Un ecosistema para moverte y cobrar</text>
</svg>
`;
}

writeFileSync(join(RAIZ, "assets/favicon.svg"), icono(230, 600));
writeFileSync(join(RAIZ, "assets/og.svg"), og());

const trabajos = [
  { radio: 230, salida: "assets/favicon.png", tamano: 32, transparente: true },
  { radio: null, salida: "assets/apple-touch-icon.png", tamano: 180 },
  { radio: null, salida: "assets/icono-192.png", tamano: 192 },
  { radio: null, salida: "assets/icono-512.png", tamano: 512 },
];

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

for (const t of trabajos) {
  const pagina = await navegador.newPage({ viewport: { width: t.tamano, height: t.tamano } });
  const svg = icono(t.radio, 600);
  await pagina.setContent(
    `<style>html,body{margin:0;padding:0;background:transparent}svg{width:${t.tamano}px;height:${t.tamano}px;display:block}</style>${svg}`,
  );
  await pagina.screenshot({ path: join(RAIZ, t.salida), omitBackground: !!t.transparente });
  await pagina.close();
  console.log(`✓ ${t.salida} ${t.tamano}×${t.tamano}`);
}

{
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  const svg = (await import("node:fs")).readFileSync(join(RAIZ, "assets/og.svg"), "utf8");
  await pagina.setContent(
    `<style>html,body{margin:0;padding:0}svg{width:1200px;height:630px;display:block}</style>${svg}`,
  );
  await pagina.screenshot({ path: join(RAIZ, "assets/og.png") });
  await pagina.close();
  console.log("✓ assets/og.png 1200×630");
}

await navegador.close();
