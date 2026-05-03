// ==========================================
// CART STATE
// ==========================================
function getCart() {
  return JSON.parse(localStorage.getItem('bh_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('bh_cart', JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline' : 'none';
  });
}

// ==========================================
// USER AUTH (localStorage-based)
// ==========================================
function getUser() {
  return JSON.parse(localStorage.getItem('bh_user') || 'null');
}
function saveUser(user) {
  localStorage.setItem('bh_user', JSON.stringify(user));
}
function getOrders() {
  return JSON.parse(localStorage.getItem('bh_orders') || '[]');
}
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('bh_orders', JSON.stringify(orders));
}
function logout() {
  localStorage.removeItem('bh_user');
  location.reload();
}

// ---- User Modal ----
function openUserModal() {
  const user = getUser();
  const existing = document.getElementById('userModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'userModal';
  modal.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:5000;
    display:flex;align-items:center;justify-content:center;
    backdrop-filter:blur(4px);
  `;

  if (user) {
    // Show profile + orders
    const orders = getOrders();
    const ordersHTML = orders.length === 0
      ? '<p style="text-align:center;color:#6b8c77;padding:20px">لا توجد طلبات سابقة بعد</p>'
      : orders.map(o => `
          <div style="border:1px solid #d8f3dc;border-radius:12px;padding:14px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:700;color:#1a3d2b;">${o.orderNum}</span>
              <span style="font-size:0.8rem;color:#6b8c77;">${o.date}</span>
            </div>
            <div style="margin-top:6px;font-size:0.88rem;color:#3d5247;">
              ${o.items.map(i => `${i.name} × ${i.qty}`).join(' ، ')}
            </div>
            <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:700;color:#2d6a4f;">${o.total} ريال</span>
              <span style="background:#d8f3dc;color:#1a3d2b;padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:600;">${o.status}</span>
            </div>
          </div>
        `).join('');

    modal.innerHTML = `
      <div style="background:#fff;border-radius:24px;width:90%;max-width:480px;max-height:85vh;overflow-y:auto;padding:32px;position:relative;box-shadow:0 24px 64px rgba(26,61,43,0.2);">
        <button onclick="document.getElementById('userModal').remove()" style="position:absolute;top:16px;left:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#6b8c77;">✕</button>
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:64px;height:64px;background:#d8f3dc;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 12px;">🌿</div>
          <h3 style="color:#1a3d2b;margin:0;">مرحباً، ${user.name}</h3>
          <p style="color:#6b8c77;font-size:0.88rem;margin:4px 0 0;">${user.email}</p>
        </div>
        <h4 style="color:#1a3d2b;margin-bottom:12px;border-bottom:2px solid #d8f3dc;padding-bottom:8px;">طلباتي السابقة (${orders.length})</h4>
        <div>${ordersHTML}</div>
        <button onclick="logout()" style="width:100%;margin-top:20px;padding:12px;border:2px solid #e74c3c;background:transparent;color:#e74c3c;border-radius:40px;font-family:inherit;font-weight:600;cursor:pointer;font-size:0.95rem;">
          تسجيل الخروج
        </button>
      </div>
    `;
  } else {
    // Login / Register form
    modal.innerHTML = `
      <div style="background:#fff;border-radius:24px;width:90%;max-width:420px;padding:32px;position:relative;box-shadow:0 24px 64px rgba(26,61,43,0.2);">
        <button onclick="document.getElementById('userModal').remove()" style="position:absolute;top:16px;left:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#6b8c77;">✕</button>
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:2.5rem;margin-bottom:8px;">🌱</div>
          <h3 style="color:#1a3d2b;margin:0;">تسجيل الدخول</h3>
          <p style="color:#6b8c77;font-size:0.88rem;">لمتابعة طلباتك وعروضك الخاصة</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;">
          <input id="loginName" type="text" placeholder="اسمك الكريم" style="border:1.5px solid #d8f3dc;border-radius:40px;padding:12px 18px;font-family:inherit;font-size:0.95rem;outline:none;direction:rtl;transition:border 0.2s;" onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#d8f3dc'" />
          <input id="loginEmail" type="email" placeholder="البريد الإلكتروني" style="border:1.5px solid #d8f3dc;border-radius:40px;padding:12px 18px;font-family:inherit;font-size:0.95rem;outline:none;direction:rtl;transition:border 0.2s;" onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#d8f3dc'" />
          <input id="loginPass" type="password" placeholder="كلمة المرور" style="border:1.5px solid #d8f3dc;border-radius:40px;padding:12px 18px;font-family:inherit;font-size:0.95rem;outline:none;direction:rtl;transition:border 0.2s;" onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#d8f3dc'" />
          <p id="loginError" style="color:#e74c3c;font-size:0.85rem;text-align:center;display:none;"></p>
          <button onclick="doLogin()" style="background:#2d6a4f;color:#fff;border:none;border-radius:40px;padding:14px;font-family:inherit;font-weight:700;font-size:1rem;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='#1a3d2b'" onmouseout="this.style.background='#2d6a4f'">
            دخول / تسجيل
          </button>
        </div>
      </div>
    `;
  }

  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function doLogin() {
  const name = document.getElementById('loginName')?.value.trim();
  const email = document.getElementById('loginEmail')?.value.trim();
  const pass = document.getElementById('loginPass')?.value.trim();
  const err = document.getElementById('loginError');

  if (!name || !email || !pass) {
    err.textContent = 'يرجى ملء جميع الحقول';
    err.style.display = 'block';
    return;
  }
  if (!email.includes('@')) {
    err.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
    err.style.display = 'block';
    return;
  }

  saveUser({ name, email });
  document.getElementById('userModal').remove();
  updateUserBtn();
  // Show welcome
  showToast(`مرحباً ${name}! 🌿 تم تسجيل الدخول بنجاح`);
}

function updateUserBtn() {
  const user = getUser();
  const btn = document.getElementById('userNavBtn');
  if (!btn) return;
  if (user) {
    btn.textContent = `👤 ${user.name.split(' ')[0]}`;
  } else {
    btn.textContent = '👤 دخول';
  }
}

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:24px;right:24px;background:#1a3d2b;color:#fff;
    padding:14px 24px;border-radius:40px;font-weight:600;z-index:9999;
    box-shadow:0 8px 24px rgba(26,61,43,0.4);animation:toastIn 0.3s ease;
    font-family:var(--font-arabic);font-size:0.92rem;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ==========================================
// ADD TO CART
// ==========================================
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, image: product.image, price: product.price, qty: 1 });
  }
  saveCart(cart);
  showAddedFeedback(productId);

  // Check auto discount
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  if (totalItems === 3) {
    showToast('🎉 أضفت 3 منتجات! خصم 10% تلقائي مطبق على طلبك');
  }
}

function showAddedFeedback(productId) {
  const btn = document.querySelector(`[data-product-id="${productId}"]`);
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = '✅ أُضيف!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('added');
  }, 1500);
}

// ==========================================
// PRODUCT MODAL
// ==========================================
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = document.getElementById('productModal');
  if (existing) existing.remove();

  const benefitChips = product.benefits
    ? product.benefits.split('،').map(b => `<span class="benefit-chip">${b.trim()}</span>`).join('')
    : '';

  const modal = document.createElement('div');
  modal.id = 'productModal';
  modal.className = 'product-modal-overlay';
  modal.innerHTML = `
    <div class="product-modal" onclick="event.stopPropagation()">
      <button class="modal-close-btn" onclick="closeProductModal()">✕</button>
      <div class="modal-hero">
        <span class="modal-badge">${product.categoryLabel}</span>
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-top">
          <div class="modal-title-group">
            <div class="modal-category">${product.categoryLabel}</div>
            <h2 class="modal-title">${product.name}</h2>
            <div class="modal-name-en">${product.nameEn || ''}</div>
          </div>
          <div class="modal-price-tag">
            <span class="price-amount">${product.price}</span>
            <span class="price-unit">ريال سعودي</span>
          </div>
        </div>
        <p class="modal-desc">${product.description}</p>
        <div class="modal-sections">
          <div class="modal-section-card">
            <div class="modal-section-title">
              <div class="modal-section-icon">🌱</div>دليل العناية
            </div>
            <div class="care-list">
              ${product.care.map(c => `<div class="care-item"><div class="care-dot"></div><span>${c}</span></div>`).join('')}
            </div>
          </div>
          <div class="modal-section-card">
            <div class="modal-section-title">
              <div class="modal-section-icon">💚</div>الفوائد الصحية
            </div>
            <p class="benefits-text">${product.benefits || 'نبتة جميلة تزين المكان'}</p>
            <div class="benefits-icon-row">${benefitChips}</div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="modal-add-btn" id="modalAddBtn_${product.id}" onclick="addToCartFromModal(${product.id})">
            🛒 أضف للسلة
          </button>
          <a href="cart.html" class="modal-cart-link">عرض السلة →</a>
        </div>
      </div>
    </div>
  `;

  modal.addEventListener('click', closeProductModal);
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modal.style.opacity = '1');
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.style.animation = 'fadeOut 0.2s ease forwards';
  setTimeout(() => {
    modal.remove();
    document.body.style.overflow = '';
  }, 200);
}

function addToCartFromModal(productId) {
  addToCart(productId);
  const btn = document.getElementById(`modalAddBtn_${productId}`);
  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = '✅ أُضيف للسلة!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('added');
    }, 1600);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProductModal();
});

// ==========================================
// PRODUCT CARD RENDER
// ==========================================
function renderProductCard(product) {
  // Hide placeholder products (price=0, name has "اسم المنتج")
  if (product.price === 0) return '';
  return `
    <div class="product-card" onclick="openProductModal(${product.id})" title="اضغط لمزيد من التفاصيل">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <div class="product-category">${product.categoryLabel}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-care">
          ${product.care.map(c => `<span class="care-tag">${c}</span>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price">${product.price} <span>ريال</span></div>
          <button class="add-to-cart-btn" data-product-id="${product.id}"
            onclick="event.stopPropagation(); addToCart(${product.id})">
            🛒 أضف للسلة
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;
  const featured = PRODUCTS.filter(p => p.featured && p.price > 0);
  container.innerHTML = featured.map(renderProductCard).join('');
}

let currentFilter = 'all';
function renderAllProducts(filter = 'all') {
  const container = document.getElementById('allProducts');
  if (!container) return;
  const filtered = (filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter))
    .filter(p => p.price > 0);
  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-soft)">
      <span style="font-size:3rem">🔍</span><p>لا توجد منتجات في هذه الفئة</p></div>`;
    return;
  }
  container.innerHTML = filtered.map(renderProductCard).join('');
}

function filterProducts(category, btn) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllProducts(category);
}

// ==========================================
// CART PAGE
// ==========================================
function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const paymentSection = document.getElementById('paymentSection');
  if (!cartItemsEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartItemsEl.classList.add('hidden');
    cartEmptyEl.classList.remove('hidden');
    if (paymentSection) paymentSection.classList.add('hidden');
    updateSummary(0);
    return;
  }

  cartEmptyEl.classList.add('hidden');
  cartItemsEl.classList.remove('hidden');
  if (paymentSection) paymentSection.classList.remove('hidden');

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price} ريال / للنبتة</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-number">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="حذف">🗑</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  updateSummary(subtotal);
  showAutoDiscountBanner(cart);
}

