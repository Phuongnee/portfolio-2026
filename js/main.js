let progress = 0;
const loadingText = document.getElementById("loading-text");
const loadingContainer = document.getElementById("loading-container");
const title = document.getElementById("title");
const menu = document.getElementById("menu");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
const navMenu = document.getElementById("nav-menu");
const logoContainer = document.getElementById("logo-container");

// === FONCTION DE CHARGEMENT ===
function updateLoading() {
  if (loadingText) loadingText.innerText = "loading ..";

  // Simule une courte attente avant de faire disparaître le loader
  setTimeout(() => {
    if (loadingContainer) {
      loadingContainer.classList.add("fade-out");
      loadingContainer.style.display = "none";
    }
    showTitle(); // afficher le contenu après le chargement
  }, 1500); // tu peux ajuster la durée (1500ms = 1,5s)
}

updateLoading();

(() => {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  // Theme already applied in <head>, but keep this as a fallback:
  root.dataset.theme =
    localStorage.getItem(STORAGE_KEY) || root.dataset.theme || "light";

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const sync = () =>
    btn.setAttribute("aria-checked", String(root.dataset.theme === "dark"));
  sync();

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next); // ✅ this makes it persist to other pages
    sync();
  });
})();

// === AFFICHER LE TITRE & LE MENU APRÈS CHARGEMENT ===
function showTitle() {
  const titleContainer = document.querySelector(".title-container");
  const title = document.getElementById("title");
  const description = document.querySelector(".title__description");

  if (titleContainer) {
    titleContainer.removeAttribute("hidden");
    titleContainer.style.display = "flex";
    titleContainer.style.flexDirection = "column";
  }
  if (title) title.style.visibility = "visible";

  if (navMenu) {
    navMenu.removeAttribute("hidden");
    navMenu.style.display = "flex";
  }
  if (description) {
    description.style.display = "flex";
    description.style.flexDirection = "column";
  }

  // === ANIMATION GSAP DU TITRE ===
  gsap.fromTo(
    [titleContainer, description].filter(Boolean),
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.15 }
  );

  const tl = gsap.timeline({ defaults: { duration: 1.2, ease: "power3.out" } });
  tl.fromTo(
    ".hero-title .first-name",
    { x: "-40vw", opacity: 0, filter: "blur(6px)", letterSpacing: "0.14em" },
    { x: "0vw", opacity: 1, filter: "blur(0px)", letterSpacing: "-0.01em" },
    0
  );
  tl.fromTo(
    ".hero-title .last-name",
    { x: "40vw", opacity: 0, filter: "blur(6px)", letterSpacing: "0.14em" },
    { x: "0vw", opacity: 1, filter: "blur(0px)", letterSpacing: "-0.01em" },
    0.25
  );
  tl.to(".hero-title .word", {
    xPercent: -0.6,
    duration: 0.15,
    ease: "power1.out",
  }).to(".hero-title .word", {
    xPercent: 0,
    duration: 0.25,
    ease: "power2.out",
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(".hero-title .word", {
      clearProps: "all",
      x: 0,
      opacity: 1,
      filter: "none",
    });
  }

  // === ANIMATION DU MENU ===
  if (window.innerWidth > 768 && menu) {
    gsap.fromTo(
      menu,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  } else if (menuToggle) {
    menuToggle.classList.add("show");
  }

  // ✅ APPLIQUER LE LIEN ACTIF ICI
  highlightActiveLink();
  // === HORLOGE "PARIS" ===
  function showTime() {
    const dayName = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    const parisTime = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Paris",
    });
    const date = new Date(parisTime);

    const day = dayName[date.getDay()];
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let session = "AM";

    if (h === 0) h = 12;
    if (h >= 12) {
      session = h === 12 ? "PM" : "PM";
      if (h > 12) h -= 12;
    }

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    const clockDisplay = document.getElementById("MyClockDisplay");
    if (clockDisplay)
      clockDisplay.textContent = `${day} ${h}:${m}:${s} ${session}`;

    setTimeout(showTime, 1000);
  }
  showTime();
}

// === MENU MOBILE ===
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("open");
    document.body.classList.toggle("no-scroll");
  });
}

// === SCROLLTRIGGER (GSAP) ===
gsap.registerPlugin(ScrollTrigger);

// === ANIMATION DU PORTFOLIO AU SCROLL ===
const portfolioSection = document.getElementById("portfolio-section");
const portfolioItems = document.querySelectorAll(".portfolio-grid");

if (portfolioSection) {
  window.addEventListener("scroll", function () {
    const sectionTop = portfolioSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop <= windowHeight / 2) {
      portfolioItems.forEach((item) => {
        item.style.visibility = "visible";
      });
      document.querySelector(".header-portfolio")?.classList.add("visible");
    }
  });
}

// === CAROUSEL HORIZONTAL (infinite scroll) ===
const track = document.querySelector(".carousel-track");

if (track && window.innerWidth > 768) {
  track.innerHTML += track.innerHTML; // duplicate UNIQUEMENT sur desktop
}
// Empêcher la duplication si on resize la fenêtre
let isTrackDuplicated = false;

function handleCarouselResize() {
  if (window.innerWidth > 768 && !isTrackDuplicated) {
    // Desktop: dupliquer le contenu
    if (track) {
      const originalCards = Array.from(track.children);
      originalCards.forEach(card => {
        track.appendChild(card.cloneNode(true));
      });
      isTrackDuplicated = true;
    }
  } else if (window.innerWidth <= 768 && isTrackDuplicated) {
    // Mobile: retirer les duplicatas
    if (track) {
      const cards = Array.from(track.children);
      const half = Math.floor(cards.length / 2);
      cards.slice(half).forEach(card => card.remove());
      isTrackDuplicated = false;
    }
  }
}

// Appel initial
handleCarouselResize();

// Écouter le resize
window.addEventListener('resize', handleCarouselResize);

// === MENU ACTIF (page courante) ===
function highlightActiveLink() {
  const url = new URL(window.location.href);
  let current = url.pathname.split("/").pop();
  if (!current || current === "/" || current === "") current = "index.html";

  const normalizeHref = (a) => {
    const abs = new URL(a.getAttribute("href"), window.location.href);
    let file = abs.pathname.split("/").pop();
    if (!file || file === "/" || file === "") file = "index.html";
    return file;
  };

  // Menu desktop
  document.querySelectorAll(".menu__link").forEach((link) => {
    if (normalizeHref(link) === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Menu mobile
  document.querySelectorAll(".menu-mobile-item a").forEach((link) => {
    if (normalizeHref(link) === current) {
      link.style.fontWeight = "700";
      link.style.textDecoration = "underline";
      link.setAttribute("aria-current", "page");
    }
  });
}
