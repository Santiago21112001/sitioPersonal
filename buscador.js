// Índice de las páginas que queremos buscar
const pages = [
  {
    name: "Inicio", content: "Soy Santiago López Laso. Este es mi sitio web personal.Aquí puedes conocer cosas sobre mí. " +
      "Prefiero no subir una foto mía, pero aquí puedes ver mi foto de perfil de GitHub."
  },
  {
    name: "Aficiones", content: "En mi tiempo libre suelo escuchar música y salir a hacer ejercicio. " +
      "El deporte que más me gusta es la natación. También me gusta leer libros y ver vídeos en el teléfono móvil. " +
      "Me gustan sobre todo los libros de fantasía y ciencia ficción, aunque a veces leo libros de otros géneros. " +
      "De vez en cuando voy a ver películas, en casa o en el cine con mis amigos. " +
      "Escucho un poco de todo, pero mi género de música favorito es el Pop. No tengo mascotas. Prefiero los gatos a los perros."
  },
  {
    name: "Informática", content: "He hecho el grado en Ingeniería Informática del Software, en laEscuela de Ingeniería Informática de Oviedo." +
      "Estoy cursando el Máster en Ingeniería Web y en el futuro quiero trabajar como ingeniero informático. " +
      "Aquí puedes ver mis conocimientos en Informática y los proyectos más importantes que desarrollé:"
  },
  {
    name: "Conocimientos informáticos", content: "Lenguajes de programación que conozco. Java - El lenguaje en el que tengo más experiencia. " +
      "Python - Utilizado en varios proyectos académicos y personales. C++ y C - Tengo cierta experiencia. JavaScript - Utilizado en algunos proyectos web." +
      "Tecnologías que manejo Spring - Framework utilizado para desarrollo de aplicaciones backend en Java. React - Biblioteca de JavaScript" +
      " para crear interfaces de usuario. Node.js - Entorno de servidor para ejecutar JavaScript del lado del servidor. Habilidades Además de conocimientos técnicos," +
      " cuento con habilidades de trabajo en equipo y desarrollo de proyectos software, adquiridas en la Universidad de Oviedo y durante prácticas profesionales."
  },
  {
    name: "Proyectos", content: "Proyectos destacados Juego de preguntas y respuestas Este es el proyecto web del que más estoy orgulloso. " +
      "Es un juego de preguntas online que desarrollé en grupo. Ya no está activo el sitio, pero el código fuente se puede ver en el siguiente enlace: https://github.com/Arquisoft/wiq_es04d " +
      "Juego de preguntas y respuestas Editor de circuitos y robots Otro proyecto que hice fue una aplicación de escritorio en Python para el Trabajo de Fin de Grado " +
      ". El código fuente se puede ver en el siguiente enlace: https://github.com/Santiago21112001/editor_circuitos_robots_S4R. Editor de circuitos y robots"
  }
];

// Función de búsqueda
function search() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; // Limpia resultados anteriores

  if (query === "") {
    alert("Por favor, ingresa un término de búsqueda.");
    return;
  }

  // Recorre cada página en el objeto `pages`
  pages.forEach(page => {
    // Busca coincidencias del término de búsqueda en el contenido de la página
    if (page.content.toLowerCase().includes(query)) {
      // Crea un fragmento del texto con el término de búsqueda resaltado
      const snippet = createSnippet(page.content, query);

      // Genera el HTML para mostrar el resultado con un enlace a la página
      const resultHTML = `
        <div class="search-result">
          <h2>Resultado encontrado en <a href="${urls.get(page.name)}">${page.name}</a></h2>
          <p>...${snippet}...</p>
        </div>`;

      // Inserta el resultado en el contenedor de resultados
      resultsContainer.insertAdjacentHTML('beforeend', resultHTML);
    }
  });
}

// Función para crear un fragmento de texto alrededor de la coincidencia
function createSnippet(text, query) {
  const index = text.toLowerCase().indexOf(query);
  const snippetStart = Math.max(index - 30, 0); // Toma 30 caracteres antes de la coincidencia o desde el inicio
  const snippetEnd = Math.min(index + 30, text.length); // Toma 30 caracteres después de la coincidencia o hasta el final
  let snippet = text.substring(snippetStart, snippetEnd);

  // Resalta el término de búsqueda en el fragmento
  snippet = snippet.replace(query, `<strong>${query}</strong>`);
  return snippet;
}
