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

/* ------------------------------------------------------------------
   Bezels de producto Apple, dibujados en el espacio de puntos real
   del dispositivo (iPhone 393×852, iPad Pro 13" 1366×1024 en horizontal)
   y escalados con un solo transform. Así las proporciones, los radios
   y la Dynamic Island son los del producto, no aproximaciones.
   ------------------------------------------------------------------ */

const TINTA = "#1d1d1f";
const GRIS = "#86868b";
const NEUTRO = "#6e6e6e";
const PIEL = "#f2f2f7";
const FONTE =
  "'SF Pro Display','SF Pro Text',-apple-system,'Helvetica Neue',Inter,Arial,sans-serif";

const n2 = (v) => (Math.round(v * 100) / 100).toString();

/** Arte de la tarjeta Blink Pay, en su caja nativa 1011×638. */
function arteTarjeta(x, y, ancho) {
  const k = ancho / 1011;
  return `<g transform="translate(${n2(x)} ${n2(y)}) scale(${n2(k)})">
      <rect width="1011" height="638" rx="40" fill="${AZUL}"/>
      <g clip-path="url(#recorte-tarjeta-og)" fill="${BLANCO}" fill-opacity="0.5" transform="translate(-442.5 -425) scale(3)">
        <path d="${OJO_GUINO}"/><path d="${OJO_ABIERTO}"/><path d="${BOCA}"/>
      </g>
    </g>`;
}

/** iPhone 15/16 Pro: 393×852 pt, radio 47, Dynamic Island, 4 botones. */
function iphone(x, base, ancho) {
  const u = ancho / 393;
  const y = base - 852 * u;
  return `<g id="iphone-og" filter="url(#sombra-og)" transform="translate(${n2(x)} ${n2(y)}) scale(${n2(u)})">
    <g fill="#2a2a2c">
      <rect x="-3" y="153" width="3" height="47" rx="1.5"/>
      <rect x="-3" y="230" width="3" height="60" rx="1.5"/>
      <rect x="-3" y="307" width="3" height="60" rx="1.5"/>
      <rect x="393" y="256" width="3" height="94" rx="1.5"/>
    </g>
    <rect width="393" height="852" rx="47" fill="url(#titanio-og)"/>
    <rect x="1" y="1" width="391" height="850" rx="46" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <rect x="10" y="10" width="373" height="832" rx="37" fill="${PIEL}"/>
    <g clip-path="url(#recorte-pantalla-iphone-og)">
      <text x="36" y="46" font-family="${FONTE}" font-size="15" font-weight="600" fill="${TINTA}">9:41</text>
      <g fill="${TINTA}">
        <rect x="316" y="40" width="3" height="5" rx="1"/><rect x="321" y="37.5" width="3" height="7.5" rx="1"/>
        <rect x="326" y="35" width="3" height="10" rx="1"/><rect x="331" y="32.5" width="3" height="12.5" rx="1"/>
      </g>
      <g fill="none" stroke="${TINTA}" stroke-width="1.8" stroke-linecap="round">
        <path d="M 342 40 A 7.6 7.6 0 0 1 352.6 40"/><path d="M 344.6 43 A 4 4 0 0 1 350 43"/>
      </g>
      <circle cx="347.3" cy="45.6" r="1.4" fill="${TINTA}"/>
      <rect x="362" y="36" width="24" height="11.5" rx="3.2" fill="none" stroke="${TINTA}" stroke-opacity="0.35"/>
      <rect x="364" y="38" width="19" height="7.5" rx="1.6" fill="${TINTA}"/>
      ${arteTarjeta(24, 76, 345)}
      <g fill="${BLANCO}" font-family="${FONTE}">
        <text x="44" y="150" font-size="30" font-weight="700"><tspan font-size="15" font-weight="600">Bs </tspan>1.500</text>
        <text x="44" y="176" font-size="15" font-weight="600" opacity="0.9">3 pasajes</text>
        <text x="349" y="276" text-anchor="end" font-size="13" font-weight="600" letter-spacing="1.2" opacity="0.85">MARÍA PÉREZ</text>
      </g>
      <rect x="139" y="310" width="115" height="30" rx="15" fill="#e3e3e8"/>
      <text x="196.5" y="330" text-anchor="middle" font-family="${FONTE}" font-size="14" fill="${TINTA}">Ver reverso</text>
      <text x="24" y="386" font-family="${FONTE}" font-size="20" font-weight="700" fill="${TINTA}">Últimos movimientos</text>
      <rect x="16" y="402" width="361" height="246" rx="20" fill="#ffffff"/>
      ${[
        ["Pasaje en la línea", "Hoy · 07:42", "−500", TINTA],
        ["Pago Móvil aprobado", "Ayer · 06:20", "+1.000", "#008000"],
        ["Recarga en taquilla", "05-nov · 03:03", "+2.000", "#008000"],
      ]
        .map(([t, s, m, c], i) => {
          const top = 402 + i * 82;
          return `        <text x="32" y="${top + 36}" font-family="${FONTE}" font-size="15" font-weight="600" fill="${TINTA}">${t}</text>
        <text x="32" y="${top + 58}" font-family="${FONTE}" font-size="13" fill="${GRIS}">${s}</text>
        <text x="361" y="${top + 47}" text-anchor="end" font-family="${FONTE}" font-size="16" font-weight="600" fill="${c}">${m}</text>${
            i ? `\n        <path d="M 32 ${top} H 361" stroke="rgba(60,60,67,0.12)" stroke-width="1"/>` : ""
          }`;
        })
        .join("\n")}
      <path d="M 0 780 H 393" stroke="rgba(60,60,67,0.12)" stroke-width="1"/>
      <g font-family="${FONTE}" font-size="12" text-anchor="middle">
        <text x="49" y="806" fill="${AZUL}">Inicio</text>
        <text x="147" y="806" fill="${GRIS}">Movimientos</text>
        <text x="246" y="806" fill="${GRIS}">Recargar</text>
        <text x="344" y="806" fill="${GRIS}">Perfil</text>
      </g>
    </g>
    <rect x="136.8" y="18" width="119.4" height="36.6" rx="18.3" fill="#000000"/>
    <rect x="133" y="831" width="127" height="5" rx="2.5" fill="${TINTA}" opacity="0.85"/>
  </g>`;
}

