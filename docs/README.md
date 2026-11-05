# Portafolio de José Botero

Página personal publicada con GitHub Pages en `dexter-mouser.github.io/dexter-mouser/`.
La página no aparece de golpe. Primero muestra una pantalla de inicio: tu avatar como botón en el centro y los 12 agentes girando a su alrededor. Al pulsarlo, los agentes salen desde la órbita y construyen la página pieza por pieza. Al final queda un portafolio normal y navegable.

## Qué muestra

1. **Cabecera fija:** avatar y nombre, menú (Proyectos, Contacto) y un botón para repetir la construcción.
2. **Presentación:** el mismo estilo de la cabecera del README del perfil. Incluye la dirección `github.com/dexter-mouser`, "José Botero" grande con degradado blanco a naranja, "Desarrollador de software Jr.", la línea "Java · Spring Boot · JavaScript · SQL" y el avatar con anillo naranja.
3. **Proyectos:** tarjetas con captura, nombre, descripción, etiquetas de tecnologías y botones "Ver demo" y "Código". Tiene filtros: Todos, Demos y Solo código.
4. **Contacto:** LinkedIn, GitHub y correo, con un botón para copiar el correo.
5. **Pie:** créditos y la barra de construcción.

Un solo tema, oscuro: fondo casi negro con rejilla de puntos, acento naranja `#ff7a1a` y textos claros. No hay selector de tema ni de color.

## El equipo de agentes

Cada pieza de la página se marca en el HTML con el tipo de trabajo que necesita (`data-capa="contenedor"`, `"texto"`, `"imagen"`, `"etiqueta"`). Cada tipo va a la cola de un rol, y cada rol tiene su propia forma de construir:

| Rol | Agentes | Qué construye | Cómo se ve |
|---|---|---|---|
| **Diseño** | 3 | Contenedores: secciones, tarjetas, barras | Traza un recuadro con tiradores y medidas (`376 × 433`), y aparece el fondo de la pieza |
| **Frontend** | 3 | Textos: títulos, párrafos, botones | Selecciona el bloque y escribe el texto letra por letra |
| **Medios** | 2 | Imágenes: capturas y avatar | Enmarca la imagen y la revela con un barrido de arriba hacia abajo |
| **Datos** | 2 | Etiquetas: tecnologías, filtros, contadores | Coloca cada etiqueta con un pequeño rebote y cuenta los números desde 0 |
| **QA** | 2 | Revisión de cada sección terminada | Recorre el borde de la sección y deja un ✓ verde que se desvanece |

Detalles visuales:

- Cada cursor lleva una etiqueta con **nombre y rol** (por ejemplo, "Ada · Diseño") en el color de su rol. Los agentes del mismo rol comparten la familia de color.
- Una pieza no se construye hasta que su contenedor existe: Frontend espera a que Diseño termine la tarjeta antes de escribir en ella.
- QA entra cuando todas las piezas de una sección están listas.
- La **barra de construcción** muestra los puntos de colores por rol, "12 agentes", el avance ("84 / 140 capas") y los botones Repetir, velocidad (1x, 2x, 0.5x) y Terminar.
- El ritmo base es 3 veces más rápido que los tiempos de `equipo.js` (`RAPIDEZ_BASE`). La construcción completa tarda unos 20 segundos a 1x.
- Repetir, en la barra o con el botón ↻ de la cabecera, vuelve a construir sin pasar por la pantalla de inicio.
- Con "reducir movimiento" activo en el sistema, no hay pantalla de inicio: la página carga completa y sin animación. El botón Repetir sigue disponible.

## Estructura de carpetas

```
docs/
├── index.html        Estructura de la página; cada pieza lleva su data-capa
├── tono.css          Variables de color y tipografía (tema oscuro único)
├── style.css         Diseño de la página: cabecera, presentación, tarjetas, contacto
├── agentes.css       Cursores, recuadros, medidas, checks de QA y barra de construcción
├── js/
│   ├── datos.js      Proyectos y datos de contacto (único archivo para editar contenido)
│   ├── equipo.js     Roles, agentes, colores y tiempos
│   ├── asignacion.js Lógica pura: arma las colas por rol y decide qué pieza puede empezar
│   ├── efectos.js    Cómo construye cada rol (trazar, escribir, revelar, rebotar, revisar)
│   ├── agentes.js    Motor: mueve los cursores, toma tareas de las colas y lleva el avance
│   └── app.js        Pinta tarjetas y contacto, filtros, copiar correo, barra y botones
└── img/              Capturas de proyectos, avatar e icono.svg
```

`asignacion.js` no toca el DOM. Recibe una lista de piezas `{ id, tipo, padre, seccion }` y devuelve las colas y el orden. Así se puede probar sin la página.

## Datos

`js/datos.js` contiene:

- `PROYECTOS`: lista de `{ repo, nombre, descripcion, tecnologias: [], tieneDemo, imagen }`. Parte de los 10 proyectos del portafolio anterior.
- `CONTACTO`: `{ linkedin, correo, github }`. Mientras no tengas los datos, quedan como marcadores.

## Pruebas

El proyecto no usa frameworks. La lógica de `asignacion.js` se prueba con el ejecutor que trae Node, sin instalar nada. Las pruebas están en `pruebas/asignacion.test.js`, en la raíz del repo, para que no se publiquen con la página. Desde la raíz se ejecutan con `node --test pruebas/` y comprueban que:

- Toda pieza se asigna a un rol.
- Ninguna pieza empieza antes que su contenedor.
- QA solo recibe secciones completas.
- Con una lista vacía no se rompe.

## Publicación

En GitHub, entra a **Settings → Pages → Source** y elige la rama `main`, carpeta `/docs`. El enlace "Portafolio" del README del perfil ya apunta a esa dirección.

## Pendiente de tu parte

- Confirmar qué proyectos van y sus tecnologías.
- Tu URL de LinkedIn y el correo que quieres mostrar.
