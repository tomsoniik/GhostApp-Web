import { setLanguage, getCurrentLanguage } from '../i18n';

export class GhostLangSwitcher extends HTMLElement {
  private isOpen = false;
  private boundCloseHandler: (e: MouseEvent) => void;

  constructor() {
    super();
    this.boundCloseHandler = (e: MouseEvent) => {
      if (!this.contains(e.target as Node)) {
        this.close();
      }
    };
  }

  connectedCallback() {
    this.render();
    window.addEventListener('language-changed', () => this.updateUI());
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.boundCloseHandler);
  }

  render() {
    const currentLang = getCurrentLanguage();
    const flagCode = currentLang === 'en' ? 'gb' : currentLang;

    this.innerHTML = `
      <div class="relative" style="z-index: 100;">
        <button id="lang-toggle-btn" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
          <span id="current-lang-flag" class="fi fi-${flagCode} rounded-sm" style="width:20px;height:15px;display:inline-block;"></span>
          <svg class="w-4 h-4 text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div id="lang-dropdown" class="absolute right-0 mt-1 w-36 rounded-xl shadow-2xl border border-white/10 transition-all duration-200 opacity-0 translate-y-1 pointer-events-none" style="background:#0a0a0a; z-index:101;">
          <div class="p-2 space-y-1">
            <button class="lang-option w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${currentLang === 'pl' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:text-white hover:bg-white/10'}" data-lang="pl">
              <span class="fi fi-pl rounded-sm" style="width:20px;height:15px;display:inline-block;"></span> Polski
            </button>
            <button class="lang-option w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${currentLang === 'en' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:text-white hover:bg-white/10'}" data-lang="en">
              <span class="fi fi-gb rounded-sm" style="width:20px;height:15px;display:inline-block;"></span> English
            </button>
            <button class="lang-option w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${currentLang === 'ru' ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:text-white hover:bg-white/10'}" data-lang="ru">
              <span class="fi fi-ru rounded-sm" style="width:20px;height:15px;display:inline-block;"></span> Русский
            </button>
          </div>
        </div>
      </div>
    `;

    this.setupListeners();
  }

  setupListeners() {
    const toggleBtn = this.querySelector('#lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isOpen ? this.close() : this.open();
      });
    }

    const options = this.querySelectorAll('.lang-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement;
        const newLang = target.getAttribute('data-lang');
        if (newLang) {
          setLanguage(newLang);
          this.close();
        }
      });
    });
  }

  open() {
    this.isOpen = true;
    const dropdown = this.querySelector('#lang-dropdown') as HTMLElement;
    if (dropdown) {
      dropdown.classList.remove('opacity-0', 'translate-y-1', 'pointer-events-none');
      dropdown.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
    // Close on outside click
    setTimeout(() => document.addEventListener('click', this.boundCloseHandler), 0);
  }

  close() {
    this.isOpen = false;
    const dropdown = this.querySelector('#lang-dropdown') as HTMLElement;
    if (dropdown) {
      dropdown.classList.add('opacity-0', 'translate-y-1', 'pointer-events-none');
      dropdown.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
    document.removeEventListener('click', this.boundCloseHandler);
  }

  updateUI() {
    const lang = getCurrentLanguage();
    const flagSpan = this.querySelector('#current-lang-flag');
    if (flagSpan) {
      const code = lang === 'en' ? 'gb' : lang;
      flagSpan.className = `fi fi-${code} rounded-sm`;
      (flagSpan as HTMLElement).style.cssText = 'width:20px;height:15px;display:inline-block;';
    }

    const options = this.querySelectorAll('.lang-option');
    options.forEach(opt => {
      const optLang = opt.getAttribute('data-lang');
      if (optLang === lang) {
        opt.className = 'lang-option w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer bg-primary/20 text-primary';
      } else {
        opt.className = 'lang-option w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-zinc-400 hover:text-white hover:bg-white/10';
      }
    });
  }
}

customElements.define('ghost-lang-switcher', GhostLangSwitcher);
