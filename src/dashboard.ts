import './style.css'

// Authentication Guard
function checkAuth() {
  const token = localStorage.getItem('ar_auth_token');
  if (!token) {
    // Redirect to login if no token
    window.location.href = '/index.html';
    return false;
  }
  return true;
}

function initDashboard() {
  // Remove overlay and fade in app
  const overlay = document.getElementById('auth-overlay');
  const app = document.getElementById('app-content');

  if (overlay) overlay.style.display = 'none';
  if (app) app.style.opacity = '1';

  // Logout Logic
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ar_auth_token');
      window.location.href = '/index.html';
    });
  }

  // Populate Mock Logs
  const logContainer = document.getElementById('log-container');
  if (logContainer) {
    const mockLogs = [
      {
        platform: 'Discord',
        color: 'text-discord',
        user: 'GamerX#1234',
        message: 'Gramy dzisiaj mixa?',
        rule: 'AFK Rule',
        reply: 'Zarządca jest obecnie offline. Zostaw wiadomość.',
        time: '12:43'
      },
      {
        platform: 'Steam',
        color: 'text-steamLight',
        user: 'PashaBiceps',
        message: 'Siemano, masz te skiny do tradu?',
        rule: 'Trade Info',
        reply: 'Automatyczna informacja: Skiny wystawione na markecie.',
        time: '11:15'
      },
      {
        platform: 'Messenger',
        color: 'text-messenger',
        user: 'Jan Kowalski',
        message: 'O której to spotkanie?',
        rule: '[Brak - Ignorowane]',
        reply: null, // No auto reply triggered
        time: '09:30'
      }
    ];

    mockLogs.forEach(log => {
      const html = `
        <div class="p-6 hover:bg-white/2 transition-colors flex items-start gap-4 group">
          <div class="w-10 h-10 rounded-full border border-white/10 bg-black/50 flex items-center justify-center shrink-0">
            <span class="text-xs font-bold ${log.color}">${log.platform[0]}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1">
              <p class="text-sm font-medium text-white">${log.user} <span class="text-xs text-zinc-500 font-mono ml-2">via ${log.platform}</span></p>
              <span class="text-xs text-zinc-500 font-mono">${log.time}</span>
            </div>
            <p class="text-sm text-zinc-400 mb-2 truncate">"${log.message}"</p>
            
            ${log.reply ? `
              <div class="bg-primary/5 border border-primary/10 rounded p-3 mt-2 relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span class="text-xs font-mono text-primary uppercase">Auto-Odpowiedź (${log.rule})</span>
                </div>
                <p class="text-sm text-zinc-300">"${log.reply}"</p>
              </div>
            ` : `
              <div class="bg-zinc-800/50 border border-white/5 rounded p-2 mt-2 inline-flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-zinc-500"></span>
                <span class="text-xs font-mono text-zinc-500 uppercase">Zignorowano (Brak reguły)</span>
              </div>
            `}
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="text-xs bg-white text-black px-3 py-1.5 rounded font-medium hover:bg-primary transition-colors">
              Przejmij Czat
            </button>
          </div>
        </div>
      `;
      logContainer.insertAdjacentHTML('beforeend', html);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    // Only init if auth passed (we add a small timeout to simulate verification)
    setTimeout(initDashboard, 500);
  }
});
