import './style.css'
import './components/GhostNavbar';
import './components/GhostSidebar';
import './components/GhostLangSwitcher';
import { initI18n, t } from './i18n';

function setupBackground() {
  // Mouse Glow Tracking
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    document.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        mouseGlow.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(204, 255, 0, 0.08), transparent 40%)`;
      });
    });
  }

  // Particle Canvas System
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
  const particleCount = Math.floor((width * height) / 15000);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5
    });
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(204, 255, 0, ${0.15 - dist / 120 * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  
  draw();
}

function setupAuth() {
  const form = document.getElementById('auth-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const btnText = document.getElementById('btn-text');
  const toggleBtn = document.getElementById('toggle-mode-btn');
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  
  // Modal Elements
  const authModal = document.getElementById('auth-modal');
  const modalBox = document.getElementById('terminal-auth');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const heroRegisterBtn = document.getElementById('hero-register-btn');

  // Captcha & Verification Elements
  const captchaContainer = document.getElementById('captcha-container');
  const mockCaptcha = document.getElementById('mock-captcha');
  const captchaCheck = document.getElementById('captcha-check');
  const captchaSpinner = document.getElementById('captcha-spinner');
  const captchaError = document.getElementById('captcha-error');
  const verificationContainer = document.getElementById('verification-container');
  const codeInput = document.getElementById('code-input') as HTMLInputElement;

  // Username & Password elements
  const usernameContainer = document.getElementById('username-container');
  const usernameInput = document.getElementById('username-input') as HTMLInputElement;
  const emailInput = document.getElementById('email-input') as HTMLInputElement;
  const passInput = document.getElementById('pass-input') as HTMLInputElement;
  const passStrengthContainer = document.getElementById('pass-strength-container');

  // Password strength bar & requirement elements
  const strBars = [
    document.getElementById('str-bar-1'),
    document.getElementById('str-bar-2'),
    document.getElementById('str-bar-3'),
    document.getElementById('str-bar-4'),
  ];
  const reqLower = document.getElementById('req-lower');
  const reqUpper = document.getElementById('req-upper');
  const reqDigit = document.getElementById('req-digit');
  const reqSpecial = document.getElementById('req-special');

  let isLoginMode = true;
  let isCaptchaVerified = false;
  let registrationStep = 1; // 1: Username+Email+Pass+Captcha -> 2: Code Verification

  // Password validation logic
  function validatePassword(password: string): { lower: boolean; upper: boolean; digit: boolean; special: boolean; score: number } {
    const lower = /[a-z]/.test(password);
    const upper = /[A-Z]/.test(password);
    const digit = /[0-9]/.test(password);
    const special = /[^a-zA-Z0-9]/.test(password);
    const score = [lower, upper, digit, special].filter(Boolean).length;
    return { lower, upper, digit, special, score };
  }

  function updatePassStrengthUI(password: string) {
    const { lower, upper, digit, special, score } = validatePassword(password);
    
    const colorMap: Record<number, string> = { 0: 'bg-zinc-800', 1: 'bg-red-500', 2: 'bg-orange-500', 3: 'bg-yellow-400', 4: 'bg-primary' };
    const barColor = colorMap[score] || 'bg-zinc-800';
    
    strBars.forEach((bar, i) => {
      if (!bar) return;
      bar.className = `h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? barColor : 'bg-zinc-800'}`;
    });
    
    function setReq(el: HTMLElement | null, met: boolean) {
      if (!el) return;
      const dot = el.querySelector('span:first-child');
      if (met) {
        el.classList.remove('text-zinc-600');
        el.classList.add('text-primary');
        if (dot) { dot.classList.remove('bg-zinc-600'); dot.classList.add('bg-primary'); }
      } else {
        el.classList.remove('text-primary');
        el.classList.add('text-zinc-600');
        if (dot) { dot.classList.remove('bg-primary'); dot.classList.add('bg-zinc-600'); }
      }
    }
    
    setReq(reqLower, lower);
    setReq(reqUpper, upper);
    setReq(reqDigit, digit);
    setReq(reqSpecial, special);
  }

  // Live password strength listener
  if (passInput) {
    passInput.addEventListener('input', () => {
      if (!isLoginMode && registrationStep === 1) {
        updatePassStrengthUI(passInput.value);
      }
    });
  }

  function resetRegistrationState() {
    registrationStep = 1;
    isCaptchaVerified = false;
    if (captchaCheck) captchaCheck.classList.add('opacity-0');
    if (captchaError) captchaError.classList.add('hidden');
    if (mockCaptcha) mockCaptcha.classList.remove('pointer-events-none', 'opacity-80');
    if (codeInput) codeInput.value = '';
    if (usernameInput) usernameInput.value = '';
    if (usernameContainer) usernameContainer.classList.add('hidden');
    if (passStrengthContainer) passStrengthContainer.classList.add('hidden');
    if (emailInput) {
      emailInput.parentElement!.parentElement!.classList.remove('hidden');
    }
    if (passInput) {
      passInput.parentElement!.parentElement!.classList.remove('hidden');
    }
  }

  function openModal(mode: 'login' | 'register') {
    isLoginMode = mode === 'login';
    updateFormUI();
    
    // Update Document Title
    document.title = isLoginMode ? 'GhostApp | Login' : 'GhostApp | Register';
    
    if (authModal && modalBox) {
      authModal.classList.remove('opacity-0', 'pointer-events-none');
      modalBox.classList.remove('scale-95');
      modalBox.classList.add('scale-100');
    }
  }

  function closeModal() {
    if (authModal && modalBox) {
      authModal.classList.add('opacity-0', 'pointer-events-none');
      modalBox.classList.remove('scale-100');
      modalBox.classList.add('scale-95');
      
      // Update Document Title
      document.title = 'GhostApp | Home';
      
      // Reset after animation
      setTimeout(() => {
        isLoginMode = true;
        resetRegistrationState();
        updateFormUI();
      }, 300);
    }
  }

  function updateFormUI() {
    if (!formTitle || !formSubtitle || !btnText || !toggleBtn) return;
    
    if (isLoginMode) {
      formTitle.innerText = t('auth.login.title');
      formSubtitle.innerText = t('auth.login.sub');
      btnText.innerText = t('auth.login.btn');
      toggleBtn.innerText = t('auth.toggle.toReg');
      
      if (captchaContainer) captchaContainer.classList.add('hidden');
      if (verificationContainer) verificationContainer.classList.add('hidden');
      if (usernameContainer) usernameContainer.classList.add('hidden');
      if (passStrengthContainer) passStrengthContainer.classList.add('hidden');
      
      // Pokaz pola na wypadek powrotu z 2 kroku rejestracji
      if (emailInput) emailInput.parentElement!.parentElement!.classList.remove('hidden');
      if (passInput) passInput.parentElement!.parentElement!.classList.remove('hidden');
      if (emailInput) emailInput.required = true;
      if (passInput) passInput.required = true;
      if (codeInput) codeInput.required = false;
      if (usernameInput) usernameInput.required = false;

    } else {
      if (registrationStep === 1) {
        formTitle.innerText = t('auth.register.title');
        formSubtitle.innerText = t('auth.register.sub');
        btnText.innerText = t('auth.register.btn');
        if (captchaContainer) captchaContainer.classList.remove('hidden');
        if (verificationContainer) verificationContainer.classList.add('hidden');
        if (usernameContainer) usernameContainer.classList.remove('hidden');
        if (passStrengthContainer) passStrengthContainer.classList.remove('hidden');
        
        if (emailInput) emailInput.required = true;
        if (passInput) passInput.required = true;
        if (codeInput) codeInput.required = false;
        if (usernameInput) usernameInput.required = true;
        
        // Reset strength UI
        updatePassStrengthUI(passInput?.value || '');

      } else if (registrationStep === 2) {
        formTitle.innerText = t('auth.verify.title');
        formSubtitle.innerText = `${t('auth.verify.sub')} ${emailInput?.value}`;
        btnText.innerText = t('auth.verify.btn');
        
        if (captchaContainer) captchaContainer.classList.add('hidden');
        if (verificationContainer) verificationContainer.classList.remove('hidden');
        if (usernameContainer) usernameContainer.classList.add('hidden');
        if (passStrengthContainer) passStrengthContainer.classList.add('hidden');
        if (emailInput) emailInput.parentElement!.parentElement!.classList.add('hidden');
        if (passInput) passInput.parentElement!.parentElement!.classList.add('hidden');
        
        if (emailInput) emailInput.required = false;
        if (passInput) passInput.required = false;
        if (codeInput) codeInput.required = true;
        if (usernameInput) usernameInput.required = false;
      }
      
      toggleBtn.innerText = t('auth.toggle.toLog');
    }
  }

  // Mock Captcha Logic
  if (mockCaptcha && captchaSpinner && captchaCheck && captchaError) {
    mockCaptcha.addEventListener('click', () => {
      if (isCaptchaVerified) return;
      
      captchaError.classList.add('hidden');
      captchaSpinner.classList.remove('hidden');
      mockCaptcha.classList.add('pointer-events-none', 'opacity-80');
      
      setTimeout(() => {
        captchaSpinner.classList.add('hidden');
        captchaCheck.classList.remove('opacity-0');
        isCaptchaVerified = true;
      }, 1000);
    });
  }

  // Event Listeners for Modal
  window.addEventListener('open-login-modal', () => openModal('login'));
  if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', () => openModal('register'));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('language-changed', () => {
    if (authModal && !authModal.classList.contains('hidden')) {
      updateFormUI();
    }
  });
  
  const authBackdrop = document.getElementById('auth-backdrop');
  if (authBackdrop) {
    authBackdrop.addEventListener('click', (e) => {
      if (e.target === authBackdrop) {
        closeModal();
      }
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isLoginMode && registrationStep === 2) {
        // Jesli bylismy w 2 kroku, wyzeruj do logowania
        resetRegistrationState();
      }
      isLoginMode = !isLoginMode;
      updateFormUI();
    });
  }
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!isLoginMode && registrationStep === 1) {
        if (!isCaptchaVerified) {
          if (captchaError) captchaError.classList.remove('hidden');
          return;
        }
        
        // Validate password strength
        const { score } = validatePassword(passInput.value);
        if (score < 4) {
          // Highlight the password field
          passInput.classList.add('border-red-500/50');
          passInput.focus();
          setTimeout(() => passInput.classList.remove('border-red-500/50'), 2000);
          return;
        }
        
        // Validate username
        if (!usernameInput.value || usernameInput.value.length < 3) {
          usernameInput.classList.add('border-red-500/50');
          usernameInput.focus();
          setTimeout(() => usernameInput.classList.remove('border-red-500/50'), 2000);
          return;
        }
      }

      if (isLoginMode) {
        if (!emailInput.value || !passInput.value) return;
      } else if (registrationStep === 1) {
        if (!usernameInput.value || !emailInput.value || !passInput.value) return;
      } else if (registrationStep === 2) {
        if (!codeInput.value) return;
      }
      
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span class="animate-pulse flex justify-center w-full">${isLoginMode ? 'AUTORYZACJA...' : (registrationStep === 1 ? 'GENEROWANIE KODU...' : 'WERYFIKACJA...')}</span>`;
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

      try {
        const baseUrl = '/api/auth';
        let endpoint = baseUrl;
        let payload: any = {};

        if (isLoginMode) {
          endpoint += '/login.php';
          payload = { email: emailInput.value, password: passInput.value };
        } else if (registrationStep === 1) {
          endpoint += '/send_code.php';
          payload = { email: emailInput.value };
        } else if (registrationStep === 2) {
          endpoint += '/register.php';
          // Zgodnie z docelowym flow mozna podac email, haslo i wpisany kod, 
          // choc backend (register.php) nie weryfikuje teraz faktycznie kodu (ale przyjmuje zgloszenie rejestracji)
          payload = { username: usernameInput.value, email: emailInput.value, password: passInput.value, code: codeInput.value };
        }
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          if (!isLoginMode && registrationStep === 1) {
            // Sukces wyslania kodu
            submitBtn.innerHTML = `<span class="text-primary font-bold flex justify-center w-full">KOD WYSŁANY</span>`;
            console.log('DEV ONLY - Kod weryfikacyjny:', data.dev_code);
            
            setTimeout(() => {
              registrationStep = 2;
              updateFormUI();
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
              submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }, 1000);
            
          } else {
            // Sukces logowania lub faktycznej rejestracji w kroku 2
            submitBtn.innerHTML = `<span class="text-green-600 font-bold flex justify-center w-full">${isLoginMode ? 'ZALOGOWANO' : 'ZAREJESTROWANO'}</span>`;
            
            setTimeout(() => {
              if (isLoginMode && data.token) {
                localStorage.setItem('ar_auth_token', data.token);
                window.dispatchEvent(new CustomEvent('auth-state-changed'));
                // SPA Routing: instead of redirect, load dashboard inline
                closeModal();
                initDashboard();
              } else {
                // Po rejestracji (krok 2 ok), wracamy do logowania
                isLoginMode = true;
                resetRegistrationState();
                updateFormUI();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                passInput.value = '';
              }
            }, 1500);
          }
        } else {
          submitBtn.innerHTML = `<span class="text-red-500 font-bold font-mono text-xs flex justify-center w-full">${data?.message?.substring(0,30).toUpperCase() || 'BŁĄD'}...</span>`;
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          }, 2500);
        }
        
      } catch (error) {
        submitBtn.innerHTML = `<span class="text-red-500 font-bold flex justify-center w-full">Brak połączenia z API</span>`;
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }, 2000);
      }
    });
  }
}

