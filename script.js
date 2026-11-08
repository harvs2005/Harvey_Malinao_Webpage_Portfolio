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

  /* ---------- Skills: hover cards + click for details ---------- */
  const skillGrid = document.querySelector(".skill-grid");
  const skillModal = $("skillModal");

  if (skillGrid && skillModal) {
    const skillCards = skillGrid.querySelectorAll(".skill-card");
    let activeSkill = null;

    function openSkill(card) {
      activeSkill = card;
      $("skillIcon").textContent = card.querySelector("span")?.textContent || "";
      $("skillTitle").textContent = card.querySelector("h3")?.textContent || "";
      $("skillText").textContent = card.dataset.text || card.querySelector("p")?.textContent || "";
      const tags = $("skillTags");
      tags.innerHTML = "";
      (card.dataset.tags || "").split("|").filter(Boolean).forEach((t, i) => {
        const li = document.createElement("li");
        li.textContent = t;
        li.style.setProperty("--i", i);
        tags.appendChild(li);
      });
      skillModal.classList.add("is-open");
      skillModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $("skillClose")?.focus();
    }

    function closeSkill(restoreFocus = true) {
      skillModal.classList.remove("is-open");
      skillModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (restoreFocus) activeSkill?.focus();
    }

    skillCards.forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `View details: ${card.querySelector("h3")?.textContent || "skill"}`);
      card.addEventListener("click", () => openSkill(card));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSkill(card); }
      });
    });

    $("skillClose")?.addEventListener("click", () => closeSkill());
    skillModal.querySelector("[data-close-skill]")?.addEventListener("click", () => closeSkill());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && skillModal.classList.contains("is-open")) closeSkill();
    });

    // "View related artwork" jumps to the gallery and filters it to that skill's category
    $("skillLink")?.addEventListener("click", () => {
      const category = activeSkill?.dataset.category || "all";
      closeSkill(false);
      const filter = $("categoryFilter");
      if (filter) { filter.value = category; filter.dispatchEvent(new Event("change")); }
    });

    // gentle staggered entrance as the cards scroll into view
    if ("IntersectionObserver" in window) {
      skillGrid.classList.add("is-ready");
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("in-view");
          io.unobserve(en.target);
        });
      }, { threshold: 0.2 });
      skillCards.forEach((c, i) => { c.style.setProperty("--delay", `${(i % 3) * 0.1}s`); io.observe(c); });
    }
  }

  /* ---------- Realistic acrylic paint-splatter background ---------- */
  const paintBg = document.querySelector(".paint-bg");

  if (paintBg) {
    const NS = "http://www.w3.org/2000/svg";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 650px)").matches;
    const MAX_SPLATS = isMobile ? 4 : 8;
    const detail = isMobile ? 0.6 : 1;
    const palette = [[184, 76, 45], [228, 176, 90], [130, 58, 34], [205, 140, 62], [160, 52, 30]];
    const rand = (a, b) => a + Math.random() * (b - a);
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const shade = (c, f) => `rgb(${c.map((v) => Math.min(255, Math.round(v * f))).join(",")})`;
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    };

    // Irregular core with spiky "fingers", stretched toward the throw direction
    function splatShape(R, n, dir, fingerCount) {
      const fingers = {};
      for (let i = 0, k = fingerCount ?? Math.floor(rand(6, 10)); i < k; i++) fingers[Math.floor(rand(0, n))] = rand(1.7, 2.7);
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const base = fingers[i] ? R * fingers[i] : R * rand(0.78, 1.15);
        const rr = base * (1 + 0.3 * Math.cos(a - dir));
        pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
      }
      let m = mid(pts[n - 1], pts[0]), d = `M${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
      for (let i = 0; i < n; i++) {
        const nx = mid(pts[i], pts[(i + 1) % n]);
        d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${nx[0].toFixed(1)} ${nx[1].toFixed(1)}`;
      }
      return d + "Z";
    }

    function spawnSplat(isStatic = false) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      const fill = shade(col, 1), dark = shade(col, 0.7), light = shade(col, 1.14);
      const size = rand(isMobile ? 220 : 280, isMobile ? 360 : 520);
      const R = rand(21, 28), dir = rand(0, Math.PI * 2);

      const svg = el("svg", { viewBox: "-100 -100 200 200", width: size, height: size, class: "splat" + (isStatic ? " static" : "") });
      svg.style.left = `${rand(4, 96)}%`;
      svg.style.top = `${rand(4, 96)}%`;
      svg.style.marginLeft = svg.style.marginTop = `${-size / 2}px`;
      svg.style.setProperty("--life", `${rand(18, 28)}s`);
      const wrap = el("g", { class: "wrap" }, svg);

      // 1) drips (drawn first so the core covers where they start)
      for (let i = 0, n = Math.floor(rand(1, isMobile ? 3 : 4)); i < n; i++) {
        const x = rand(-R * 0.7, R * 0.7), y1 = R * 0.5, len = rand(28, 72), w = rand(2.6, 4.4);
        const dur = `${rand(6, 10).toFixed(1)}s`, delay = `${rand(0.8, 1.8).toFixed(1)}s`;
        const line = el("line", { x1: x, y1, x2: x, y2: y1 + len, stroke: fill, "stroke-width": w, "stroke-linecap": "round", pathLength: 1, class: "drip" }, wrap);
        line.style.setProperty("--dur", dur); line.style.setProperty("--delay", delay);
        const bulb = el("circle", { cx: x, cy: y1, r: w * 0.78, fill, class: "drip-bulb" }, wrap);
        bulb.style.setProperty("--len", `${len}px`); bulb.style.setProperty("--dur", dur); bulb.style.setProperty("--delay", delay);
      }

      // 2) core: base, darker rim, lighter pooled centre, glossy highlight
      const d = splatShape(R, 26, dir);
      el("path", { d, fill, stroke: dark, "stroke-width": 1.4, "stroke-opacity": 0.55, "stroke-linejoin": "round", class: "core" }, wrap);
      const inner = el("g", { transform: "scale(.7)" }, wrap);
      el("path", { d, fill: light, "fill-opacity": 0.38, class: "core inner" }, inner);
      el("ellipse", { cx: -R * 0.25, cy: -R * 0.3, rx: R * 0.3, ry: R * 0.13, transform: "rotate(-30)", fill: "#fff", "fill-opacity": 0.2, class: "core inner" }, wrap);

      // 3) streaks shooting out of the core
      for (let i = 0, n = Math.floor(rand(5, 9) * detail + 1); i < n; i++) {
        const a = dir + rand(-1.6, 1.6), r1 = R * 0.9, r2 = R * rand(1.6, 3);
        el("line", { x1: Math.cos(a) * r1, y1: Math.sin(a) * r1, x2: Math.cos(a) * r2, y2: Math.sin(a) * r2, stroke: fill, "stroke-width": rand(0.8, 2.4), "stroke-linecap": "round", pathLength: 1, class: "tail" }, wrap);
      }

      // 4) droplets: stretched along their flight path, mostly in the throw direction
      for (let i = 0, n = Math.round(rand(36, 54) * detail); i < n; i++) {
        const biased = Math.random() < 0.7;
        const a = biased ? dir + (rand(0, 1) + rand(0, 1) + rand(0, 1) - 1.5) * 1.6 : rand(0, Math.PI * 2);
        const near = Math.pow(Math.random(), 1.6);
        const dist = R * (1.4 + near * (biased ? 4.4 : 2.6));
        const rad = Math.max(0.9, R * rand(0.05, 0.2) * (1 - near * 0.75));
        const stretch = 1 + (1 - near) * rand(0.6, 2.4);
        const g = el("g", { transform: `translate(${(Math.cos(a) * dist).toFixed(1)} ${(Math.sin(a) * dist).toFixed(1)}) rotate(${((a * 180) / Math.PI).toFixed(0)})` }, wrap);
        const drop = el("ellipse", { rx: rad * stretch, ry: rad, fill, class: "drop" }, g);
        drop.style.setProperty("--dx", `${(-dist * 0.92).toFixed(1)}px`);
        drop.style.setProperty("--dur", `${(0.35 + near * 0.55).toFixed(2)}s`);
        drop.style.setProperty("--d", `${rand(0, 0.06).toFixed(2)}s`);
      }

      // 5) fine speckle mist
      for (let i = 0, n = Math.round(rand(28, 44) * detail); i < n; i++) {
        const a = Math.random() < 0.7 ? dir + rand(-1.7, 1.7) : rand(0, Math.PI * 2), dist = R * rand(1.5, 6.5);
        const sp = el("circle", { cx: (Math.cos(a) * dist).toFixed(1), cy: (Math.sin(a) * dist).toFixed(1), r: rand(0.35, 1.1).toFixed(2), fill, class: "speck" }, wrap);
        sp.style.setProperty("--d", `${rand(0.05, 0.5).toFixed(2)}s`);
      }

      if (!isStatic) svg.addEventListener("animationend", (e) => { if (e.target === svg) svg.remove(); });
      paintBg.appendChild(svg);
    }

    const makeSvg = (size, cls, isStatic, life) => {
      const svg = el("svg", { viewBox: "-100 -100 200 200", width: size, height: size, class: `splat ${cls}` + (isStatic ? " static" : "") });
      svg.style.left = `${rand(4, 96)}%`;
      svg.style.top = `${rand(4, 96)}%`;
      svg.style.marginLeft = svg.style.marginTop = `${-size / 2}px`;
      svg.style.setProperty("--life", `${rand(life[0], life[1])}s`);
      if (!isStatic) svg.addEventListener("animationend", (e) => { if (e.target === svg) svg.remove(); });
      return svg;
    };

    // Minimal paint stain: soft, translucent pool with a darker dried rim
    function spawnStain(isStatic = false) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      const svg = makeSvg(rand(200, 380), "stain", isStatic, [22, 32]);
      const wrap = el("g", { class: "wrap" }, svg);
      const R = rand(32, 44), dir = rand(0, Math.PI * 2);
      const d = splatShape(R, 22, dir, 0);
      el("path", { d, fill: shade(col, 1), stroke: shade(col, 0.68), "stroke-width": 2.2, "stroke-opacity": 0.6, "stroke-linejoin": "round", class: "stain-body" }, wrap);
      const inner = el("g", { transform: "scale(.78)" }, wrap);
      el("path", { d, fill: shade(col, 1.15), "fill-opacity": 0.5, class: "stain-body" }, inner);
      for (let i = 0, n = Math.floor(rand(2, 5)); i < n; i++) {
        const a = rand(0, Math.PI * 2), dist = R * rand(1.3, 1.9);
        el("circle", { cx: (Math.cos(a) * dist).toFixed(1), cy: (Math.sin(a) * dist).toFixed(1), r: rand(2, 6).toFixed(1), fill: shade(col, 1), class: "stain-body" }, wrap);
      }
      paintBg.appendChild(svg);
    }

    // Minimal dye: translucent colour that has bled and diffused into soft, overlapping clouds
    function spawnDye(isStatic = false) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      const svg = makeSvg(rand(240, 440), "dye", isStatic, [24, 34]);
      const wrap = el("g", { class: "wrap" }, svg);
      const R = rand(26, 36), dir = rand(0, Math.PI * 2);
      const spread = (n) => n.style.setProperty("--spread", `${rand(7, 12).toFixed(1)}s`);
      for (let i = 0, n = 3 + Math.floor(rand(0, 3)); i < n; i++) {
        const a = rand(0, Math.PI * 2), off = R * rand(0, 0.7);
        const grp = el("g", { transform: `translate(${(Math.cos(a) * off).toFixed(1)} ${(Math.sin(a) * off).toFixed(1)})` }, wrap);
        const cloud = el("path", { d: splatShape(R * rand(0.55, 1), 18, dir, 0), fill: shade(col, rand(0.9, 1.15)), "fill-opacity": rand(0.45, 0.8).toFixed(2), class: "dye-body" }, grp);
        spread(cloud);
      }
      spread(el("circle", { r: R * 0.28, fill: shade(col, 0.8), "fill-opacity": 0.5, class: "dye-body" }, wrap));
      paintBg.appendChild(svg);
    }

    // Mix of paint splatter, soft stains and dye
    function spawnRandom(isStatic = false) {
      const r = Math.random();
      (r < 0.6 ? spawnSplat : r < 0.8 ? spawnStain : spawnDye)(isStatic);
    }

    if (reduceMotion) {
      [spawnSplat, spawnDye, spawnStain, spawnSplat].slice(0, isMobile ? 3 : 4).forEach((f) => f(true));
    } else {
      [0, 600, 1400, 2200].forEach((t, i) => setTimeout(i === 2 ? spawnStain : i === 3 ? spawnDye : spawnSplat, t));
      setInterval(() => {
        if (!document.hidden && paintBg.children.length < MAX_SPLATS) spawnRandom();
      }, 3000);
    }
  }

  
