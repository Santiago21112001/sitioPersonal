// Índice de las páginas que queremos buscar
const pages = [
  { name: "Inicio", url: "index.html", content: "Este es el contenido de ejemplo para la página de inicio." },
  { name: "Aficiones", url: "hobbies.html", content: "En mi tiempo libre suelo escuchar música y hacer ejercicio." },
  { name: "Informática", url: "computing.html", content: "Contenido sobre informática y tecnología." }
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
          <h2>Resultado encontrado en <a href="${page.url}">${page.name}</a></h2>
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
