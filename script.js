const tabs = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.tab-panel');
const toast = document.querySelector('#toast');
let toastTimer;
const accountModal = document.querySelector('#account-modal');
const accountViews = document.querySelectorAll('.account-view');
const progressSteps = document.querySelectorAll('.progress-step');
let profileName = '';
let currentUser = null;
let authToken = localStorage.getItem('jjjDeliveryToken') || '';
let GOOGLE_MAPS_API_KEY = 'MASUKKAN_API_KEY_GOOGLE_MAPS';
let mapsReady = false;
let directionsService;
let selectedPlaces = { origin: null, destination: null };
let routeRequestId = 0;
let routeLookupTimer;
const orderButton = document.querySelector('#order-button');

async function loadApiConfig() {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    GOOGLE_MAPS_API_KEY = data.mapsApiKey || GOOGLE_MAPS_API_KEY;
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'MASUKKAN_API_KEY_GOOGLE_MAPS') {
      const mapsScript = document.createElement('script');
      mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      mapsScript.async = true;
      mapsScript.defer = true;
      document.head.appendChild(mapsScript);
    }
  } catch (error) {
    console.warn('Config API tidak dapat dimuat', error);
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Permintaan gagal.');
  }
  return data;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const active = panel.id === tab.dataset.tab;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  });
});

function openAccount() {
  accountModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeAccount() {
  accountModal.hidden = true;
  document.body.style.overflow = '';
}

function showAccountView(viewName) {
  accountViews.forEach((view) => view.classList.toggle('is-visible', view.dataset.view === viewName));
  const order = ['login', 'register', 'profile', 'vehicle'];
  const currentIndex = order.indexOf(viewName);
  progressSteps.forEach((step, index) => {
    step.classList.toggle('is-current', index === currentIndex);
    step.classList.toggle('is-done', index < currentIndex);
  });
}

document.querySelector('#account-button').addEventListener('click', openAccount);
document.querySelector('#modal-close').addEventListener('click', closeAccount);
accountModal.addEventListener('click', (event) => { if (event.target === accountModal) closeAccount(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !accountModal.hidden) closeAccount(); });
document.querySelector('[data-open-register]').addEventListener('click', () => showAccountView('register'));
document.querySelector('[data-open-login]').addEventListener('click', () => showAccountView('login'));
document.querySelector('[data-open-profile]')?.addEventListener('click', () => showAccountView('profile'));

document.querySelector('#register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'customer');

  try {
    const result = await fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });

    authToken = result.token;
    currentUser = result.user;
    localStorage.setItem('jjjDeliveryToken', authToken);
    profileName = name;
    showToast('Akun berhasil dibuat.');
    showAccountView('profile');
  } catch (error) {
    showToast(error.message || 'Registrasi gagal.');
  }
});

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  try {
    const result = await fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    authToken = result.token;
    currentUser = result.user;
    localStorage.setItem('jjjDeliveryToken', authToken);
    profileName = result.user.name;
    showToast('Login berhasil.');
    showAccountView('profile');
  } catch (error) {
    showToast(error.message || 'Login gagal.');
  }
});

document.querySelector('#profile-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const fullName = String(formData.get('fullName') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const address = String(formData.get('address') || '').trim();

  try {
    const result = await fetchJson('/api/profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fullName, phone, address }),
    });

    profileName = fullName;
    currentUser = currentUser || { name: fullName };
    showToast('Profil berhasil disimpan.');
    showAccountView('vehicle');
  } catch (error) {
    showToast(error.message || 'Profil gagal disimpan.');
  }
});

document.querySelectorAll('.fleet-card').forEach((card) => card.addEventListener('click', () => {
  document.querySelectorAll('.fleet-card').forEach((item) => item.classList.remove('is-selected'));
  card.classList.add('is-selected');
}));

document.querySelector('#finish-account').addEventListener('click', async () => {
  try {
    if (authToken) {
      const profileResponse = await fetchJson('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (profileResponse?.user?.name) {
        profileName = profileResponse.user.name;
      }
    }
  } catch (error) {
    console.warn('Gagal memuat profil saat selesai:', error);
  }

  closeAccount();
  const button = document.querySelector('#account-button');
  button.innerHTML = `${profileName || 'Akun saya'} <span aria-hidden="true">✓</span>`;
  showToast('Profil tersimpan. Selamat mengirim!');
});

