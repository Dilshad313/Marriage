# Irshad & Nidha — Wedding Invitation

A standalone, premium Islamic wedding invitation site. Pure HTML, CSS and
vanilla JavaScript — no build step, no backend. Open `index.html` directly
in a browser to view it.

## How to customize

Everything that changes per-wedding lives in one place: the `weddingData`
object at the top of [script.js](script.js).

```js
const weddingData = {
  groom: "Irshad",
  bride: "Nidha",
  groomFather: "...",
  groomMother: "...",
  brideFather: "...",
  brideMother: "...",
  date: "...",          // display text, e.g. "20th December 2026"
  day: "...",           // e.g. "Sunday"
  time: "...",          // e.g. "11:00 AM"
  venue: "...",
  address: "...",
  weddingDateISO: "",   // drives the live countdown, e.g. "2026-12-20T11:00:00"
  googleMapsUrl: "",    // drives the QR code + "Get Directions" buttons
  whatsappNumber: ""    // digits only with country code, e.g. "919876543210"
};
```

Until `weddingDateISO`, `googleMapsUrl` and `whatsappNumber` are filled in,
the site shows honest placeholders ("Date to be announced", disabled
direction buttons, a WhatsApp fallback message) instead of fake data.

## Photos

Add real files named `1.jpg` through `8.jpg` inside
[assets/gallery/](assets/gallery/). Each slot shows a decorative placeholder
until its file exists, so you can add photos one at a time.

## Background music (optional)

Add a file at `assets/music/wedding.mp3`. The music toggle button in the
navigation bar only appears once that file loads successfully — it stays
hidden if the file is missing, and the music never autoplays.

## Colors

All colors are CSS variables at the top of [style.css](style.css)
(`:root { --primary-green, --deep-green, --gold, --cream, --text-dark, ... }`).
Change them there to retheme the whole site.
