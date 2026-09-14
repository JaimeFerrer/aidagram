# Álbum de Aida 🎂

Una pequeña web estilo Instagram con fotos de la infancia de Aida, filtrables
por la gente con la que aparece en cada foto (con papá, con mamá, conmigo...).

## Cómo añadir fotos

1. Copia las imágenes dentro de la carpeta [`images/`](images).
2. Abre [`js/data.js`](js/data.js) y añade una entrada por cada foto, indicando:
   - `file`: ruta a la imagen (ej. `"images/foto01.jpg"`)
   - `categories`: con quién aparece (ej. `["mama", "conmigo"]`)
   - `caption`: (opcional) un texto o recuerdo corto

Los botones de filtro se generan automáticamente a partir de las categorías
que uses, así que puedes crear las que quieras.

## Ver la web

Abre `index.html` directamente en el navegador, o activa **GitHub Pages**
en la configuración del repositorio (Settings → Pages → Deploy from branch
`main`) para tener un enlace público que compartir.
