// Ejecutar con: node --test pruebas/
const { test } = require('node:test');
const assert = require('node:assert');
const {
  crearPlan, puedeEmpezar, tomarSiguiente, tomarSeccionLista
} = require('../docs/js/asignacion.js');

const PIEZAS = [
  { id: 0, tipo: 'contenedor', padre: null, seccion: 'proyectos' },
  { id: 1, tipo: 'texto', padre: 0, seccion: 'proyectos' },
  { id: 2, tipo: 'imagen', padre: 0, seccion: 'proyectos' },
  { id: 3, tipo: 'etiqueta', padre: 0, seccion: 'proyectos' },
  { id: 4, tipo: 'desconocido', padre: null, seccion: null }
];
const PIEZAS_POR_ID = Object.fromEntries(PIEZAS.map((pieza) => [pieza.id, pieza]));

test('toda pieza queda en la cola de un rol', () => {
  const { colas } = crearPlan(PIEZAS);
  const asignadas = Object.values(colas).flat().sort();
  assert.deepStrictEqual(asignadas, [0, 1, 2, 3, 4]);
  assert.deepStrictEqual(colas.diseno, [0, 4]);
  assert.deepStrictEqual(colas.frontend, [1]);
});

test('una pieza no empieza antes que su contenedor', () => {
  assert.strictEqual(puedeEmpezar(PIEZAS[1], new Set()), false);
  assert.strictEqual(puedeEmpezar(PIEZAS[1], new Set([0])), true);
  assert.strictEqual(tomarSiguiente([1], PIEZAS_POR_ID, new Set()), null);
});

test('tomarSiguiente salta las bloqueadas y respeta su turno', () => {
  const cola = [1, 4];
  assert.strictEqual(tomarSiguiente(cola, PIEZAS_POR_ID, new Set()), 4);
  assert.deepStrictEqual(cola, [1]);
});

test('QA solo recibe secciones completas y una sola vez', () => {
  const { secciones } = crearPlan(PIEZAS);
  const tomadas = new Set();
  assert.strictEqual(tomarSeccionLista(secciones, new Set([0, 1, 2]), tomadas), null);
  assert.strictEqual(tomarSeccionLista(secciones, new Set([0, 1, 2, 3]), tomadas), 'proyectos');
  assert.strictEqual(tomarSeccionLista(secciones, new Set([0, 1, 2, 3]), tomadas), null);
});

test('una lista vacía no rompe nada', () => {
  const { colas, secciones } = crearPlan([]);
  assert.deepStrictEqual(Object.values(colas).flat(), []);
  assert.strictEqual(tomarSiguiente([], {}, new Set()), null);
  assert.strictEqual(tomarSeccionLista(secciones, new Set(), new Set()), null);
});
