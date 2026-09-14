// Lista de fotos del álbum de Aida.
//
// Cómo añadir una foto nueva:
// 1. Copia el archivo de imagen dentro de la carpeta images/
// 2. Añade un objeto aquí con:
//      file        -> ruta relativa a la imagen, ej: "images/foto01.jpg"
//      categories  -> array con las personas/etiquetas que aparecen, ej: ["mama", "conmigo"]
//      caption     -> (opcional) un texto o recuerdo corto para esa foto
//
// Las categorías disponibles se detectan automáticamente a partir de las
// que uses aquí, así que puedes inventar las que necesites
// (por ejemplo: "papa", "mama", "conmigo", "amigos", "familia", "cole"...).

const PHOTOS = [
  // Ejemplo (bórralo o edítalo cuando tengas fotos reales):
  // {
  //   file: "images/foto01.jpg",
  //   categories: ["mama", "conmigo"],
  //   caption: "Verano en la playa, 2010"
  // },
];

// Nombres bonitos para mostrar en los botones de filtro.
// Si añades una categoría que no está aquí, se mostrará tal cual.
const CATEGORY_LABELS = {
  papa: "Con papá",
  mama: "Con mamá",
  conmigo: "Conmigo",
  familia: "Familia",
  amigos: "Amigos",
  cole: "Cole",
};
