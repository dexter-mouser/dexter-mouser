// Cómo construye cada rol. Usa las utilidades del motor (agentes.js): esperar, escalar, limitar, colocarCursor.
const ESPACIO_SVG = 'http://www.w3.org/2000/svg';

function revelarElemento(elemento) {
  elemento.classList.remove('capa-oculta');
}

function crearCaja(agente, medida, capa) {
  const caja = document.createElement('div');
  caja.className = 'caja-agente';
  caja.style.setProperty('--color-agente', agente.color);
  caja.style.left = `${medida.x}px`;
  caja.style.top = `${medida.y}px`;
  const etiqueta = document.createElement('span');
  etiqueta.className = 'medida-caja';
  etiqueta.textContent = '0 × 0';
  caja.append(etiqueta);
  capa.append(caja);
  return caja;
}

// La etiqueta de medidas cuenta desde 0 mientras la caja crece.
function animarMedida(etiqueta, ancho, alto, ms) {
  const inicio = performance.now();
  const avanzar = (ahora) => {
    // El sello de tiempo del cuadro puede ser anterior a `inicio`: se limita a 0.
    const progreso = limitar((ahora - inicio) / ms, 0, 1);
    etiqueta.textContent = `${Math.round(ancho * progreso)} × ${Math.round(alto * progreso)}`;
    if (progreso < 1) requestAnimationFrame(avanzar);
  };
  requestAnimationFrame(avanzar);
}

async function moverA(cursor, x, y) {
  const distancia = Math.hypot(x - Number(cursor.dataset.x), y - Number(cursor.dataset.y));
  const ms = limitar(distancia * FACTOR_MOVER, TIEMPOS.moverMin, TIEMPOS.moverMax);
  colocarCursor(cursor, x, y, ms);
  await esperar(ms + TIEMPOS.revisar);
}

// Dibuja el recuadro de selección de esquina a esquina. Devuelve null si la ejecución se canceló.
async function trazarCaja(agente, cursor, medida, ejecucion) {
  await moverA(cursor, medida.x, medida.y);
  if (!ejecucion.estaActiva) return null;
  const caja = crearCaja(agente, medida, ejecucion.capa);
  const ms = limitar(Math.hypot(medida.ancho, medida.alto) * FACTOR_DIBUJAR, TIEMPOS.dibujarMin, TIEMPOS.dibujarMax);
  void caja.offsetWidth; // fija el tamaño 0 × 0 para que la transición arranque desde la esquina
  caja.style.transitionDuration = `${escalar(ms)}ms`;
  caja.style.width = `${medida.ancho}px`;
  caja.style.height = `${medida.alto}px`;
  animarMedida(caja.querySelector('.medida-caja'), medida.ancho, medida.alto, escalar(ms));
  colocarCursor(cursor, medida.x + medida.ancho, medida.y + medida.alto, ms);
  await esperar(ms + TIEMPOS.revisar);
  return ejecucion.estaActiva ? caja : null;
}

function retirarCaja(caja) {
  caja.classList.add('caja-terminada');
  setTimeout(() => caja.remove(), escalar(TIEMPOS.retirarCaja));
}

function puedeEscribirse(elemento) {
  const texto = elemento.textContent.trim();
  const soloTieneTexto = [...elemento.childNodes].every((nodo) => nodo.nodeType === Node.TEXT_NODE);
  return soloTieneTexto && texto.length > 0 && texto.length <= LARGO_MAXIMO_ESCRITURA;
}

async function escribirTexto(elemento, ejecucion) {
  const original = elemento.textContent;
  const texto = original.trim();
  const escrito = document.createElement('span');
  const pendiente = document.createElement('span');
  pendiente.className = 'texto-pendiente';
  pendiente.textContent = texto;
  elemento.replaceChildren(escrito, pendiente);
  revelarElemento(elemento);
  const msPorLetra = Math.min(TIEMPOS.msPorLetra, TIEMPOS.escrituraMaxima / texto.length);
  for (let letras = 1; letras <= texto.length && ejecucion.estaActiva; letras++) {
    escrito.textContent = texto.slice(0, letras);
    pendiente.textContent = texto.slice(letras);
    await esperar(msPorLetra);
  }
  elemento.textContent = original;
}

// Cuenta desde 0 hasta el número final de cada [data-contador] dentro del elemento.
function contarDesdeCero(elemento) {
  const contadores = elemento.matches('[data-contador]') ? [elemento] : [...elemento.querySelectorAll('[data-contador]')];
  contadores.forEach((contador) => {
    const final = Number(contador.dataset.contador);
    const inicio = performance.now();
    const ms = escalar(TIEMPOS.contador);
    const avanzar = (ahora) => {
      const progreso = limitar((ahora - inicio) / ms, 0, 1);
      contador.textContent = String(Math.round(final * progreso));
      if (progreso < 1) requestAnimationFrame(avanzar);
    };
    requestAnimationFrame(avanzar);
  });
}

