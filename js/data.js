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
  // --- Primera tanda ---
  { file: "images/aida-06.png", categories: [], caption: "" },
  { file: "images/aida-07.png", categories: [], caption: "" },
  { file: "images/aida-08.png", categories: [], caption: "" },
  { file: "images/aida-09.png", categories: [], caption: "" },
  { file: "images/aida-10.png", categories: [], caption: "" },
  { file: "images/aida-11.png", categories: [], caption: "" },
  { file: "images/aida-12.png", categories: [], caption: "" },
  { file: "images/aida-13.png", categories: [], caption: "" },
  { file: "images/aida-14.png", categories: [], caption: "" },
  { file: "images/aida-15.png", categories: [], caption: "" },
  { file: "images/aida-16.png", categories: [], caption: "" },
  { file: "images/aida-17.png", categories: [], caption: "" },
  { file: "images/aida-18.png", categories: [], caption: "" },
  { file: "images/aida-19.png", categories: [], caption: "" },
  { file: "images/aida-20.png", categories: [], caption: "" },
  { file: "images/aida-21.png", categories: [], caption: "" },
  { file: "images/aida-22.png", categories: [], caption: "" },
  { file: "images/aida-23.png", categories: [], caption: "" },
  { file: "images/aida-24.png", categories: [], caption: "" },
  { file: "images/aida-25.png", categories: [], caption: "" },
  { file: "images/aida-26.png", categories: [], caption: "" },
  { file: "images/aida-27.png", categories: [], caption: "" },
  { file: "images/aida-28.png", categories: [], caption: "" },
  { file: "images/aida-29.png", categories: [], caption: "" },
  { file: "images/aida-30.png", categories: [], caption: "" },
  { file: "images/aida-31.png", categories: [], caption: "" },
  { file: "images/aida-32.png", categories: [], caption: "" },
  { file: "images/aida-33.png", categories: [], caption: "" },
  { file: "images/aida-34.png", categories: [], caption: "" },
  { file: "images/aida-35.png", categories: [], caption: "" },
  { file: "images/aida-36.png", categories: [], caption: "" },
  { file: "images/aida-37.png", categories: [], caption: "" },
  { file: "images/aida-38.png", categories: [], caption: "" },
  { file: "images/aida-39.png", categories: [], caption: "" },
  { file: "images/aida-40.png", categories: [], caption: "" },
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
