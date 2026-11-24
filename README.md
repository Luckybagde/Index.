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