/* ================================================================
   WEBSITE VISITOR COUNTER — GOATCOUNTER
================================================================ */

const counter = document.getElementById("visitor-count");

if (counter) {
  const COUNTER_URL =
    "https://jamesharvey.goatcounter.com/counter/TOTAL.json";

  let numberEl = null;
  let currentCount = 0;

  function animateCount(element, from, to) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || from === to) {
      element.textContent = to.toLocaleString();
      return;
    }

    const start = performance.now();
    const duration = 1000;

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);

      const value = Math.round(
        from + (to - from) * progress
      );

      element.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  async function updateVisitorCount() {
    try {
      const response = await fetch(COUNTER_URL, {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Unable to retrieve visitor count.");
      }

      const data = await response.json();

      const totalVisits = parseInt(
        String(data.count).replace(/[^\d]/g, ""),
        10
      );

      if (Number.isNaN(totalVisits)) {
        throw new Error("Invalid visitor count received.");
      }

      if (!numberEl) {
        counter.innerHTML = `
          <span class="visitor-number">0</span>
          <span class="visitor-label">total website visits</span>
          <span class="visitor-views"></span>
        `;

        numberEl = counter.querySelector(".visitor-number");
      }

      animateCount(numberEl, currentCount, totalVisits);

      currentCount = totalVisits;

    } catch (error) {
      console.error("GoatCounter error:", error);

      if (!numberEl) {
        counter.innerHTML = `
          <span class="visitor-error">
            Visitor count temporarily unavailable.
          </span>
        `;
      }
    }
  }

  function startVisitorCounter() {
    updateVisitorCount();

    // Refresh every 4 hours to match GoatCounter's cache period.
    setInterval(updateVisitorCount, 4 * 60 * 60 * 1000);
  }

  if (document.readyState === "complete") {
    startVisitorCounter();
  } else {
    window.addEventListener("load", startVisitorCounter, {
      once: true
    });
  }
}

});