/**
 * Link Page - Edit Webpage Script (edit.html)
 * Form state binding, real-time preview updates, image uploads, drag-and-drop link manager.
 */

import { 
  loadSettings, 
  saveSettings, 
  resetSettings, 
  exportSettings, 
  importSettings, 
  DEFAULT_SETTINGS,
  isEditorAuthenticated,
  verifyCredentials,
  loginEditorSession,
  logoutEditorSession
} from './storage.js';
import { renderPreview, applyThemeStyles } from './preview.js';
import { SOCIAL_PLATFORMS, UI_ICONS, getPlatformIcon } from './icons.js';
import { showToast, showModal, compressImage, isValidUrl, isValidEmail, isValidPhone, escapeHtml } from './utils.js';

let settings = null;
let livePreviewFrame = null;

document.addEventListener('DOMContentLoaded', () => {
  initEditPage();
});

function initEditPage() {
  settings = loadSettings();
  livePreviewFrame = document.getElementById('device-preview-content');

  // Setup Login Lock Screen Overlay
  setupEditorAuth();

  // Render initial live preview
  updateLivePreview();

  // Populate form controls from settings
  populateFormFields();

  // Render editable links list
  renderEditableLinksList();

  // Bind form change listeners for instant live updating
  bindFormChangeEvents();

  // Bind top navbar actions
  bindNavbarActions();

  // Save settings before page unload
  window.addEventListener('beforeunload', () => {
    if (settings) {
      saveSettings(settings);
    }
  });

  // Save settings when clicking any link pointing back to index.html
  document.querySelectorAll('a[href="index.html"]').forEach(link => {
    link.addEventListener('click', () => {
      if (settings) {
        saveSettings(settings);
      }
    });
  });
}

function updateLivePreview() {
  if (livePreviewFrame) {
    renderPreview(settings, livePreviewFrame);
  }
  if (settings) {
    saveSettings(settings);
  }
}

/**
 * Fill form controls with current settings
 */
function populateFormFields() {
  // Brand
  setInputValue('brand-name', settings.brand.name);
  setInputValue('brand-description', settings.brand.description);
  setInputValue('brand-website', settings.brand.website);

  // Profile & Logo
  setInputValue('profile-avatar-path', settings.profile.avatar || '');
  setInputValue('profile-badge', settings.profile.badge || '');
  setCheckboxValue('profile-verified', settings.profile.verified);
  setInputValue('logo-url-path', settings.logo.url || '');
  setInputValue('logo-badge-text', settings.logo.badgeText || '');

  // Theme & Colors
  setSelectValue('theme-mode', settings.theme.mode || 'light');
  setSelectValue('theme-preset', settings.theme.preset || 'clean-minimalism');
  setInputValue('color-primary', settings.colors.primary || '#4f46e5');
  setInputValue('color-secondary', settings.colors.secondary || '#6366f1');
  setInputValue('color-bg', settings.colors.background || '#f8fafc');
  setInputValue('color-text', settings.colors.text || '#0f172a');
  setInputValue('color-btn-bg', settings.colors.buttonBg || '#ffffff');

  // Typography
  setSelectValue('typography-font', settings.typography.fontFamily || 'Plus Jakarta Sans');
  setSelectValue('typography-size', settings.typography.fontSize || 'medium');
  setCheckboxValue('typography-rtl', settings.typography.rtl || false);

  // SEO
  setInputValue('seo-title', settings.seo?.metaTitle || '');
  setInputValue('seo-description', settings.seo?.metaDescription || '');
  setInputValue('seo-keywords', settings.seo?.keywords || '');

  // Admin Security Credentials
  setInputValue('auth-username', settings.auth?.username || 'admin');
  setInputValue('auth-password', settings.auth?.password || 'admin123');

  // Previews
  updateImagePreviewElements();
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined ? val : '';
}

function setSelectValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function setCheckboxValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.checked = Boolean(val);
}

function updateImagePreviewElements() {
  const avatarPathInput = document.getElementById('profile-avatar-path');
  if (avatarPathInput && avatarPathInput !== document.activeElement) {
    avatarPathInput.value = settings.profile.avatar || '';
  }

  const avatarImg = document.getElementById('avatar-preview-img');
  if (avatarImg) {
    avatarImg.src = settings.profile.avatar || './logo.svg';
  }

  const logoPathInput = document.getElementById('logo-url-path');
  if (logoPathInput && logoPathInput !== document.activeElement) {
    logoPathInput.value = settings.logo.url || '';
  }

  const logoImg = document.getElementById('logo-preview-img');
  if (logoImg) {
    if (settings.logo.url) {
      logoImg.src = settings.logo.url;
      logoImg.style.display = 'block';
    } else {
      logoImg.style.display = 'none';
    }
  }
}

