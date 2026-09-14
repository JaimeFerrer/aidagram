(function () {
  const grid = document.getElementById("grid");
  const filtersEl = document.getElementById("filters");
  const emptyState = document.getElementById("emptyState");

  const lightbox = document.getElementById("lightbox");
  const lightboxStop = document.getElementById("lightboxStop");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxEditBtn = document.getElementById("lightboxEditBtn");
  const lightboxCaptionEdit = document.getElementById("lightboxCaptionEdit");
  const lightboxCaptionInput = document.getElementById("lightboxCaptionInput");
  const lightboxCaptionSave = document.getElementById("lightboxCaptionSave");

  let activeFilter = "all";
  let currentPhoto = null;

  const ROTATIONS = [-4, -2.5, -1, 1.5, 3, 4.5, -3.5, 2, -1.5, 0.5];
  const TAPE_COLORS = ["#c96a4d", "#8a9a63", "#d1a53d", "#7d8fa6"];
  const TAPE_ANGLES = [-6, -3, 2, 5, -4, 4];

  function pick(arr, i) {
    return arr[i % arr.length];
  }

  function labelFor(category) {
    return (window.CATEGORY_LABELS && CATEGORY_LABELS[category]) || category;
  }

  function buildFilters() {
    const categories = new Set();
    PHOTOS.forEach((p) => (p.categories || []).forEach((c) => categories.add(c)));

    const all = document.createElement("button");
    all.className = "filter-btn active";
    all.textContent = "Todas";
    all.dataset.filter = "all";
    filtersEl.appendChild(all);

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.textContent = labelFor(cat);
      btn.dataset.filter = cat;
      filtersEl.appendChild(btn);
    });

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      [...filtersEl.children].forEach((b) => b.classList.toggle("active", b === btn));
      renderGrid();
    });
  }

  function renderGrid() {
    grid.innerHTML = "";
    const items = PHOTOS.filter(
      (p) => activeFilter === "all" || (p.categories || []).includes(activeFilter)
    );

    items.forEach((photo, i) => {
      const card = document.createElement("div");
      card.className = "photo-card";
      card.style.setProperty("--rot", `${pick(ROTATIONS, i)}deg`);
      card.style.setProperty("--tape-angle", `${pick(TAPE_ANGLES, i + 2)}deg`);
      card.style.setProperty("--tape-color", pick(TAPE_COLORS, i));

      const img = document.createElement("img");
      img.src = photo.file;
      img.alt = photo.caption || "";
      img.loading = "lazy";
      card.appendChild(img);
      card.addEventListener("click", () => openLightbox(photo));
      grid.appendChild(card);
    });

    emptyState.hidden = PHOTOS.length > 0;
    grid.hidden = PHOTOS.length === 0;
  }

  // ---------- Visor con comentario ----------

  function openLightbox(photo) {
    currentPhoto = photo;
    lightboxImg.src = photo.file;
    lightboxImg.alt = photo.caption || "";
    lightboxCaption.textContent = photo.caption || "";
    lightboxCaptionEdit.hidden = true;
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxCaptionEdit.hidden = true;
    currentPhoto = null;
  }

  lightboxClose.addEventListener("click", closeLightbox);
  // Clic fuera de la "polaroid" (en el fondo oscuro) cierra el visor.
  lightbox.addEventListener("click", (e) => {
    if (!lightboxStop.contains(e.target)) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  lightboxEditBtn.addEventListener("click", () => {
    if (!currentPhoto) return;
    lightboxCaptionInput.value = currentPhoto.caption || "";
    lightboxCaptionEdit.hidden = false;
    lightboxCaptionInput.focus();
  });

  async function saveCaption() {
    if (!currentPhoto) return;
    const newCaption = lightboxCaptionInput.value.trim();
    lightboxCaptionSave.disabled = true;
    lightboxCaptionSave.textContent = "Guardando…";
    try {
      await GH.updateCaption(currentPhoto.file, newCaption);
      currentPhoto.caption = newCaption;
      lightboxCaption.textContent = newCaption;
      lightboxCaptionEdit.hidden = true;
    } catch (err) {
      alert(err.message || "No se ha podido guardar el comentario. Inténtalo otra vez.");
    } finally {
      lightboxCaptionSave.disabled = false;
      lightboxCaptionSave.textContent = "Guardar";
    }
  }

  lightboxCaptionSave.addEventListener("click", saveCaption);
  lightboxCaptionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCaption();
    }
  });

  buildFilters();
  renderGrid();
})();
