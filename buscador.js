function search() {
  // Obtener el texto del campo de búsqueda, convertirlo a minúsculas y eliminar espacios extra
  const query = $('#search-input').val().toLowerCase().trim();
  const searchResultsContainer = $('#search-results');

  // Limpiar resultados previos antes de mostrar nuevos
  searchResultsContainer.empty();

  // Si no hay texto en el campo de búsqueda, mostrar un mensaje y detener la función
  if (query.length === 0) {
    searchResultsContainer.append('<p>Por favor ingrese un término de búsqueda.</p>');
    return;
  }

  // Array para almacenar los resultados encontrados
  let results = [];

  /**
   * Función para recortar el texto alrededor de la coincidencia.
   * @param {string} text - Texto completo donde buscar la coincidencia.
   * @param {number} startIndex - Índice inicial de la coincidencia.
   * @param {number} endIndex - Índice final de la coincidencia.
   * @returns {string} - Texto recortado con 30 caracteres antes y después de la coincidencia.
   */
  function truncateText(text, startIndex, endIndex) {
    const contextLength = 30; // Número de caracteres antes y después de la coincidencia
    const start = Math.max(0, startIndex - contextLength); // Evitar índices negativos
    const end = Math.min(text.length, endIndex + contextLength); // Evitar superar la longitud del texto
    const truncated = text.substring(start, end); // Extraer la parte relevante del texto
    return `${start > 0 ? '...' : ''}${truncated}${end < text.length ? '...' : ''}`;
  }

  /**
   * Función para resaltar la palabra clave dentro de un texto.
   * @param {string} text - Texto donde resaltar las coincidencias.
   * @returns {string} - Texto con la palabra clave envuelta en un span con clase "highlight".
   */
  function highlightText(text) {
    const regex = new RegExp(`(${query})`, 'gi'); // Crear una expresión regular que ignore mayúsculas y minúsculas
    return text.replace(regex, '<span class="highlight">$1</span>'); // Resaltar coincidencias
  }

  /**
   * Función para buscar coincidencias dentro de una página.
   * @param {string} pageName - Nombre del archivo HTML que se está buscando.
   * @param {Document} content - Contenido del archivo HTML (puede ser el DOM actual o cargado de otro archivo).
   */
  function searchInPage(pageName, content) {
    try {
      // Buscar coincidencias en encabezados, párrafos, enlaces y listas
      $(content).find('h1, h2, h3, h4, h5, h6, p, a, ul li, ol li').each(function () {
        const text = $(this).text(); // Obtener el texto del elemento
        const index = text.toLowerCase().indexOf(query); // Buscar el índice de la coincidencia

        if (index !== -1) { // Si se encuentra una coincidencia
          const startIndex = index;
          const endIndex = index + query.length;
          const truncatedText = truncateText(text, startIndex, endIndex); // Limitar el texto alrededor de la coincidencia
          const highlightedText = highlightText(truncatedText); // Resaltar la coincidencia en el texto recortado

          // Agregar el resultado al array con un enlace al archivo correspondiente
          results.push(`
            <p>${highlightedText} 
            <a href="${pageName}" target="_blank">${pageName}</a>
            </p>
          `);
        }
      });
    } catch (error) {
      console.error(`Error al procesar la página ${pageName}:`, error);
      results.push(`<p><strong>Error al procesar la página ${pageName}.</strong></p>`);
    }
  }

  // Buscar coincidencias en la página actual
  searchInPage(window.location.pathname, document);

  // Lista de otras páginas del sitio para buscar coincidencias
  const otherPages = ['hobbies.html', 'computing.html'];

  /**
   * Función para buscar coincidencias en otros archivos HTML.
   * @param {string} pageName - Nombre del archivo HTML.
   * @returns {Promise<void>} - Promesa que busca coincidencias en el archivo.
   */
  function searchInOtherPages(pageName) {
    return fetch(pageName) // Cargar el contenido del archivo HTML
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar ${pageName}: ${response.statusText}`);
        }
        return response.text(); // Obtener el contenido como texto
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html'); // Convertir el texto en un DOM
        searchInPage(pageName, doc); // Buscar coincidencias dentro del DOM cargado
      })
      .catch(error => {
        console.error(error);
        results.push(`<p><strong>No se pudo cargar el archivo ${pageName}: ${error.message}</strong></p>`);
      });
  }

  // Ejecutar la búsqueda en las otras páginas del sitio
  const promises = otherPages.map(pageName => searchInOtherPages(pageName));

  // Esperar a que todas las búsquedas terminen
  Promise.all(promises)
    .then(() => {
      displayResults(); // Mostrar los resultados cuando todas las búsquedas estén completas
    })
    .catch(error => {
      console.error('Error general en la búsqueda:', error);
      results.push('<p><strong>Hubo un error en la búsqueda. Por favor, intente de nuevo más tarde.</strong></p>');
      displayResults(); // Mostrar resultados, incluso si hubo errores
    });

  /**
   * Función para mostrar los resultados de la búsqueda.
   */
  function displayResults() {
    if (results.length > 0) {
      searchResultsContainer.append(results.join('')); // Agregar los resultados encontrados al contenedor
    } else {
      searchResultsContainer.append('<p>No se encontraron resultados.</p>'); // Mensaje cuando no hay coincidencias
    }
  }
}
