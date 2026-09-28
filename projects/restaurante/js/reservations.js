/**
 * LUMINA — Reinvented Reservations Flow (Instant Flow)
 * - Stylized draggable date carousel
 * - Instant bubbling timeslots with staggered pop-in
 * - Dynamic live summary line
 * - Gold particle explosion on confirm
 */

(function initReservations() {
  // State
  let state = {
    guests: 2,
    selectedDateIndex: 0,
    selectedSlot: null,
    confirmed: false,
    dates: []
  };

  // Build dates
  function buildDates(count = 14) {
    const today = new Date();
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return Array.from({ length: count }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      let label = '';
      if (i === 0) label = 'Hoy';
      else if (i === 1) label = 'Mañana';
      else label = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;

      // Simulate timeslots
      const baseSlots = ['13:00', '13:30', '14:00', '14:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
      const availableSlots = baseSlots.filter(() => Math.random() > 0.28);

      return {
        id: i,
        date: d,
        label,
        slots: availableSlots.length > 0 ? availableSlots : ['20:30', '21:30']
      };
    });
  }

  state.dates = buildDates(14);

  // DOM Elements
  const carouselTrack = document.getElementById('date-carousel');
  const bubblesGrid = document.getElementById('time-bubbles');
  const guestPills = document.querySelectorAll('.guest-pill');
  const liveSummary = document.getElementById('live-summary');
  const summaryGuests = document.getElementById('summary-guests');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const contactFields = document.getElementById('contact-fields');
  const confirmBtn = document.getElementById('confirm-btn');
  const confirmedBox = document.getElementById('confirmed-box');
  const resetBtn = document.getElementById('reset-res-btn');
  const canvas = document.getElementById('particle-canvas');

  if (!carouselTrack || !bubblesGrid || !confirmBtn) return;

  // 1. Render Date Carousel
  function renderDateCarousel() {
    carouselTrack.innerHTML = state.dates.map((d, index) => {
      const isActive = index === state.selectedDateIndex;
      return `
        <button
          type="button"
          class="date-chip ${isActive ? 'active' : ''}"
          data-index="${index}"
          role="option"
          aria-selected="${isActive}"
        >
          <span>${d.label}</span>
          ${isActive ? '<span class="date-chip-dot" aria-hidden="true"></span>' : ''}
        </button>
      `;
    }).join('');

    attachDateEvents();
  }

  function attachDateEvents() {
    const chips = carouselTrack.querySelectorAll('.date-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const index = parseInt(chip.getAttribute('data-index'), 10);
        selectDate(index);
      });
    });
  }

  function selectDate(index) {
    state.selectedDateIndex = index;
    state.selectedSlot = null;
    renderDateCarousel();
    renderTimeBubbles();
    updateLiveSummary();
    updateConfirmBtnState();
  }

  // Draggable Carousel Logic
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  carouselTrack.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - carouselTrack.offsetLeft;
    scrollLeft = carouselTrack.scrollLeft;
  });

  carouselTrack.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselTrack.offsetLeft;
    const walk = (x - startX) * 1.2;
    carouselTrack.scrollLeft = scrollLeft - walk;
  });

  carouselTrack.addEventListener('mouseup', () => { isDragging = false; });
  carouselTrack.addEventListener('mouseleave', () => { isDragging = false; });

  // Touch Support for mobile
  carouselTrack.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - carouselTrack.offsetLeft;
    scrollLeft = carouselTrack.scrollLeft;
  }, { passive: true });

  carouselTrack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselTrack.offsetLeft;
    const walk = (x - startX) * 1.2;
    carouselTrack.scrollLeft = scrollLeft - walk;
  }, { passive: true });

  carouselTrack.addEventListener('touchend', () => { isDragging = false; });

  // 2. Render Time Bubbles
  function renderTimeBubbles() {
    const currentDate = state.dates[state.selectedDateIndex];
    if (!currentDate || currentDate.slots.length === 0) {
      bubblesGrid.innerHTML = '<p class="no-slots">Sin disponibilidad en esta fecha</p>';
      return;
    }

    bubblesGrid.innerHTML = currentDate.slots.map((slot, i) => {
      const isActive = slot === state.selectedSlot;
      return `
        <button
          type="button"
          class="bubble ${isActive ? 'active' : ''}"
          data-slot="${slot}"
          style="animation-delay: ${i * 45}ms"
          role="option"
          aria-selected="${isActive}"
        >
          ${slot}
        </button>
      `;
    }).join('');

    const bubbles = bubblesGrid.querySelectorAll('.bubble');
    bubbles.forEach((bubble) => {
      bubble.addEventListener('click', () => {
        state.selectedSlot = bubble.getAttribute('data-slot');
        bubbles.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        bubble.classList.add('active');
        bubble.setAttribute('aria-selected', 'true');
        updateLiveSummary();
        updateConfirmBtnState();
      });
    });
  }

  // 3. Guest Selector
  guestPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      guestPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      state.guests = parseInt(pill.getAttribute('data-guests'), 10);
      updateLiveSummary();
    });
  });

  // 4. Update Live Summary
  function updateLiveSummary() {
    const curDate = state.dates[state.selectedDateIndex];
    if (state.selectedSlot && curDate) {
      summaryGuests.textContent = `${state.guests} ${state.guests === 1 ? 'Persona' : 'Pers.'}`;
      summaryDate.textContent = curDate.label;
      summaryTime.textContent = `${state.selectedSlot}h`;
      liveSummary.style.display = 'block';
      contactFields.classList.add('visible');
    } else {
      liveSummary.style.display = 'none';
      contactFields.classList.remove('visible');
    }
  }

  function updateConfirmBtnState() {
    if (state.selectedSlot && !state.confirmed) {
      confirmBtn.disabled = false;
      confirmBtn.classList.remove('disabled');
    } else {
      confirmBtn.disabled = true;
      confirmBtn.classList.add('disabled');
    }
  }

  // 5. Particle Explosion & Confirmation Engine
  const PARTICLE_COUNT = 36;

  function runParticleExplosion(originX, originY) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * 2 * Math.PI;
      const speed = 40 + Math.random() * 90;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: 1.5 + Math.random() * 2.8,
        life: 1,
        decay: 0.02 + Math.random() * 0.015
      };
    });

    let lastTime = performance.now();

    function frame(now) {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt * 0.016,
          y: p.y + p.vy * dt * 0.016,
          vy: p.vy + 65 * dt * 0.016, // subtle gravity
          life: p.life - p.decay * dt
        }))
        .filter((p) => p.life > 0);

      particles.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${38 + Math.random() * 12}, 70%, ${55 + p.life * 20}%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      });

      if (particles.length > 0) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(frame);
  }

  confirmBtn.addEventListener('click', (e) => {
    if (!state.selectedSlot || state.confirmed) return;

    const rect = confirmBtn.getBoundingClientRect();
    const originX = (e.clientX - rect.left) + 80;
    const originY = 60;

    confirmBtn.classList.add('firing');
    runParticleExplosion(originX, originY);

    setTimeout(() => {
      confirmBtn.classList.remove('firing');
      confirmBtn.style.display = 'none';
      confirmedBox.style.display = 'flex';
      state.confirmed = true;
    }, 850);
  });

  resetBtn.addEventListener('click', () => {
    state.confirmed = false;
    state.selectedSlot = null;
    confirmedBox.style.display = 'none';
    confirmBtn.style.display = 'inline-flex';
    updateConfirmBtnState();
    renderTimeBubbles();
    updateLiveSummary();
  });

  // Initial call
  renderDateCarousel();
  renderTimeBubbles();
})();