/** iPad Pro 13" horizontal: pantalla 1366×1024 pt, marco de aluminio. */
function ipad(x, base, anchoMarco) {
  const PAD = 50;
  const m = anchoMarco / (1366 + PAD * 2);
  const altoMarco = (1024 + PAD * 2) * m;
  const y = base - altoMarco;
  return `<g id="ipad-og" filter="url(#sombra-og)" transform="translate(${n2(x)} ${n2(y)}) scale(${n2(m)})">
    <rect width="${1366 + PAD * 2}" height="${1024 + PAD * 2}" rx="100" fill="url(#titanio-og)"/>
    <rect x="1.5" y="1.5" width="${1363 + PAD * 2}" height="${1021 + PAD * 2}" rx="98.5" fill="none" stroke="rgba(255,255,255,0.07)"/>
    <circle cx="${(1366 + PAD * 2) / 2}" cy="25" r="10" fill="#0a0a0c"/>
    <rect x="${PAD}" y="${PAD}" width="1366" height="1024" rx="55" fill="${PIEL}"/>
    <g clip-path="url(#recorte-pantalla-ipad-og)" transform="translate(${PAD} ${PAD})">
      <text x="60" y="80" font-family="${FONTE}" font-size="44" font-weight="700" fill="${TINTA}">Blink POS</text>
      <rect x="1128" y="42" width="178" height="46" rx="23" fill="#e4f7ea"/>
      <circle cx="1152" cy="65" r="7" fill="#34c759"/>
      <text x="1168" y="74" font-family="${FONTE}" font-size="24" font-weight="600" fill="${TINTA}">Caja abierta</text>
      <text x="60" y="172" font-family="${FONTE}" font-size="30" fill="${NEUTRO}">Total a cobrar</text>
      <text x="60" y="272" font-family="${FONTE}" font-size="104" font-weight="700" letter-spacing="-3" fill="${TINTA}">Bs 1.500,00</text>
      <text x="60" y="316" font-family="${FONTE}" font-size="28" fill="${NEUTRO}">Dólares y bolívares a tasa BCV</text>
      ${[
        ["Café con leche", "Bs 320,00"],
        ["Pan de queso ×2", "Bs 180,00"],
        ["Jugo natural", "Bs 1.000,00"],
      ]
        .map(([t, mnt], i) => {
          const top = 372 + i * 92;
          return `        <text x="60" y="${top + 34}" font-family="${FONTE}" font-size="34" fill="${TINTA}">${t}</text>
        <text x="1306" y="${top + 34}" text-anchor="end" font-family="${FONTE}" font-size="34" font-weight="600" fill="${TINTA}">${mnt}</text>
        <path d="M 60 ${top + 60} H 1306" stroke="rgba(60,60,67,0.12)" stroke-width="1.5"/>`;
        })
        .join("\n")}
      <rect x="60" y="668" width="1246" height="110" rx="26" fill="${AZUL}"/>
      <text x="683" y="738" text-anchor="middle" font-family="${FONTE}" font-size="44" font-weight="600" fill="${BLANCO}">Cobrar</text>
      <path d="M 0 872 H 1366" stroke="rgba(60,60,67,0.12)" stroke-width="1.5"/>
      <g font-family="${FONTE}" font-size="30" text-anchor="middle">
        <text x="200" y="938" fill="${AZUL}" font-weight="600">Vender</text>
        <text x="560" y="938" fill="${GRIS}">Caja</text>
        <text x="900" y="938" fill="${GRIS}">Productos</text>
        <text x="1200" y="938" fill="${GRIS}">Informes</text>
      </g>
      <rect x="${(1366 - 355) / 2}" y="988" width="355" height="12" rx="6" fill="${TINTA}" opacity="0.85"/>
    </g>
  </g>`;
}

