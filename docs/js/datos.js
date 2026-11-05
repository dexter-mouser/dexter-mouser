// Contenido editable del portafolio. Cambia aquí proyectos y contacto; el resto se arma solo.
const USUARIO_GITHUB = 'dexter-mouser';

const CONTACTO = {
  // Edita: tu URL de LinkedIn y el correo que quieres mostrar.
  linkedin: 'https://www.linkedin.com/in/TU-USUARIO/',
  correo: 'TU-CORREO@ejemplo.com',
  github: `https://github.com/${USUARIO_GITHUB}`
};

const PROYECTOS = [
  {
    repo: 'CRM-BASE',
    nombre: 'CRM Base',
    descripcion: 'CRM para tiendas con inicio de sesión por roles y cuentas de prueba.',
    tecnologias: ['JavaScript', 'HTML', 'CSS'],
    tieneDemo: true,
    imagen: 'img/CRM-BASE.jpg'
  },
  {
    repo: 'HorarioNotas',
    nombre: 'Horario + Notas',
    descripcion: 'Agenda semanal por días con notas, tareas y calendario.',
    tecnologias: ['JavaScript', 'HTML', 'CSS'],
    tieneDemo: true,
    imagen: 'img/HorarioNotas.jpg'
  },
  {
    repo: 'STOP',
    nombre: '¡Stop!',
    descripcion: 'Juego de palabras: el anfitrión lleva la partida y cada jugador escribe desde su celular.',
    tecnologias: ['JavaScript', 'HTML', 'CSS'],
    tieneDemo: true,
    imagen: 'img/STOP.jpg'
  },
  {
    repo: 'demoBingo',
    nombre: 'Bingo',
    descripcion: 'Bingo sin complicaciones: anfitrión, jugadores y cartones desde el navegador.',
    tecnologias: ['JavaScript', 'HTML', 'CSS'],
    tieneDemo: true,
    imagen: 'img/demoBingo.jpg'
  },
  {
    repo: 'demoSUMI-Cachiporra.',
    nombre: 'SumiPorra',
    descripcion: 'Juego de grupo: cada quien elige un número en secreto y toca con cuidado.',
    tecnologias: ['JavaScript', 'HTML', 'CSS'],
    tieneDemo: true,
    imagen: 'img/demoSUMI-Cachiporra.jpg'
  },
  {
    repo: 'ASCII',
    nombre: 'ASCII',
    descripcion: 'Experimento visual hecho solo con caracteres ASCII sobre fondo negro.',
    tecnologias: ['JavaScript'],
    tieneDemo: true,
    imagen: 'img/ASCII.jpg'
  },
  {
    repo: 'Horario',
    nombre: 'Horario',
    descripcion: 'Horario semanal con vista por día y botón para añadir clases.',
    tecnologias: ['JavaScript', 'HTML', 'CSS'],
    tieneDemo: true,
    imagen: 'img/Horario.jpg'
  },
  {
    repo: 'POO-pokemon',
    nombre: 'POO Pokémon',
    descripcion: 'Práctica de programación orientada a objetos en Java con temática Pokémon.',
    tecnologias: ['Java'],
    tieneDemo: false,
    archivo: 'src/Pokemon.java'
  },
  {
    repo: 'inventarioNoel',
    nombre: 'Inventario Noel',
    descripcion: 'Sistema de inventario en Java para un caso de estudio.',
    tecnologias: ['Java'],
    tieneDemo: false,
    archivo: 'src/Inventario.java'
  },
  {
    repo: 'as500',
    nombre: 'as500',
    descripcion: 'Scripts y pruebas en Python.',
    tecnologias: ['Python'],
    tieneDemo: false,
    archivo: 'main.py'
  }
];
