// Lógica pura del equipo: qué rol construye cada pieza y cuándo puede empezar.
// No toca el DOM, así se puede probar con `node --test`.
const ROL_POR_TIPO = {
  contenedor: 'diseno',
  texto: 'frontend',
  imagen: 'medios',
  etiqueta: 'datos'
};
const ROLES_CONSTRUCTORES = ['diseno', 'frontend', 'medios', 'datos'];

function obtenerRol(tipo) {
  return ROL_POR_TIPO[tipo] || ROL_POR_TIPO.contenedor;
}

// piezas: [{ id, tipo, padre, seccion }] en orden de documento.
function crearPlan(piezas) {
  const colas = Object.fromEntries(ROLES_CONSTRUCTORES.map((rol) => [rol, []]));
  const secciones = {};
  piezas.forEach((pieza) => {
    colas[obtenerRol(pieza.tipo)].push(pieza.id);
    if (pieza.seccion === null || pieza.seccion === undefined) return;
    if (!secciones[pieza.seccion]) secciones[pieza.seccion] = [];
    secciones[pieza.seccion].push(pieza.id);
  });
  return { colas, secciones };
}

// Una pieza espera a que su contenedor exista: nadie escribe en una tarjeta sin dibujar.
function puedeEmpezar(pieza, terminadas) {
  return pieza.padre === null || pieza.padre === undefined || terminadas.has(pieza.padre);
}

// Saca de la cola la primera pieza lista; las bloqueadas conservan su turno.
function tomarSiguiente(cola, piezasPorId, terminadas) {
  const indice = cola.findIndex((id) => puedeEmpezar(piezasPorId[id], terminadas));
  return indice === -1 ? null : cola.splice(indice, 1)[0];
}

// Entrega a QA una sección con todas sus piezas terminadas y la marca como tomada.
function tomarSeccionLista(secciones, terminadas, tomadas) {
  const lista = Object.keys(secciones).find((seccion) =>
    !tomadas.has(seccion) && secciones[seccion].every((id) => terminadas.has(id)));
  if (lista === undefined) return null;
  tomadas.add(lista);
  return lista;
}

if (typeof module !== 'undefined') {
  module.exports = { ROL_POR_TIPO, obtenerRol, crearPlan, puedeEmpezar, tomarSiguiente, tomarSeccionLista };
}
