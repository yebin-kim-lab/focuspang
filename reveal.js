(function () {
  const SEL = 'section h1, section h2, section h3, section p, section [data-r=stat], section a[href][style*="999px"], section image-slot, section [data-r=row], section [data-r=card], section [data-view-autoplay="1"], section [data-reveal], section [role=tablist], main [data-r=row], main nav, footer > div > div';
  const EASE = 'cubic-bezier(.2,.7,.2,1)';
  function prep(el) {
    if (el.__rv || el.closest('header')) return null;
    let t = el;
    if (el.tagName === 'IFRAME' || el.tagName === 'IMAGE-SLOT') t = el.parentElement;
    if (!t || t.__rv) return null;
    if (/left/.test(t.style.transition || '')) return null;
    if (t.parentElement && t.parentElement.closest('[data-rv-on]')) { /* nested in revealed block */ }
    t.__rv = 1; el.__rv = 1;
    t.style.opacity = '0';
    t.style.translate = '0 28px';
    t.style.transition = [t.style.transition, 'opacity .8s ' + EASE, 'translate .8s ' + EASE].filter(Boolean).join(',');
    return t;
  }
  function run() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(entries => {
      const shown = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
      shown.forEach((e, i) => {
        const t = e.target;
        t.style.transitionDelay = Math.min(i * 90, 540) + 'ms';
        t.style.opacity = '1'; t.style.translate = '0 0';
        io.unobserve(t);
        setTimeout(() => { t.style.transitionDelay = ''; }, 1500);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    const scan = () => document.querySelectorAll(SEL).forEach(el => { const t = prep(el); if (t) io.observe(t); });
    scan(); setTimeout(scan, 800); setTimeout(scan, 2500);
  }
  window.fpReveal = run;
})();
