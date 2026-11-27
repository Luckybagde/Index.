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

function setupLoveQuiz() {
  const card = $("#quiz-card");
  const panels = Array.from(document.querySelectorAll(".quiz-panel"));
  const stepLabel = $("#quiz-step");
  const bar = $("#quiz-progress-bar");
  const finalScreen = $("#quiz-final");
  const replayButton = $("#quiz-replay");
  if (!card || !panels.length || !stepLabel || !finalScreen) return;
  let current = 0;
  const total = panels.length;
  function showPanel(index, animate) {
    panels.forEach((panel, panelIndex) => {
      panel.classList.remove("is-active", "is-leaving");
      if (panelIndex === index) {
        panel.hidden = false;
        panel.classList.add(animate ? "is-active" : "is-active");
      } else {
        panel.hidden = true;
      }
    });
    stepLabel.textContent = `Question ${index + 1} of ${total}`;
    if (bar) bar.style.width = `${((index + 1) / total) * 100}%`;
    const stage = $("#quiz-stage");
    if (stage) stage.hidden = false;
    finalScreen.hidden = true;
    card.hidden = false;
  }
  function showFinal() {
    panels.forEach((panel) => {
      panel.classList.remove("is-active", "is-leaving");
      panel.hidden = true;
    });
    const stage = $("#quiz-stage");
    if (stage) stage.hidden = true;
    stepLabel.textContent = `All ${total} questions answered`;
    if (bar) bar.style.width = "100%";
    finalScreen.hidden = false;
    celebrate();
    if (replayButton) replayButton.focus({ preventScroll: true });
  }
  function answer(panel, option, allOptions) {
    const reply = panel.querySelector(".quiz-reply");
    const replyText = panel.querySelector(".quiz-reply-text");
    const message = option.getAttribute("data-reply") || "Every answer is a beautiful one.";
    allOptions.forEach((button) => {
      button.classList.toggle("is-chosen", button === option);
      button.classList.toggle("is-dimmed", button !== option);
      button.setAttribute("aria-pressed", button === option ? "true" : "false");
    });
    if (replyText) replyText.textContent = message;
    if (reply) {
      reply.hidden = false;
      reply.classList.remove("quiz-reply");
      void reply.offsetWidth;
      reply.classList.add("quiz-reply");
    }
    const next = panel.querySelector(".quiz-next");
    if (next) next.focus({ preventScroll: true });
  }
  function resetPanel(panel) {
    const reply = panel.querySelector(".quiz-reply");
    const replyText = panel.querySelector(".quiz-reply-text");
    if (reply) reply.hidden = true;
    if (replyText) replyText.textContent = "";
    panel.querySelectorAll(".quiz-option").forEach((button) => {
      button.classList.remove("is-chosen", "is-dimmed");
      button.removeAttribute("aria-pressed");
    });
  }
  panels.forEach((panel, index) => {
    const options = Array.from(panel.querySelectorAll(".quiz-option"));
    options.forEach((option) => {
      option.addEventListener("click", () => {
        if (panel.classList.contains("is-leaving")) return;
        answer(panel, option, options);
      });
    });
    const next = panel.querySelector(".quiz-next");
    if (next) {
      next.addEventListener("click", () => {
        panel.classList.remove("is-active");
        panel.classList.add("is-leaving");
        const isLast = index === total - 1;
        window.setTimeout(() => {
          if (isLast) {
            showFinal();
          } else {
            current = index + 1;
            showPanel(current, true);
          }
        }, 300);
      });
    }
  });
  if (replayButton) {
    replayButton.addEventListener("click", () => {
      panels.forEach(resetPanel);
      current = 0;
      showPanel(0, true);
      stepLabel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
  showPanel(0, false);
}
function setupPhotoFrames() {
  document.querySelectorAll(".love-photo-img").forEach((image) => {
    const frame = image.closest(".love-photo-frame");
    if (!frame) return;
    const markLoaded = () => {
      if (image.naturalWidth > 0) frame.classList.add("has-photo");
    };
    const markMissing = () => {
      frame.classList.remove("has-photo");
    };
    image.addEventListener("load", markLoaded);
    image.addEventListener("error", markMissing);
    if (image.complete) {
      if (image.naturalWidth > 0) markLoaded();
      else markMissing();
    }
  });
}
updateWeddingDetails();
updateCountdown();
window.setInterval(updateCountdown, 1000);
setupRsvp();
setupSharing();
setupMusic();
setupLoveQuiz();
setupPhotoFrames();
