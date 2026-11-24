/*
 * Personalize the invitation here. Leave values blank until the couple has
 * confirmed the details; the page intentionally uses honest placeholders.
 */
const WEDDING = {
  // ISO 8601 date/time with timezone, e.g. "2027-05-21T16:00:00-07:00"
  date: "",
  displayDate: "",
  displayTime: "",
  venueName: "",
  venueAddress: "",
  mapsUrl: ""
};

const $ = (selector) => document.querySelector(selector);
const escapeMessages = [
  "Nice try!",
  "Wrong answer detected!",
  "You can’t escape this wedding!",
  "The button has left the chat!",
  "System error: NO is unavailable!"
];
let lastEscapeMessage = -1;
let toastTimer;

function setTextIfPresent(selector, value) {
  if (value) $(selector).textContent = value;
}

function setMapLinks(url) {
  if (!url) return;
  ["#maps-link", "#location-map-link"].forEach((selector) => {
    const link = $(selector);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.removeAttribute("aria-disabled");
    link.addEventListener("click", (event) => {
      if (link.getAttribute("aria-disabled") === "true") event.preventDefault();
    });
  });
  $("#maps-link").innerHTML = 'OPEN THE MAP <span aria-hidden="true">→</span>';
}

function updateWeddingDetails() {
  setTextIfPresent("#wedding-date", WEDDING.displayDate);
  setTextIfPresent("#wedding-time", WEDDING.displayTime);
  setTextIfPresent("#venue-name", WEDDING.venueName);
  setTextIfPresent("#venue-address", WEDDING.venueAddress);
  setMapLinks(WEDDING.mapsUrl);
}

function updateCountdown() {
  const note = $("#countdown-note");
  const date = Date.parse(WEDDING.date);
  if (!WEDDING.date || !Number.isFinite(date)) {
    note.textContent = "Our date is being dreamed up. Check back soon ♡";
    return;
  }
  const remaining = date - Date.now();
  if (remaining <= 0) {
    ["#days", "#hours", "#minutes", "#seconds"].forEach((selector) => $(selector).textContent = "00");
    note.textContent = "Today is the day! Let the celebrations begin ♡";
    return;
  }
  const seconds = Math.floor(remaining / 1000);
  $("#days").textContent = String(Math.floor(seconds / 86400)).padStart(2, "0");
  $("#hours").textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
  $("#minutes").textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  $("#seconds").textContent = String(seconds % 60).padStart(2, "0");
  note.textContent = "Every second brings us closer to forever ♡";
}

function escapeNoButton() {
  const zone = $("#no-zone");
  const button = $("#no-button");
  if (!zone || !button) return;
  const maxX = Math.max(0, zone.clientWidth - button.offsetWidth);
  const maxY = Math.max(0, zone.clientHeight - button.offsetHeight);
  const currentX = Number.parseFloat(button.style.left) || 0;
  const currentY = Number.parseFloat(button.style.top) || 0;
  let x = 0;
  let y = 0;
  // Choose a different landing spot where possible, staying inside the NO zone.
  for (let attempt = 0; attempt < 8; attempt += 1) {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
    if (Math.hypot(x - currentX, y - currentY) > 24) break;
  }
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  lastEscapeMessage = (lastEscapeMessage + 1) % escapeMessages.length;
  $("#escape-message").textContent = escapeMessages[lastEscapeMessage];
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function celebrate() {
  const colors = ["#ad6f75", "#d6b887", "#f3dfe0", "#fffdfa", "#b58d5b", "#d99d8b"];
  const count = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 16 : 90;
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.setAttribute("aria-hidden", "true");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.55 ? "50%" : "2px";
    piece.style.setProperty("--duration", `${2.4 + Math.random() * 2.8}s`);
    piece.style.setProperty("--drift", `${Math.random() * 220 - 110}px`);
    piece.style.setProperty("--spin", `${Math.random() * 900 - 450}deg`);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
    document.body.appendChild(piece);
  }
}

function setupRsvp() {
  const noButton = $("#no-button");
  const yesButton = $("#yes-button");
  // Pointer entry handles mouse; pointerdown happens before touch can click.
  noButton.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") escapeNoButton();
  });
  noButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    escapeNoButton();
  });
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    escapeNoButton();
  });
  noButton.addEventListener("focus", escapeNoButton);
  yesButton.addEventListener("click", () => {
    $("#confirmation").hidden = false;
    $("#escape-message").textContent = "Excellent choice. Your dance-floor debut awaits!";
    yesButton.setAttribute("aria-pressed", "true");
    celebrate();
    $("#confirmation").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function invitationText() {
  return "Lucky & Vishu invite you to celebrate a love in bloom. Join us for a day of joy — we can't wait to celebrate with you!";
}

function setupSharing() {
  $("#share-button").addEventListener("click", async () => {
    const data = { title: "Lucky & Vishu — A Celebration of Love", text: invitationText(), url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (error) {
        if (error.name !== "AbortError") showToast("Sharing isn't available right now. Try WhatsApp below.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        showToast("Invitation link copied — send it with love ♡");
      } catch {
        showToast("Copy this invitation link: " + window.location.href);
      }
    }
  });

  const whatsapp = document.createElement("a");
  whatsapp.className = "whatsapp-share";
  whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`${invitationText()} ${window.location.href}`)}`;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener noreferrer";
  whatsapp.textContent = "";
  whatsapp.setAttribute("aria-label", "Share the invitation on WhatsApp");
  // Keep the action beside the native share control without adding a heavy widget.
  const shareButton = $("#share-button");
  whatsapp.innerHTML = '<span aria-hidden="true">☏</span><span class="share-label">WhatsApp</span>';
  whatsapp.classList.add("icon-button");
  shareButton.parentElement.appendChild(whatsapp);
}

function setupMusic() {
  const button = $("#music-toggle");
  let context;
  let masterGain;
  let timer;
  let noteIndex = 0;
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];

  function playNote() {
    if (!context || !masterGain || masterGain.gain.value === 0) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = notes[noteIndex % notes.length];
    noteIndex += 1;
    envelope.gain.setValueAtTime(0.0001, context.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.08);
    envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.8);
    oscillator.connect(envelope);
    envelope.connect(masterGain);
    oscillator.start();
    oscillator.stop(context.currentTime + 1.85);
  }

  button.addEventListener("click", async () => {
    const playing = button.getAttribute("aria-pressed") === "true";
    if (playing) {
      if (masterGain) masterGain.gain.setTargetAtTime(0, context.currentTime, 0.08);
      window.clearInterval(timer);
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", "Play gentle background music");
      button.querySelector(".music-label").textContent = "Music off";
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      showToast("Background music isn't supported in this browser.");
      return;
    }
    context ||= new AudioContext();
    await context.resume();
    masterGain ||= context.createGain();
    masterGain.connect(context.destination);
    masterGain.gain.cancelScheduledValues(context.currentTime);
    masterGain.gain.setTargetAtTime(0.18, context.currentTime, 0.15);
    playNote();
    timer = window.setInterval(playNote, 850);
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Mute gentle background music");
    button.querySelector(".music-label").textContent = "Music on";
  });
}

updateWeddingDetails();
updateCountdown();
window.setInterval(updateCountdown, 1000);
setupRsvp();
setupSharing();
setupMusic();
