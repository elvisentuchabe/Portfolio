/**
 * LUMINA — Custom Cursor Module
 * Ring + Dot with smooth follow and interactive states
 */

(function initCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');

  if (!ring || !dot) return;

  // Track position
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    ring.style.transform = `translate(${x}px, ${y}px)`;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });

  // Mouse down / up
  window.addEventListener('mousedown', () => {
    ring.classList.add('clicking');
    dot.classList.add('clicking');
  });

  window.addEventListener('mouseup', () => {
    ring.classList.remove('clicking');
    dot.classList.remove('clicking');
  });

  // Hover detection over interactive elements
  const interactiveSelectors = 'a, button, [role="button"], input, select, label, .menu-item, .bubble, .date-chip, .guest-pill';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.add('hovering');
      dot.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.remove('hovering');
      dot.classList.remove('hovering');
    }
  });
})();