function estimateDistance(origin, destination) {
  const combined = `${origin}|${destination}`;
  const score = [...combined].reduce((total, character) => total + character.charCodeAt(0), 0);
  return Math.max(1, (score % 24) + 2);
}

async function geocodeAddress(address) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=id&q=${encodeURIComponent(address)}`);
  if (!response.ok) throw new Error('Lokasi tidak dapat dicari.');
  const results = await response.json();
  if (!results[0]) throw new Error('Alamat tidak ditemukan.');
  return { latitude: Number(results[0].lat), longitude: Number(results[0].lon) };
}

async function estimateRoadDistance(origin, destination) {
  const [originPoint, destinationPoint] = await Promise.all([geocodeAddress(origin), geocodeAddress(destination)]);
  const coordinates = `${originPoint.longitude},${originPoint.latitude};${destinationPoint.longitude},${destinationPoint.latitude}`;
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`);
  if (!response.ok) throw new Error('Rute jalan tidak dapat dihitung.');
  const data = await response.json();
  const distance = data.routes?.[0]?.distance;
  if (!distance) throw new Error('Rute jalan tidak ditemukan.');
  return Math.max(1, Math.ceil(distance / 1000));
}

function renderRateEstimate(distance) {
  const origin = document.querySelector('#origin').value.trim();
  const destination = document.querySelector('#destination').value.trim();
  const packageType = document.querySelector('#package-type').value.trim();
  const packageWeight = document.querySelector('#package-weight').value;
  const packageSize = document.querySelector('#package-size').selectedOptions[0].textContent;
  const fragile = document.querySelector('#fragile').checked;
  const fleet = document.querySelector('input[name="fleet"]:checked').value;
  const result = document.querySelector('#rate-result');
  if (origin.length < 3 || destination.length < 3) {
    result.innerHTML = '<div class="empty-result">Isi alamat jemput dan alamat penerima untuk melihat estimasi harga.</div>';
    return;
  }
  const fleetNames = { pickup: 'Pickup / New Carry', calya: 'Calya' };
  const fleetRates = { pickup: 10000, calya: 7500 };
  const rate = fleetRates[fleet];
  const price = (distance * rate).toLocaleString('id-ID');
  document.querySelector('#auto-price-note').innerHTML = `Tarif otomatis <strong>Rp${rate.toLocaleString('id-ID')}/km</strong>`;
  const packageLabel = packageType || 'Detail barang belum diisi';
  result.innerHTML = `<div class="result-card"><p><span class="result-label">Estimasi ${fleetNames[fleet]} · Rp${rate.toLocaleString('id-ID')}/km</span><strong>Rp ${price}</strong>${distance} km · ${packageLabel} · ${packageWeight} kg${fragile ? ' · Mudah pecah' : ''}</p><span aria-hidden="true">✓</span></div>`;
  const message = [`Halo JJJ Delivery Service, saya ingin pesan pengiriman.`, `Alamat jemput: ${origin}`, `Alamat penerima: ${destination}`, `Barang: ${packageType}`, `Berat: ${packageWeight} kg`, `Ukuran: ${packageSize}`, `Armada: ${fleetNames[fleet]}`, `Jarak: ${distance} km`, `Estimasi tarif: Rp ${price}`, fragile ? 'Catatan: Barang mudah pecah' : ''].filter(Boolean).join('\n');
  orderButton.href = `https://wa.me/6281212082536?text=${encodeURIComponent(message)}`;
  orderButton.hidden = false;

  orderButton.onclick = async (event) => {
    event.preventDefault();
    try {
      const orderResponse = await fetchJson('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          pickupAddress: origin,
          destinationAddress: destination,
          packageType,
          packageWeight,
          packageSize: packageSize,
          fragile,
          fleet,
          estimatedDistance: distance,
          totalPrice: Number(price.replace(/\D/g, '')),
        }),
      });

      showToast(`Pesanan dibuat. Resi: ${orderResponse.trackingNumber}`);
      document.querySelector('#tracking-number').value = orderResponse.trackingNumber;
      document.querySelector('#tracking-result').innerHTML = renderTrackingCard(orderResponse.trackingNumber, {
        status: orderResponse.status,
        location: origin,
        history: orderResponse.shipment.history,
      });
      window.open(orderButton.href, '_blank');
    } catch (error) {
      showToast(error.message || 'Gagal membuat pesanan.');
      window.open(orderButton.href, '_blank');
    }
  };
}

