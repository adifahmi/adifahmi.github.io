(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));

  const tiltScene = document.querySelector('[data-tilt-scene]');
  if (tiltScene) {
    let tiltX = 0;
    let tiltY = 0;
    let activePointer = null;
    let startX = 0;
    let startY = 0;
    let startTiltX = 0;
    let startTiltY = 0;
    let dragBounds = null;
    let hoverBounds = null;
    let didDrag = false;
    let suppressClickUntil = 0;
    let latestPointer = null;
    let frameRequested = false;

    const renderTilt = (x, y) => {
      tiltX = Math.max(-12, Math.min(12, x));
      tiltY = Math.max(-10, Math.min(10, y));
      tiltScene.style.setProperty('--tilt-x', `${tiltX}deg`);
      tiltScene.style.setProperty('--tilt-y', `${tiltY}deg`);
    };

    const resetTilt = () => renderTilt(0, 0);

    const queuePointerTilt = (event, dragging) => {
      const bounds = dragging ? dragBounds : hoverBounds || tiltScene.getBoundingClientRect();
      latestPointer = {
        x: event.clientX,
        y: event.clientY,
        bounds,
        dragging,
        startX,
        startY,
        startTiltX,
        startTiltY,
      };
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(() => {
        frameRequested = false;
        if (!latestPointer) return;
        const { x, y, bounds: frameBounds } = latestPointer;
        if (latestPointer.dragging) {
          const deltaX = (x - latestPointer.startX) / frameBounds.width;
          const deltaY = (y - latestPointer.startY) / frameBounds.height;
          renderTilt(latestPointer.startTiltX + deltaX * 24, latestPointer.startTiltY - deltaY * 20);
        } else {
          const normalizedX = (x - frameBounds.left) / frameBounds.width;
          const normalizedY = (y - frameBounds.top) / frameBounds.height;
          renderTilt((normalizedX - 0.5) * 24, (0.5 - normalizedY) * 20);
        }
      });
    };

    tiltScene.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch' && activePointer === null) {
        hoverBounds = tiltScene.getBoundingClientRect();
      }
    });

    tiltScene.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType !== 'touch') return;
      activePointer = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startTiltX = tiltX;
      startTiltY = tiltY;
      dragBounds = tiltScene.getBoundingClientRect();
      didDrag = false;
      tiltScene.classList.add('is-dragging');
      try { tiltScene.setPointerCapture(event.pointerId); } catch { /* Pointer may already be inactive. */ }
    });

    tiltScene.addEventListener('pointermove', (event) => {
      const isPointerDrag = activePointer === event.pointerId;
      const isMouseHover = event.pointerType !== 'touch' && activePointer === null;
      if (!isMouseHover && !isPointerDrag) return;

      if (isPointerDrag && Math.hypot(event.clientX - startX, event.clientY - startY) > 4) {
        didDrag = true;
      }
      queuePointerTilt(event, isPointerDrag);
    });

    tiltScene.addEventListener('pointerup', (event) => {
      if (activePointer !== event.pointerId) return;
      activePointer = null;
      dragBounds = null;
      tiltScene.classList.remove('is-dragging');
      if (didDrag) {
        suppressClickUntil = performance.now() + 500;
      }
    });

    tiltScene.addEventListener('pointercancel', () => {
      activePointer = null;
      dragBounds = null;
      didDrag = false;
      tiltScene.classList.remove('is-dragging');
      latestPointer = null;
      resetTilt();
    });

    tiltScene.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'touch' && activePointer === null) {
        latestPointer = null;
        hoverBounds = null;
        resetTilt();
      }
    });

    tiltScene.addEventListener('click', (event) => {
      if (event.detail > 0 && performance.now() < suppressClickUntil) {
        event.preventDefault();
        suppressClickUntil = 0;
        return;
      }
      resetTilt();
    });

    tiltScene.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 5 : 3;
      if (event.key === 'ArrowLeft') renderTilt(tiltX - step, tiltY);
      else if (event.key === 'ArrowRight') renderTilt(tiltX + step, tiltY);
      else if (event.key === 'ArrowUp') renderTilt(tiltX, tiltY + step);
      else if (event.key === 'ArrowDown') renderTilt(tiltX, tiltY - step);
      else if (event.key === 'Home') resetTilt();
      else return;
      event.preventDefault();
    });
  }
})();
