/* =========================================================
   Irshad & Nidha — Wedding Invitation
   All editable wedding information lives in `weddingData` below.
   ========================================================= */

const weddingData = {
  groom: "Irshad",
  bride: "Nidha",

  groomFather: "[Groom Father's Name – To Be Added]",
  groomMother: "[Groom Mother's Name – To Be Added]",
  brideFather: "[Bride Father's Name – To Be Added]",
  brideMother: "[Bride Mother's Name – To Be Added]",

  // Display text shown on the Nikah Details card. Edit freely.
  date: "[Wedding Date]",
  day: "[Wedding Day]",
  time: "[Wedding Time]",
  venue: "[Venue Name]",
  address: "[Complete Venue Address]",

  // ISO datetime used ONLY to drive the live countdown, e.g. "2026-12-20T11:00:00".
  // Leave empty until the real date is confirmed — the countdown will show a
  // graceful placeholder instead of a fake countdown.
  weddingDateISO: "",

  // Full Google Maps link to the venue, e.g. "https://maps.google.com/?q=...".
  // Leave empty until confirmed — the QR code and Get Directions button will
  // show a graceful placeholder instead of pointing nowhere.
  googleMapsUrl: "",

  // WhatsApp number in international format, digits only, e.g. "919876543210".
  whatsappNumber: ""
};

document.addEventListener('DOMContentLoaded', () => {
  populateContent();
  initNav();
  initReveal();
  initCountdown();
  initLocation();
  initQrCode();
  initRsvp();
  initGallery();
  initLightbox();
  initMusic();
});

