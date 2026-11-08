// Blink — interacciones de la landing: el año del pie y el acordeón de preguntas.

const anio = document.getElementById("anio");
if (anio) anio.textContent = String(new Date().getFullYear());

const respuestas = [...document.querySelectorAll(".lp-acordeon__boton")].map(
  (boton) => ({
    boton,
    item: boton.closest(".lp-acordeon__item"),
    panel: document.getElementById(boton.getAttribute("aria-controls")),
  }),
);

function cerrar(todo) {
  for (const { boton, item, panel } of todo) {
    boton.setAttribute("aria-expanded", "false");
    item.classList.remove("lp-acordeon__item--abierto");
    if (panel) panel.inert = true;
  }
}

cerrar(respuestas);

for (const abierta of respuestas) {
  abierta.boton.addEventListener("click", () => {
    const yaAbierta = abierta.boton.getAttribute("aria-expanded") === "true";
    cerrar(respuestas);
    if (yaAbierta) return;

    abierta.boton.setAttribute("aria-expanded", "true");
    abierta.item.classList.add("lp-acordeon__item--abierto");
    if (abierta.panel) abierta.panel.inert = false;
  });
}
