import QRCode from 'qrcode';

/**
 * Link Page - Utilities Module
 * Validation, Toast Notifications, Modal Dialogs, Image Compression, and QR Generator.
 */

// Toast notification helper
export function showToast(message, type = 'info', duration = 3000) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slide-in`;
  
  const iconMap = {
    success: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  toastContainer.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
  if (!toast || toast.dataset.closing === 'true') return;
  toast.dataset.closing = 'true';
  toast.classList.add('toast-hiding');
  const removeEl = () => {
    if (toast.parentNode) toast.remove();
  };
  toast.addEventListener('animationend', removeEl, { once: true });
  setTimeout(removeEl, 250);
}

// Modal Dialog System
export function showModal({ title, content, confirmText = 'Confirm', cancelText = 'Cancel', type = 'info', onConfirm, onCancel }) {
  const existingModal = document.getElementById('app-modal');
  if (existingModal) existingModal.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'app-modal';
  backdrop.className = 'modal-backdrop animate-fade-in';

  backdrop.innerHTML = `
    <div class="modal-card modal-${type} animate-scale-up" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h3 id="modal-title" class="modal-title">${escapeHtml(title)}</h3>
        <button class="modal-close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        ${cancelText ? `<button class="btn btn-secondary modal-cancel-btn">${escapeHtml(cancelText)}</button>` : ''}
        ${confirmText ? `<button class="btn btn-primary modal-confirm-btn">${escapeHtml(confirmText)}</button>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    if (backdrop.dataset.closing === 'true') return;
    backdrop.dataset.closing = 'true';
    backdrop.classList.add('modal-closing');
    const removeModal = () => {
      if (backdrop.parentNode) {
        backdrop.remove();
      }
    };
    backdrop.addEventListener('animationend', removeModal, { once: true });
    setTimeout(removeModal, 220);
  };

  backdrop.querySelector('.modal-close')?.addEventListener('click', () => {
    close();
    if (onCancel) onCancel();
  });

  backdrop.querySelector('.modal-cancel-btn')?.addEventListener('click', () => {
    close();
    if (onCancel) onCancel();
  });

  backdrop.querySelector('.modal-confirm-btn')?.addEventListener('click', async () => {
    if (onConfirm) {
      const res = await onConfirm();
      if (res !== false) close();
    } else {
      close();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      close();
      if (onCancel) onCancel();
    }
  });

  return { close };
}

// Escape HTML string
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validations
export function isValidUrl(url) {
  if (!url) return false;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  try {
    const parsed = new URL(url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^[\+\d\s\(\)\-]{6,20}$/.test(phone);
}

// Copy to Clipboard
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Copy failed', err);
    return false;
  }
}

// Image File Compression & Base64 Converter
export function compressImage(file, maxWidth = 500, maxHeight = 500, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('لم يتم إرفاق أي ملف'));
    }

    const fileName = (file.name || '').toLowerCase();
    const isImageExt = /\.(png|jpe?g|webp|gif|svg|bmp|ico)$/i.test(fileName);
    const isImageType = Boolean(file.type && file.type.startsWith('image/'));

    if (!isImageType && !isImageExt) {
      return reject(new Error('الملف المختار ليس صورة صالحة'));
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (event) => {
      const rawDataUrl = event.target.result;

      // For SVG images or small files, return raw dataUrl directly
      if (file.type === 'image/svg+xml' || fileName.endsWith('.svg')) {
        return resolve(rawDataUrl);
      }

      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width || maxWidth;
          let height = img.height || maxHeight;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width || 100;
          canvas.height = height || 100;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Use PNG format if original file is PNG to preserve transparency
          const isPng = file.type === 'image/png' || fileName.endsWith('.png');
          const outputType = isPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(outputType, quality);
          resolve(dataUrl || rawDataUrl);
        } catch (err) {
          console.warn('Canvas compression error, using raw Data URL', err);
          resolve(rawDataUrl);
        }
      };

      img.onerror = (err) => {
        console.warn('Image load error, using raw Data URL', err);
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Real Standard ISO/IEC 18004 QR Code Generator
 * Draws a fully functional, 100% scannable QR Code using HTML5 Canvas with centered readable logo
 */
export function generateQRCodeCanvas(text, canvas, size = 220, options = {}) {
  if (!canvas) return;
  const targetUrl = text || window.location.href;
  const darkColor = options.color || '#382d54';
  const lightColor = options.bgColor || '#ffffff';
  const showLogo = options.showLogo !== false;
  const logoUrl = options.logoUrl || './logo.svg';
  
  QRCode.toCanvas(canvas, targetUrl, {
    width: size,
    margin: 2,
    color: {
      dark: darkColor,
      light: lightColor
    },
    errorCorrectionLevel: 'H'
  }, function (error) {
    if (error) {
      console.error('Error generating QR code:', error);
      return;
    }
    if (showLogo) {
      const ctx = canvas.getContext('2d');
      const logoSize = Math.round(size * 0.22);
      const centerX = size / 2;
      const centerY = size / 2;

      ctx.save();
      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (logoSize / 2) + 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = darkColor;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        ctx.drawImage(logoImg, centerX - (logoSize / 2), centerY - (logoSize / 2), logoSize, logoSize);
        ctx.restore();
      };
      logoImg.onerror = () => {
        ctx.restore();
      };
      logoImg.src = logoUrl;
    }
  });
}
