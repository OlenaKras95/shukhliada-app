/*
 * Меню на телефоні: сайдбар виїжджає за бургером (рішення PM 2026-11-24, sitemap.md, «Навігація»).
 * Закривається: «Закрити», затемнення, Esc, свайп ліворуч, вибір пункту чи категорії.
 * Фокус не виходить з відкритого меню: решта сторінки — inert. Закрили — фокус на бургер.
 * Ширина телефона — та сама, що в _frame.css.
 */
(() => {
  const device = document.querySelector('.device');
  const burger = device && device.querySelector('.wf-burger');
  const nav = device && device.querySelector(':scope > nav');
  if (!burger || !nav) return;

  const scrim = device.querySelector(':scope > .wf-scrim');
  const closeBtn = nav.querySelector('.wf-menu-close');
  const phone = matchMedia('(max-width: 720px)');
  let outside = [];

  const isOpen = () => device.classList.contains('wf-menu-open');

  function open() {
    device.classList.add('wf-menu-open');
    burger.setAttribute('aria-expanded', 'true');
    // усе, крім меню: шапка, main, а також навігатор репо поза рамкою
    outside = [
      ...[...device.children].filter((el) => el !== nav && el !== scrim),
      ...[...document.body.children].filter((el) => el !== device && el.tagName !== 'SCRIPT'),
    ];
    outside.forEach((el) => { el.inert = true; });
    (closeBtn || nav.querySelector('a')).focus();
  }

  function close({ focusBurger = true } = {}) {
    device.classList.remove('wf-menu-open');
    burger.setAttribute('aria-expanded', 'false');
    outside.forEach((el) => { el.inert = false; });
    outside = [];
    if (focusBurger) burger.focus();
  }

  burger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', () => close());
  if (scrim) scrim.addEventListener('click', () => close());

  // вибір пункту чи категорії закриває меню — інакше воно лишиться поверх відкритого шару
  nav.addEventListener('click', (e) => {
    if (isOpen() && e.target.closest('a')) close({ focusBurger: false });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
  });

  // свайп ліворуч по меню
  let x0 = null;
  nav.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  nav.addEventListener('touchend', (e) => {
    if (x0 !== null && e.changedTouches[0].clientX - x0 < -60) close();
    x0 = null;
  });

  // повернули телефон чи розширили вікно до десктопа — сайдбар знову звичайний
  phone.addEventListener('change', () => {
    if (!phone.matches && isOpen()) close({ focusBurger: false });
  });
})();
