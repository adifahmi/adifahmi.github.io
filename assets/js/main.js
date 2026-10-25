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
  const artAssembly = tiltScene?.querySelector('[data-art-assembly]');
  if (tiltScene && artAssembly) {
    let assemblyX = 0;
    let assemblyY = 0;
    let assemblyRotateX = 0;
    let assemblyRotateY = 0;
    let activePointer = null;
    let startX = 0;
    let startY = 0;
    let startAssemblyX = 0;
    let startAssemblyY = 0;
    let startRotateX = 0;
    let startRotateY = 0;
    let dragBounds = null;
    let didDrag = false;
    let suppressClickUntil = 0;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const renderAssembly = (x, y, rotateX = assemblyRotateX, rotateY = assemblyRotateY) => {
      const bounds = tiltScene.getBoundingClientRect();
      const maxX = Math.min(110, bounds.width * 0.2);
      const maxY = Math.min(80, bounds.height * 0.16);
      assemblyX = clamp(x, -maxX, maxX);
      assemblyY = clamp(y, -maxY, maxY);
      assemblyRotateX = clamp(rotateX, -14, 14);
      assemblyRotateY = clamp(rotateY, -14, 14);
      artAssembly.style.setProperty('--assembly-x', `${assemblyX}px`);
      artAssembly.style.setProperty('--assembly-y', `${assemblyY}px`);
      artAssembly.style.setProperty('--assembly-rotate-x', `${assemblyRotateX}deg`);
      artAssembly.style.setProperty('--assembly-rotate-y', `${assemblyRotateY}deg`);
    };

    const resetAssembly = () => renderAssembly(0, 0, 0, 0);

    artAssembly.addEventListener('pointerdown', (event) => {
      const target = event.target instanceof Element ? event.target.closest('.orbit, .art-core') : null;
      if (!target || !artAssembly.contains(target)) return;
      if (event.isPrimary === false || (event.button !== 0 && event.pointerType !== 'touch')) return;
      activePointer = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startAssemblyX = assemblyX;
      startAssemblyY = assemblyY;
      startRotateX = assemblyRotateX;
      startRotateY = assemblyRotateY;
      dragBounds = tiltScene.getBoundingClientRect();
      didDrag = false;
      artAssembly.classList.add('is-dragging');
      try { tiltScene.setPointerCapture(event.pointerId); } catch { /* Pointer may already be inactive. */ }
    });

    window.addEventListener('pointermove', (event) => {
      if (activePointer !== event.pointerId || !dragBounds?.width || !dragBounds?.height) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (Math.hypot(deltaX, deltaY) > 5) didDrag = true;
      if (!didDrag) return;
      renderAssembly(
        startAssemblyX + deltaX,
        startAssemblyY + deltaY,
        startRotateX - (deltaY / dragBounds.height) * 28,
        startRotateY + (deltaX / dragBounds.width) * 28,
      );
    });

    window.addEventListener('pointerup', (event) => {
      if (activePointer !== event.pointerId) return;
      activePointer = null;
      dragBounds = null;
      artAssembly.classList.remove('is-dragging');
      if (didDrag) {
        suppressClickUntil = performance.now() + 500;
      }
    });

    window.addEventListener('pointercancel', () => {
      activePointer = null;
      dragBounds = null;
      didDrag = false;
      artAssembly.classList.remove('is-dragging');
    });

    tiltScene.addEventListener('click', (event) => {
      if (event.detail > 0 && performance.now() < suppressClickUntil) {
        event.preventDefault();
        suppressClickUntil = 0;
        return;
      }
      resetAssembly();
    });

    tiltScene.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 24 : 12;
      if (event.key === 'ArrowLeft') renderAssembly(assemblyX - step, assemblyY, assemblyRotateX, assemblyRotateY - 2);
      else if (event.key === 'ArrowRight') renderAssembly(assemblyX + step, assemblyY, assemblyRotateX, assemblyRotateY + 2);
      else if (event.key === 'ArrowUp') renderAssembly(assemblyX, assemblyY - step, assemblyRotateX + 2, assemblyRotateY);
      else if (event.key === 'ArrowDown') renderAssembly(assemblyX, assemblyY + step, assemblyRotateX - 2, assemblyRotateY);
      else if (event.key === 'Home') resetAssembly();
      else return;
      event.preventDefault();
    });
  }
})();
