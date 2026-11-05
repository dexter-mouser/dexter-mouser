const COLORES_TECNOLOGIA = {
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#663399'
};
const FILTROS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'demo', nombre: 'Demos' },
  { id: 'codigo', nombre: 'Solo código' }
];
const LINEAS_VISTA_CODIGO = 9;
const DURACION_AVISO = 2600;

function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function crearEnlaceExterno(clase, texto, url) {
  const enlace = crearElemento('a', clase, texto);
  enlace.href = url;
  enlace.target = '_blank';
  enlace.rel = 'noopener';
  return enlace;
}

function marcarCapa(elemento, tipo) {
  elemento.dataset.capa = tipo;
  return elemento;
}

function obtenerUrlDemo(proyecto) {
  return `https://${USUARIO_GITHUB}.github.io/${proyecto.repo}/`;
}

function obtenerUrlRepo(proyecto) {
  return `https://github.com/${USUARIO_GITHUB}/${proyecto.repo}`;
}

// Anchos de línea estables a partir del nombre, para que cada repo tenga su "código".
function generarLineasCodigo(semillaTexto, cantidad) {
  let semilla = [...semillaTexto].reduce((suma, letra) => suma * 31 + letra.charCodeAt(0), 7) >>> 0;
  return Array.from({ length: cantidad }, () => {
    semilla = (semilla * 1103515245 + 12345) >>> 0;
    return { sangria: semilla % 3, ancho: 30 + (semilla >>> 8) % 60, esResaltada: semilla % 4 === 0 };
  });
}

function crearVistaCodigo(proyecto) {
  const vista = crearElemento('div', 'vista-codigo');
  const cabecera = crearElemento('div', 'vista-codigo-archivo');
  cabecera.append(crearElemento('span', 'puntos-ventana'), crearElemento('span', '', proyecto.archivo));
  vista.append(cabecera);
  generarLineasCodigo(proyecto.repo, LINEAS_VISTA_CODIGO).forEach((linea) => {
    const barra = crearElemento('span', linea.esResaltada ? 'linea-codigo linea-resaltada' : 'linea-codigo');
    barra.style.marginLeft = `${linea.sangria * 14}px`;
    barra.style.width = `${linea.ancho}%`;
    vista.append(barra);
  });
  return vista;
}

function crearVistaPrevia(proyecto) {
  const url = proyecto.tieneDemo ? obtenerUrlDemo(proyecto) : obtenerUrlRepo(proyecto);
  const enlace = marcarCapa(crearEnlaceExterno('tarjeta-vista', '', url), 'imagen');
  enlace.setAttribute('aria-label', `Abrir ${proyecto.nombre}`);
  if (!proyecto.tieneDemo) {
    enlace.append(crearVistaCodigo(proyecto));
    return enlace;
  }
  const imagen = crearElemento('img');
  imagen.src = proyecto.imagen;
  imagen.alt = `Captura de ${proyecto.nombre}`;
  imagen.width = 640;
  imagen.height = 400;
  enlace.append(imagen);
  return enlace;
}

function crearTecnologias(proyecto) {
  const lista = crearElemento('ul', 'tecnologias');
  lista.setAttribute('aria-label', 'Tecnologías');
  proyecto.tecnologias.forEach((nombre) => {
    const etiqueta = marcarCapa(crearElemento('li', 'tecnologia', nombre), 'etiqueta');
    etiqueta.style.setProperty('--color-tecnologia', COLORES_TECNOLOGIA[nombre] || 'var(--texto-suave)');
    lista.append(etiqueta);
  });
  return lista;
}

function crearAcciones(proyecto) {
  const acciones = crearElemento('div', 'tarjeta-acciones');
  if (proyecto.tieneDemo) {
    acciones.append(marcarCapa(crearEnlaceExterno('boton boton-principal boton-pequeno', 'Ver demo', obtenerUrlDemo(proyecto)), 'texto'));
  }
  acciones.append(marcarCapa(crearEnlaceExterno('boton boton-pequeno', 'Código', obtenerUrlRepo(proyecto)), 'texto'));
  return acciones;
}