function showAutoDiscountBanner(cart) {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  let banner = document.getElementById('autoDiscountBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'autoDiscountBanner';
    banner.style.cssText = `
      padding:12px 20px;border-radius:12px;margin-bottom:16px;
      font-weight:600;font-size:0.9rem;text-align:center;
      display:flex;align-items:center;justify-content:center;gap:10px;
    `;
    const cartItemsEl = document.getElementById('cartItems');
    if (cartItemsEl) cartItemsEl.parentNode.insertBefore(banner, cartItemsEl);
  }
  banner.style.display = 'flex';

  if (totalItems >= 5) {
    banner.style.background = 'linear-gradient(135deg,#1a3d2b,#2d6a4f)';
    banner.style.color = '#fff';
    banner.innerHTML = '🎉 خصم 20% مطبق! (٥ منتجات أو أكثر)';
  } else if (totalItems >= 2) {
    banner.style.background = 'linear-gradient(135deg,#2d6a4f,#40916c)';
    banner.style.color = '#fff';
    banner.innerHTML = `🌿 خصم 15% مطبق! ${totalItems >= 5 ? '' : '— أضف ${5 - totalItems} منتج للوصول لخصم 20%'}`;
  } else if (totalItems === 1) {
    banner.style.background = 'linear-gradient(135deg,#74c69d,#40916c)';
    banner.style.color = '#fff';
    banner.innerHTML = '🛒 أضف منتجاً واحداً أكثر للحصول على خصم 15% تلقائي!';
  } else {
    banner.style.display = 'none';
  }
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateSummary(subtotal) {
  const shippingEl = document.getElementById('shipping');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl    = document.getElementById('totalPrice');
  if (!subtotalEl) return;

  const shipping = subtotal > 0 ? 25 : 0;
  const isCOD = document.querySelector('input[name="payment"]:checked')?.value === 'cod';
  const codFee = isCOD ? 10 : 0;

  // الخصم المتدرج + كود WELCOME
  const cart = getCart();
  const coupon = document.getElementById('couponInput')?.value?.trim() || '';
  let discount = 0;
  const autoDiscount = getAutoDiscount(cart, coupon);
  if (autoDiscount) {
    discount = Math.round(subtotal * autoDiscount.discount);
  }

  const total = subtotal + shipping + codFee - discount;
  subtotalEl.textContent = subtotal + ' ريال';
  shippingEl.textContent = subtotal > 0 ? shipping + ' ريال' : 'مجاناً';

  const discountRow = document.getElementById('discountRow');
  const discountEl  = document.getElementById('discountAmount');
  const discountLbl = document.getElementById('discountLabel');
  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `- ${discount} ريال`;
      if (discountLbl && autoDiscount) discountLbl.textContent = autoDiscount.label;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  totalEl.textContent = (total > 0 ? total : 0) + ' ريال';
}

// ==========================================
// PAYMENT METHODS
// ==========================================
function showPaymentFields(method) {
  ['cardFields','applepayFields','codFields'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  if (method === 'card' || method === 'mada') {
    document.getElementById('cardFields')?.classList.remove('hidden');
  } else if (method === 'applepay') {
    document.getElementById('applepayFields')?.classList.remove('hidden');
  } else if (method === 'cod') {
    document.getElementById('codFields')?.classList.remove('hidden');
  }

  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  updateSummary(subtotal);
}

function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  val = val.replace(/(.{4})/g, '$1  ').trim();
  input.value = val;
  const icon = document.getElementById('cardTypeIcon');
  if (!icon) return;
  if (val.startsWith('4')) icon.textContent = '💳';
  else if (val.startsWith('5') || val.startsWith('2')) icon.textContent = '🏦';
  else if (val.startsWith('3')) icon.textContent = '🟦';
  else icon.textContent = '💳';
}

function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2,4);
  input.value = val;
}

