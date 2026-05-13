import { t } from '../i18n';

export class GhostSidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
    window.addEventListener('language-changed', () => this.render());
  }

  render() {
    this.innerHTML = `
      <aside class="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col relative z-20">
        <div class="p-6">
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
        </div>

        <nav class="flex-1 px-4 space-y-2">
          <button data-page="events"
            class="sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
            <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            ${t('dash.sidebar.events')}
          </button>
          <button data-page="rules"
            class="sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            ${t('dash.sidebar.rules')}
          </button>
          <button data-page="config"
            class="sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            ${t('dash.sidebar.nodes')}
          </button>
        </nav>

        <div class="p-4 border-t border-white/5 space-y-3">
          <button id="home-btn"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium cursor-pointer group">
            <svg class="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            ${t('dash.sidebar.home')}
          </button>
          <button id="logout-btn"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 text-sm font-medium cursor-pointer group">
            <svg class="w-4 h-4 text-red-500/50 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            ${t('dash.sidebar.logout')}
          </button>
        </div>
      </aside>
    `;

    this.setupListeners();
  }

  activatePage(page: string) {
    const buttons = this.querySelectorAll('.sidebar-btn');
    buttons.forEach(b => {
      b.classList.remove('bg-white/5', 'text-white', 'border', 'border-white/10');
      b.classList.add('text-zinc-400', 'hover:text-white', 'hover:bg-white/5');
      const icon = b.querySelector('svg');
      if (icon) icon.classList.remove('text-primary');
    });

    const target = this.querySelector(`.sidebar-btn[data-page="${page}"]`);
    if (target) {
      target.classList.add('bg-white/5', 'text-white', 'border', 'border-white/10');
      target.classList.remove('text-zinc-400', 'hover:text-white', 'hover:bg-white/5');
      const activeIcon = target.querySelector('svg');
      if (activeIcon) activeIcon.classList.add('text-primary');
    }

    location.hash = page;
    window.dispatchEvent(new CustomEvent('sidebar-navigate', { detail: { page } }));
  }

  setupListeners() {
    // Sidebar navigation
    const buttons = this.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        if (page) {
          this.activatePage(page);
        }
      });
    });

    // Restore tab from URL hash on load
    const hash = location.hash.replace('#', '');
    const validPages = ['events', 'config', 'rules'];
    const initialPage = validPages.includes(hash) ? hash : 'events';
    // Use setTimeout to ensure the main.ts listener is registered first
    setTimeout(() => this.activatePage(initialPage), 0);

    // Home (back to landing)
    const homeBtn = this.querySelector('#home-btn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('ghost-go-home'));
      });
    }

    // Logout
    const logoutBtn = this.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('ghost-logout'));
      });
    }
  }
}

customElements.define('ghost-sidebar', GhostSidebar);
