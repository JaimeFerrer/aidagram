// Ayudantes compartidos para leer/escribir directamente en el repositorio
// de GitHub desde el navegador: subir fotos, editar comentarios, borrar...
// index.html (comentarios) y upload.html (subir/borrar) usan este mismo
// módulo, y comparten la misma clave de acceso guardada en localStorage.
const GH = (function () {
  const OWNER = "jaimeferrer";
  const REPO = "aidagram";
  const BRANCH = "main";
  const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

  function getToken(forcePrompt) {
    let token = localStorage.getItem("aida_gh_token");
    if (!token || forcePrompt) {
      token = prompt(
        "Pega aquí la clave de acceso de GitHub (se guarda solo en este dispositivo, nunca se sube al repositorio).\n\n" +
        "¿No la tienes? Pídesela a Jaime."
      );
      if (token) localStorage.setItem("aida_gh_token", token.trim());
    }
    return token ? token.trim() : null;
  }

  function forgetToken() {
    localStorage.removeItem("aida_gh_token");
  }

  // Codifica/decodifica texto UTF-8 <-> base64 de forma segura (data.js
  // tiene tildes y eñes que btoa/atob no manejan directamente).
  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function base64ToUtf8(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  async function ghRequest(path, options) {
    const token = getToken(false);
    if (!token) throw new Error("Falta la clave de acceso.");
    const res = await fetch(API + path, {
      ...options,
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json",
        ...((options && options.headers) || {}),
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 401) {
        forgetToken();
        throw new Error("Clave de acceso inválida o caducada. Vuelve a intentarlo.");
      }
      throw new Error(`GitHub respondió ${res.status}: ${body.slice(0, 200)}`);
    }
    return res.status === 204 ? null : res.json();
  }

  // Aplica editFn(textoActual) -> textoNuevo sobre js/data.js, con
  // reintentos por si dos personas editan casi a la vez. editFn puede
  // devolver null para señalar "nada que hacer, no hace falta escribir".
  async function editDataJs(editFn, message) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const current = await ghRequest(`/contents/js/data.js?ref=${BRANCH}`, { method: "GET" });
      const text = base64ToUtf8(current.content);
      const updated = editFn(text);
      if (updated === null) return;
      try {
        await ghRequest("/contents/js/data.js", {
          method: "PUT",
          body: JSON.stringify({
            message: message || "Actualiza data.js",
            content: utf8ToBase64(updated),
            sha: current.sha,
            branch: BRANCH,
          }),
        });
        return;
      } catch (err) {
        if (attempt === 2) throw err;
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }

  function escapeForRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Cada foto ocupa una única línea en data.js (así las genera todo el
  // código de esta web), así que localizarla y tocarla es sencillo.
  function findEntryLineRe(filename) {
    return new RegExp(`^([ \\t]*\\{[^\\n]*file:\\s*"${escapeForRegex(filename)}"[^\\n]*\\},?)\\n`, "m");
  }

  async function uploadImageFile(base64, ext) {
    const filename = `images/upload-${Date.now()}.${ext}`;
    await ghRequest(`/contents/${filename}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Sube foto desde la web: ${filename}`,
        content: base64,
        branch: BRANCH,
      }),
    });
    return filename;
  }

  function addEntryToDataJs(filename, categories, caption, newLabels) {
    const catsJs = "[" + categories.map((c) => `"${c}"`).join(", ") + "]";
    const safeCaption = (caption || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const photoLine = `  { file: "${filename}", categories: ${catsJs}, caption: "${safeCaption}" },\n];`;
    const labelEntries = Object.keys(newLabels || {});
    return editDataJs((text) => {
      let updated = text.replace(/\n\];/, "\n" + photoLine);
      if (updated === text) throw new Error("No se pudo editar data.js (formato inesperado).");
      if (labelEntries.length) {
        const labelLines = labelEntries
          .map((key) => `  ${key}: "${newLabels[key].replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",\n`)
          .join("");
        const before = updated;
        updated = updated.replace(/(CATEGORY_LABELS\s*=\s*\{[\s\S]*?)\n\};/, `$1\n${labelLines}};`);
        if (updated === before) throw new Error("No se pudieron registrar las etiquetas nuevas.");
      }
      return updated;
    }, `Registra foto ${filename} en data.js`);
  }

  function removeEntryFromDataJs(filename) {
    const lineRe = findEntryLineRe(filename);
    return editDataJs((text) => {
      if (!lineRe.test(text)) return null;
      return text.replace(lineRe, "");
    }, `Elimina la foto ${filename} de data.js`);
  }

  function updateCaption(filename, newCaption) {
    const lineRe = findEntryLineRe(filename);
    const safeCaption = (newCaption || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return editDataJs((text) => {
      const m = lineRe.exec(text);
      if (!m) throw new Error("No se encontró la foto en data.js.");
      const line = m[1];
      const newLine = line.replace(/caption:\s*"(?:[^"\\]|\\.)*"/, `caption: "${safeCaption}"`);
      if (newLine === line) throw new Error("No se pudo actualizar el comentario.");
      return text.slice(0, m.index) + newLine + "\n" + text.slice(m.index + m[0].length);
    }, `Actualiza comentario de ${filename}`);
  }

  return {
    getToken,
    forgetToken,
    ghRequest,
    editDataJs,
    uploadImageFile,
    addEntryToDataJs,
    removeEntryFromDataJs,
    updateCaption,
  };
})();
