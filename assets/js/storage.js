/**
 * Link Page - Storage Module
 * Manages LocalStorage persistence, defaults, export, and import.
 */

const STORAGE_KEY = 'linkpage_settings_v8';

export const DEFAULT_SETTINGS = {
  brand: {
    name: 'Kady',
    description: 'متجر بيع مستحضرات تجميل واكسسوارات\nمتجر بيع بالتجزئة والجملة',
    website: ''
  },
  logo: {
    url: '', // No default logo
    badgeText: 'نشط'
  },
  profile: {
    avatar: '', // No default photo
    badge: 'نشط',
    verified: true
  },
  theme: {
    mode: 'light', // 'light', 'dark', 'custom', 'auto'
    preset: 'clean-minimalism',
    glassmorphism: true,
    glassBlur: '16px'
  },
  colors: {
    primary: '#4f46e5',
    secondary: '#6366f1',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    buttonBg: '#ffffff',
    buttonText: '#0f172a',
    buttonBorder: '#e2e8f0',
    buttonHover: '#f8fafc',
    accent: '#818cf8'
  },
  typography: {
    fontFamily: 'Cairo',
    fontSize: 'medium',
    fontWeight: '500',
    rtl: true
  },
  auth: {
    username: 'admin',
    password: 'admin123',
    enabled: true
  },
  links: [
    {
      id: 'l1',
      platform: 'WhatsApp',
      label: 'تواصل عبر واتساب',
      url: 'https://iwtsp.com/201005019951',
      enabled: true,
      featured: true,
      badge: 'مباشر'
    },
    {
      id: 'l2',
      platform: 'Facebook',
      label: 'صفحتنا على فيسبوك',
      url: 'https://www.facebook.com/share/1BU8LP7iX8/',
      enabled: true,
      featured: false,
      badge: ''
    },
    {
      id: 'l3',
      platform: 'TikTok',
      label: 'حسابنا على تيك توك',
      url: 'https://www.tiktok.com/@user5079433482615?_r=1&_t=ZS-98WAJ3ILOaO',
      enabled: true,
      featured: false,
      badge: ''
    },
    {
      id: 'l4',
      platform: 'Instagram',
      label: 'حسابنا على إنستغرام',
      url: 'https://www.instagram.com/kdy.kady?igsh=cmM1dHBvaXp1ZGpv',
      enabled: true,
      featured: false,
      badge: ''
    }
  ],
  seo: {
    metaTitle: 'Kady | متجر بيع مستحضرات تجميل واكسسوارات',
    metaDescription: 'متجر بيع مستحضرات تجميل واكسسوارات - متجر بيع بالتجزئة والجملة',
    keywords: 'Kady, مستحضرات تجميل, اكسسوارات, بيع بالتجزئة, بيع بالجملة, كادي'
  }
};

let inMemorySettings = null;

function mergeWithDefaults(parsed) {
  if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS };
  return {
    ...DEFAULT_SETTINGS,
    ...parsed,
    brand: { ...DEFAULT_SETTINGS.brand, ...(parsed.brand || {}) },
    logo: { ...DEFAULT_SETTINGS.logo, ...(parsed.logo || {}) },
    profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) },
    theme: { ...DEFAULT_SETTINGS.theme, ...(parsed.theme || {}) },
    colors: { ...DEFAULT_SETTINGS.colors, ...(parsed.colors || {}) },
    typography: { ...DEFAULT_SETTINGS.typography, ...(parsed.typography || {}) },
    seo: { ...DEFAULT_SETTINGS.seo, ...(parsed.seo || {}) },
    auth: { ...DEFAULT_SETTINGS.auth, ...(parsed.auth || {}) },
    links: Array.isArray(parsed.links) ? parsed.links : DEFAULT_SETTINGS.links
  };
}

/**
 * Load settings from LocalStorage, SessionStorage, or window.name fallback
 * Merges missing properties with defaults to safeguard against broken state.
 */
