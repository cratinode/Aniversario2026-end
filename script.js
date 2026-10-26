/* ==========================================================================
   JAVASCRIPT: VIRADA DE PÁGINA 3D, SOM DE PAPEL (WEB AUDIO API) E SWIPE
   ========================================================================== */
const TOTAL_PAGES = 10;
let currentPage = 1;
let isFlipping = false;
let audioCtx = null;

/* Sintetiza som sutil de folha de papel virando via Web Audio API */
function playPageTurnSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const duration = 0.32;
    const bufferSize = Math.floor(audioCtx.sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      const t = i / bufferSize;
      const env = Math.sin(Math.PI * t) * Math.pow(1 - t * 0.6, 1.4);
      data[i] = (b0 + b1 + b2 + white * 0.12) * env * 0.45;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1900, audioCtx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + duration);
    filter.Q.value = 1.2;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.24, audioCtx.currentTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.004, audioCtx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  } catch (_) {}
}

function renderDots() {
  const dotsWrap = document.getElementById('progress-dots');
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'page-dot' + (i === currentPage ? ' active' : '');
    dot.setAttribute('aria-label', 'Página ' + i);
    dot.addEventListener('click', () => goToPage(i));
    dotsWrap.appendChild(dot);
  }
}

function updateUI() {
  document.querySelectorAll('.book-page').forEach((pageEl) => {
    const num = Number(pageEl.getAttribute('data-page'));
    const isActive = num === currentPage;
    pageEl.classList.toggle('active', isActive);
    if (isActive) {
      pageEl.scrollTop = 0;
      pageEl.querySelectorAll('.sheet-left, .sheet-right').forEach((s) => {
        s.scrollTop = 0;
      });
    }
  });

  const spine = document.getElementById('spine-overlay');
  if (spine) {
    spine.style.display = (currentPage > 1 && currentPage < 10) ? 'block' : 'none';
  }

  const progressText = document.getElementById('progress-text');
  if (progressText) {
    progressText.textContent = 'Página ' + currentPage + ' de ' + TOTAL_PAGES;
  }

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if (btnPrev) btnPrev.disabled = (currentPage === 1);
  if (btnNext) btnNext.disabled = (currentPage === TOTAL_PAGES);

  document.querySelectorAll('.page-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx + 1 === currentPage);
  });

  document.querySelectorAll('video').forEach((v) => v.pause());
}

export function goToPage(target) {
  if (isFlipping || target === currentPage || target < 1 || target > TOTAL_PAGES) return;
  isFlipping = true;

  const direction = target > currentPage ? 'next' : 'prev';
  const leaf = document.getElementById('turning-leaf');

  playPageTurnSound();

  if (leaf) {
    leaf.classList.remove('flip-next', 'flip-prev');
    void leaf.offsetWidth;
    leaf.classList.add(direction === 'next' ? 'flip-next' : 'flip-prev');
  }

  setTimeout(() => {
    currentPage = target;
    updateUI();
  }, 370);

  setTimeout(() => {
    if (leaf) leaf.classList.remove('flip-next', 'flip-prev');
    isFlipping = false;
  }, 780);
}

export function nextPage() {
  if (currentPage < TOTAL_PAGES) goToPage(currentPage + 1);
}

export function prevPage() {
  if (currentPage > 1) goToPage(currentPage - 1);
}

/* Confetes discretos nas cores da paleta na Página 10 */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let pieces = [];
let rafId = null;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

export function launchConfetti() {
  if (!canvas || !ctx) return;
  const colors = ['#C5A059', '#556E39', '#6E8B4C', '#4A3525', '#FBF8F1'];
  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -15 - Math.random() * 200,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 5,
      vy: 2 + Math.random() * 3.2,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.08,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  if (!rafId) animateConfetti();
}

function animateConfetti() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vRot;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 30);
  if (pieces.length > 0) {
    rafId = requestAnimationFrame(animateConfetti);
  } else {
    rafId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* Expondo funções no escopo global (window) para atributos onclick no HTML */
window.goToPage = goToPage;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.launchConfetti = launchConfetti;

/* Setas do teclado */
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextPage();
  else if (e.key === 'ArrowLeft') prevPage();
});

/* Gesto de arrasto (swipe horizontal) no celular e tablet */
let startX = 0;
let startY = 0;
const stage = document.getElementById('book-stage');

if (stage) {
  stage.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    }
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const dx = e.changedTouches[0].screenX - startX;
      const dy = e.changedTouches[0].screenY - startY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        if (dx < 0) nextPage();
        else prevPage();
      }
    }
  }, { passive: true });
}

/* Inicialização */
renderDots();
updateUI();
