(function () {
  const grid = document.getElementById("grid");
  const filtersEl = document.getElementById("filters");
  const emptyState = document.getElementById("emptyState");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  let activeFilter = "all";

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

    items.forEach((photo) => {
      const tile = document.createElement("div");
      tile.className = "photo-tile";
      const img = document.createElement("img");
      img.src = photo.file;
      img.alt = photo.caption || "";
      img.loading = "lazy";
      tile.appendChild(img);
      tile.addEventListener("click", () => openLightbox(photo));
      grid.appendChild(tile);
    });

    emptyState.hidden = PHOTOS.length > 0;
    grid.hidden = PHOTOS.length === 0;
  }

  function openLightbox(photo) {
    lightboxImg.src = photo.file;
    lightboxImg.alt = photo.caption || "";
    lightboxCaption.textContent = photo.caption || "";
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  buildFilters();
  renderGrid();
})();