function initDashboard() {
  const landingView = document.getElementById('landing-view');
  const dashboardView = document.getElementById('dashboard-view');
  const overlay = document.getElementById('auth-overlay');
  const app = document.getElementById('app-content');

  if (landingView) landingView.classList.add('hidden');
  if (dashboardView) dashboardView.classList.remove('hidden');

  if (overlay) overlay.style.display = 'none';
  if (app) app.style.opacity = '1';

  document.title = 'GhostApp | Dashboard';

  // Logout Logic — listen on custom event dispatched by GhostSidebar component
  window.addEventListener('ghost-logout', () => {
    localStorage.removeItem('ar_auth_token');
    if (dashboardView) dashboardView.classList.add('hidden');
    if (landingView) landingView.classList.remove('hidden');
    document.title = 'GhostApp | Home';
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
  });

  // Go Home (without logout) — sidebar home button
  window.addEventListener('ghost-go-home', () => {
    if (dashboardView) dashboardView.classList.add('hidden');
    if (landingView) landingView.classList.remove('hidden');
    document.title = 'GhostApp | Home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Go Dashboard (from landing navbar) — when already logged in
  window.addEventListener('ghost-go-dashboard', () => {
    if (landingView) landingView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');
    if (app) app.style.opacity = '1';
    document.title = 'GhostApp | Dashboard';
  });

  // Fetch real logs from API (replace mock data)
  loadDashboardLogs();

  // Fetch live stats
  loadDashboardStats();
}

async function loadDashboardLogs() {
  const logContainer = document.getElementById('log-container');
  if (!logContainer) return;

  // TODO: docelowo user_id z tokenu JWT, na razie 1
  const userId = 1;
  const API_BASE = '/api';

  try {
    const res = await fetch(`${API_BASE}/logs/list.php?user_id=${userId}&limit=50`);
    
    if (!res.ok) throw new Error('API niedostępne');
    
    const data = await res.json();
    
    if (!data.logs || data.logs.length === 0) {
      // Onboarding — brak logów, pokaż instrukcje
      logContainer.innerHTML = `
        <div class="px-8 py-12 text-center">
          <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-display font-bold text-white mb-2">${t('onboard.title')}</h3>
          <p class="text-sm text-zinc-400 max-w-md mx-auto mb-8">${t('onboard.desc')}</p>
          
          <div class="max-w-lg mx-auto space-y-4 text-left">
            <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <span class="shrink-0 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <p class="text-sm font-medium text-white">${t('onboard.step1.title')}</p>
                <p class="text-xs text-zinc-400 mt-1">${t('onboard.step1.desc')}</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <span class="shrink-0 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <p class="text-sm font-medium text-white">${t('onboard.step2.title')}</p>
                <p class="text-xs text-zinc-400 mt-1">${t('onboard.step2.desc')}</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <span class="shrink-0 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <p class="text-sm font-medium text-white">${t('onboard.step3.title')}</p>
                <p class="text-xs text-zinc-400 mt-1">${t('onboard.step3.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Render prawdziwych logów
    logContainer.innerHTML = '';
    data.logs.forEach((log: { id: number; platform: string; event_type: string; source_user: string; source_channel: string; trigger_keyword: string; original_message: string; reply_sent: string; created_at: string }) => {
      const platformColor = log.platform === 'discord' ? 'text-discord' : (log.platform === 'steam' ? 'text-steamLight' : 'text-messenger');
      const isAutoReply = log.event_type === 'auto_reply';
      const statusText = isAutoReply ? t('dash.logs.sent') : t('dash.logs.activation');
      const timeAgo = formatTimeAgo(log.created_at);

      logContainer.innerHTML += `
        <div class="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-default">
          <div class="flex items-center gap-4">
            <div class="w-2 h-2 rounded-full ${isAutoReply ? 'bg-primary' : 'bg-blue-500'}"></div>
            <div>
              <p class="text-sm font-medium text-white">${log.event_type === 'auto_reply' ? 'Auto-Reply' : 'System'} <span class="text-zinc-500 text-xs ml-2 font-mono">ACT-${log.id}</span></p>
              <p class="text-xs text-zinc-400 mt-0.5">${t('dash.logs.platform')}: <span class="${platformColor} font-semibold">${log.platform}</span> • ${t('dash.logs.user')}: ${log.source_user}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium ${isAutoReply ? 'text-primary' : 'text-blue-400'}">${statusText}</p>
            <p class="text-xs text-zinc-500 mt-0.5">${timeAgo}</p>
          </div>
        </div>
      `;
    });

  } catch (_err) {
    // API niedostępne — pokaż onboarding zamiast błędu
    logContainer.innerHTML = `
      <div class="px-8 py-12 text-center">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-lg font-display font-bold text-white mb-2">${t('onboard.title')}</h3>
        <p class="text-sm text-zinc-400 max-w-md mx-auto">${t('onboard.desc')}</p>
      </div>
    `;
  }
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  
  if (diffMin < 1) return 'teraz';
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}

function animateCountUp(el: HTMLElement, target: number, suffix: string = '') {
  const duration = 800;
  const start = performance.now();
  const from = 0;

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.round(from + (target - from) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

let statsInterval: ReturnType<typeof setInterval> | null = null;

async function loadDashboardStats() {
  const API_BASE = '/api';
  const userId = 1; // TODO: From JWT

  const statActions = document.getElementById('stat-today-actions');
  const statTotalLabel = document.getElementById('stat-total-label');
  const statEfficiency = document.getElementById('stat-efficiency');
  const statEffDetail = document.getElementById('stat-efficiency-detail');
  const statRules = document.getElementById('stat-active-rules');
  const statPlatforms = document.getElementById('stat-platforms-list');

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats/get.php?user_id=${userId}`);
      if (!res.ok) throw new Error('API niedostępne');
      const data = await res.json();

      // Today's Actions
      if (statActions) {
        animateCountUp(statActions, data.today_actions);
      }
      if (statTotalLabel) {
        statTotalLabel.textContent = `${t('dash.stats.total')}: ${data.total_actions}`;
      }

      // Efficiency
      if (statEfficiency) {
        animateCountUp(statEfficiency, data.efficiency, '%');
      }
      if (statEffDetail) {
        statEffDetail.textContent = `${data.auto_replies_7d}/${data.total_events_7d} (7d)`;
      }

      // Active Rules
      if (statRules) {
        animateCountUp(statRules, data.active_rules);
      }

      // Platform statuses
      if (statPlatforms) {
        const platformConfig: Record<string, { label: string; colorClass: string }> = {
          discord:   { label: 'Discord',   colorClass: 'text-discord' },
          steam:     { label: 'Steam',     colorClass: 'text-steamLight' },
          messenger: { label: 'Messenger', colorClass: 'text-messenger' },
        };

        // Always show Discord, plus any other connected platforms
        const platformNames = new Set(['discord', ...Object.keys(data.platforms || {})]);
        let html = '';

        platformNames.forEach(name => {
          const cfg = platformConfig[name] || { label: name, colorClass: 'text-zinc-400' };
          const info = data.platforms?.[name];
          const isActive = info?.status === 'active';
          const statusText = isActive ? t('dash.stats.connected') : t('dash.stats.disconnected');
          const statusColor = isActive ? cfg.colorClass : 'text-zinc-600';
          const dotColor = isActive ? 'bg-green-500' : 'bg-zinc-700';

          html += `
            <div class="flex justify-between items-center text-sm ${html ? 'mt-2' : ''}">
              <span class="text-zinc-400 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
                ${cfg.label}
              </span>
              <span class="${statusColor} font-bold text-xs">${statusText}</span>
            </div>
          `;
        });

        statPlatforms.innerHTML = html;
      }

    } catch (_err) {
      // Fallback — pokaż zera zamiast skeleton
      if (statActions) statActions.textContent = '0';
      if (statEfficiency) statEfficiency.textContent = '0%';
      if (statRules) statRules.textContent = '0';
      if (statTotalLabel) statTotalLabel.textContent = '';
      if (statEffDetail) statEffDetail.textContent = '';
      if (statPlatforms) {
        statPlatforms.innerHTML = `
          <div class="flex justify-between items-center text-sm">
            <span class="text-zinc-400 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
              Discord
            </span>
            <span class="text-zinc-600 font-bold text-xs">${t('dash.stats.disconnected')}</span>
          </div>
        `;
      }
    }
  };

  // Initial fetch
  fetchStats();

  // Auto-refresh every 15s
  if (statsInterval) clearInterval(statsInterval);
  statsInterval = setInterval(() => {
    if (!document.getElementById('view-events')?.classList.contains('hidden')) {
      fetchStats();
    }
  }, 15000);
}

function checkAuthAndRoute() {
  const token = localStorage.getItem('ar_auth_token');
  if (token) {
    initDashboard();
  } else {
    const landingView = document.getElementById('landing-view');
    const dashboardView = document.getElementById('dashboard-view');
    if (landingView) landingView.classList.remove('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');
  }
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

function setupDashboardTabs() {
  window.addEventListener('sidebar-navigate', (e: Event) => {
    const customEvent = e as CustomEvent;
    const page = customEvent.detail.page;

    const viewEvents = document.getElementById('view-events');
    const viewConfig = document.getElementById('view-config');
    const viewRules = document.getElementById('view-rules');
    const topbarTitle = document.getElementById('topbar-title');

    // Hide all views
    [viewEvents, viewConfig, viewRules].forEach(v => {
      if (v) {
        v.classList.add('hidden');
        v.classList.remove('opacity-100');
      }
    });

    // Show the selected view
    if (page === 'events') {
      if (viewEvents) {
        viewEvents.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        viewEvents.classList.add('opacity-100');
      }
      if (topbarTitle) topbarTitle.innerText = t('dash.topbar.title');
    } else if (page === 'config') {
      if (viewConfig) {
        viewConfig.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        viewConfig.classList.add('opacity-100');
      }
      if (topbarTitle) topbarTitle.innerText = t('dash.sidebar.nodes');
    } else if (page === 'rules') {
      if (viewRules) {
        viewRules.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        viewRules.classList.add('opacity-100');
      }
      if (topbarTitle) topbarTitle.innerText = t('dash.sidebar.rules');
    }
  });
}

function setupConfigActions() {
  const discordSaveBtn = document.getElementById('discord-save-btn') as HTMLButtonElement;
  const discordTokenInput = document.getElementById('discord-token-input') as HTMLInputElement;
  const discordScopeSelect = document.getElementById('discord-scope-select') as HTMLSelectElement;
  
  const aiEnabledCheckbox = document.getElementById('discord-ai-enabled') as HTMLInputElement;
  const aiKeyInput = document.getElementById('discord-ai-key-input') as HTMLInputElement;
  const aiPromptInput = document.getElementById('discord-ai-prompt-input') as HTMLInputElement;

  // Wczytaj zapisane klucze przy ładowaniu
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config/get_platforms.php?user_id=1');
      const platforms = await res.json();
      
      if (platforms['discord']) {
        const token = platforms['discord'].token;
        if (token && discordTokenInput) {
          discordTokenInput.value = token;
        }
        if (discordScopeSelect) {
          discordScopeSelect.value = platforms['discord'].scope || 'dm_only';
        }
        if (aiEnabledCheckbox) {
          aiEnabledCheckbox.checked = platforms['discord'].ai_enabled;
        }
        if (aiKeyInput && platforms['discord'].ai_api_key) {
          aiKeyInput.value = platforms['discord'].ai_api_key;
        }
        if (aiPromptInput && platforms['discord'].ai_prompt) {
          aiPromptInput.value = platforms['discord'].ai_prompt;
        }
      }
    } catch (err) {
      console.error('Nie udało się wczytać konfiguracji');
    }
  };

  fetchConfig();

  if (discordSaveBtn) {
    discordSaveBtn.addEventListener('click', async () => {
      const token = discordTokenInput?.value;
      const scope = discordScopeSelect?.value;
      const aiEnabled = aiEnabledCheckbox?.checked ? 1 : 0;
      const aiKey = aiKeyInput?.value || '';
      const aiPrompt = aiPromptInput?.value || '';

      if (!token) return;

      const originalText = discordSaveBtn.innerHTML;
      discordSaveBtn.innerHTML = 'Zapisywanie...';
      discordSaveBtn.disabled = true;
      discordSaveBtn.classList.add('opacity-50');

      try {
        const response = await fetch('/api/discord/connect.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 1, // TODO: From JWT
            bot_token: token,
            bot_scope: scope,
            ai_enabled: aiEnabled,
            ai_api_key: aiKey,
            ai_prompt: aiPrompt
          })
        });

        await response.json();
        
        if (response.ok) {
          discordSaveBtn.innerHTML = 'Zapisano pomyślnie!';
          discordSaveBtn.classList.replace('bg-discord/20', 'bg-green-500/20');
          discordSaveBtn.classList.replace('text-white', 'text-green-400');
          discordSaveBtn.classList.replace('border-discord/30', 'border-green-500/30');
          
          setTimeout(() => {
            discordSaveBtn.innerHTML = originalText;
            discordSaveBtn.disabled = false;
            discordSaveBtn.classList.remove('opacity-50');
            discordSaveBtn.classList.replace('bg-green-500/20', 'bg-discord/20');
            discordSaveBtn.classList.replace('text-green-400', 'text-white');
            discordSaveBtn.classList.replace('border-green-500/30', 'border-discord/30');
          }, 2000);
        } else {
          discordSaveBtn.innerHTML = 'Błąd z API';
          setTimeout(() => {
            discordSaveBtn.innerHTML = originalText;
            discordSaveBtn.disabled = false;
            discordSaveBtn.classList.remove('opacity-50');
          }, 2000);
        }
      } catch (err) {
        discordSaveBtn.innerHTML = 'Błąd połączenia';
        setTimeout(() => {
          discordSaveBtn.innerHTML = originalText;
          discordSaveBtn.disabled = false;
          discordSaveBtn.classList.remove('opacity-50');
        }, 2000);
      }
    });
  }
}