function simulateApplePay() {
  const btn = document.querySelector('.applepay-btn');
  btn.style.opacity = '0.5';
  setTimeout(() => {
    btn.style.opacity = '1';
    alert('✅ تمت المصادقة عبر Apple Pay! اضغط "تأكيد الطلب" للمتابعة');
  }, 1200);
}

// ==========================================
// PLACE ORDER + SHIPPING NOTIFICATION
// ==========================================
function placeOrder(event) {
  event.preventDefault();

  const method = document.querySelector('input[name="payment"]:checked')?.value;
  if (!method) { alert('يرجى اختيار طريقة الدفع'); return; }

  if (method === 'card' || method === 'mada') {
    const cardNum = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const expiry  = document.getElementById('expiry')?.value;
    const cvv     = document.getElementById('cvv')?.value;
    if (!cardNum || cardNum.length < 16) { alert('يرجى إدخال رقم البطاقة كاملاً'); return; }
    if (!expiry || expiry.length < 5) { alert('يرجى إدخال تاريخ انتهاء صحيح'); return; }
    if (!cvv || cvv.length < 3) { alert('يرجى إدخال رمز CVV'); return; }
  }

  const cart = getCart();
  const orderNum = 'BH-' + Date.now().toString().slice(-6);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const coupon = document.getElementById('couponInput')?.value?.trim() || '';
  const autoDiscount = getAutoDiscount(cart, coupon);
  const discount = autoDiscount ? Math.round(subtotal * autoDiscount.discount) : 0;
  const shipping = 25;
  const codFee = method === 'cod' ? 10 : 0;
  const total = subtotal + shipping + codFee - discount;

  // Save order for logged-in user
  const user = getUser();
  if (user) {
    saveOrder({
      orderNum,
      date: new Date().toLocaleDateString('ar-SA'),
      items: cart.map(i => ({ name: i.name, qty: i.qty })),
      total,
      status: 'قيد المعالجة 🕐'
    });
  }

  saveCart([]);

  // Show success modal with shipping companies
  const modal = document.getElementById('successModal');
  const orderNumberEl = document.getElementById('orderNumber');
  if (orderNumberEl) orderNumberEl.textContent = `رقم الطلب: ${orderNum}`;

  // Inject shipping selection section
  const shippingSection = document.getElementById('shippingSection');
  if (shippingSection) {
    const companies = [
      {
        id: 'aramex',
        name: 'أرامكس',
        logo: '🔴',
        eta: '2–3 أيام عمل',
        price: 25,
        trackingUrl: `https://www.aramex.com/sa/ar/track/shipments?ShipmentNumber=${orderNum}`,
        color: '#c0392b'
      },
      {
        id: 'spl',
        name: 'سبل (البريد السعودي)',
        logo: '🟢',
        eta: '1–2 يوم عمل',
        price: 20,
        trackingUrl: `https://splonline.com.sa/ar/?trackingid=${orderNum}`,
        color: '#27ae60'
      },
    ];

    shippingSection.innerHTML = `
      <div style="margin-top:20px;text-align:right;">
        <h4 style="color:#1a3d2b;margin-bottom:12px;font-size:0.95rem;">🚚 اختر شركة الشحن</h4>
        <div id="shippingOptions" style="display:flex;flex-direction:column;gap:10px;">
          ${companies.map(c => `
            <label style="cursor:pointer;display:flex;align-items:center;gap:14px;background:#f0fdf4;border:2px solid #d8f3dc;border-radius:14px;padding:14px;transition:all 0.2s;" 
                   id="shippingLabel_${c.id}"
                   onclick="selectShipping('${c.id}')">
              <input type="radio" name="shippingCo" value="${c.id}" style="accent-color:${c.color};width:18px;height:18px;flex-shrink:0;" />
              <span style="font-size:1.8rem;">${c.logo}</span>
              <div style="flex:1;">
                <div style="font-weight:700;color:#1a3d2b;font-size:0.92rem;">${c.name}</div>
                <div style="font-size:0.8rem;color:#6b8c77;">⏱️ ${c.eta}</div>
              </div>
              <div style="text-align:center;flex-shrink:0;">
                <div style="font-weight:800;color:${c.color};font-size:1rem;">${c.price} ريال</div>
                <div style="font-size:0.72rem;color:#6b8c77;">رسوم الشحن</div>
              </div>
            </label>
          `).join('')}
        </div>

        <div id="trackingBox" style="display:none;margin-top:14px;background:#fff;border:1.5px solid #d8f3dc;border-radius:14px;padding:16px;text-align:right;">
          <div id="trackingInfo"></div>
          <a id="trackingBtn" href="#" target="_blank"
             style="display:inline-flex;align-items:center;gap:6px;background:#2d6a4f;color:#fff;padding:10px 22px;border-radius:30px;font-size:0.85rem;font-weight:600;text-decoration:none;margin-top:12px;">
            🔍 تتبع شحنتك
          </a>
        </div>
      </div>
    `;

    // store companies for selectShipping()
    window._shippingCompanies = companies;
    window._shippingOrderNum = orderNum;
  }

  modal.classList.remove('hidden');
  document.getElementById('checkoutForm')?.reset();
  renderCart();
}