export function loadSettings() {
  let loadedRaw = null;

  // 1. Try LocalStorage
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) loadedRaw = data;
  } catch (e) {
    console.warn('LocalStorage read restricted:', e);
  }

  // 2. Try SessionStorage if LocalStorage was empty
  if (!loadedRaw) {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      if (data) loadedRaw = data;
    } catch (e) {
      console.warn('SessionStorage read restricted:', e);
    }
  }

  // 3. Try window.name fallback (works across navigations in same tab on file:// protocol)
  if (!loadedRaw) {
    try {
      if (window.name && window.name.startsWith('linkpage_data:')) {
        loadedRaw = window.name.substring('linkpage_data:'.length);
      }
    } catch (e) {
      console.warn('window.name read restricted:', e);
    }
  }

  if (loadedRaw) {
    try {
      const parsed = JSON.parse(loadedRaw);
      const merged = mergeWithDefaults(parsed);
      inMemorySettings = merged;
      return merged;
    } catch (e) {
      console.error('Error parsing stored settings:', e);
    }
  }

  return inMemorySettings ? { ...inMemorySettings } : { ...DEFAULT_SETTINGS };
}

/**
 * Save settings to LocalStorage, SessionStorage, and window.name
 */
export function saveSettings(settings) {
  inMemorySettings = { ...settings };
  const jsonStr = JSON.stringify(settings);

  // Save to LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY, jsonStr);
  } catch (e) {
    console.warn('LocalStorage save restricted:', e);
  }

  // Save to SessionStorage
  try {
    sessionStorage.setItem(STORAGE_KEY, jsonStr);
  } catch (e) {
    console.warn('SessionStorage save restricted:', e);
  }

  // Save to window.name
  try {
    window.name = 'linkpage_data:' + jsonStr;
  } catch (e) {
    console.warn('window.name save restricted:', e);
  }

  try {
    window.dispatchEvent(new CustomEvent('linkpage:settingsUpdated', { detail: settings }));
  } catch (e) {}

  return true;
}

/**
 * Reset settings back to default
 */
export function resetSettings() {
  inMemorySettings = { ...DEFAULT_SETTINGS };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  try {
    if (window.name && window.name.startsWith('linkpage_data:')) {
      window.name = '';
    }
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('linkpage:settingsUpdated', { detail: DEFAULT_SETTINGS }));
  return DEFAULT_SETTINGS;
}

/**
 * Export settings as JSON download
 */
export function exportSettings(settings) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `linkpage-config-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import settings from JSON string
 */
export function importSettings(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure');
    }
    const merged = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      brand: { ...DEFAULT_SETTINGS.brand, ...(parsed.brand || {}) },
      logo: { ...DEFAULT_SETTINGS.logo, ...(parsed.logo || {}) },
      profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) },
      theme: { ...DEFAULT_SETTINGS.theme, ...(parsed.theme || {}) },
      colors: { ...DEFAULT_SETTINGS.colors, ...(parsed.colors || {}) },
      typography: { ...DEFAULT_SETTINGS.typography, ...(parsed.typography || {}) },
      seo: { ...DEFAULT_SETTINGS.seo, ...(parsed.seo || {}) },
      links: Array.isArray(parsed.links) ? parsed.links : DEFAULT_SETTINGS.links
    };
    saveSettings(merged);
    return { success: true, settings: merged };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

let memoryAuthSession = false;

const AUTH_SESSION_KEY = 'linkpage_editor_auth_session';

/**
 * Check if the current browser session is authenticated
 */
export function isEditorAuthenticated() {
  try {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true' || memoryAuthSession;
  } catch (e) {
    return memoryAuthSession;
  }
}

/**
 * Validate credentials against saved settings
 */
export function verifyCredentials(inputUsername, inputPassword) {
  const settings = loadSettings();
  const validUsername = (settings.auth?.username || DEFAULT_SETTINGS.auth.username).trim();
  const validPassword = (settings.auth?.password || DEFAULT_SETTINGS.auth.password).trim();
  
  return (inputUsername || '').trim() === validUsername && (inputPassword || '').trim() === validPassword;
}

/**
 * Authenticate session
 */
export function loginEditorSession() {
  memoryAuthSession = true;
  try {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
  } catch (e) {
    console.warn('sessionStorage restricted:', e);
  }
}

/**
 * Clear authenticated session
 */
export function logoutEditorSession() {
  memoryAuthSession = false;
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {
    console.warn('sessionStorage restricted:', e);
  }
}

