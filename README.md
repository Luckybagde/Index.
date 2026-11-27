# Lucky & Vishu — A Celebration of Love

A responsive, romantic digital wedding invitation built with plain HTML, CSS, and JavaScript. No build step, backend, or package installation is required; the site is ready to publish from GitHub Pages.

## Preview / publish

In the repository's **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save. GitHub Pages will publish `index.html`.

## Personalize the invitation

Open `script.js` and fill in the `WEDDING` object when the couple confirms the details:

- `date`: an ISO 8601 date and time **including a timezone**, for example `2027-05-21T16:00:00-07:00` (example format only; not a suggested wedding date).
- `displayDate`, `displayTime`: guest-facing date and time.
- `venueName`, `venueAddress`: confirmed venue information.
- `mapsUrl`: a Google Maps URL for the confirmed location.

Until these values are supplied, the page displays clear placeholders and the countdown/map link do not imply an unconfirmed date or location.

The gallery currently uses original CSS illustrations instead of invented personal photographs. To add the couple's own pictures, replace the contents of the three `.photo-art` elements in `index.html` with `<img>` elements using their approved image files; add descriptive alt text and keep images optimized for mobile.

## Features

- Responsive, accessible invitation with reduced-motion support and keyboard skip link.
- Live countdown once a confirmed ISO date is configured.
- Playable/mutable gentle ambient music synthesized in the browser; it starts only after the visitor asks for it.
- Escaping NO button for mouse, touch and keyboard; YES launches confetti and the RSVP confirmation.
- Native device sharing when available, clipboard fallback, and WhatsApp sharing.
- Confirmed venue link support; no date, venue address or personal photos are fabricated.

Fonts load from Google Fonts when online; the page has system-font fallbacks. All site logic is vanilla JavaScript and all layout/illustrations are local CSS/HTML.

## Love quiz and photo frames (added)

The invitation now includes a three-question love quiz ("One Little Question, Three Little Moments of Love") and an "Our Little World" photo section. Every quiz answer is a correct answer and gives its own romantic reply; the quiz lives entirely in `script.js` and `styles.css` with no new dependencies.

To add the couple's photographs, save them as:

- `images/girlfriend-photo.jpg` (portrait framing works best)
- `images/couple-photo.jpg` (landscape framing works best)

Both names are already referenced in `index.html`; the frames display an elegant placeholder until the files exist, so a broken-image icon never appears. Any image size is accepted — the frames crop to fit — but keep each file under about 2 MB. If the photos are `.png` instead of `.jpg`, change those two `src` values in `index.html`.