/**
 * Bind input & change listeners across all editor panels
 */
function bindFormChangeEvents() {
  // Real-time Brand input
  bindRealtimeInput('brand-name', (val) => { settings.brand.name = val; });
  bindRealtimeInput('brand-description', (val) => { settings.brand.description = val; });
  bindRealtimeInput('brand-website', (val) => { settings.brand.website = val; });

  // Profile & Logo
  bindRealtimeInput('profile-avatar-path', (val) => {
    settings.profile.avatar = val.trim();
    updateImagePreviewElements();
  });
  bindRealtimeInput('logo-url-path', (val) => {
    settings.logo.url = val.trim();
    updateImagePreviewElements();
  });
  bindRealtimeInput('profile-badge', (val) => { settings.profile.badge = val; });
  bindRealtimeCheckbox('profile-verified', (val) => { settings.profile.verified = val; });
  bindRealtimeInput('logo-badge-text', (val) => { settings.logo.badgeText = val; });

  // Avatar Upload
  const avatarUploadInput = document.getElementById('avatar-file-input');
  if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const compressed = await compressImage(file, 500, 500, 0.9);
          settings.profile.avatar = compressed;
          updateImagePreviewElements();
          updateLivePreview();
          showToast('تم رفع صورة الملف الشخصي بنجاح!', 'success');
        } catch (err) {
          console.error('Avatar upload error:', err);
          showToast('حدث خطأ أثناء رفع الصورة: ' + (err.message || 'فشل المعالجة'), 'error');
        } finally {
          e.target.value = '';
        }
      }
    });
  }

  const removeAvatarBtn = document.getElementById('btn-remove-avatar');
  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener('click', () => {
      settings.profile.avatar = './logo.svg';
      updateImagePreviewElements();
      updateLivePreview();
      showToast('تمت استعادة صورة اللوجو الافتراضية SVG', 'info');
    });
  }

  // Logo Upload
  const logoUploadInput = document.getElementById('logo-file-input');
  if (logoUploadInput) {
    logoUploadInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const compressed = await compressImage(file, 400, 400, 0.9);
          settings.logo.url = compressed;
          updateImagePreviewElements();
          updateLivePreview();
          showToast('تم رفع شعار العلامة التجارية بنجاح!', 'success');
        } catch (err) {
          console.error('Logo upload error:', err);
          showToast('حدث خطأ أثناء رفع الشعار: ' + (err.message || 'فشل المعالجة'), 'error');
        } finally {
          e.target.value = '';
        }
      }
    });
  }

  const removeLogoBtn = document.getElementById('btn-remove-logo');
  if (removeLogoBtn) {
    removeLogoBtn.addEventListener('click', () => {
      settings.logo.url = '';
      updateImagePreviewElements();
      updateLivePreview();
      showToast('تم إزالة الشعار الفرعي', 'info');
    });
  }

  // Theme Select
  bindRealtimeSelect('theme-mode', (val) => {
    settings.theme.mode = val;
  });

  bindRealtimeSelect('theme-preset', (val) => {
    settings.theme.preset = val;
    // Set matching preset colors if preset chosen
    if (val === 'clean-minimalism') {
      settings.theme.mode = 'light';
      settings.colors.background = '#f8fafc';
      settings.colors.primary = '#4f46e5';
      settings.colors.secondary = '#6366f1';
      settings.colors.text = '#0f172a';
      settings.colors.buttonBg = '#ffffff';
    } else if (val === 'dark-luxury') {
      settings.colors.background = '#0f172a';
      settings.colors.primary = '#6366f1';
      settings.colors.secondary = '#8b5cf6';
      settings.colors.text = '#f8fafc';
    } else if (val === 'clean-paper') {
      settings.colors.background = '#fafafa';
      settings.colors.primary = '#18181b';
      settings.colors.text = '#18181b';
      settings.colors.buttonBg = '#ffffff';
    } else if (val === 'ocean-breeze') {
      settings.colors.background = '#0f172a';
      settings.colors.primary = '#0284c7';
      settings.colors.text = '#f8fafc';
    } else if (val === 'sunset-glow') {
      settings.colors.background = '#18181b';
      settings.colors.primary = '#f43f5e';
      settings.colors.text = '#f9fafb';
    }
    populateFormFields();
  });

  // Color Pickers
  bindRealtimeInput('color-primary', (val) => { settings.colors.primary = val; });
  bindRealtimeInput('color-secondary', (val) => { settings.colors.secondary = val; });
  bindRealtimeInput('color-bg', (val) => { settings.colors.background = val; settings.theme.preset = 'custom'; });
  bindRealtimeInput('color-text', (val) => { settings.colors.text = val; });
  bindRealtimeInput('color-btn-bg', (val) => { settings.colors.buttonBg = val; });

  // Typography
  bindRealtimeSelect('typography-font', (val) => { settings.typography.fontFamily = val; });
  bindRealtimeSelect('typography-size', (val) => { settings.typography.fontSize = val; });
  bindRealtimeCheckbox('typography-rtl', (val) => { settings.typography.rtl = val; });

  // SEO Inputs
  bindRealtimeInput('seo-title', (val) => { if (!settings.seo) settings.seo = {}; settings.seo.metaTitle = val; });
  bindRealtimeInput('seo-description', (val) => { if (!settings.seo) settings.seo = {}; settings.seo.metaDescription = val; });
  bindRealtimeInput('seo-keywords', (val) => { if (!settings.seo) settings.seo = {}; settings.seo.keywords = val; });

  // Security Credentials Inputs
  bindRealtimeInput('auth-username', (val) => {
    if (!settings.auth) settings.auth = {};
    settings.auth.username = val || 'admin';
  });
  bindRealtimeInput('auth-password', (val) => {
    if (!settings.auth) settings.auth = {};
    settings.auth.password = val || 'admin123';
  });
}