function setupDiscordGuide() {
  const toggle = document.getElementById('discord-guide-toggle');
  const content = document.getElementById('discord-guide-content');
  const chevron = document.getElementById('discord-guide-chevron');

  if (toggle && content && chevron) {
    toggle.addEventListener('click', () => {
      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
      }
    });
  }
}

function setupRulesActions() {
  const form = document.getElementById('add-rule-form') as HTMLFormElement;
  const refreshBtn = document.getElementById('refresh-rules-btn') as HTMLButtonElement;
  const rulesContainer = document.getElementById('rules-container');

  const fetchRules = async () => {
    if (!rulesContainer) return;
    rulesContainer.innerHTML = `
      <div class="p-8 text-center text-zinc-500 text-sm font-mono flex flex-col items-center justify-center">
        <div class="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin mb-3"></div>
        Ładowanie reguł...
      </div>
    `;

    try {
      // user_id is hardcoded to 1 for now
      const response = await fetch('/api/rules/get.php?user_id=1');
      const rules = await response.json();

      if (rules.length === 0) {
        rulesContainer.innerHTML = `
          <div class="p-8 text-center text-zinc-500 text-sm">
            Nie masz jeszcze żadnych reguł. Dodaj pierwszą powyżej!
          </div>
        `;
        return;
      }

      rulesContainer.innerHTML = rules.map((rule: any) => `
        <div class="p-6 flex items-center justify-between group/rule hover:bg-white/2 transition-colors">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <img src="/src/assets/sociale/${rule.platform_name}.png" alt="${rule.platform_name}" class="w-5 h-5 object-contain opacity-70">
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-white/10 text-white rounded text-xs font-mono font-medium">${rule.trigger_keyword}</span>
                ${rule.is_active ? 
                  '<span class="w-2 h-2 rounded-full bg-primary/70 shadow-[0_0_8px_rgba(204,255,0,0.5)]"></span>' : 
                  '<span class="w-2 h-2 rounded-full bg-red-500/70 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>'
                }
              </div>
              <p class="text-sm text-zinc-400 font-medium">Odpowiedź: <span class="text-zinc-300 font-normal">"${rule.reply_text}"</span></p>
            </div>
          </div>
          <button data-rule-id="${rule.id}" class="delete-rule-btn p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover/rule:opacity-100">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      `).join('');

      // Add delete listeners
      document.querySelectorAll('.delete-rule-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const ruleId = (e.currentTarget as HTMLElement).getAttribute('data-rule-id');
          if (!ruleId || !confirm('Na pewno chcesz usunąć tę regułę?')) return;

          try {
            await fetch('/api/rules/delete.php', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: ruleId, user_id: 1 })
            });
            fetchRules();
          } catch (err) {
            console.error('Failed to delete rule', err);
            alert('Błąd podczas usuwania reguły');
          }
        });
      });

    } catch (err) {
      rulesContainer.innerHTML = `
        <div class="p-8 text-center text-red-400 text-sm">
          Błąd podczas pobierania reguł. Sprawdź czy API działa.
        </div>
      `;
    }
  };

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.querySelector('svg')?.classList.add('animate-spin');
      fetchRules().finally(() => {
        setTimeout(() => refreshBtn.querySelector('svg')?.classList.remove('animate-spin'), 500);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const platform = (document.getElementById('rule-platform') as HTMLSelectElement).value;
      const trigger = (document.getElementById('rule-trigger') as HTMLInputElement).value;
      const reply = (document.getElementById('rule-reply') as HTMLInputElement).value;
      const btn = document.getElementById('rule-add-btn') as HTMLButtonElement;

      const originalText = btn.innerHTML;
      btn.innerHTML = 'Dodawanie...';
      btn.disabled = true;
      btn.classList.add('opacity-50');

      try {
        const res = await fetch('/api/rules/add.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 1,
            platform_name: platform,
            trigger_keyword: trigger,
            reply_text: reply
          })
        });

        if (res.ok) {
          form.reset();
          fetchRules();
        } else {
          alert('Błąd podczas dodawania reguły');
        }
      } catch (err) {
        alert('Błąd połączenia z API');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50');
      }
    });
  }

  // Initial fetch when tab is opened
  window.addEventListener('sidebar-navigate', (e: any) => {
    if (e.detail.page === 'rules') {
      fetchRules();
    }
  });
}

