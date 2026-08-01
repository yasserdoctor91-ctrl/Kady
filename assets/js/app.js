/**
 * Link Page - Main Public App Script (index.html)
 * Loads settings, renders public profile card, binds toolbar controls (Copy, Share, QR Modal).
 */

import { loadSettings } from './storage.js';
import { renderPreview } from './preview.js';
import { UI_ICONS } from './icons.js';
import { showToast, showModal, copyToClipboard, generateQRCodeCanvas } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initPublicPage();
});

function initPublicPage() {
  const container = document.getElementById('public-profile-card');
  if (!container) return;

  // Load current settings
  let settings = loadSettings();

  // Update SEO Meta Tags
  updateSeoTags(settings);

  // Render main preview card
  renderPreview(settings, container);

  const refreshPublicPage = () => {
    settings = loadSettings();
    updateSeoTags(settings);
    renderPreview(settings, container);
  };

  // Listen for real-time updates from edit page or other tabs
  window.addEventListener('linkpage:settingsUpdated', (e) => {
    settings = e.detail || loadSettings();
    updateSeoTags(settings);
    renderPreview(settings, container);
  });

  window.addEventListener('storage', refreshPublicPage);
  window.addEventListener('focus', refreshPublicPage);
  window.addEventListener('pageshow', refreshPublicPage);

  // Bind Public Toolbar Buttons
  bindToolbarActions();
}

function updateSeoTags(settings) {
  if (!settings.seo) return;
  
  if (settings.seo.metaTitle) {
    document.title = settings.seo.metaTitle;
  } else if (settings.brand.name) {
    document.title = `${settings.brand.name} | Links`;
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && settings.seo.metaDescription) {
    metaDesc.setAttribute('content', settings.seo.metaDescription);
  }

  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords && settings.seo.keywords) {
    metaKeywords.setAttribute('content', settings.seo.keywords);
  }
}

function bindToolbarActions() {
  const copyBtn = document.getElementById('btn-copy-link');
  const shareBtn = document.getElementById('btn-share-page');
  const qrBtn = document.getElementById('btn-qr-code');
  const themeToggleBtn = document.getElementById('btn-theme-toggle');

  const currentUrl = window.location.href;

  // Copy Link Button
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const success = await copyToClipboard(currentUrl);
      if (success) {
        showToast('Link copied to clipboard!', 'success');
      } else {
        showToast('Could not copy link automatically', 'error');
      }
    });
  }

  // Share Page Button
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: 'Check out my links page!',
            url: currentUrl
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            fallbackShareModal(currentUrl);
          }
        }
      } else {
        fallbackShareModal(currentUrl);
      }
    });
  }

  // QR Code Button
  if (qrBtn) {
    qrBtn.addEventListener('click', () => {
      openQrModal(currentUrl);
    });
  }

  // Quick Theme Toggle Button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }
}

function fallbackShareModal(url) {
  showModal({
    title: 'Share Website',
    content: `
      <p style="margin-bottom: 12px;">Share this link page with your audience or friends:</p>
      <div style="display: flex; gap: 8px;">
        <input type="text" readonly value="${url}" class="form-input" id="share-modal-input" />
        <button class="btn btn-primary" id="share-modal-copy-btn">${UI_ICONS.copy} Copy</button>
      </div>
    `,
    confirmText: 'Done',
    cancelText: '',
    onConfirm: () => true
  });

  setTimeout(() => {
    const copyModalBtn = document.getElementById('share-modal-copy-btn');
    const input = document.getElementById('share-modal-input');
    if (copyModalBtn && input) {
      copyModalBtn.addEventListener('click', async () => {
        await copyToClipboard(url);
        showToast('Link copied to clipboard!', 'success');
      });
    }
  }, 50);
}

function openQrModal(url) {
  showModal({
    title: 'رمز QR للموقع',
    content: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 10px 0;">
        <p style="text-align: center; font-size: 0.95rem; color: var(--color-text-secondary); dir: rtl;">امسح رمز QR باستخدام كاميرا هاتفك لفتح هذه الصفحة مباشرة.</p>
        <div style="background: #ffffff; padding: 16px; border-radius: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.12); display: flex; justify-content: center; align-items: center;">
          <canvas id="qr-modal-canvas"></canvas>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-download-qr" style="gap: 8px;">
          ${UI_ICONS.download} تحميل رمز QR كـ PNG
        </button>
      </div>
    `,
    confirmText: 'إغلاق',
    cancelText: ''
  });

  setTimeout(() => {
    const canvas = document.getElementById('qr-modal-canvas');
    if (canvas) {
      generateQRCodeCanvas(url, canvas, 220);
    }

    const downloadBtn = document.getElementById('btn-download-qr');
    if (downloadBtn && canvas) {
      downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'eldoctor-qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('تم تحميل صورة رمز QR بنجاح!', 'success');
      });
    }
  }, 50);
}
