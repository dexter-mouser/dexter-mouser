// Roles, agentes y tiempos del equipo que construye la página.
// Colores oscuros a propósito: las etiquetas de los cursores llevan texto blanco.
const ROLES = {
  diseno: { nombre: 'Diseño', color: '#2563eb' },
  frontend: { nombre: 'Frontend', color: '#c2410c' },
  medios: { nombre: 'Medios', color: '#7c3aed' },
  datos: { nombre: 'Datos', color: '#0e7490' },
  qa: { nombre: 'QA', color: '#15803d' }
};

const AGENTES = [
  { nombre: 'Ada', rol: 'diseno', color: '#2563eb' },
  { nombre: 'Grace', rol: 'diseno', color: '#1d4ed8' },
  { nombre: 'Margaret', rol: 'diseno', color: '#1e40af' },
  { nombre: 'Linus', rol: 'frontend', color: '#c2410c' },
  { nombre: 'Ken', rol: 'frontend', color: '#9a3412' },
  { nombre: 'Dennis', rol: 'frontend', color: '#b45309' },
  { nombre: 'Hedy', rol: 'medios', color: '#7c3aed' },
  { nombre: 'Alan', rol: 'medios', color: '#6d28d9' },
  { nombre: 'Barbara', rol: 'datos', color: '#0e7490' },
  { nombre: 'Edsger', rol: 'datos', color: '#0369a1' },
  { nombre: 'Tim', rol: 'qa', color: '#15803d' },
  { nombre: 'Frances', rol: 'qa', color: '#166534' }
];

const VELOCIDADES = [1, 2, 0.5];
// Multiplica todos los tiempos: la velocidad "1x" ya va 3 veces más rápido que los TIEMPOS de abajo.
const RAPIDEZ_BASE = 3;

// Milisegundos a velocidad 1x.
const TIEMPOS = {
  moverMin: 360,
  moverMax: 1100,
  dibujarMin: 450,
  dibujarMax: 1200,
  revisar: 180,
  pausa: 180,
  entradaEscalonada: 160,
  retirarCaja: 800,
  esperaBloqueado: 150,
  msPorLetra: 38,
  escrituraMaxima: 2000,
  barridoTitulo: 1700,
  revelarImagen: 950,
  rebote: 450,
  contador: 700,
  recorridoQA: 380,
  check: 1100
};

// Milisegundos por píxel recorrido: lo lejano tarda más, sin pasar de los límites.
const FACTOR_MOVER = 0.75;
const FACTOR_DIBUJAR = 0.95;
const LARGO_MAXIMO_ESCRITURA = 200;
