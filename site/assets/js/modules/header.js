export function renderHeader(game) {
  const navLinks = [
    { href: '#overview', label: 'Overview' },
    { href: '#stats', label: 'Stats' },
    { href: '#timeline', label: 'Timeline' },
    { href: '#roadmap', label: 'Roadmap' },
    { href: '#patches', label: 'Patches' },
    { href: '#sources', label: 'Sources' },
    { href: '#guides', label: 'Guides' },
    { href: '#search', label: 'Search' },
  ];

  const navHTML = navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('');

  return `
    <header class="site-header">
      <div class="container header-inner">
        <a class="logo" href="#top" aria-label="Windrose Research Home">
          <span class="logo-icon">⚓</span>
          <span>Windrose</span>
        </a>
        <nav class="desktop-nav" aria-label="Main navigation">
          ${navHTML}
          <a class="btn btn-primary" href="https://github.com/brimdor/windrose" target="_blank" rel="noopener">GitHub</a>
        </nav>
        <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav id="mobile-nav" class="mobile-nav container" aria-label="Mobile navigation">
        ${navHTML}
        <a class="btn btn-primary" href="https://github.com/brimdor/windrose" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </header>
  `;
}

export function initHeader() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.classList.toggle('open', !expanded);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
    });
  });
}