/**
 * Handle Editor Authentication & Login Lock Screen Overlay
 */
function setupEditorAuth() {
  const loginOverlay = document.getElementById('login-modal-overlay');
  const loginForm = document.getElementById('editor-login-form');
  const errorAlert = document.getElementById('login-error-alert');
  const logoutBtn = document.getElementById('btn-logout-editor');

  if (!loginOverlay || !loginForm) return;

  // Check current auth status
  if (isEditorAuthenticated()) {
    loginOverlay.classList.add('hidden');
    loginOverlay.style.display = 'none';
  } else {
    loginOverlay.classList.remove('hidden');
    loginOverlay.style.display = 'flex';
  }

  // Handle Login submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('login-username-input');
    const passwordInput = document.getElementById('login-password-input');

    const username = usernameInput ? usernameInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    if (verifyCredentials(username, password)) {
      loginEditorSession();
      loginOverlay.classList.add('hidden');
      loginOverlay.style.display = 'none';
      if (errorAlert) errorAlert.style.display = 'none';
      showToast('تم تسجيل الدخول بنجاح! مرحباً بك في لوحة التعديل', 'success');
    } else {
      if (errorAlert) {
        errorAlert.textContent = 'اسم المستخدم أو كلمة السر غير صحيحة!';
        errorAlert.style.display = 'block';
      }
      showToast('خطأ في اسم المستخدم أو كلمة السر', 'error');
    }
  });

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutEditorSession();
      loginOverlay.classList.remove('hidden');
      loginOverlay.style.display = 'flex';
      const usernameInput = document.getElementById('login-username-input');
      const passwordInput = document.getElementById('login-password-input');
      if (usernameInput) usernameInput.value = '';
      if (passwordInput) passwordInput.value = '';
      if (errorAlert) errorAlert.style.display = 'none';
      showToast('تم تسجيل الخروج من صفحة التعديل', 'info');
    });
  }
}

function bindRealtimeInput(id, callback) {
  const el = document.getElementById(id);
  if (el) {
    const handler = (e) => {
      callback(e.target.value);
      updateLivePreview();
    };
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  }
}

function bindRealtimeSelect(id, callback) {
  const el = document.getElementById(id);
  if (el) {
    const handler = (e) => {
      callback(e.target.value);
      updateLivePreview();
    };
    el.addEventListener('change', handler);
    el.addEventListener('input', handler);
  }
}

function bindRealtimeCheckbox(id, callback) {
  const el = document.getElementById(id);
  if (el) {
    const handler = (e) => {
      callback(e.target.checked);
      updateLivePreview();
    };
    el.addEventListener('change', handler);
  }
}

