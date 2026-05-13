export const translations: Record<string, Record<string, string>> = {
  pl: {
    'nav.architecture': 'Architektura',
    'nav.faq': 'FAQ',
    'nav.login': 'Zaloguj się',
    'hero.badge': 'Terminal Gotowy do działania',
    'hero.title.1': 'Scentralizuj swoją',
    'hero.title.2': 'odpowiedź.',
    'hero.desc': 'GhostApp to wysoce konfigurowalny system auto-respondera. Podepnij swoje konta Discord, Steam oraz Messenger i pozwól algorytmom zarządzać wiadomościami, gdy jesteś offline.',
    'hero.register': 'Załóż darmowe konto',
    'hero.more': 'Dowiedz się więcej',
    'features.title': 'Wielowątkowy protokół',
    'features.desc': 'Twój czas jest zbyt cenny, by odpowiadać na wciąż te same wiadomości. Zbudowaliśmy ekosystem, który rozwiązuje ten problem.',
    'feature1.title': 'Pojedynczy Terminal',
    'feature1.desc': 'Zarządzaj wszystkimi konwersacjami z poziomu jednego szyfrowanego dashboardu. Koniec z przeskakiwaniem między aplikacjami.',
    'feature2.title': 'Własne Reguły (Triggery)',
    'feature2.desc': 'Definiuj filtry słów kluczowych. Gdy bot wykryje np. słowo "trade" na Steamie, natychmiast wyśle przygotowany komunikat bez Twojej ingerencji.',
    'feature3.title': 'Pełna Dyskrecja',
    'feature3.desc': 'Zaszyfrowane logi i lokalne przechowywanie kluczy (JWT). Twoja prywatność to rdzeń naszego systemu komunikacyjnego.',
    'faq.title': 'Najczęściej zadawane pytania (FAQ)',
    'faq.desc': 'Wszystko, co musisz wiedzieć o architekturze GhostApp.',
    'faq1.q': 'Czy muszę udostępniać swoje hasła platformom?',
    'faq1.a': 'Nie. GhostApp nie wymaga twoich osobistych haseł. Do połączenia węzłów używamy wyłącznie tokenów API botów wygenerowanych w portalu dewelopera.',
    'faq2.q': 'Jak działają Triggery?',
    'faq2.a': 'W zakładce "Reguły" definiujesz słowa kluczowe. Gdy algorytm przechwyci taką wiadomość, system automatycznie odpowiada na nią przygotowanym tekstem.',
    'faq3.q': 'Gdzie przechowywane są dane?',
    'faq3.a': 'Wiadomości podlegają jedynie logowaniu i przechowywane są w zabezpieczonej bazie MySQL. Hasło jest hashowane BCRYPT.',
    'footer.text': '© 2026 GhostApp. System operacyjny komunikacji.',
    // Auth dynamic
    'auth.login.title': 'Logowanie',
    'auth.login.sub': 'Zaloguj się do swojego konta.',
    'auth.login.btn': 'Zaloguj się',
    'auth.register.title': 'Rejestracja',
    'auth.register.sub': 'Utwórz nowe konto użytkownika.',
    'auth.register.btn': 'Zarejestruj się',
    'auth.verify.title': 'Weryfikacja Email',
    'auth.verify.sub': 'Wysłano kod na adres:',
    'auth.verify.btn': 'Potwierdź kod',
    'auth.toggle.toReg': 'Nie masz konta? Zarejestruj się.',
    'auth.toggle.toLog': 'Masz już dostęp? Autoryzuj się.',
    'auth.label.email': 'E-Mail',
    'auth.label.pass': 'Hasło',
    'auth.label.code': 'Kod Weryfikacyjny z E-Maila',
    'auth.robot': 'Nie jestem robotem',
    // Dashboard
    'dash.sidebar.events': 'Dziennik Zdarzeń',
    'dash.sidebar.rules': 'Reguły Auto-Respondera',
    'dash.sidebar.nodes': 'Konfiguracja',
    'dash.sidebar.logout': 'Wyloguj (Zniszcz Sesję)',
    'dash.topbar.title': 'Dziennik Zdarzeń (Inbox)',
    'dash.topbar.daemon': 'Daemon Aktywny',
    'dash.stats.actions': 'Dzisiejsze Akcje',
    'dash.stats.efficiency': 'Skuteczność Auto-odpowiedzi',
    'dash.stats.connected': 'Połączony',
    'dash.logs.title': 'Ostatnie Interwencje',
    'dash.logs.sent': 'Wysłano',
    'dash.logs.activation': 'Aktywacja',
    'dash.logs.platform': 'Platforma',
    'dash.logs.user': 'Użytkownik',
    'dash.overlay.verify': 'Weryfikacja tokenu...',
    'nav.dashboard': 'Panel',
    'dash.sidebar.home': 'Strona główna',
    // Onboarding
    'onboard.title': 'Podłącz swojego bota',
    'onboard.desc': 'Nie masz jeszcze żadnych zdarzeń. Podłącz bota Discord, aby rozpocząć automatyczne odpowiadanie na wiadomości.',
    'onboard.step1.title': 'Stwórz aplikację Discord',
    'onboard.step1.desc': 'Wejdź na discord.com/developers/applications, kliknij "New Application", przejdź do zakładki Bot i skopiuj token.',
    'onboard.step2.title': 'Wklej token do konfiguracji',
    'onboard.step2.desc': 'Otwórz plik bot/.env i wklej token jako DISCORD_BOT_TOKEN=twój_token. Ustaw też GHOST_USER_ID na swoje ID użytkownika.',
    'onboard.step3.title': 'Uruchom bota',
    'onboard.step3.desc': 'W terminalu wpisz: node bot/index.js — bot połączy się z Discordem i zacznie nasłuchiwać wiadomości.'
  },
  en: {
    'nav.architecture': 'Architecture',
    'nav.faq': 'FAQ',
    'nav.login': 'Log In',
    'hero.badge': 'Terminal Ready to Operate',
    'hero.title.1': 'Centralize your',
    'hero.title.2': 'response.',
    'hero.desc': 'GhostApp is a highly customizable auto-responder system. Connect your Discord, Steam and Messenger accounts and let algorithms manage messages when you are offline.',
    'hero.register': 'Create Free Account',
    'hero.more': 'Learn More',
    'features.title': 'Multithreaded Protocol',
    'features.desc': 'Your time is too valuable to answer the same messages. We built an ecosystem that solves this.',
    'feature1.title': 'Single Terminal',
    'feature1.desc': 'Manage all conversations from one encrypted dashboard. No more jumping between apps.',
    'feature2.title': 'Custom Rules (Triggers)',
    'feature2.desc': 'Define keyword filters. When a bot detects e.g., "trade" on Steam, it replies instantly without your intervention.',
    'feature3.title': 'Full Discretion',
    'feature3.desc': 'Encrypted logs and local key storage (JWT). Your privacy is the core of our system.',
    'faq.title': 'Frequently Asked Questions (FAQ)',
    'faq.desc': 'Everything you need to know about GhostApp architecture.',
    'faq1.q': 'Do I need to share my passwords?',
    'faq1.a': 'No. GhostApp doesn\'t need personal passwords. We only use API tokens generated in the developer portal.',
    'faq2.q': 'How do Triggers work?',
    'faq2.a': 'In the "Rules" tab you define keywords. When intercepted, the system replies automatically.',
    'faq3.q': 'Where is the data stored?',
    'faq3.a': 'Messages are logged in a secure MySQL DB. Passwords are BCRYPT hashed.',
    'footer.text': '© 2026 GhostApp. Communication OS.',
    // Auth dynamic
    'auth.login.title': 'Log In',
    'auth.login.sub': 'Log in to your account.',
    'auth.login.btn': 'Log In',
    'auth.register.title': 'Registration',
    'auth.register.sub': 'Create a new user account.',
    'auth.register.btn': 'Sign Up',
    'auth.verify.title': 'Email Verification',
    'auth.verify.sub': 'Code sent to:',
    'auth.verify.btn': 'Confirm code',
    'auth.toggle.toReg': 'No account? Sign up.',
    'auth.toggle.toLog': 'Already have access? Log in.',
    'auth.label.email': 'E-Mail',
    'auth.label.pass': 'Password',
    'auth.label.code': 'Email Verification Code',
    'auth.robot': 'I am not a robot',
    // Dashboard
    'dash.sidebar.events': 'Event Log',
    'dash.sidebar.rules': 'Auto-Responder Rules',
    'dash.sidebar.nodes': 'Config',
    'dash.sidebar.logout': 'Log Out (Destroy Session)',
    'dash.topbar.title': 'Event Log (Inbox)',
    'dash.topbar.daemon': 'Daemon Active',
    'dash.stats.actions': 'Today\'s Actions',
    'dash.stats.efficiency': 'Auto-reply Efficiency',
    'dash.stats.connected': 'Connected',
    'dash.logs.title': 'Recent Interventions',
    'dash.logs.sent': 'Sent',
    'dash.logs.activation': 'Activation',
    'dash.logs.platform': 'Platform',
    'dash.logs.user': 'User',
    'dash.overlay.verify': 'Verifying token...',
    'nav.dashboard': 'Dashboard',
    'dash.sidebar.home': 'Home Page',
    // Onboarding
    'onboard.title': 'Connect your bot',
    'onboard.desc': 'No events yet. Connect a Discord bot to start auto-responding to messages.',
    'onboard.step1.title': 'Create a Discord Application',
    'onboard.step1.desc': 'Go to discord.com/developers/applications, click "New Application", navigate to the Bot tab and copy the token.',
    'onboard.step2.title': 'Paste token into config',
    'onboard.step2.desc': 'Open bot/.env and paste your token as DISCORD_BOT_TOKEN=your_token. Also set GHOST_USER_ID to your user ID.',
    'onboard.step3.title': 'Start the bot',
    'onboard.step3.desc': 'In terminal run: node bot/index.js — the bot will connect to Discord and start listening for messages.'
  },
  ru: {
    'nav.architecture': 'Архитектура',
    'nav.faq': 'FAQ',
    'nav.login': 'Войти',
    'hero.badge': 'Терминал готов к работе',
    'hero.title.1': 'Централизуйте ваш',
    'hero.title.2': 'ответ.',
    'hero.desc': 'GhostApp — это настраиваемая система автоответчика. Подключите Discord, Steam и Messenger, и позвольте алгоритмам работать за вас.',
    'hero.register': 'Создать аккаунт',
    'hero.more': 'Узнать больше',
    'features.title': 'Многопоточный протокол',
    'features.desc': 'Ваше время слишком ценно. Мы создали систему, которая решает проблему одинаковых ответов.',
    'feature1.title': 'Единый терминал',
    'feature1.desc': 'Управляйте всеми беседами из одной зашифрованной панели. Больше не нужно переключаться между приложениями.',
    'feature2.title': 'Свои правила (Триггеры)',
    'feature2.desc': 'Настройте фильтры. При обнаружении слова "трейд", бот ответит мгновенно без вашего участия.',
    'feature3.title': 'Полная конфиденциальность',
    'feature3.desc': 'Зашифрованные логи и локальное хранение ключей (JWT). Ваша приватность - основа системы.',
    'faq.title': 'Часто задаваемые вопросы (FAQ)',
    'faq.desc': 'Всё, что нужно знать об архитектуре GhostApp.',
    'faq1.q': 'Нужно ли давать пароли?',
    'faq1.a': 'Нет. GhostApp не требует ваших личных паролей. Мы используем только API-токены ботов.',
    'faq2.q': 'Как работают Триггеры?',
    'faq2.a': 'Вкладка "Правила" позволяет задать ключевые слова для авто-ответа.',
    'faq3.q': 'Где хранятся данные?',
    'faq3.a': 'Сообщения логируются в защищенной базе MySQL. Пароли хэшируются BCRYPT.',
    'footer.text': '© 2026 GhostApp. Операционная система коммуникаций.',
    // Auth dynamic
    'auth.login.title': 'Вход',
    'auth.login.sub': 'Войдите в свой аккаунт.',
    'auth.login.btn': 'Войти',
    'auth.register.title': 'Регистрация',
    'auth.register.sub': 'Создайте новый аккаунт.',
    'auth.register.btn': 'Зарегистрироваться',
    'auth.verify.title': 'Верификация Email',
    'auth.verify.sub': 'Код отправлен на:',
    'auth.verify.btn': 'Подтвердить код',
    'auth.toggle.toReg': 'Нет аккаунта? Зарегистрироваться.',
    'auth.toggle.toLog': 'Есть доступ? Войти.',
    'auth.label.email': 'E-Mail',
    'auth.label.pass': 'Пароль',
    'auth.label.code': 'Проверочный код',
    'auth.robot': 'Я не робот',
    // Dashboard
    'dash.sidebar.events': 'Журнал событий',
    'dash.sidebar.rules': 'Правила автоответчика',
    'dash.sidebar.nodes': 'Конфигурация',
    'dash.sidebar.logout': 'Выйти (Уничтожить сессию)',
    'dash.topbar.title': 'Журнал событий (Inbox)',
    'dash.topbar.daemon': 'Daemon активен',
    'dash.stats.actions': 'Действия за сегодня',
    'dash.stats.efficiency': 'Эффективность авто-ответов',
    'dash.stats.connected': 'Подключен',
    'dash.logs.title': 'Последние вмешательства',
    'dash.logs.sent': 'Отправлено',
    'dash.logs.activation': 'Активация',
    'dash.logs.platform': 'Платформа',
    'dash.logs.user': 'Пользователь',
    'dash.overlay.verify': 'Проверка токена...',
    'nav.dashboard': 'Панель',
    'dash.sidebar.home': 'Главная',
    // Onboarding
    'onboard.title': 'Подключите бота',
    'onboard.desc': 'Событий пока нет. Подключите бота Discord, чтобы начать автоответы.',
    'onboard.step1.title': 'Создайте приложение Discord',
    'onboard.step1.desc': 'Перейдите на discord.com/developers/applications, нажмите "New Application", перейдите во вкладку Bot и скопируйте токен.',
    'onboard.step2.title': 'Вставьте токен в конфиг',
    'onboard.step2.desc': 'Откройте bot/.env и вставьте токен как DISCORD_BOT_TOKEN=ваш_токен. Также установите GHOST_USER_ID.',
    'onboard.step3.title': 'Запустите бота',
    'onboard.step3.desc': 'В терминале введите: node bot/index.js — бот подключится к Discord и начнёт отслеживать сообщения.'
  }
};

export function t(key: string): string {
  const lang = getCurrentLanguage();
  const dict = translations[lang] || translations['pl'];
  return dict[key] || key;
}

export function setLanguage(lang: string) {
  localStorage.setItem('ghostapp_lang', lang);
  document.documentElement.lang = lang;
  
  const dict = translations[lang] || translations['pl'];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) {
      // If it's an input we might want to change placeholder, but here we just do textContent
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
         (el as HTMLInputElement).placeholder = dict[key];
      } else {
         el.textContent = dict[key];
      }
    }
  });

  // Dispatch global event so components can react
  window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
}

export function getCurrentLanguage(): string {
  return localStorage.getItem('ghostapp_lang') || 'pl';
}

export function initI18n() {
  setLanguage(getCurrentLanguage());
}
