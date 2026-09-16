const apps = [
  { id: 'facebook', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Facebook', label: 'Android · Windows · macOS', format: 'Official', icon: 'f', iconClass: 'icon-blue', version: 'Official release', size: 'Official app', rating: 'Meta', description: 'Terhubung dengan teman, komunitas, dan halaman favorit melalui Facebook resmi.', download: 'https://www.facebook.com/', external: true },
  { id: 'roblox', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Roblox', label: 'Android · Windows · macOS', format: 'Official', icon: 'R', iconClass: 'icon-dark', version: 'Official release', size: 'Official installer', rating: 'Roblox', description: 'Platform game dan kreasi komunitas. Download melalui halaman resmi Roblox.', download: 'https://www.roblox.com/download', external: true },
  { id: 'zoom', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Zoom', label: 'Android · Windows · macOS', format: 'Official', icon: 'Z', iconClass: 'icon-blue', version: 'Official release', size: 'Official installer', rating: 'Zoom', description: 'Meeting video dan kolaborasi online untuk kerja, belajar, dan komunitas.', download: 'https://zoom.us/download', external: true },
  { id: 'iriun-webcam', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Iriun Webcam', label: 'Android · Windows · macOS', format: 'Official', icon: 'W', iconClass: 'icon-orange', version: 'Official release', size: 'Official installer', rating: 'Iriun', description: 'Gunakan kamera HP sebagai webcam komputer melalui aplikasi resmi Iriun Webcam.', download: 'https://iriun.com/', external: true },
  { id: 'traveloka', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Traveloka', label: 'Android · Windows · macOS', format: 'Official', icon: 'T', iconClass: 'icon-blue', version: 'Official release', size: 'Official app', rating: 'Traveloka', description: 'Pesan tiket perjalanan, hotel, dan kebutuhan liburan melalui Traveloka resmi.', download: 'https://www.traveloka.com/', external: true },
  { id: 'tiket-com', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'tiket.com', label: 'Android · Windows · macOS', format: 'Official', icon: 't', iconClass: 'icon-orange', version: 'Official release', size: 'Official app', rating: 'tiket.com', description: 'Pesan penerbangan, hotel, kereta, dan aktivitas perjalanan dari tiket.com.', download: 'https://www.tiket.com/', external: true },
  { id: 'qmove', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'QMove', label: 'Android · Windows · macOS', format: 'Official', icon: 'Q', iconClass: 'icon-lime', version: 'Official release', size: 'Official app', rating: 'QMove', description: 'Layanan QMove dari situs resmi. Pilih layanan atau aplikasi yang sesuai melalui website QMove.', download: 'https://www.qmove.com/id-id/', external: true },
  { id: 'lalamove', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Lalamove', label: 'Android · Windows · macOS', format: 'Official', icon: 'L', iconClass: 'icon-orange', version: 'Official release', size: 'Official app', rating: 'Lalamove', description: 'Layanan pengiriman dan transportasi sesuai kebutuhan bisnis maupun personal.', download: 'https://www.lalamove.com/', external: true },
  { id: 'turbo-vpn', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Turbo VPN', label: 'Android · Windows · macOS', format: 'Official', icon: 'V', iconClass: 'icon-dark', version: 'Official release', size: 'Official installer', rating: 'Turbo VPN', description: 'Aplikasi VPN dari situs resmi Turbo VPN. Periksa kebijakan privasi sebelum menggunakan.', download: 'https://turbovpn.com/', external: true },
  { id: 'grab', platform: 'official', platforms: ['android'], name: 'Grab', label: 'Android', format: 'Official', icon: 'G', iconClass: 'icon-lime', version: 'Official release', size: 'Official app', rating: 'Grab', description: 'Transportasi, pesan antar makanan, pembayaran, dan layanan harian dari Grab.', download: 'https://www.grab.com/id/download/', external: true },
  { id: 'gojek', platform: 'official', platforms: ['android'], name: 'Gojek', label: 'Android', format: 'Official', icon: 'G', iconClass: 'icon-blue', version: 'Official release', size: 'Official app', rating: 'Gojek', description: 'Transportasi, makanan, pembayaran, dan kebutuhan harian dari Gojek.', download: 'https://www.gojek.com/', external: true },
  { id: 'shopee', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Shopee', label: 'Android · Windows · macOS', format: 'Official', icon: 'S', iconClass: 'icon-orange', version: 'Official release', size: 'Official app', rating: 'Shopee', description: 'Marketplace dan layanan belanja online melalui situs resmi Shopee.', download: 'https://shopee.co.id/', external: true },
  { id: 'lazada', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Lazada', label: 'Android · Windows · macOS', format: 'Official', icon: 'L', iconClass: 'icon-blue', version: 'Official release', size: 'Official app', rating: 'Lazada', description: 'Belanja online dan temukan berbagai produk dari Lazada resmi.', download: 'https://www.lazada.co.id/', external: true },
  { id: 'tokopedia', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Tokopedia', label: 'Android · Windows · macOS', format: 'Official', icon: 'T', iconClass: 'icon-lime', version: 'Official release', size: 'Official app', rating: 'Tokopedia', description: 'Marketplace Indonesia untuk belanja dan kebutuhan bisnis.', download: 'https://www.tokopedia.com/', external: true },
  { id: 'bukalapak', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'Bukalapak', label: 'Android · Windows · macOS', format: 'Official', icon: 'B', iconClass: 'icon-orange', version: 'Official release', size: 'Official app', rating: 'Bukalapak', description: 'Belanja online dan layanan digital melalui Bukalapak resmi.', download: 'https://www.bukalapak.com/', external: true },
  { id: 'akulaku', platform: 'official', platforms: ['android'], name: 'Akulaku', label: 'Android', format: 'Official', icon: 'A', iconClass: 'icon-dark', version: 'Official release', size: 'Official app', rating: 'Akulaku', description: 'Marketplace dan layanan finansial digital melalui sumber resmi Akulaku.', download: 'https://www.akulaku.com/', external: true },
  { id: 'dana', platform: 'official', platforms: ['android'], name: 'DANA', label: 'Android', format: 'Official', icon: 'D', iconClass: 'icon-blue', version: 'Official release', size: 'Official app', rating: 'DANA', description: 'Dompet digital untuk pembayaran dan transaksi harian.', download: 'https://www.dana.id/', external: true },
  { id: 'ovo', platform: 'official', platforms: ['android'], name: 'OVO', label: 'Android', format: 'Official', icon: 'O', iconClass: 'icon-orange', version: 'Official release', size: 'Official app', rating: 'OVO', description: 'Pembayaran digital dan layanan keuangan melalui OVO resmi.', download: 'https://www.ovo.id/', external: true },
  { id: 'gopay', platform: 'official', platforms: ['android'], name: 'GoPay', label: 'Android', format: 'Official', icon: 'G', iconClass: 'icon-lime', version: 'Official release', size: 'Official app', rating: 'GoPay', description: 'Pembayaran digital dan transaksi harian dari GoPay resmi.', download: 'https://gopay.co.id/', external: true },
  { id: 'whatsapp', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'WhatsApp', label: 'Android · Windows · macOS', format: 'Official', icon: '◉', iconClass: 'icon-lime', version: 'Official release', size: 'Official installer', rating: 'WhatsApp', description: 'Aplikasi pesan dan panggilan untuk terhubung dengan keluarga, teman, dan pelanggan.', download: 'https://www.whatsapp.com/download', external: true },
  { id: 'capcut', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'CapCut', label: 'Android · Windows · macOS', format: 'Official', icon: 'C', iconClass: 'icon-orange', version: 'Official release', size: 'Official installer', rating: 'CapCut', description: 'Editor video untuk membuat dan mengedit konten. Pilih installer resmi sesuai perangkatmu.', download: 'https://www.capcut.com/download', external: true },
  { id: 'tiktok', platform: 'official', platforms: ['android', 'windows', 'macos'], name: 'TikTok', label: 'Android · Windows · macOS', format: 'Official', icon: '♪', iconClass: 'icon-dark', version: 'Official release', size: 'Official installer', rating: 'TikTok', description: 'Platform video pendek resmi. Pilih versi yang sesuai dengan perangkatmu melalui halaman download TikTok.', download: 'https://www.tiktok.com/download', external: true },
  { id: 'photoshop', platform: 'official', platforms: ['windows', 'macos'], name: 'Adobe Photoshop', label: 'Windows · macOS', format: 'Official', icon: 'Ps', iconClass: 'icon-blue', version: 'Creative Cloud', size: 'Official installer', rating: 'Adobe', description: 'Aplikasi editing foto profesional dari Adobe. Download dan instal melalui Creative Cloud resmi.', download: 'https://creativecloud.adobe.com/apps/download/creative-cloud', external: true },
  { id: 'daily', name: 'Jujoys Daily', platform: 'android', label: 'Android', format: 'APK', icon: 'J', iconClass: 'icon-lime', version: '2.4.1', size: '38 MB', rating: '4.9', description: 'Rutinitas harian lebih teratur dengan ruang yang tenang untuk fokus.', download: '#'
  },
  { id: 'studio', name: 'Jujoys Studio', platform: 'windows', label: 'Windows', format: 'EXE', icon: '✦', iconClass: 'icon-orange', version: '1.8.0', size: '82 MB', rating: '4.8', description: 'Ruang kreatif desktop untuk mengatur ide, proyek, dan karya.', download: '#'
  },
  { id: 'move', name: 'Jujoys Move', platform: 'macos', label: 'macOS', format: 'DMG', icon: '↗', iconClass: 'icon-blue', version: '3.1.2', size: '46 MB', rating: '4.9', description: 'Teman bergerak untuk menjaga aktivitasmu tetap ringan dan konsisten.', download: '#'
  },
  { id: 'connect', name: 'Jujoys Connect', platform: 'android', label: 'Android', format: 'APK', icon: '◌', iconClass: 'icon-dark', version: '1.6.4', size: '29 MB', rating: '4.7', description: 'Tetap terhubung dengan komunitas dan orang-orang penting.', download: '#'
  },
  { id: 'desk', name: 'Jujoys Desk', platform: 'windows', label: 'Windows', format: 'EXE', icon: '▣', iconClass: 'icon-lime', version: '2.0.0', size: '64 MB', rating: '4.8', description: 'Workspace ringkas untuk mengelola pekerjaan tanpa kerumitan.', download: '#'
  },
  { id: 'care', name: 'Jujoys Care', platform: 'macos', label: 'macOS', format: 'DMG', icon: '♥', iconClass: 'icon-orange', version: '1.3.7', size: '31 MB', rating: '4.9', description: 'Pengingat sederhana untuk merawat diri dan menjaga keseimbangan.', download: '#'
  }
];

const appLogos = {
  facebook: 'facebook', roblox: 'roblox', zoom: 'zoom', 'iriun-webcam': 'iriun', traveloka: 'traveloka', 'tiket-com': 'tiket',
  lalamove: 'lalamove', 'turbo-vpn': 'turbovpn', grab: 'grab', gojek: 'gojek', shopee: 'shopee', lazada: 'lazada',
  tokopedia: 'tokopedia', bukalapak: 'bukalapak', dana: 'dana', ovo: 'ovo', gopay: 'gopay', whatsapp: 'whatsapp',
  capcut: 'capcut', tiktok: 'tiktok', photoshop: 'adobephotoshop'
};

const officialLogoDomains = {
  traveloka: 'traveloka.com', 'tiket-com': 'tiket.com', qmove: 'qmove.com', lalamove: 'lalamove.com',
  'turbo-vpn': 'turbovpn.com', lazada: 'lazada.co.id', tokopedia: 'tokopedia.com', capcut: 'capcut.com', akulaku: 'akulaku.com'
};

const officialLogoUrls = {
  'iriun-webcam': 'https://iriun.com/favicon.ico', traveloka: 'https://www.traveloka.com/favicon.ico', 'tiket-com': 'https://www.tiket.com/favicon.ico', qmove: 'assets/qmove-mark.svg',
  lalamove: 'https://www.lalamove.com/favicon.ico', 'turbo-vpn': 'assets/turbo-vpn-mark.svg', lazada: 'https://www.lazada.co.id/favicon.ico',
  tokopedia: 'https://www.tokopedia.com/favicon.ico', capcut: 'assets/capcut-mark.svg'
};

const localLogoSvg = {
  'iriun-webcam': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#f1a15e"/><rect x="13" y="20" width="38" height="27" rx="8" fill="#17251f"/><circle cx="32" cy="33.5" r="9" fill="#f1a15e"/><circle cx="32" cy="33.5" r="4" fill="#17251f"/><path d="M24 15h16" stroke="#17251f" stroke-width="5" stroke-linecap="round"/></svg>',
  qmove: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#d5f36b"/><path d="M18 31c0-9 7-16 16-16s16 7 16 16-7 16-16 16c-4 0-8-1-11-4" fill="none" stroke="#17251f" stroke-width="7" stroke-linecap="round"/><path d="m38 38 11 11" stroke="#17251f" stroke-width="7" stroke-linecap="round"/></svg>',
  'turbo-vpn': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#17251f"/><path d="M14 18h36l-4 25c-8 6-16 9-14 9s-6-3-14-9z" fill="#d5f36b"/><path d="m36 19-10 16h8l-5 11 13-17h-8z" fill="#17251f"/></svg>'
};

function getLogoMarkup(app) {
  const localSvg = localLogoSvg[app.id];
  if (localSvg) {
    const logoUrl = `data:image/svg+xml,${encodeURIComponent(localSvg)}`;
    return `<img style="width:31px;height:31px;object-fit:contain" src="${logoUrl}" alt="Logo ${app.name}" /><span hidden>${app.icon}</span>`;
  }
  const officialLogoUrl = officialLogoUrls[app.id];
  if (officialLogoUrl) {
    return `<img style="width:31px;height:31px;object-fit:contain" src="${officialLogoUrl}" alt="Logo ${app.name}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false" /><span hidden>${app.icon}</span>`;
  }
  const officialDomain = officialLogoDomains[app.id];
  if (officialDomain) {
    const logoUrl = `https://www.google.com/s2/favicons?domain=${officialDomain}&sz=128`;
    return `<img style="width:31px;height:31px;object-fit:contain" src="${logoUrl}" alt="Logo ${app.name}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false" /><span hidden>${app.icon}</span>`;
  }
  const logoName = appLogos[app.id];
  if (!logoName) return app.icon;
  const logoUrl = `https://cdn.simpleicons.org/${logoName}`;
  return `<img style="width:31px;height:31px;object-fit:contain" src="${logoUrl}" alt="Logo ${app.name}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false" /><span hidden>${app.icon}</span>`;
}

const grid = document.querySelector('#app-grid');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
const githubLoginButton = document.querySelector('#github-login-button');
const githubLoginLabel = document.querySelector('#github-login-label');
const githubLoginModal = document.querySelector('#github-login-modal');
const githubLoginForm = document.querySelector('#github-login-form');
const githubLoginClose = document.querySelector('#github-close');
let activeFilter = 'all';
let adTimer;
let pendingOfficialUrl = '';
let githubUser = localStorage.getItem('jujoysGroupUser') || '';

function updateGithubLoginState() {
  if (!githubLoginButton || !githubLoginLabel) return;

  if (githubUser) {
    githubLoginButton.classList.add('is-logged-in');
    githubLoginLabel.textContent = githubUser;
    githubLoginButton.title = `Masuk sebagai ${githubUser}`;
    return;
  }

  githubLoginButton.classList.remove('is-logged-in');
  githubLoginLabel.textContent = 'Masuk ke Jujoys Group';
  githubLoginButton.title = 'Masuk ke Jujoys Group';
}

function openGithubLogin() {
  if (!githubLoginModal) return;
  githubLoginModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeGithubLogin() {
  if (!githubLoginModal) return;
  githubLoginModal.hidden = true;
  document.body.style.overflow = '';
}

function handleGithubLogin(event) {
  event.preventDefault();
  if (!githubLoginForm) return;

  const formData = new FormData(githubLoginForm);
  const username = String(formData.get('githubUsername') || '').trim();
  const password = String(formData.get('githubPassword') || '').trim();

  if (!username || !password) {
    alert('Masukkan username/email dan password Jujoys Group terlebih dahulu.');
    return;
  }

  githubUser = username;
  localStorage.setItem('jujoysGroupUser', githubUser);
  updateGithubLoginState();
  closeGithubLogin();
  githubLoginForm.reset();
  showToast(`Selamat datang, ${githubUser}!`);
}

function renderApps() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = apps.filter((app) => {
    const matchesFilter = activeFilter === 'all' || app.platform === activeFilter || app.platforms?.includes(activeFilter);
    const matchesSearch = `${app.name} ${app.label} ${app.description}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  emptyState.hidden = visible.length > 0;
  grid.innerHTML = visible.map((app) => `
    <article class="app-card">
      <div class="app-icon ${app.iconClass}">${getLogoMarkup(app)}</div>
      <h3>${app.name}</h3>
      <p>${app.description}</p>
      <div class="card-footer"><span>${app.label} · ${app.format} · v${app.version}</span><button class="download-link" type="button" data-app-id="${app.id}">Detail <span>↗</span></button></div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-app-id]').forEach((button) => button.addEventListener('click', () => openAppModal(button.dataset.appId)));
}

function openAppModal(id) {
  const app = apps.find((item) => item.id === id);
  if (!app) return;
  document.querySelector('#modal-icon').innerHTML = getLogoMarkup(app);
  document.querySelector('#modal-icon').className = `modal-icon ${app.iconClass}`;
  document.querySelector('#modal-platform').textContent = app.label;
  document.querySelector('#modal-title').textContent = app.name;
  document.querySelector('#modal-description').textContent = app.description;
  document.querySelector('#modal-version').textContent = `Versi ${app.version}`;
  document.querySelector('#modal-size').textContent = app.size;
  document.querySelector('#modal-rating').textContent = `★ ${app.rating}`;
  document.querySelector('#modal-format').textContent = app.format;
  const downloadLink = document.querySelector('#modal-download');
  downloadLink.href = app.download;
  downloadLink.target = app.external ? '_blank' : '_self';
  downloadLink.rel = app.external ? 'noopener noreferrer' : '';
  if (app.external) {
    downloadLink.removeAttribute('download');
    downloadLink.innerHTML = 'Buka situs resmi <span>↗</span>';
    downloadLink.onclick = (event) => {
      event.preventDefault();
      openAdBeforeRedirect(app.download);
    };
  } else {
    downloadLink.setAttribute('download', '');
    downloadLink.innerHTML = 'URL belum tersedia <span>•</span>';
  }
  downloadLink.querySelector('span').textContent = app.external ? '↗' : '↓';
  document.querySelector('#app-modal').hidden = false;
  document.body.style.overflow = 'hidden';
}

function openAdBeforeRedirect(url) {
  pendingOfficialUrl = url;
  const adModal = document.querySelector('#ad-modal');
  const countdown = document.querySelector('#ad-countdown');
  const skip = document.querySelector('#ad-skip');
  let seconds = 4;
  clearInterval(adTimer);
  skip.disabled = true;
  countdown.textContent = `Lanjut dalam ${seconds} detik`;
  adModal.hidden = false;
  setTimeout(() => {
    document.querySelectorAll('#ad-modal ins.adsbygoogle').forEach(() => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }, 100);
  adTimer = setInterval(() => {
    seconds -= 1;
    countdown.textContent = seconds > 0 ? `Lanjut dalam ${seconds} detik` : 'Siap dilanjutkan';
    if (seconds <= 0) {
      clearInterval(adTimer);
      skip.disabled = false;
    }
  }, 1000);
}

function continueToOfficialSite() {
  clearInterval(adTimer);
  document.querySelector('#ad-modal').hidden = true;
  document.body.style.overflow = '';
  if (pendingOfficialUrl && pendingOfficialUrl !== '#') {
    window.open(pendingOfficialUrl, '_blank', 'noopener,noreferrer');
  }
  pendingOfficialUrl = '';
}

function closeModal() {
  document.querySelector('#app-modal').hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
  activeFilter = button.dataset.filter;
  renderApps();
}));
searchInput.addEventListener('input', renderApps);
document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.querySelector(`#${button.dataset.scroll}`).scrollIntoView({ behavior: 'smooth' })));
document.querySelector('#modal-close').addEventListener('click', closeModal);
document.querySelector('#app-modal').addEventListener('click', (event) => { if (event.target.id === 'app-modal') closeModal(); });
githubLoginButton?.addEventListener('click', openGithubLogin);
githubLoginClose?.addEventListener('click', closeGithubLogin);
githubLoginModal?.addEventListener('click', (event) => { if (event.target === githubLoginModal) closeGithubLogin(); });
githubLoginForm?.addEventListener('submit', handleGithubLogin);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeGithubLogin();
  }
});
document.querySelector('#ad-skip').addEventListener('click', continueToOfficialSite);
document.querySelector('#ad-modal').addEventListener('click', (event) => { if (event.target.id === 'ad-modal') continueToOfficialSite(); });
updateGithubLoginState();
renderApps();