function updateRateEstimate() {
  const origin = document.querySelector('#origin').value.trim();
  const destination = document.querySelector('#destination').value.trim();
  const result = document.querySelector('#rate-result');
  if (origin.length < 3 || destination.length < 3) {
    renderRateEstimate(0);
    return;
  }
  if (mapsReady && selectedPlaces.origin && selectedPlaces.destination) {
    const requestId = ++routeRequestId;
    directionsService.route({ origin: selectedPlaces.origin, destination: selectedPlaces.destination, travelMode: 'DRIVING' }, (response, status) => {
      if (requestId !== routeRequestId) return;
      if (status === 'OK' && response.routes[0]?.legs[0]?.distance?.value) {
        renderRateEstimate(Math.max(1, Math.ceil(response.routes[0].legs[0].distance.value / 1000)));
      } else {
        renderRateEstimate(estimateDistance(origin, destination));
      }
    });
    return;
  }
  const requestId = ++routeRequestId;
  clearTimeout(routeLookupTimer);
  result.innerHTML = '<div class="empty-result">Mendeteksi lokasi dan menghitung jarak jalan...</div>';
  routeLookupTimer = setTimeout(async () => {
    try {
      const distance = await estimateRoadDistance(origin, destination);
      if (requestId === routeRequestId) renderRateEstimate(distance);
    } catch (error) {
      if (requestId === routeRequestId) {
        result.innerHTML = '<div class="empty-result">Alamat belum ditemukan. Tambahkan nama jalan, kota, atau kecamatan yang lebih lengkap.</div>';
        orderButton.hidden = true;
      }
    }
  }, 450);
}

document.querySelectorAll('#origin, #destination, #package-type, #package-weight').forEach((input) => input.addEventListener('input', () => {
  selectedPlaces[input.id] = null;
  updateRateEstimate();
}));
document.querySelectorAll('#package-size, #fragile').forEach((input) => input.addEventListener('change', updateRateEstimate));
document.querySelectorAll('input[name="fleet"]').forEach((input) => input.addEventListener('change', () => {
  document.querySelectorAll('.fleet-choice').forEach((choice) => choice.classList.toggle('is-selected', choice.querySelector('input').checked));
  updateRateEstimate();
}));

function initGoogleMaps() {
  mapsReady = true;
  directionsService = new google.maps.DirectionsService();
  ['origin', 'destination'].forEach((fieldId) => {
    const autocomplete = new google.maps.places.Autocomplete(document.querySelector(`#${fieldId}`), { componentRestrictions: { country: 'id' }, fields: ['formatted_address', 'geometry', 'name'] });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      selectedPlaces[fieldId] = place.geometry?.location ? place.geometry.location : place.formatted_address;
      if (place.formatted_address) document.querySelector(`#${fieldId}`).value = place.formatted_address;
      updateRateEstimate();
    });
  });
}

const savedProfile = JSON.parse(localStorage.getItem('jjjDeliveryProfile') || 'null');
if (savedProfile?.name) {
  profileName = savedProfile.name;
  document.querySelector('#account-button').innerHTML = `${profileName} <span aria-hidden="true">✓</span>`;
}

async function hydrateSession() {
  if (!authToken) {
    return;
  }

  try {
    const result = await fetchJson('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (result?.user?.name) {
      profileName = result.user.name;
      document.querySelector('#account-button').innerHTML = `${profileName} <span aria-hidden="true">✓</span>`;
    }
  } catch (error) {
    localStorage.removeItem('jjjDeliveryToken');
    authToken = '';
  }
}

window.initGoogleMaps = initGoogleMaps;
loadApiConfig();
hydrateSession();

document.querySelector('#tracking-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const trackingNumber = document.querySelector('#tracking-number').value.trim().toUpperCase();

  try {
    const result = await fetchJson(`/api/shipments/${encodeURIComponent(trackingNumber)}`);
    const shipment = result.shipment;
    document.querySelector('#tracking-result').innerHTML = shipment ? renderTrackingCard(trackingNumber, shipment) : '<div class="empty-result">Nomor resi belum ditemukan. Periksa kembali atau tambahkan melalui panel admin.</div>';
  } catch (error) {
    document.querySelector('#tracking-result').innerHTML = '<div class="empty-result">Nomor resi belum ditemukan. Periksa kembali atau tambahkan melalui panel admin.</div>';
  }
});

