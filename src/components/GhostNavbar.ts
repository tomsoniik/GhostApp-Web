import { setLanguage, getCurrentLanguage, t } from '../i18n';

export class GhostNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupListeners();
    
    window.addEventListener('language-changed', (e: Event) => {
      const customEvent = e as CustomEvent;
      this.updateActiveLanguageUI(customEvent.detail.lang);
      this.updateAuthButton();
    });

    // Listen for auth state changes (login/logout) to swap button
    window.addEventListener('auth-state-changed', () => {
      this.updateAuthButton();
    });
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('ar_auth_token');
  }

  render() {
    const loggedIn = this.isLoggedIn();

    this.innerHTML = `
      <nav class="fixed top-0 left-0 right-0 px-6 py-4 flex justify-between items-center z-50 bg-background/50 backdrop-blur-md border-b border-white/5">
      <div class="font-display text-2xl font-bold tracking-tighter text-white flex items-center gap-3">
        <div class="relative w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(204,255,0,0.1)]">
          <svg width="24" height="24" class="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"></path>
            <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"></circle>
            <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"></circle>
          </svg>
        </div>
        <span>Ghost<span class="text-primary font-normal">App</span></span>
      </div>
      <div class="flex items-center gap-6">
        <a href="#cechy" data-i18n="nav.architecture" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block">${t('nav.architecture')}</a>
        <a href="#faq" data-i18n="nav.faq" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block">${t('nav.faq')}</a>

        ${loggedIn ? `
        <button id="nav-dashboard-btn" class="px-4 py-2 bg-primary text-black font-semibold rounded-lg text-sm hover:bg-white transition-colors flex items-center gap-2 cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span>${t('nav.dashboard')}</span>
        </button>
        ` : `
        <button id="nav-login-btn" class="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer">
          <span data-i18n="nav.login">${t('nav.login')}</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7-7m7-7H3" /></svg>
        </button>
        `}

        <div class="w-px h-6 bg-white/10 ml-2 mr-0 hidden md:block"></div>

        <!-- Language Switcher -->
        <div class="relative group cursor-pointer hidden md:block">
          <button class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium focus:outline-none">
            <span id="current-lang-flag" class="fi fi-pl rounded-sm w-5 h-4 opacity-80 group-hover:opacity-100 transition-opacity"></span>
            <svg class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div class="absolute right-0 top-full mt-4 w-32 bg-background/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            <div class="py-1">
              <a href="#" data-lang="en" class="lang-option flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                <span class="fi fi-gb rounded-sm w-5 h-4"></span> EN
              </a>
              <a href="#" data-lang="ru" class="lang-option flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                <span class="fi fi-ru rounded-sm w-5 h-4"></span> RU
              </a>
              <a href="#" data-lang="pl" class="lang-option flex items-center gap-3 px-4 py-2.5 text-sm text-white bg-primary/10 transition-colors">
                <span class="fi fi-pl rounded-sm w-5 h-4"></span> PL
              </a>
            </div>
          </div>
        </div>

      </div>
    </nav>
    `;
  }

  setupListeners() {
    // Login button (when NOT logged in)
    const loginBtn = this.querySelector('#nav-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-login-modal'));
      });
    }

    // Dashboard button (when logged in)
    const dashBtn = this.querySelector('#nav-dashboard-btn');
    if (dashBtn) {
      dashBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('ghost-go-dashboard'));
      });
    }

    const langOptions = this.querySelectorAll('.lang-option');
    langOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = (opt as HTMLElement).dataset.lang;
        if (lang) {
          setLanguage(lang);
        }
      });
    });

    this.updateActiveLanguageUI(getCurrentLanguage());
  }

  updateAuthButton() {
    const loggedIn = this.isLoggedIn();
    const loginBtn = this.querySelector('#nav-login-btn');
    const dashBtn = this.querySelector('#nav-dashboard-btn');
    
    // If state changed, re-render to swap buttons
    if ((loggedIn && loginBtn) || (!loggedIn && dashBtn)) {
      this.render();
      this.setupListeners();
    }

    // Update text for current language
    if (dashBtn) {
      const span = dashBtn.querySelector('span');
      if (span) span.textContent = t('nav.dashboard');
    }
  }

  updateActiveLanguageUI(lang: string) {
    const flagSpan = this.querySelector('#current-lang-flag');
    if (flagSpan) {
      flagSpan.className = `fi fi-${lang === 'en' ? 'gb' : lang} rounded-sm w-5 h-4 opacity-80 group-hover:opacity-100 transition-opacity`;
    }

    const options = this.querySelectorAll('.lang-option');
    options.forEach(opt => {
      const isSelected = (opt as HTMLElement).dataset.lang === lang;
      if (isSelected) {
        opt.className = 'lang-option flex items-center gap-3 px-4 py-2.5 text-sm text-white bg-primary/10 transition-colors';
      } else {
        opt.className = 'lang-option flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors';
      }
    });
  }
}

customElements.define('ghost-navbar', GhostNavbar);