function crearTarjeta(proyecto) {
  const tarjeta = marcarCapa(crearElemento('article', 'tarjeta'), 'contenedor');
  tarjeta.dataset.tipo = proyecto.tieneDemo ? 'demo' : 'codigo';
  const cuerpo = crearElemento('div', 'tarjeta-cuerpo');
  cuerpo.append(
    marcarCapa(crearElemento('h3', 'tarjeta-nombre', proyecto.nombre), 'texto'),
    marcarCapa(crearElemento('p', 'tarjeta-descripcion', proyecto.descripcion), 'texto'),
    crearTecnologias(proyecto),
    crearAcciones(proyecto)
  );
  tarjeta.append(crearVistaPrevia(proyecto), cuerpo);
  return tarjeta;
}

function contarProyectos(filtroId) {
  if (filtroId === 'todos') return PROYECTOS.length;
  return PROYECTOS.filter((proyecto) => (filtroId === 'demo') === proyecto.tieneDemo).length;
}

function aplicarFiltro(filtroId) {
  document.querySelectorAll('.tarjeta').forEach((tarjeta) => {
    tarjeta.hidden = filtroId !== 'todos' && tarjeta.dataset.tipo !== filtroId;
  });
  document.querySelectorAll('.filtro').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(boton.dataset.filtro === filtroId));
  });
}

function crearFiltros(contenedor) {
  FILTROS.forEach((filtro) => {
    const boton = marcarCapa(crearElemento('button', 'filtro', filtro.nombre), 'etiqueta');
    boton.type = 'button';
    boton.dataset.filtro = filtro.id;
    const cantidad = crearElemento('span', 'filtro-cantidad', String(contarProyectos(filtro.id)));
    cantidad.dataset.contador = contarProyectos(filtro.id);
    boton.append(cantidad);
    boton.addEventListener('click', () => aplicarFiltro(filtro.id));
    contenedor.append(boton);
  });
  aplicarFiltro('todos');
}

let temporizadorAviso = null;

function mostrarAviso(texto) {
  const aviso = document.getElementById('aviso');
  aviso.textContent = texto;
  aviso.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { aviso.hidden = true; }, DURACION_AVISO);
}

async function copiarCorreo(valor) {
  try {
    await navigator.clipboard.writeText(CONTACTO.correo);
    mostrarAviso('Correo copiado correctamente');
  } catch (error) {
    console.error('No se pudo copiar el correo:', error);
    window.getSelection().selectAllChildren(valor);
    mostrarAviso('Correo seleccionado: cópialo con Ctrl+C');
  }
}

function crearContacto(tipo, texto, accion) {
  const tarjeta = marcarCapa(crearElemento('div', 'contacto'), 'contenedor');
  const valor = marcarCapa(crearElemento('p', 'contacto-valor', texto), 'texto');
  tarjeta.append(marcarCapa(crearElemento('p', 'contacto-tipo', tipo), 'texto'), valor, accion(valor));
  return tarjeta;
}

function crearBotonEnlace(texto, url) {
  return () => marcarCapa(crearEnlaceExterno('boton boton-pequeno', texto, url), 'texto');
}

function pintarContactos(contenedor) {
  const botonCopiar = (valor) => {
    const boton = marcarCapa(crearElemento('button', 'boton boton-principal boton-pequeno', 'Copiar correo'), 'texto');
    boton.type = 'button';
    boton.addEventListener('click', () => copiarCorreo(valor));
    return boton;
  };
  contenedor.append(
    crearContacto('Correo', CONTACTO.correo, botonCopiar),
    crearContacto('LinkedIn', 'Perfil profesional', crearBotonEnlace('Abrir LinkedIn', CONTACTO.linkedin)),
    crearContacto('GitHub', `@${USUARIO_GITHUB}`, crearBotonEnlace('Ver repositorios', CONTACTO.github))
  );
}

