document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  /* ---------- Footer year ---------- */
  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Dark / light theme ---------- */
  const themeToggle = $("themeToggle");

  function setTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    if (themeToggle) {
      themeToggle.textContent = isDark ? "☀" : "◐";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
    try { localStorage.setItem("portfolio-theme", theme); } catch (e) {}
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (e) {}
  setTheme(savedTheme === "dark" ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
  });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Gallery: modal ---------- */
  const projectGrid = $("projectGrid");
  const artModal = $("artModal");

  if (projectGrid && artModal) {
    const modalImage = $("modalImage");
    const toggleModalArt = $("toggleModalArt");
    let selectedCard = null;
    let showingDigital = false;

    projectGrid.querySelectorAll(".project-card").forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `View details: ${card.dataset.title || "artwork"}`);
    });

    function openArtwork(card) {
      selectedCard = card;
      showingDigital = false;

      const original = card.querySelector(".original-art");
      const digital = card.querySelector(".digital-art");

      $("modalTitle").textContent = card.dataset.title || "Untitled Artwork";
      $("modalCategory").textContent = card.dataset.category || "Artwork";
      $("modalMedium").textContent = card.dataset.medium || "";
      $("modalDescription").textContent = card.dataset.description || "";

      modalImage.src = original ? original.getAttribute("src") : "";
      modalImage.alt = original ? original.alt : card.dataset.title || "";

      toggleModalArt.hidden = !digital;
      toggleModalArt.textContent = "View Digital Version";

      artModal.classList.add("is-open");
      artModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $("modalClose")?.focus();
    }

    function closeArtwork() {
      artModal.classList.remove("is-open");
      artModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      selectedCard?.focus();
      selectedCard = null;
    }

    function swapModalImage(img) {
      modalImage.classList.remove("artwork-arriving");
      modalImage.classList.add("artwork-changing");
      setTimeout(() => {
        modalImage.src = img.getAttribute("src");
        modalImage.alt = img.alt;
        modalImage.classList.remove("artwork-changing");
        modalImage.classList.add("artwork-arriving");
      }, 250);
    }

    modalImage.addEventListener("animationend", () => modalImage.classList.remove("artwork-arriving"));

    projectGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".project-card");
      if (card) openArtwork(card);
    });

    projectGrid.addEventListener("keydown", (e) => {
      const card = e.target.closest(".project-card");
      if (card && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openArtwork(card);
      }
    });

    $("modalClose")?.addEventListener("click", closeArtwork);
    artModal.querySelector("[data-close-modal]")?.addEventListener("click", closeArtwork);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && artModal.classList.contains("is-open")) closeArtwork();
    });

    toggleModalArt?.addEventListener("click", () => {
      if (!selectedCard) return;
      const original = selectedCard.querySelector(".original-art");
      const digital = selectedCard.querySelector(".digital-art");
      if (!original || !digital) return;

      showingDigital = !showingDigital;
      swapModalImage(showingDigital ? digital : original);
      toggleModalArt.textContent = showingDigital ? "View Original Artwork" : "View Digital Version";
    });

    /* ---------- Gallery: search + filter ---------- */
    const searchInput = $("projectSearch");
    const categoryFilter = $("categoryFilter");
    const emptyState = $("emptyState");

    function filterArtwork() {
      const text = (searchInput?.value || "").trim().toLowerCase();
      const category = (categoryFilter?.value || "all").toLowerCase();
      let visible = 0;

      projectGrid.querySelectorAll(".project-card").forEach((card) => {
        const d = card.dataset;
        const content = [d.title, d.category, d.medium, d.description].join(" ").toLowerCase();
        const show =
          content.includes(text) &&
          (category === "all" || (d.category || "").toLowerCase() === category);

        card.hidden = !show;
        if (show) visible++;
      });

      if (emptyState) emptyState.hidden = visible !== 0;
    }

    searchInput?.addEventListener("input", filterArtwork);
    categoryFilter?.addEventListener("change", filterArtwork);
    filterArtwork();
  }

  /* ---------- Visitor counter (GoatCounter) ----------
     Shows unique visitors (same figure as the GoatCounter dashboard)
     plus total page views. It waits until GoatCounter has recorded this
     visit, bypasses caching, and refreshes every minute. */
  const counter = $("visitor-count");

  if (counter) {
    const COUNTER_URL = "https://jamesharvey.goatcounter.com/counter/TOTAL.json";
    const toNumber = (v) => parseInt(String(v ?? "").replace(/\D/g, ""), 10) || 0;
    let numberEl = null, viewsEl = null, current = 0;

    function countUp(el, from, to) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (from === to || reduce) { el.textContent = to.toLocaleString(); return; }
      const t0 = performance.now(), dur = 900;
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(from + (to - from) * p).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    async function updateCounter() {
      try {
        const res = await fetch(COUNTER_URL);
        if (!res.ok) throw new Error("GoatCounter returned HTTP " + res.status);
        const data = await res.json();
        const visitors = toNumber(data.count_unique ?? data.count);
        const views = toNumber(data.count);

        if (!numberEl) {
          counter.innerHTML =
            '<span class="visitor-number">0</span>' +
            '<span class="visitor-label">unique visitors</span>' +
            '<span class="visitor-views"></span>';
          numberEl = counter.querySelector(".visitor-number");
          viewsEl = counter.querySelector(".visitor-views");
        }
        countUp(numberEl, current, visitors);
        current = visitors;
        viewsEl.textContent = `• ${views.toLocaleString()} page views`;
      } catch (err) {
        console.error("Visitor counter error:", err);
        if (!numberEl) counter.innerHTML = '<span class="visitor-error">Visitor count unavailable.</span>';
      }
    }

    const startCounter = () => {
      setTimeout(updateCounter, 1500); // let GoatCounter record this visit first
      setInterval(updateCounter, 60000);
    };
    if (document.readyState === "complete") startCounter();
    else window.addEventListener("load", startCounter);
  }
});
