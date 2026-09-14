(function () {
  const grid = document.getElementById("grid");
  const filtersEl = document.getElementById("filters");
  const emptyState = document.getElementById("emptyState");

  let activeFilter = "all";

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
      // Al hacer clic, la foto se abre a tamaño completo en una pestaña
      // nueva (sin overlays ni ventanas emergentes en la propia página).
      const link = document.createElement("a");
      link.className = "photo-card";
      link.href = photo.file;
      link.target = "_blank";
      link.rel = "noopener";
      link.title = photo.caption || "";
      link.style.setProperty("--rot", `${pick(ROTATIONS, i)}deg`);
      link.style.setProperty("--tape-angle", `${pick(TAPE_ANGLES, i + 2)}deg`);
      link.style.setProperty("--tape-color", pick(TAPE_COLORS, i));

      const img = document.createElement("img");
      img.src = photo.file;
      img.alt = photo.caption || "";
      img.loading = "lazy";
      link.appendChild(img);
      grid.appendChild(link);
    });

    emptyState.hidden = PHOTOS.length > 0;
    grid.hidden = PHOTOS.length === 0;
  }

  buildFilters();
  renderGrid();
})();