function setupLogsActions() {
  const logContainer = document.getElementById('log-container');
  if (!logContainer) return;

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs/get.php?user_id=1');
      const logs = await res.json();

      if (logs.length === 0) {
        logContainer.innerHTML = `
          <div class="p-8 text-center text-zinc-500 text-sm">
            Brak zdarzeń. Bot nasłuchuje w oczekiwaniu na wiadomości.
          </div>
        `;
        return;
      }

      logContainer.innerHTML = logs.map((log: any) => {
        let iconHtml = '';
        let statusHtml = '';

        if (log.platform === 'discord') {
          iconHtml = `<div class="w-8 h-8 rounded-full bg-discord/10 flex items-center justify-center shrink-0 border border-discord/20"><img src="/src/assets/sociale/discord.png" class="w-4 h-4 opacity-70"></div>`;
        } else {
          iconHtml = `<div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10"><div class="w-4 h-4 bg-zinc-500 rounded-sm"></div></div>`;
        }

        if (log.event_type === 'auto_reply') {
          statusHtml = `<span class="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px] font-bold uppercase tracking-wider">Odpowiedziano</span>`;
        } else if (log.event_type === 'error') {
          statusHtml = `<span class="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-wider">Błąd</span>`;
        } else if (log.event_type === 'system') {
          statusHtml = `<span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wider">System</span>`;
        } else {
          statusHtml = `<span class="px-2 py-0.5 bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 rounded text-[10px] font-bold uppercase tracking-wider">${log.event_type}</span>`;
        }

        const date = new Date(log.created_at).toLocaleString('pl-PL', { hour: '2-digit', minute:'2-digit', second:'2-digit', day: '2-digit', month: '2-digit' });

        return `
          <div class="p-5 flex items-start gap-4 hover:bg-white/2 transition-colors">
            ${iconHtml}
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white text-sm truncate">${log.source_user}</span>
                  ${log.source_channel && log.source_channel !== 'DM' ? `<span class="text-xs text-zinc-500">w ${log.source_channel}</span>` : ''}
                  ${log.source_channel === 'DM' ? `<span class="text-xs text-zinc-500">w DM</span>` : ''}
                  ${statusHtml}
                </div>
                <span class="text-xs text-zinc-500 font-mono">${date}</span>
              </div>
              <div class="text-sm">
                ${log.original_message ? `<p class="text-zinc-400 mb-1 line-clamp-1"><span class="text-zinc-500">Użytkownik:</span> ${log.original_message}</p>` : ''}
                ${log.reply_sent ? `<p class="text-primary/90 line-clamp-2"><span class="text-zinc-500">Bot (Reguła "${log.trigger_keyword}"):</span> ${log.reply_sent}</p>` : ''}
                ${log.event_type === 'system' ? `<p class="text-blue-400 line-clamp-1">${log.trigger_keyword}</p>` : ''}
                ${log.event_type === 'error' ? `<p class="text-red-400 line-clamp-1">${log.original_message}</p>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      logContainer.innerHTML = `<div class="p-8 text-center text-red-400 text-sm">Błąd pobierania logów. Sprawdź połączenie z serwerem.</div>`;
    }
  };

  // Fetch immediately and set up an interval if the events view is active
  fetchLogs();
  
  window.addEventListener('sidebar-navigate', (e: any) => {
    if (e.detail.page === 'events') {
      fetchLogs();
    }
  });

  // Optional: Auto-refresh every 5 seconds
  setInterval(() => {
    if (!document.getElementById('view-events')?.classList.contains('hidden')) {
      fetchLogs();
    }
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  checkAuthAndRoute();
  setupBackground();
  setupAuth();
  setupSmoothScrolling();
  setupScrollReveal();
  setupDashboardTabs();
  setupConfigActions();
  setupDiscordGuide();
  setupRulesActions();
  setupLogsActions();
});
