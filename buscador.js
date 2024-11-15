function search() {
  // Obtener el texto de búsqueda
  const query = $('#search-input').val().toLowerCase().trim();
  const searchResultsContainer = $('#search-results');
  
  // Limpiar resultados previos
  searchResultsContainer.empty();

  // Si la consulta está vacía, no hacer nada
  if (query.length === 0) {
    searchResultsContainer.append('<p>Por favor ingrese un término de búsqueda.</p>');
    return;
  }

  // Array para almacenar los resultados encontrados
  let results = [];

  // Función para resaltar las palabras coincidentes en el texto
  function highlightText(text) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // Buscar en la página actual
  function searchInPage(pageName, content) {
    try {
      // Buscar en los encabezados (h1, h2, h3, h4, h5, h6)
      $(content).find('h1, h2, h3, h4, h5, h6').each(function() {
        const text = $(this).text();
        if (text.toLowerCase().includes(query)) {
          results.push(`
            <p>${highlightText(text)} 
            <a href="${pageName}" target="_blank">${pageName}</a>
            </p>
          `);
        }
      });

      // Buscar en los párrafos (<p>)
      $(content).find('p').each(function() {
        const text = $(this).text();
        if (text.toLowerCase().includes(query)) {
          results.push(`
            <p>${highlightText(text)} 
            <a href="${pageName}" target="_blank">${pageName}</a>
            </p>
          `);
        }
      });

      // Buscar en los enlaces (<a>)
      $(content).find('a').each(function() {
        const text = $(this).text();
        if (text.toLowerCase().includes(query)) {
          results.push(`
            <p>${highlightText(text)} 
            <a href="${pageName}" target="_blank">${pageName}</a>
            </p>
          `);
        }
      });

      // Buscar en las listas (<ul>, <ol>, <li>)
      $(content).find('ul li, ol li').each(function() {
        const text = $(this).text();
        if (text.toLowerCase().includes(query)) {
          results.push(`
            <p>${highlightText(text)} 
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

  // Buscar en la página actual
  searchInPage(window.location.pathname, document);

  // Array con los nombres de los otros archivos HTML en el sitio
  const otherPages = ['hobbies.html', 'computing.html']; // Añadir más si es necesario

  // Función para buscar en los otros archivos HTML
  function searchInOtherPages(pageName) {
    return fetch(pageName)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar ${pageName}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        searchInPage(pageName, doc);
      })
      .catch(error => {
        console.error(error);
        results.push(`<p><strong>No se pudo cargar el archivo ${pageName}: ${error.message}</strong></p>`);
      });
  }

  // Llamar a la función para buscar en otros archivos HTML
  const promises = otherPages.map(pageName => searchInOtherPages(pageName));

  // Esperar a que todas las búsquedas en otras páginas terminen
  Promise.all(promises)
    .then(() => {
      displayResults();
    })
    .catch(error => {
      // Este catch captura cualquier error no manejado en las promesas
      console.error('Error general en la búsqueda:', error);
      results.push('<p><strong>Hubo un error en la búsqueda. Por favor, intente de nuevo más tarde.</strong></p>');
      displayResults();
    });

  // Función para mostrar los resultados
  function displayResults() {
    if (results.length > 0) {
      searchResultsContainer.append(results.join(''));
    } else {
      searchResultsContainer.append('<p>No se encontraron resultados.</p>');
    }
  }
}
