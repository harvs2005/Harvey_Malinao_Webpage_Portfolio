
/* =========================
   DARK MODE TOGGLE
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) {
    console.error("Dark mode button #themeToggle was not found.");
    return;
  }

  const body = document.body;

  function updateTheme(isDark) {
    body.classList.toggle("dark-mode", isDark);

    localStorage.setItem(
      "portfolio-theme",
      isDark ? "dark" : "light"
    );

    themeToggle.textContent = isDark ? "☀" : "◐";

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  // Restore saved theme
  const savedTheme = localStorage.getItem("portfolio-theme");
  updateTheme(savedTheme === "dark");

  // Toggle theme when clicked
  themeToggle.addEventListener("click", () => {
    const isDark = !body.classList.contains("dark-mode");
    updateTheme(isDark);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const projectGrid = document.getElementById("projectGrid");
  const artModal = document.getElementById("artModal");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalMedium = document.getElementById("modalMedium");
  const modalDescription = document.getElementById("modalDescription");
  const toggleModalArt = document.getElementById("toggleModalArt");
  const searchInput = document.getElementById("projectSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const emptyState = document.getElementById("emptyState");

  if (!projectGrid || !artModal) {
    console.error("Gallery or artwork modal was not found.");
    return;
  }

  let selectedCard = null;
  let showingDigital = false;

  function openArtwork(card) {
    selectedCard = card;
    showingDigital = false;

    const original = card.querySelector(".original-art");
    const digital = card.querySelector(".digital-art");

    modalTitle.textContent =
      card.dataset.title || "Untitled Artwork";

    modalCategory.textContent =
      card.dataset.category || "Artwork";

    modalMedium.textContent =
      card.dataset.medium || "";

    modalDescription.textContent =
      card.dataset.description || "";

    modalImage.src = original
      ? original.getAttribute("src")
      : "";

    modalImage.alt = original
      ? original.alt
      : modalTitle.textContent;

    toggleModalArt.hidden = !digital;

    toggleModalArt.textContent = "View Digital Version";

    artModal.classList.add("is-open");
    artModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modalClose?.focus();
  }

  function closeArtwork() {
    artModal.classList.remove("is-open");
    artModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    selectedCard = null;
  }

  projectGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card");

    if (card && projectGrid.contains(card)) {
      openArtwork(card);
    }
  });

  projectGrid.addEventListener("keydown", (event) => {
    const card = event.target.closest(".project-card");

    if (
      card &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      openArtwork(card);
    }
  });

  modalClose?.addEventListener("click", closeArtwork);

  artModal.querySelector("[data-close-modal]")
    ?.addEventListener("click", closeArtwork);

  toggleModalArt?.addEventListener("click", () => {
    if (!selectedCard) return;

    const original = selectedCard.querySelector(".original-art");
    const digital = selectedCard.querySelector(".digital-art");

    if (!original || !digital) return;

    showingDigital = !showingDigital;

    const image = showingDigital ? digital : original;

    modalImage.src = image.getAttribute("src");
    modalImage.alt = image.alt;

    toggleModalArt.textContent = showingDigital
      ? "View Original Artwork"
      : "View Digital Version";
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      artModal.classList.contains("is-open")
    ) {
      closeArtwork();
    }
  });

  
 
function filterArtwork() {
  const searchInput = document.getElementById("projectSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const projectGrid = document.getElementById("projectGrid");
  const emptyState = document.getElementById("emptyState");

  if (!searchInput || !categoryFilter || !projectGrid) return;

  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value.toLowerCase();
  const cards = projectGrid.querySelectorAll(".project-card");

  let visibleCount = 0;

  cards.forEach((card) => {
    const title = card.dataset.title || "";
    const category = card.dataset.category || "";
    const medium = card.dataset.medium || "";
    const description = card.dataset.description || "";

    const imageAltText = Array.from(card.querySelectorAll("img"))
      .map((img) => img.alt || "")
      .join(" ");

    const cardText = card.querySelector(".project-info")?.innerText || "";

    const searchableContent = [
      title,
      category,
      medium,
      description,
      imageAltText,
      cardText
    ].join(" ").toLowerCase();

    const matchesSearch = searchableContent.includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      category.toLowerCase() === selectedCategory;

    const shouldShow = matchesSearch && matchesCategory;

    card.hidden = !shouldShow;

    if (shouldShow) {
      visibleCount++;
    }
  });

  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("projectSearch");
  const categoryFilter = document.getElementById("categoryFilter");

  searchInput?.addEventListener("input", filterArtwork);
  categoryFilter?.addEventListener("change", filterArtwork);

  filterArtwork();
});


  searchInput?.addEventListener("input", filterArtwork);
  categoryFilter?.addEventListener("change", filterArtwork);

  filterArtwork();


  searchInput?.addEventListener("input", filterArtwork);
  categoryFilter?.addEventListener("change", filterArtwork);
});


document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("projectSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const projectGrid = document.getElementById("projectGrid");
    const emptyState = document.getElementById("emptyState");

    if (!searchInput || !categoryFilter || !projectGrid) return;

    const projectCards = projectGrid.querySelectorAll(".project-card");

    function filterArtworks() {
        const searchText = searchInput.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const title = card.dataset.title || "";
            const category = card.dataset.category || "";
            const medium = card.dataset.medium || "";
            const description = card.dataset.description || "";
            const cardText = card.innerText || "";

            const searchableText = (
                title + " " +
                category + " " +
                medium + " " +
                description + " " +
                cardText
            ).toLowerCase();

            const matchesSearch = searchableText.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                category.toLowerCase() === selectedCategory;

            const shouldShow = matchesSearch && matchesCategory;

            card.style.display = shouldShow ? "" : "none";

            if (shouldShow) {
                visibleCount++;
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    searchInput.addEventListener("input", filterArtworks);
    categoryFilter.addEventListener("change", filterArtworks);

    filterArtworks();
});
