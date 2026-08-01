/**
 * Link Page - Preview Renderer Module
 * Renders settings onto a DOM target container (used for both index.html and edit.html live preview).
 */

import { SOCIAL_PLATFORMS, UI_ICONS, getPlatformIcon } from './icons.js';
import { escapeHtml } from './utils.js';

export function renderPreview(settings, containerElement) {
  if (!containerElement || !settings) return;

  // Apply typography and colors to the target document root or container
  applyThemeStyles(settings, containerElement);

  const { brand, logo, profile, links, typography } = settings;

  // Profile Avatar & Logo HTML sources
  let avatarSrc = (profile && profile.avatar) || './logo.svg';
  if (avatarSrc.includes('eldoctor_logo') || avatarSrc.includes('el doctor logo')) {
    avatarSrc = './logo.svg';
  } else if (!avatarSrc.startsWith('http') && !avatarSrc.startsWith('data:') && !avatarSrc.startsWith('/') && !avatarSrc.startsWith('assets/') && !avatarSrc.startsWith('.')) {
    avatarSrc = './' + avatarSrc;
  }
  let logoSrc = logo ? logo.url : '';
  if (logoSrc.includes('eldoctor_logo') || logoSrc.includes('el doctor logo')) {
    logoSrc = './logo.svg';
  }

  // Filter enabled links
  const activeLinks = (links || []).filter(l => l.enabled);

  // Generate links HTML
  let linksHtml = '';
  if (activeLinks.length === 0) {
    linksHtml = `
      <div class="empty-state">
        <div class="empty-state-icon">${UI_ICONS.sparkler}</div>
        <p>No active links available yet. Add links in the editor!</p>
      </div>
    `;
  } else {
    linksHtml = activeLinks.map((link, idx) => {
      const isFeatured = link.featured;
      let platformIcon = getPlatformIcon(link.platform);

      // Add logo image for Website link card if available
      if (link.platform === 'Website' && (logoSrc || avatarSrc)) {
        const logoImg = logoSrc || avatarSrc;
        platformIcon = `<img src="${escapeHtml(logoImg)}" alt="Website Logo" class="website-link-icon-img" style="width: 26px; height: 26px; object-fit: contain; border-radius: 6px; background: #ffffff; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);" onerror="this.onerror=null; this.outerHTML='${escapeHtml(getPlatformIcon('Website'))}';" />`;
      }

      const staggerClass = `stagger-${(idx % 7) + 1}`;

      return `
        <a href="${escapeHtml(link.url)}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="link-card ${isFeatured ? 'link-card-featured' : ''} has-ripple animate-slide-up ${staggerClass}"
           data-link-id="${link.id}">
          <div class="link-card-icon">
            ${platformIcon}
          </div>
          <div class="link-card-content">
            <span class="link-card-label">${escapeHtml(link.label || link.platform)}</span>
            ${link.badge ? `<span class="link-card-badge">${escapeHtml(link.badge)}</span>` : ''}
          </div>
          <span class="link-card-arrow">${UI_ICONS.externalLink}</span>
        </a>
      `;
    }).join('');
  }

  // Render Full Bio Card Structure inside target container
  containerElement.innerHTML = `
    <div class="profile-hero">
      <div class="avatar-container">
        <img src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(brand.name)}" class="profile-avatar" onerror="this.onerror=null; this.src='./logo.svg';" />
        ${logoSrc && logoSrc !== avatarSrc ? `
          <div class="brand-logo-badge">
            <img src="${escapeHtml(logoSrc)}" alt="Logo" />
          </div>
        ` : ''}
      </div>

      <div class="profile-identity">
        <div class="brand-title-row">
          <h1 class="profile-name">${escapeHtml(brand.name || 'Your Name')}</h1>
          ${profile.verified ? `<span class="verified-badge" title="Verified Profile">${UI_ICONS.verified}</span>` : ''}
        </div>
        
        ${brand.description ? `<p class="profile-bio">${escapeHtml(brand.description)}</p>` : ''}
        
        ${brand.website ? `
          <a href="${escapeHtml(brand.website)}" target="_blank" rel="noopener noreferrer" class="website-pill-btn">
            ${(logoSrc || avatarSrc) ? `<img src="${escapeHtml(logoSrc || avatarSrc)}" alt="Website Logo" style="width: 20px; height: 20px; object-fit: contain; border-radius: 4px; background: #ffffff; padding: 2px;" onerror="this.onerror=null; this.src='./logo.svg';" />` : getPlatformIcon('Website')}
            <span>${escapeHtml(brand.website.replace(/^https?:\/\//, ''))}</span>
            <span style="opacity: 0.7;">${UI_ICONS.externalLink}</span>
          </a>
        ` : ''}

        ${profile.badge ? `
          <div class="profile-status-pill">
            <span class="status-dot"></span>
            <span>${escapeHtml(profile.badge)}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="links-list">
      ${linksHtml}
    </div>
  `;

  // Attach ripple event listeners to link cards
  containerElement.querySelectorAll('.has-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-circle');

      const ripple = btn.getElementsByClassName('ripple-circle')[0];
      if (ripple) ripple.remove();

      btn.appendChild(circle);
    });
  });
}

/**
 * Applies color variables, font families, and theme mode directly onto body/root
 */
export function applyThemeStyles(settings, containerElement) {
  const root = document.documentElement;
  const { theme, colors, typography } = settings;

  // Set Theme Mode attribute
  let activeMode = theme.mode;
  if (activeMode === 'auto') {
    activeMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', activeMode);

  if (theme.preset && theme.preset !== 'custom') {
    root.setAttribute('data-theme-preset', theme.preset);
  } else {
    root.removeAttribute('data-theme-preset');
  }

  // RTL direction
  if (typography.rtl) {
    root.setAttribute('dir', 'rtl');
  } else {
    root.setAttribute('dir', 'ltr');
  }

  // Apply custom CSS variables if defined
  if (colors) {
    if (colors.primary) root.style.setProperty('--color-primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary);
    if (colors.background) {
      root.style.setProperty('--color-bg', colors.background);
      if (theme.preset === 'custom') {
        root.style.setProperty('--color-bg-gradient', colors.background);
      }
    }
    if (colors.text) root.style.setProperty('--color-text', colors.text);
    if (colors.buttonBg) root.style.setProperty('--btn-bg', colors.buttonBg);
    if (colors.buttonText) root.style.setProperty('--btn-text', colors.buttonText);
  }

  // Font family
  if (typography.fontFamily) {
    root.style.setProperty('--font-family-base', `'${typography.fontFamily}', sans-serif`);
    
    // Dynamically load Google Font if needed
    loadGoogleFont(typography.fontFamily);
  }

  // Font size
  if (typography.fontSize === 'small') {
    root.style.setProperty('--font-size-base', '14px');
  } else if (typography.fontSize === 'large') {
    root.style.setProperty('--font-size-base', '18px');
  } else {
    root.style.setProperty('--font-size-base', '16px');
  }
}

// Helper to inject Google Font dynamically
function loadGoogleFont(fontName) {
  if (!fontName) return;
  const fontId = 'google-font-' + fontName.toLowerCase().replace(/\s+/g, '-');
  if (document.getElementById(fontId)) return;

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