/* ---------- Fill the page from weddingData ---------- */
function populateContent() {
  const map = {
    groomName: weddingData.groom,
    brideName: weddingData.bride,
    heroGroomName: weddingData.groom,
    heroBrideName: weddingData.bride,
    groomFather: weddingData.groomFather,
    groomMother: weddingData.groomMother,
    brideFather: weddingData.brideFather,
    brideMother: weddingData.brideMother,
    nikahDate: weddingData.date,
    nikahDay: weddingData.day,
    nikahTime: weddingData.time,
    nikahVenue: weddingData.venue,
    nikahAddress: weddingData.address,
    venueName: weddingData.venue,
    venueAddress: weddingData.address
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  document.title = `${weddingData.groom} & ${weddingData.bride} | Wedding Invitation`;
}

/* ---------- Navigation ---------- */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    navLinks.classList.remove('open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

/* ---------- Reveal-on-scroll ---------- */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((el) => observer.observe(el));
}

/* ---------- Countdown ---------- */
function initCountdown() {
  const grid = document.getElementById('countdownGrid');
  const message = document.getElementById('countdownMessage');
  const target = weddingData.weddingDateISO ? new Date(weddingData.weddingDateISO) : null;

  if (!target || Number.isNaN(target.getTime())) {
    grid.hidden = true;
    message.hidden = false;
    message.textContent = 'Date to be announced — Insha’Allah.';
    return;
  }

  const els = {
    days: document.getElementById('cdDays'),
    hours: document.getElementById('cdHours'),
    minutes: document.getElementById('cdMinutes'),
    seconds: document.getElementById('cdSeconds')
  };

  // Update a digit's text, and briefly pulse it, but only when the value actually changes.
  const setCell = (el, value) => {
    const formatted = String(value).padStart(2, '0');
    if (el.textContent === formatted) return;
    el.textContent = formatted;
    el.classList.remove('pulse');
    void el.offsetWidth; // restart the animation even if a pulse is already mid-flight
    el.classList.add('pulse');
  };

  const tick = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      clearInterval(timer);
      grid.hidden = true;
      message.hidden = false;
      message.textContent = 'Alhamdulillah — The Day Has Arrived!';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    setCell(els.days, days);
    setCell(els.hours, hours);
    setCell(els.minutes, minutes);
    setCell(els.seconds, seconds);
  };

  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------- Location buttons ---------- */
function initLocation() {
  const directionsBtn = document.getElementById('directionsBtn');
  const qrDirectionsBtn = document.getElementById('qrDirectionsBtn');
  const hasUrl = Boolean(weddingData.googleMapsUrl);

  [directionsBtn, qrDirectionsBtn].forEach((btn) => {
    if (!btn) return;
    if (!hasUrl) {
      btn.disabled = true;
      btn.textContent = 'Location to be announced';
      return;
    }
    btn.addEventListener('click', () => {
      window.open(weddingData.googleMapsUrl, '_blank', 'noopener');
    });
  });
}

/* ---------- QR code ---------- */
function initQrCode() {
  const qrBox = document.getElementById('qrcode');
  const placeholder = document.getElementById('qrPlaceholderText');
  if (!weddingData.googleMapsUrl) {
    placeholder.hidden = false;
    return;
  }
  if (typeof QRCode === 'undefined') {
    placeholder.hidden = false;
    placeholder.textContent = 'QR code unavailable right now — please use the button below.';
    return;
  }
  // eslint-disable-next-line no-undef
  new QRCode(qrBox, {
    text: weddingData.googleMapsUrl,
    width: 150,
    height: 150,
    colorDark: '#123F36',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

/* ---------- RSVP ---------- */
function initRsvp() {
  const yesBtn = document.getElementById('rsvpYes');
  const noBtn = document.getElementById('rsvpNo');
  const response = document.getElementById('rsvpResponse');
  if (!yesBtn || !noBtn || !response) return;

  const show = (text) => {
    response.hidden = false;
    response.textContent = text;
  };

  yesBtn.addEventListener('click', () => {
    if (weddingData.whatsappNumber) {
      const message = `Assalamu Alaikum, I would like to confirm my attendance for the Nikah of ${weddingData.groom} & ${weddingData.bride}.`;
      const url = `https://wa.me/${weddingData.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
      show('JazakAllah Khair! Please send the pre-filled WhatsApp message to confirm.');
    } else {
      show('Shukran! Please let the family know directly — RSVP via WhatsApp is coming soon.');
    }
  });

  noBtn.addEventListener('click', () => {
    show('Thank you for letting us know. We will miss you — please keep us in your duas.');
  });
}

/* ---------- Gallery ---------- */
const GALLERY_COUNT = 8;
let galleryPhotos = [];

function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  for (let i = 1; i <= GALLERY_COUNT; i++) {
    const src = `assets/gallery/${i}.jpg`;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'gallery-item reveal';
    item.setAttribute('aria-label', `Open photo ${i}`);

    const placeholder = document.createElement('span');
    placeholder.className = 'gallery-placeholder';
    placeholder.textContent = '✧';
    item.appendChild(placeholder);

    const img = document.createElement('img');
    img.alt = `${weddingData.groom} & ${weddingData.bride} — wedding photo ${i}`;
    img.loading = 'lazy';
    img.addEventListener('load', () => item.classList.add('has-image'));
    img.addEventListener('error', () => { img.remove(); });
    img.src = src;
    item.appendChild(img);

    item.addEventListener('click', () => openLightbox(i - 1));
    grid.appendChild(item);
    galleryPhotos.push(src);
  }

  // Re-run reveal observer for dynamically added items
  initReveal();
}

/* ---------- Lightbox ---------- */
let lightboxIndex = 0;

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  if (!lightbox) return;

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  prevBtn.addEventListener('click', () => showLightbox(lightboxIndex - 1));
  nextBtn.addEventListener('click', () => showLightbox(lightboxIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
    if (e.key === 'ArrowLeft') showLightbox(lightboxIndex - 1);
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  showLightbox(index);
  document.getElementById('lightbox').hidden = false;
  document.getElementById('lightboxClose').focus();
}

function showLightbox(index) {
  const count = galleryPhotos.length;
  lightboxIndex = ((index % count) + count) % count;
  const img = document.getElementById('lightboxImg');
  const placeholder = document.getElementById('lightboxPlaceholder');

  img.hidden = false;
  placeholder.hidden = true;
  img.onerror = () => { img.hidden = true; placeholder.hidden = false; };
  img.src = galleryPhotos[lightboxIndex];
  img.alt = `${weddingData.groom} & ${weddingData.bride} — wedding photo ${lightboxIndex + 1}`;
}

function closeLightbox() {
  document.getElementById('lightbox').hidden = true;
}

/* ---------- Background music ---------- */
function initMusic() {
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  if (!audio || !toggle) return;

  let ready = false;

  audio.addEventListener('canplaythrough', () => {
    ready = true;
    toggle.hidden = false;
  }, { once: true });

  audio.addEventListener('error', () => { toggle.hidden = true; });

  // Trigger a load attempt; if assets/music/wedding.mp3 is missing this fires 'error'.
  audio.load();

  toggle.addEventListener('click', () => {
    if (!ready) return;
    const playing = toggle.getAttribute('aria-pressed') === 'true';
    if (playing) {
      audio.pause();
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Play background music');
    } else {
      audio.play().catch(() => {});
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Pause background music');
    }
  });
}