function og() {
  const base = 572;
  const anchoIphone = 212;
  const anchoIpad = 550;
  const hueco = 30;
  const inicio = (1200 - (anchoIpad + hueco + anchoIphone)) / 2;
  const anchoLockup = 260;
  const k = anchoLockup / 869;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="1200" height="630" viewBox="0 0 1200 630" version="1.1" shape-rendering="geometricPrecision">
  <title>Blink — imagen para compartir del ecosistema</title>
  <desc>Composición 1200×630 al estilo de la referencia autorizada de Apple: campo gris claro, lockup «Blink» aprobado arriba y los dos bezels de producto —un iPhone 15 Pro con la billetera Blink Pay y un iPad Pro horizontal con Blink POS— apoyados sobre la misma línea de base. Los trazos del lockup y del arte de la tarjeta se reproducen tal cual de los maestros; la geometría de los bezels sigue las proporciones reales de los dispositivos (393×852 pt radio 47 con Dynamic Island; 1366×1024 pt el iPad).</desc>
  <defs>
    <linearGradient id="campo-og" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f5f5f7"/>
    </linearGradient>
    <radialGradient id="luz-og" cx="0.5" cy="0.62" r="0.62">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="titanio-og" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="#3a3a3c"/><stop offset="40%" stop-color="#1c1c1e"/><stop offset="100%" stop-color="#18181a"/>
    </linearGradient>
    <clipPath id="recorte-tarjeta-og"><rect width="1011" height="638" rx="40"/></clipPath>
    <clipPath id="recorte-pantalla-iphone-og"><rect x="10" y="10" width="373" height="832" rx="37"/></clipPath>
    <clipPath id="recorte-pantalla-ipad-og"><rect width="1366" height="1024" rx="55"/></clipPath>
    <filter id="sombra-og" x="-30%" y="-25%" width="160%" height="165%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#1d1d1f" flood-opacity="0.18"/>
    </filter>
  </defs>
  <g inkscape:groupmode="layer" inkscape:label="Fondo" id="capa-fondo">
    <rect width="1200" height="630" fill="url(#campo-og)"/>
    <rect width="1200" height="630" fill="url(#luz-og)"/>
  </g>
  <g inkscape:groupmode="layer" inkscape:label="Lockup aprobado" id="capa-lockup" transform="translate(${n2((1200 - anchoLockup) / 2)} 44) scale(${n2(k)})" color="${AZUL}">${LOCKUP}</g>
  <g inkscape:groupmode="layer" inkscape:label="iPad Pro" id="capa-ipad">
    ${ipad(inicio, base, anchoIpad)}
  </g>
  <g inkscape:groupmode="layer" inkscape:label="iPhone 15 Pro" id="capa-iphone">
    ${iphone(inicio + anchoIpad + hueco, base, anchoIphone)}
  </g>
  <g inkscape:groupmode="layer" inkscape:label="Mensaje" id="capa-mensaje">
    <text x="600" y="612" text-anchor="middle" font-family="${FONTE}" font-size="22" fill="${NEUTRO}">Muévete y cobra. Con un solo Blink.</text>
  </g>
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
  // SF Pro no está instalado en esta máquina: se inyecta Inter (SIL OFL),
  // el respaldo declarado, para que el raster use una grotesca del estilo.
  const { readFileSync } = await import("node:fs");
  const inter = readFileSync(
    "/home/prodz/Documents/Qoder/2026-10-31/88381b6f/Pay/src/assets/fonts/inter-latin.woff2",
  );
  const cara = `@font-face{font-family:"Inter";font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${inter.toString("base64")}) format("woff2")}`;
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  const svg = readFileSync(join(RAIZ, "assets/og.svg"), "utf8");
  await pagina.setContent(
    `<style>html,body{margin:0;padding:0}svg{width:1200px;height:630px;display:block}${cara}</style>${svg}`,
    { waitUntil: "load" },
  );
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: join(RAIZ, "assets/og.png") });
  await pagina.close();
  console.log("✓ assets/og.png 1200×630");
}

await navegador.close();
