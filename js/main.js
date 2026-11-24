/* =========================================================
   Atelier — portfolio behaviour
   - Renders the gallery from galleryData (edit this to add art)
   - Category filtering
   - Lightbox with keyboard + prev/next
   - Sticky-nav state + footer year + contact mailto
   ========================================================= */

/* ---------- EDIT YOUR WORK HERE ----------
   category must be "illustration" or "character"
   Swap src to your own JPG/PNG/WebP (drop files in /images). */
const galleryData = [
  { src: "images/art-01.png", title: "Quiet Morning",    category: "illustration", year: "2025" },
  { src: "images/art-02.png", title: "The Cartographer",  category: "character",    year: "2025" },
  { src: "images/art-03.png", title: "Field Notes",       category: "illustration", year: "2024" },
  { src: "images/art-04.png", title: "Wandering Fox",     category: "character",    year: "2024" },
  { src: "images/art-05.png", title: "Paper Moon",        category: "illustration", year: "2025" },
  { src: "images/art-06.png", title: "Sentinel",          category: "character",    year: "2023" },
  { src: "images/art-07.png", title: "Garden Study",      category: "illustration", year: "2024" },
  { src: "images/art-08.png", title: "Little Astronaut",  category: "character",    year: "2025" },
  { src: "images/art-09.png", title: "Tide Pool",         category: "illustration", year: "2023" },
];

const catLabel = (c) => (c === "character" ? "Character Art" : "Illustration");

/* ---------- Render gallery ---------- */
const galleryEl = document.getElementById("gallery");
let visible = []; // items currently shown (for lightbox navigation)

function renderGallery(filter = "all") {
  visible = galleryData.filter((d) => filter === "all" || d.category === filter);
  galleryEl.innerHTML = "";
  visible.forEach((item, i) => {
    const fig = document.createElement("figure");
    fig.className = "card";
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", `${item.title} — open`);
    fig.innerHTML = `
      <img class="card__img" src="${item.src}" alt="${item.title}" loading="lazy" />
      <figcaption class="card__cap">
        <div class="card__title">${item.title}</div>
        <div class="card__cat">${catLabel(item.category)} · ${item.year}</div>
      </figcaption>`;
    const open = () => openLightbox(i);
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    galleryEl.appendChild(fig);
    // staggered reveal
    requestAnimationFrame(() => {
      setTimeout(() => fig.classList.add("is-in"), i * 60);
    });
  });
}

/* ---------- Filters ---------- */
const filtersEl = document.getElementById("filters");
filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  filtersEl.querySelectorAll(".filter").forEach((b) => {
    b.classList.remove("is-active");
    b.setAttribute("aria-selected", "false");
  });
  btn.classList.add("is-active");
  btn.setAttribute("aria-selected", "true");
  renderGallery(btn.dataset.filter);
});

/* ---------- Lightbox ---------- */
const lb       = document.getElementById("lightbox");
const lbImg    = document.getElementById("lbImg");
const lbCap    = document.getElementById("lbCap");
const lbClose  = document.getElementById("lbClose");
const lbPrev   = document.getElementById("lbPrev");
const lbNext   = document.getElementById("lbNext");
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  showLb();
  lb.classList.add("is-open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function showLb() {
  const item = visible[lbIndex];
  lbImg.src = item.src;
  lbImg.alt = item.title;
  lbCap.textContent = `${item.title} — ${catLabel(item.category)}, ${item.year}`;
}
function closeLightbox() {
  lb.classList.remove("is-open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lbImg.src = "";
}
function step(dir) {
  lbIndex = (lbIndex + dir + visible.length) % visible.length;
  showLb();
}

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => step(-1));
lbNext.addEventListener("click", () => step(1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* ---------- Sticky nav state + gradient scroll progress ---------- */
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
const onScroll = () => {
  nav.classList.toggle("nav--scrolled", window.scrollY > 40);
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Contact form -> mailto ---------- */
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const msg = form.message.value.trim();
  if (!name || !email || !msg) {
    note.hidden = false;
    note.textContent = "Please fill in every field before sending.";
    note.style.color = "var(--accent)";
    return;
  }
  const subject = encodeURIComponent(`Commission enquiry — ${name}`);
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
  window.location.href = `mailto:hello@studio.com?subject=${subject}&body=${body}`;
  note.hidden = false;
  note.textContent = "Thanks — your email app should open now.";
});

/* ---------- Init ---------- */
renderGallery("all");
