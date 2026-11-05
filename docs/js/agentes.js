// Motor: crea los cursores, reparte las tareas de las colas y lleva el avance.
const RUTA_CURSOR = 'M2 2 L2 17 L6.5 12.8 L9.6 19.5 L12.4 18.2 L9.4 11.6 L15.5 11.6 Z';

let velocidadActual = 1;
let ejecucionActual = null;

function escalar(ms) {
  return ms / (velocidadActual * RAPIDEZ_BASE);
}

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, escalar(ms)));
}

function limitar(valor, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, valor));
}

function medirElemento(elemento) {
  const rect = elemento.getBoundingClientRect();
  return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, ancho: rect.width, alto: rect.height };
}

function crearCapaAgentes() {
  const capa = document.createElement('div');
  capa.className = 'capa-agentes';
  capa.setAttribute('aria-hidden', 'true');
  capa.style.height = `${document.documentElement.scrollHeight}px`;
  document.body.append(capa);
  return capa;
}

// Flecha y etiqueta del agente; la usan los cursores que construyen y la órbita del inicio.
function crearMarcadorCursor(agente, clase) {
  const cursor = document.createElement('div');
  cursor.className = clase;
  cursor.style.setProperty('--color-agente', agente.color);
  const svg = document.createElementNS(ESPACIO_SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 18 21');
  const ruta = document.createElementNS(ESPACIO_SVG, 'path');
  ruta.setAttribute('d', RUTA_CURSOR);
  svg.append(ruta);
  const etiqueta = document.createElement('span');
  etiqueta.className = 'etiqueta-agente';
  etiqueta.textContent = `${agente.nombre} · ${ROLES[agente.rol].nombre}`;
  cursor.append(svg, etiqueta);
  return cursor;
}

function crearCursor(agente, capa) {
  const cursor = crearMarcadorCursor(agente, 'cursor-agente');
  capa.append(cursor);
  return cursor;
}

function ocultarPiezas(raiz) {
  raiz.querySelectorAll('[data-capa]').forEach((elemento) => elemento.classList.add('capa-oculta'));
}

function colocarCursor(cursor, x, y, ms) {
  cursor.style.transitionDuration = `${escalar(ms)}ms`;
  cursor.style.transform = `translate(${x}px, ${y}px)`;
  cursor.dataset.x = x;
  cursor.dataset.y = y;
}

function marcarTerminada(id, ejecucion) {
  if (ejecucion.terminadas.has(id)) return;
  revelarElemento(ejecucion.elementosPorId[id]);
  ejecucion.terminadas.add(id);
  ejecucion.alAvanzar(ejecucion.terminadas.size, ejecucion.total);
}

async function ejecutarTarea(agente, cursor, id, ejecucion) {
  const elemento = ejecucion.elementosPorId[id];
  const medida = medirElemento(elemento);
  // Piezas sin tamaño (tarjetas filtradas) no tienen nada que dibujar.
  if (medida.ancho > 0 && medida.alto > 0) {
    await EFECTOS[agente.rol](agente, cursor, elemento, medida, ejecucion);
  }
  if (ejecucion.estaActiva) marcarTerminada(id, ejecucion);
}

async function trabajarConstructor(agente, cursor, ejecucion) {
  const cola = ejecucion.colas[agente.rol];
  while (ejecucion.estaActiva && cola.length > 0) {
    const id = tomarSiguiente(cola, ejecucion.piezasPorId, ejecucion.terminadas);
    if (id === null) {
      await esperar(TIEMPOS.esperaBloqueado);
      continue;
    }
    await ejecutarTarea(agente, cursor, id, ejecucion);
  }
}

async function trabajarRevisor(agente, cursor, ejecucion) {
  const totalSecciones = Object.keys(ejecucion.secciones).length;
  while (ejecucion.estaActiva && ejecucion.seccionesTomadas.size < totalSecciones) {
    const seccion = tomarSeccionLista(ejecucion.secciones, ejecucion.terminadas, ejecucion.seccionesTomadas);
    if (seccion === null) {
      await esperar(TIEMPOS.esperaBloqueado);
      continue;
    }
    const elemento = document.querySelector(`[data-seccion="${seccion}"]`);
    await efectoQA(agente, cursor, elemento, medirElemento(elemento), ejecucion);
  }
}

async function trabajarAgente(agente, indice, ejecucion) {
  const cursor = crearCursor(agente, ejecucion.capa);
  // Si venían girando en la pantalla de inicio, salen desde ese punto.
  const inicio = ejecucion.posiciones[indice] || {
    x: (window.innerWidth / (AGENTES.length + 1)) * (indice + 1),
    y: window.scrollY + window.innerHeight * 0.7
  };
  colocarCursor(cursor, inicio.x, inicio.y, 0);
  await esperar(indice * TIEMPOS.entradaEscalonada);
  if (agente.rol === 'qa') {
    await trabajarRevisor(agente, cursor, ejecucion);
  } else {
    await trabajarConstructor(agente, cursor, ejecucion);
  }
  cursor.classList.add('cursor-retirado');
}

function describirPiezas(elementos) {
  const idPorElemento = new Map(elementos.map((elemento, id) => [elemento, id]));
  return elementos.map((elemento, id) => {
    const padre = elemento.parentElement ? elemento.parentElement.closest('[data-capa]') : null;
    const seccion = elemento.closest('[data-seccion]');
    return {
      id,
      tipo: elemento.dataset.capa,
      padre: padre ? idPorElemento.get(padre) : null,
      seccion: seccion ? seccion.dataset.seccion : null
    };
  });
}

function finalizarEjecucion(ejecucion) {
  ejecucion.estaActiva = false;
  ejecucion.elementosPorId.forEach((_, id) => marcarTerminada(id, ejecucion));
  setTimeout(() => ejecucion.capa.remove(), escalar(TIEMPOS.retirarCaja));
  ejecucion.alTerminar();
}

function cancelarEjecucion() {
  if (!ejecucionActual) return;
  ejecucionActual.estaActiva = false;
  ejecucionActual.capa.remove();
  ejecucionActual = null;
}

function construirPagina(raiz, { alAvanzar, alTerminar, posiciones = [] }) {
  cancelarEjecucion();
  ocultarPiezas(raiz);
  const elementos = [...raiz.querySelectorAll('[data-capa]')];
  const piezas = describirPiezas(elementos);
  const ejecucion = {
    ...crearPlan(piezas),
    estaActiva: true,
    piezasPorId: piezas,
    elementosPorId: elementos,
    terminadas: new Set(),
    seccionesTomadas: new Set(),
    total: elementos.length,
    posiciones,
    capa: crearCapaAgentes(),
    alAvanzar,
    alTerminar
  };
  ejecucionActual = ejecucion;
  alAvanzar(0, ejecucion.total);
  Promise.all(AGENTES.map((agente, indice) => trabajarAgente(agente, indice, ejecucion)))
    .then(() => { if (ejecucion.estaActiva) finalizarEjecucion(ejecucion); });
}

function terminarConstruccion() {
  if (ejecucionActual && ejecucionActual.estaActiva) finalizarEjecucion(ejecucionActual);
}

function estaConstruyendo() {
  return Boolean(ejecucionActual && ejecucionActual.estaActiva);
}

function cambiarVelocidad() {
  const indice = VELOCIDADES.indexOf(velocidadActual);
  velocidadActual = VELOCIDADES[(indice + 1) % VELOCIDADES.length];
  return velocidadActual;
}
