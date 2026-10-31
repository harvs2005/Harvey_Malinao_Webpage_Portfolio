const artworks = [
  {
    id: "portrait-study",
    title: "Portrait Study",
    category: "Portrait",
    medium: "Graphite and charcoal",
    description: "A portrait study focused on facial proportions, expression, and smooth light-to-dark shading. This piece highlights the patience and observation involved in realistic drawing.",
    original: "images/portrait-study.jpg",
    digital: "images/portrait-study-digital.jpg"
  },
  {
    id: "charcoal-sketch",
    title: "Charcoal Sketch",
    category: "Sketch",
    medium: "Charcoal on paper",
    description: "A traditional sketch exploring contrast, texture, and expressive marks. The digital version can show a cleaned-up scan or a digitally enhanced presentation of the original work.",
    original: "images/charcoal-sketch.jpg",
    digital: "images/charcoal-sketch-digital.jpg"
  },
  {
    id: "tattoo-concept",
    title: "Tattoo Concept",
    category: "Tattoo",
    medium: "Fine-line concept",
    description: "A tattoo-inspired design study built around clear linework and a balanced composition. It represents the planning stage before a design is adapted for placement on the body.",
    original: "images/tattoo-concept.jpg",
    digital: "images/tattoo-concept-digital.jpg"
  },
  {
    id: "digital-illustration",
    title: "Digital Illustration",
    category: "Digital",
    medium: "Digital artwork",
    description: "A digital art concept exploring shape, composition, and visual storytelling. Replace the sample image paths with your own finished illustration and its alternate digital presentation.",
    original: "images/digital-illustration.jpg",
    digital: "images/digital-illustration-digital.jpg"
  },
  {
    id: "anime-study",
    title: "Anime Character Study",
    category: "Sketch",
    medium: "Pencil sketch",
    description: "A character study inspired by anime illustration, with attention to silhouette, expression, and recognizable details. The hover preview can be used for a colored or digitally refined version.",
    original: "images/anime-study.jpg",
    digital: "images/anime-study-digital.jpg"
  },
  {
    id: "lettering-design",
    title: "Lettering & Typography",
    category: "Digital",
    medium: "Typography / graphic design",
    description: "A typography-focused piece that experiments with letterforms, spacing, and visual rhythm. It can be used to showcase a digital poster, lettering composition, or personal branding design.",
    original: "images/lettering-design.jpg",
    digital: "images/lettering-design-digital.jpg"
  }
];

const projectGrid = document.getElementById("projectGrid");
const searchInput = document.getElementById("projectSearch");
const categoryFilter = document.getElementById("categoryFilter");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("portfolioModal");
const modalImage = document.getElementById("modalArtworkImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

function renderProjects() {
  if (!projectGrid) return;
  const query = (searchInput?.value || "").trim().toLowerCase();
  const category = categoryFilter?.value || "all";
  const filtered = artworks.filter(art => {
    const matchesCategory = category === "all" || art.category === category;
    const matchesSearch = [art.title, art.category, art.medium, art.description]
      .join(" ").toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  projectGrid.innerHTML = filtered.map(art => `
    <button class="project-card" type="button" data-art-id="${art.id}"
      aria-label="Open ${art.title} details">
      <span class="project-image-wrap">
        <img class="project-image original-image" src="${art.original}" alt="${art.title} original artwork" loading="lazy">
        <img class="project-image digital-image" src="${art.digital}" alt="" loading="lazy">
        <span class="hover-hint">Hover to preview digital version <span aria-hidden="true">↗</span></span>
      </span>
      <span class="project-card-copy">
        <span class="project-card-top"><span class="project-category">${art.category}</span><span class="project-open" aria-hidden="true">↗</span></span>
        <span class="project-title">${art.title}</span>
        <span class="project-medium">${art.medium}</span>
        <span class="project-description-preview">${art.description}</span>
      </span>
    </button>
  `).join("");

  emptyState.hidden = filtered.length > 0;
}

function openProject(id) {
  const art = artworks.find(item => item.id === id);
  if (!art || !modal) return;
  modalImage.src = art.original;
  modalImage.alt = art.title;
  modalCategory.textContent = `${art.category} / ${art.medium}`;
  modalTitle.textContent = art.title;
  modalDescription.textContent = art.description;
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
  document.body.classList.add("modal-open");
}

function closeProject() {
  if (!modal) return;
  modal.close?.();
  modal.removeAttribute("open");
  document.body.classList.remove("modal-open");
}

projectGrid?.addEventListener("click", event => {
  const card = event.target.closest("[data-art-id]");
  if (card) openProject(card.dataset.artId);
});
searchInput?.addEventListener("input", renderProjects);
categoryFilter?.addEventListener("change", renderProjects);
modal?.querySelector(".modal-close")?.addEventListener("click", closeProject);
modal?.addEventListener("click", event => {
  if (event.target === modal) closeProject();
});
modal?.addEventListener("close", () => document.body.classList.remove("modal-open"));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") document.body.classList.remove("modal-open");
});

const themeToggle = document.getElementById("themeToggle");
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.setAttribute("aria-pressed", String(document.body.classList.contains("dark-mode")));
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle?.addEventListener("click", () => {
  const open = navLinks?.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(open)));
});
navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("nav-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll(".reveal").forEach(el => {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    observer.observe(el);
  } else el.classList.add("is-visible");
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  const status = document.getElementById("formStatus");
  if (contactForm.elements.website?.value) return;
  if (status) status.textContent = "This demo form is not connected to an email service yet. Please add a form backend before publishing.";
});
renderProjects();