function selectShipping(id) {
  const companies = window._shippingCompanies || [];
  const orderNum = window._shippingOrderNum || '';
  const c = companies.find(x => x.id === id);
  if (!c) return;

  // Highlight selected label
  companies.forEach(x => {
    const lbl = document.getElementById('shippingLabel_' + x.id);
    if (lbl) lbl.style.borderColor = x.id === id ? x.color : '#d8f3dc';
  });

  // Show tracking box
  const box = document.getElementById('trackingBox');
  const info = document.getElementById('trackingInfo');
  const btn = document.getElementById('trackingBtn');
  if (box && info && btn) {
    info.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:2rem;">${c.logo}</span>
        <div>
          <div style="font-weight:700;color:#1a3d2b;">${c.name}</div>
          <div style="font-size:0.82rem;color:#6b8c77;">⏱️ التوصيل خلال ${c.eta}</div>
          <div style="font-size:0.82rem;color:#6b8c77;">📦 رقم التتبع: <strong>${orderNum}</strong></div>
          <div style="font-size:0.82rem;color:#6b8c77;margin-top:2px;">💰 رسوم الشحن: <strong style="color:${c.color}">${c.price} ريال</strong></div>
        </div>
      </div>
    `;
    btn.href = c.trackingUrl;
    btn.style.background = c.color;
    box.style.display = 'block';
  }
}

// ==========================================
// NEWSLETTER
// ==========================================
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  btn.textContent = '✅ تم الاشتراك!';
  btn.style.background = '#40916c';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'اشترك الآن';
    btn.style.background = '';
  }, 3000);
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderFeaturedProducts();
  renderAllProducts();
  renderCart();
  updateUserBtn();

  // Add user button to navbars if not index page
  // (index.html handles its own navbar)
  const navbar = document.querySelector('.navbar');
  if (navbar && !document.getElementById('userNavBtn')) {
    const navLinks = navbar.querySelector('.nav-links');
    if (navLinks) {
      const userBtn = document.createElement('button');
      userBtn.id = 'userNavBtn';
      userBtn.onclick = openUserModal;
      const user = getUser();
      userBtn.textContent = user ? `👤 ${user.name.split(' ')[0]}` : '👤 دخول';
      userBtn.style.cssText = `
        background:transparent;border:1.5px solid var(--green-main);
        color:var(--green-main);padding:7px 18px;border-radius:40px;
        font-family:inherit;font-size:0.88rem;font-weight:600;cursor:pointer;
        transition:all 0.2s;
      `;
      userBtn.onmouseover = () => { userBtn.style.background = 'var(--green-pale)'; };
      userBtn.onmouseout = () => { userBtn.style.background = 'transparent'; };
      navLinks.insertBefore(userBtn, navLinks.querySelector('.cart-link'));
    }
  }

  // Add user button to index navbar (fixed)
  const indexNavbar = document.getElementById('mainNavbar');
  if (indexNavbar && !document.getElementById('userNavBtn')) {
    const navLinks = indexNavbar.querySelector('.nav-links');
    if (navLinks) {
      const userBtn = document.createElement('button');
      userBtn.id = 'userNavBtn';
      userBtn.onclick = openUserModal;
      const user = getUser();
      userBtn.textContent = user ? `👤 ${user.name.split(' ')[0]}` : '👤 دخول';
      userBtn.style.cssText = `
        background:transparent;border:1.5px solid rgba(255,255,255,0.5);
        color:rgba(255,255,255,0.9);padding:7px 18px;border-radius:40px;
        font-family:inherit;font-size:0.88rem;font-weight:600;cursor:pointer;
        transition:all 0.3s;
      `;
      navLinks.insertBefore(userBtn, navLinks.querySelector('.instagram-nav-btn'));
    }
  }
});