const shipmentStorageKey = 'jjjDeliveryShipments';
const defaultShipments = { 'KML-482910': { status: 'Dalam perjalanan', location: 'Jakarta Selatan', history: [{ status: 'Dalam perjalanan', location: 'Jakarta Selatan', note: 'Kurir sedang membawa paket menuju alamat penerima.', time: '11 Sep 2026, 10:30' }, { status: 'Pickup berhasil', location: 'Jakarta Pusat', note: 'Paket diterima dari pengirim.', time: '11 Sep 2026, 08:15' }] } };

function getShipments() {
  return JSON.parse(localStorage.getItem(shipmentStorageKey) || JSON.stringify(defaultShipments));
}

function renderTrackingCard(trackingNumber, shipment) {
  const progressByStatus = { 'Menunggu pickup': 20, 'Dalam perjalanan': 60, 'Tiba di kota tujuan': 82, 'Sudah diterima': 100 };
  const progress = progressByStatus[shipment.status] || 50;
  const history = shipment.history.map((item) => `<li><span class="history-dot"></span><div><strong>${item.status}</strong><small>${item.location} · ${item.time}</small><p>${item.note}</p></div></li>`).join('');
  return `<div class="tracking-card"><header><span>${trackingNumber}</span><strong>${shipment.status}</strong></header><div class="tracking-progress"><span style="width:${progress}%"></span></div><div class="tracking-summary"><div><small>Status paket</small><strong>${shipment.status}</strong></div><div><small>Lokasi kurir</small><strong>${shipment.location}</strong></div></div><div class="tracking-history"><h3>Riwayat perjalanan</h3><ol>${history}</ol></div></div>`;
}

async function loadAdminSummary() {
  const summary = document.querySelector('#admin-summary');
  if (!summary) return;

  try {
    const result = await fetchJson('/api/shipments');
    const shipments = result.shipments || [];
    if (!shipments.length) {
      summary.innerHTML = '<div class="empty-result">Belum ada kiriman yang tercatat.</div>';
      return;
    }

    const total = shipments.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
    const latest = shipments.slice(0, 4);

    summary.innerHTML = `
      <div class="tracking-card">
        <header>
          <span>Dashboard admin</span>
          <strong>${shipments.length} kiriman</strong>
        </header>
        <div class="tracking-summary">
          <div><small>Nilai total</small><strong>Rp ${Number(total).toLocaleString('id-ID')}</strong></div>
          <div><small>Status aktif</small><strong>${shipments.filter((item) => item.status !== 'Sudah diterima').length}</strong></div>
        </div>
        <div class="tracking-history">
          <h3>Kiriman terbaru</h3>
          <ol>
            ${latest.map((item) => `<li><span class="history-dot"></span><div><strong>${item.tracking_number}</strong><small>${item.status} · ${item.location}</small><p>${item.package_type} · Rp ${Number(item.total_price || 0).toLocaleString('id-ID')}</p></div></li>`).join('')}
          </ol>
        </div>
      </div>
    `;
  } catch (error) {
    summary.innerHTML = '<div class="empty-result">Dashboard admin belum bisa dimuat.</div>';
  }
}

document.querySelector('#tracking-admin-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const trackingNumber = formData.get('admin-tracking-number').trim().toUpperCase();
  const status = formData.get('admin-status');
  const location = formData.get('admin-location').trim();
  const note = formData.get('admin-note').trim();

  try {
    const response = await fetchJson(`/api/shipments/${encodeURIComponent(trackingNumber)}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status, location, note }),
    });

    const shipment = response.shipment;
    document.querySelector('#tracking-number').value = trackingNumber;
    document.querySelector('#tracking-result').innerHTML = renderTrackingCard(trackingNumber, shipment);
    await loadAdminSummary();
    showToast(`Status ${trackingNumber} berhasil diperbarui`);
  } catch (error) {
    showToast(error.message || 'Gagal memperbarui status.');
  }
});

document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));

loadAdminSummary();