async function efectoDiseno(agente, cursor, elemento, medida, ejecucion) {
  const caja = await trazarCaja(agente, cursor, medida, ejecucion);
  if (!caja) return;
  revelarElemento(elemento);
  retirarCaja(caja);
  await esperar(TIEMPOS.pausa);
}

async function efectoFrontend(agente, cursor, elemento, medida, ejecucion) {
  const caja = await trazarCaja(agente, cursor, medida, ejecucion);
  if (!caja) return;
  colocarCursor(cursor, medida.x, medida.y + medida.alto, TIEMPOS.moverMin);
  if (elemento.classList.contains('titulo-epico')) {
    // El título tiene su propio barrido en CSS; su duración sigue la velocidad del equipo.
    elemento.style.transitionDuration = `${escalar(TIEMPOS.barridoTitulo)}ms`;
    revelarElemento(elemento);
    await esperar(TIEMPOS.barridoTitulo);
    elemento.style.transitionDuration = '';
  } else if (puedeEscribirse(elemento)) {
    await escribirTexto(elemento, ejecucion);
  } else {
    revelarElemento(elemento);
  }
  retirarCaja(caja);
  await esperar(TIEMPOS.pausa);
}

function crearBarrido(medida, agente, capa) {
  const barrido = document.createElement('div');
  barrido.className = 'barrido-imagen';
  barrido.style.setProperty('--color-agente', agente.color);
  barrido.style.left = `${medida.x}px`;
  barrido.style.top = `${medida.y}px`;
  barrido.style.width = `${medida.ancho}px`;
  barrido.style.setProperty('--alto-barrido', `${medida.alto}px`);
  barrido.style.animationDuration = `${escalar(TIEMPOS.revelarImagen)}ms`;
  capa.append(barrido);
  return barrido;
}

async function efectoMedios(agente, cursor, elemento, medida, ejecucion) {
  const caja = await trazarCaja(agente, cursor, medida, ejecucion);
  if (!caja) return;
  elemento.style.transitionDuration = `${escalar(TIEMPOS.revelarImagen)}ms`;
  revelarElemento(elemento);
  const barrido = crearBarrido(medida, agente, ejecucion.capa);
  colocarCursor(cursor, medida.x + medida.ancho, medida.y + medida.alto, TIEMPOS.revelarImagen);
  await esperar(TIEMPOS.revelarImagen);
  barrido.remove();
  elemento.style.transitionDuration = '';
  retirarCaja(caja);
}

async function efectoDatos(agente, cursor, elemento, medida, ejecucion) {
  const caja = await trazarCaja(agente, cursor, medida, ejecucion);
  if (!caja) return;
  elemento.style.animationDuration = `${escalar(TIEMPOS.rebote)}ms`;
  elemento.classList.add('rebote');
  revelarElemento(elemento);
  contarDesdeCero(elemento);
  await esperar(TIEMPOS.rebote);
  elemento.classList.remove('rebote');
  elemento.style.animationDuration = '';
  retirarCaja(caja);
}

function crearMarcaRevision(agente, medida, capa) {
  const marca = document.createElement('div');
  marca.className = 'revision-qa';
  marca.style.setProperty('--color-agente', agente.color);
  marca.style.left = `${medida.x}px`;
  marca.style.top = `${medida.y}px`;
  marca.style.width = `${medida.ancho}px`;
  marca.style.height = `${medida.alto}px`;
  const check = document.createElementNS(ESPACIO_SVG, 'svg');
  check.setAttribute('viewBox', '0 0 24 24');
  check.classList.add('check-qa');
  const trazo = document.createElementNS(ESPACIO_SVG, 'path');
  trazo.setAttribute('d', 'M5 12.5l4.5 4.5L19 7.5');
  check.append(trazo);
  marca.append(check);
  capa.append(marca);
  return marca;
}

// QA recorre las cuatro esquinas de la sección y deja un check.
async function efectoQA(agente, cursor, seccion, medida, ejecucion) {
  const marca = crearMarcaRevision(agente, medida, ejecucion.capa);
  const esquinas = [
    [medida.x, medida.y], [medida.x + medida.ancho, medida.y],
    [medida.x + medida.ancho, medida.y + medida.alto], [medida.x, medida.y + medida.alto]
  ];
  for (const [x, y] of esquinas) {
    if (!ejecucion.estaActiva) break;
    colocarCursor(cursor, x, y, TIEMPOS.recorridoQA);
    await esperar(TIEMPOS.recorridoQA);
  }
  marca.classList.add('revision-aprobada');
  await esperar(TIEMPOS.check);
  marca.classList.add('caja-terminada');
  setTimeout(() => marca.remove(), escalar(TIEMPOS.retirarCaja));
}

const EFECTOS = {
  diseno: efectoDiseno,
  frontend: efectoFrontend,
  medios: efectoMedios,
  datos: efectoDatos
};
