// Formulario de contacto: envía nombre y correo a info@puchworks.com
// a través de FormSubmit (https://formsubmit.co), sin abrir el correo del visitante.
(() => {
  const form = document.querySelector('.contact__form');
  if (!form) return;

  const ENDPOINT = 'https://formsubmit.co/ajax/info@puchworks.com';
  const button = form.querySelector('.contact__submit');
  const status = form.querySelector('.contact__status');

  const setStatus = (text) => { status.textContent = text; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form._honey.value) return; // bot

    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();

    button.disabled = true;
    setStatus('Enviando…');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `${nombre} quiere contactarte desde puchworks.com`,
          _replyto: correo,
          _template: 'table',
          Mensaje: `${nombre} quiere contactarte.`,
          Nombre: nombre,
          Correo: correo,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || res.status);

      form.reset();
      setStatus('¡Gracias! Te contactaremos pronto.');
    } catch {
      setStatus('No se pudo enviar. Escríbenos a info@puchworks.com.');
    } finally {
      button.disabled = false;
    }
  });
})();
