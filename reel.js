// Cinta de proyectos: avanza sola hacia la izquierda y, con el mouse
// sobre los bordes, acelera hacia ese lado. En touch se puede arrastrar.
(() => {
  const reel = document.querySelector('.reel');
  const track = reel && reel.querySelector('.reel__track');
  const group = track && track.querySelector('.reel__group');
  if (!group) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const AUTO = reduceMotion ? 0 : 40; // px/s de avance automático
  const MAX = 900;                    // px/s máximo en los bordes
  const EDGE = 0.3;                   // fracción del ancho que activa el control

  let offset = 0;        // desplazamiento actual (px, positivo = hacia la izquierda)
  let velocity = AUTO;   // velocidad actual, suavizada
  let target = AUTO;     // velocidad deseada
  let groupWidth = 0;
  let dragging = false;
  let dragX = 0;
  let last = performance.now();

  const measure = () => { groupWidth = group.getBoundingClientRect().width; };
  measure();
  addEventListener('resize', measure);
  addEventListener('load', measure);

  // Hover: izquierda retrocede, derecha adelanta, centro mantiene el ritmo base.
  reel.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const rect = reel.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (x < EDGE) {
      const t = 1 - x / EDGE;
      target = -MAX * t * t;
    } else if (x > 1 - EDGE) {
      const t = (x - (1 - EDGE)) / EDGE;
      target = MAX * t * t;
    } else {
      target = AUTO;
    }
  });
  reel.addEventListener('pointerleave', () => { target = AUTO; });

  // Arrastre en pantallas táctiles.
  reel.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    dragging = true;
    dragX = e.clientX;
    velocity = 0;
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    offset -= e.clientX - dragX;
    dragX = e.clientX;
  });
  const endDrag = () => { dragging = false; };
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!dragging) {
      velocity += (target - velocity) * Math.min(1, dt * 4);
      offset += velocity * dt;
    }
    if (groupWidth) offset = ((offset % groupWidth) + groupWidth) % groupWidth;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