/**
 * Render editable links list with drag & drop reordering, platform dropdown, inputs, toggles
 */
function renderEditableLinksList() {
  const listContainer = document.getElementById('editable-links-list');
  if (!listContainer) return;

  if (settings.links.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state" style="padding: 24px;">
        <p>No links added yet. Click "Add New Link" below!</p>
      </div>
    `;
    return;
  }

  const platformsOptions = Object.keys(SOCIAL_PLATFORMS).map(plat => `<option value="${plat}">${plat}</option>`).join('');

  listContainer.innerHTML = settings.links.map((link, index) => {
    return `
      <div class="editable-link-card animate-fade-in" data-id="${link.id}" data-index="${index}" draggable="true">
        <div class="link-card-top">
          <span class="drag-handle" title="Drag to reorder">${UI_ICONS.grip}</span>
          
          <select class="form-select link-platform-select" data-action="platform" data-id="${link.id}">
            ${Object.keys(SOCIAL_PLATFORMS).map(p => `<option value="${p}" ${p === link.platform ? 'selected' : ''}>${p}</option>`).join('')}
          </select>

          <div class="link-actions-group">
            <label class="toggle-switch" title="Enable or Disable Link">
              <input type="checkbox" data-action="toggle-enable" data-id="${link.id}" ${link.enabled ? 'checked' : ''} />
              <span class="toggle-slider"></span>
            </label>
            
            <button class="btn btn-secondary btn-sm btn-icon" data-action="duplicate" data-id="${link.id}" title="Duplicate link">
              ${UI_ICONS.duplicate}
            </button>
            
            <button class="btn btn-danger btn-sm btn-icon" data-action="delete" data-id="${link.id}" title="Delete link">
              ${UI_ICONS.trash}
            </button>
          </div>
        </div>

        <div class="link-inputs-grid">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Title / Label</label>
            <input type="text" class="form-input" data-action="label" data-id="${link.id}" value="${escapeHtml(link.label)}" placeholder="Link Title" />
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">URL / Endpoint</label>
            <input type="text" class="form-input" data-action="url" data-id="${link.id}" value="${escapeHtml(link.url)}" placeholder="https://" />
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; margin-top: 4px;">
          <div class="form-group" style="margin-bottom:0; flex:1;">
            <input type="text" class="form-input" data-action="badge" data-id="${link.id}" value="${escapeHtml(link.badge || '')}" placeholder="Badge tag (e.g. NEW, 50% OFF)" style="font-size:0.8rem; padding: 6px 10px;" />
          </div>
          
          <label style="display:flex; align-items:center; gap:6px; font-size:0.8rem; cursor:pointer; color: var(--color-text-secondary);">
            <input type="checkbox" data-action="featured" data-id="${link.id}" ${link.featured ? 'checked' : ''} />
            Highlight Card
          </label>
        </div>
      </div>
    `;
  }).join('');

  // Attach event handlers for link item controls
  bindLinkItemEvents(listContainer);

  // Attach Drag and Drop handlers
  bindDragAndDrop(listContainer);
}

function bindLinkItemEvents(listContainer) {
  listContainer.querySelectorAll('[data-action]').forEach(element => {
    const action = element.getAttribute('data-action');
    const id = element.getAttribute('data-id');

    if (action === 'platform') {
      element.addEventListener('change', (e) => {
        const platformName = e.target.value;
        const link = settings.links.find(l => l.id === id);
        if (link) {
          link.platform = platformName;
          const config = SOCIAL_PLATFORMS[platformName];
          if (config) {
            link.label = config.defaultLabel;
            link.url = config.placeholder;
          }
          renderEditableLinksList();
          updateLivePreview();
        }
      });
    } else if (action === 'label') {
      element.addEventListener('input', (e) => {
        const link = settings.links.find(l => l.id === id);
        if (link) {
          link.label = e.target.value;
          updateLivePreview();
        }
      });
    } else if (action === 'url') {
      element.addEventListener('input', (e) => {
        const link = settings.links.find(l => l.id === id);
        if (link) {
          link.url = e.target.value;
          updateLivePreview();
        }
      });
    } else if (action === 'badge') {
      element.addEventListener('input', (e) => {
        const link = settings.links.find(l => l.id === id);
        if (link) {
          link.badge = e.target.value;
          updateLivePreview();
        }
      });
    } else if (action === 'toggle-enable') {
      element.addEventListener('change', (e) => {
        const link = settings.links.find(l => l.id === id);
        if (link) {
          link.enabled = e.target.checked;
          updateLivePreview();
        }
      });
    } else if (action === 'featured') {
      element.addEventListener('change', (e) => {
        const link = settings.links.find(l => l.id === id);
        if (link) {
          link.featured = e.target.checked;
          updateLivePreview();
        }
      });
    } else if (action === 'delete') {
      element.addEventListener('click', () => {
        settings.links = settings.links.filter(l => l.id !== id);
        renderEditableLinksList();
        updateLivePreview();
        showToast('Link removed', 'info');
      });
    } else if (action === 'duplicate') {
      element.addEventListener('click', () => {
        const link = settings.links.find(l => l.id === id);
        if (link) {
          const dup = {
            ...link,
            id: 'l_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
            label: link.label + ' (Copy)'
          };
          settings.links.push(dup);
          renderEditableLinksList();
          updateLivePreview();
          showToast('Link duplicated', 'success');
        }
      });
    }
  });
}

function addNewLink() {
  const newId = 'l_' + Date.now();
  const defaultPlat = 'Custom Link';
  const config = SOCIAL_PLATFORMS[defaultPlat];

  settings.links.push({
    id: newId,
    platform: defaultPlat,
    label: config.defaultLabel,
    url: config.placeholder,
    enabled: true,
    featured: false,
    badge: ''
  });

  renderEditableLinksList();
  updateLivePreview();
  showToast('New link added!', 'success');
}

/**
 * Drag and drop reordering implementation
 */
function bindDragAndDrop(container) {
  let draggedCard = null;

  container.querySelectorAll('.editable-link-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCard = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      if (draggedCard) {
        draggedCard.classList.remove('dragging');
        draggedCard = null;
      }
      reorderLinksFromDOM(container);
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggedCard);
      } else {
        container.insertBefore(draggedCard, afterElement);
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.editable-link-card:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function reorderLinksFromDOM(container) {
  const newOrderedIds = [...container.querySelectorAll('.editable-link-card')].map(card => card.getAttribute('data-id'));
  
  const reordered = [];
  newOrderedIds.forEach(id => {
    const found = settings.links.find(l => l.id === id);
    if (found) reordered.push(found);
  });

  settings.links = reordered;
  updateLivePreview();
}

/**
 * Top Navbar & Action buttons (Save, Reset, Export, Import, Preview)
 */
function bindNavbarActions() {
  const saveBtn = document.getElementById('btn-save-settings');
  const saveBtnBottom = document.getElementById('btn-save-settings-bottom');
  const resetBtn = document.getElementById('btn-reset-settings');
  const exportBtn = document.getElementById('btn-export-settings');
  const importInput = document.getElementById('import-file-input');
  const previewBtn = document.getElementById('btn-view-public');

  const handleSave = () => {
    const saved = saveSettings(settings);
    if (saved) {
      showToast('تم حفظ جميع التعديلات بنجاح! 🎉', 'success');
      updateLivePreview();
    } else {
      showToast('حدث خطأ أثناء حفظ التعديلات', 'error');
    }
  };

  if (saveBtn) saveBtn.addEventListener('click', handleSave);
  if (saveBtnBottom) saveBtnBottom.addEventListener('click', handleSave);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showModal({
        title: 'Reset to Defaults?',
        content: '<p>Are you sure you want to reset all customizations and links back to the original default layout? Unsaved changes will be lost.</p>',
        confirmText: 'Reset Everything',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: () => {
          settings = resetSettings();
          populateFormFields();
          renderEditableLinksList();
          updateLivePreview();
          showToast('Settings reset to defaults', 'info');
        }
      });
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportSettings(settings);
      showToast('Settings configuration exported to JSON file', 'success');
    });
  }

  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = importSettings(event.target.result);
          if (res.success) {
            settings = res.settings;
            populateFormFields();
            renderEditableLinksList();
            updateLivePreview();
            showToast('Settings imported successfully!', 'success');
          } else {
            showToast('Import failed: ' + res.error, 'error');
          }
        };
        reader.readAsText(file);
      }
    });
  }

  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      saveSettings(settings);
      const newWin = window.open('index.html', '_blank');
      if (newWin) {
        try {
          newWin.name = 'linkpage_data:' + JSON.stringify(settings);
        } catch (e) {}
      }
    });
  }
}
