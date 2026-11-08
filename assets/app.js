// Blink — interacciones mínimas: barra translúcida y aparición al hacer scroll.

const barra = document.getElementById("barra");
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

function ajustarBarra() {
  if (!barra) return;
  barra.classList.toggle("barra--transparente", window.scrollY < 24);
}

ajustarBarra();
window.addEventListener("scroll", ajustarBarra, { passive: true });

const anio = document.getElementById("anio");
if (anio) anio.textContent = String(new Date().getFullYear());

const pendientes = document.querySelectorAll("[data-revelar]");

if (reducirMovimiento.matches || !("IntersectionObserver" in window)) {
  pendientes.forEach((el) => el.classList.add("visible"));
} else {
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  pendientes.forEach((el) => observador.observe(el));
}
