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
        showToast('تم نسخ الرابط بنجاح!', 'success');
      } else {
        showToast('تعذر نسخ الرابط تلقائياً', 'error');
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
            text: 'تعرف على الصفحة الرسمية لـ Kady!',
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
      showToast(newTheme === 'dark' ? 'تم التبديل للوضع الليلي' : 'تم التبديل للوضع الصباحي', 'info');
    });
  }
}

function fallbackShareModal(url) {
  showModal({
    title: 'مشاركة الموقع',
    content: `
      <p style="margin-bottom: 12px; dir: rtl; text-align: right;">شارك الصفحة الرسمية مع أصدقائك أو عملائك:</p>
      <div style="display: flex; gap: 8px;">
        <input type="text" readonly value="${url}" class="form-input" id="share-modal-input" />
        <button class="btn btn-primary" id="share-modal-copy-btn">${UI_ICONS.copy} نسخ</button>
      </div>
    `,
    confirmText: 'إغلاق',
    cancelText: '',
    onConfirm: () => true
  });

  setTimeout(() => {
    const copyModalBtn = document.getElementById('share-modal-copy-btn');
    const input = document.getElementById('share-modal-input');
    if (copyModalBtn && input) {
      copyModalBtn.addEventListener('click', async () => {
        await copyToClipboard(url);
        showToast('تم نسخ الرابط بنجاح!', 'success');
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
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-text);">لون الـ QR:</span>
          <button class="qr-color-btn" data-color="#382d54" style="width: 26px; height: 26px; border-radius: 50%; background: #382d54; border: 2px solid #ffffff; box-shadow: 0 0 0 2px #382d54; cursor: pointer;" title="أرجواني غامق"></button>
          <button class="qr-color-btn" data-color="#4f46e5" style="width: 26px; height: 26px; border-radius: 50%; background: #4f46e5; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer;" title="أزرق ملكي"></button>
          <button class="qr-color-btn" data-color="#d96b9d" style="width: 26px; height: 26px; border-radius: 50%; background: #d96b9d; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer;" title="وردي"></button>
          <button class="qr-color-btn" data-color="#059669" style="width: 26px; height: 26px; border-radius: 50%; background: #059669; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer;" title="أخضر زمردي"></button>
          <button class="qr-color-btn" data-color="#0f172a" style="width: 26px; height: 26px; border-radius: 50%; background: #0f172a; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer;" title="أسود"></button>
          <input type="color" id="qr-custom-color-picker" value="#382d54" style="width: 28px; height: 28px; border: none; border-radius: 50%; cursor: pointer; padding: 0; background: transparent;" title="تخصيص اللون" />
        </div>
        <div style="background: #ffffff; padding: 16px; border-radius: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.12); display: flex; justify-content: center; align-items: center;">
          <canvas id="qr-modal-canvas"></canvas>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-download-qr" style="gap: 8px;">
          ${UI_ICONS.download} تحميل رمز QR كـ PNG
        </button>
      </div>
    `,
    confirmText: 'إغلاق',
    cancelText: '',
    onConfirm: () => true
  });

  setTimeout(() => {
    let selectedColor = '#382d54';
    const canvas = document.getElementById('qr-modal-canvas');
    const updateQr = () => {
      if (canvas) {
        generateQRCodeCanvas(url, canvas, 240, {
          color: selectedColor,
          bgColor: '#ffffff',
          showLogo: true,
          logoUrl: './logo.svg'
        });
      }
    };
    updateQr();

    document.querySelectorAll('.qr-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedColor = e.currentTarget.getAttribute('data-color') || '#382d54';
        document.querySelectorAll('.qr-color-btn').forEach(b => b.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)');
        e.currentTarget.style.boxShadow = `0 0 0 2px ${selectedColor}`;
        updateQr();
      });
    });

    const colorPicker = document.getElementById('qr-custom-color-picker');
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        selectedColor = e.target.value;
        updateQr();
      });
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