function actualizarBarra(hechas, total) {
  document.getElementById('barra-hechas').textContent = hechas;
  document.getElementById('barra-total').textContent = total;
  const porcentaje = total === 0 ? 0 : (hechas / total) * 100;
  document.getElementById('barra-relleno').style.width = `${porcentaje}%`;
}

function marcarBarraTerminada(estaTerminada) {
  document.getElementById('barra').classList.toggle('barra-terminada', estaTerminada);
}

function iniciarConstruccion(posiciones = []) {
  window.scrollTo({ top: 0 });
  document.getElementById('barra').hidden = false;
  marcarBarraTerminada(false);
  construirPagina(document.body, {
    alAvanzar: actualizarBarra,
    alTerminar: () => marcarBarraTerminada(true),
    posiciones
  });
}

function crearOrbita(orbita) {
  AGENTES.forEach((agente, indice) => {
    const satelite = crearElemento('div', 'satelite');
    satelite.style.setProperty('--angulo', `${(360 / AGENTES.length) * indice}deg`);
    satelite.append(crearMarcadorCursor(agente, 'cursor-orbita'));
    orbita.append(satelite);
  });
}

// Punto de la punta de cada flecha en la página, para que los agentes salgan desde ahí.
function medirPosicionesOrbita() {
  return [...document.querySelectorAll('.cursor-orbita')].map((cursor) => {
    const rect = cursor.getBoundingClientRect();
    return { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
  });
}

function mostrarPantallaInicio() {
  const pantalla = document.getElementById('pantalla-inicio');
  ocultarPiezas(document.body);
  crearOrbita(document.getElementById('orbita'));
  const roles = Object.keys(ROLES).length;
  document.getElementById('inicio-ayuda').textContent = `${AGENTES.length} agentes listos · ${roles} roles`;
  pantalla.hidden = false;
  const boton = document.getElementById('boton-inicio');
  boton.focus();
  boton.addEventListener('click', () => {
    const posiciones = medirPosicionesOrbita();
    pantalla.hidden = true;
    iniciarConstruccion(posiciones);
  }, { once: true });
}

function configurarBarra() {
  const puntos = document.getElementById('barra-roles');
  Object.values(ROLES).forEach((rol) => {
    const punto = crearElemento('span');
    punto.style.background = rol.color;
    punto.title = rol.nombre;
    puntos.append(punto);
  });
  document.getElementById('barra-num-agentes').textContent = AGENTES.length;
  document.getElementById('barra-num-roles').textContent = Object.keys(ROLES).length;
  document.getElementById('boton-repetir').addEventListener('click', () => iniciarConstruccion());
  document.getElementById('boton-reiniciar').addEventListener('click', () => iniciarConstruccion());
  document.getElementById('boton-velocidad').addEventListener('click', (evento) => {
    evento.currentTarget.textContent = `${cambiarVelocidad()}x`;
  });
  document.getElementById('boton-cerrar').addEventListener('click', () => {
    if (estaConstruyendo()) return terminarConstruccion();
    document.getElementById('barra').hidden = true;
  });
}

function iniciar() {
  const contenedorTarjetas = document.getElementById('tarjetas');
  PROYECTOS.forEach((proyecto) => contenedorTarjetas.append(crearTarjeta(proyecto)));
  crearFiltros(document.getElementById('filtros'));
  pintarContactos(document.getElementById('contactos'));
  configurarBarra();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const totalCapas = document.querySelectorAll('[data-capa]').length;
    document.getElementById('barra').hidden = false;
    actualizarBarra(totalCapas, totalCapas);
    return marcarBarraTerminada(true);
  }
  mostrarPantallaInicio();
}

iniciar();
