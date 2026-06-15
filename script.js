/* ═══════════════════════════════════════════
   MAISON & CO. — MAIN JAVASCRIPT
   ═══════════════════════════════════════════ */

'use strict';

/* ── PRODUCT DATA ── */
const PRODUCTS = [
  {
    id: 1,
    name: 'Vela Lounge Sofa',
    category: 'seating',
    categoryLabel: 'Seating',
    desc: 'Deep-seated comfort in linen & teak. 3-seater with detachable cushions.',
    price: 89500,
    oldPrice: 104000,
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    id: 2,
    name: 'Ronde Dining Table',
    category: 'tables',
    categoryLabel: 'Tables',
    desc: 'Solid walnut top, powder-coated hairpin legs. Seats 6 comfortably.',
    price: 62000,
    oldPrice: null,
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=600&q=80',
  },
  {
    id: 3,
    name: 'Kova Armchair',
    category: 'seating',
    categoryLabel: 'Seating',
    desc: 'Boucle fabric with ash frame. A sculptural accent for any corner.',
    price: 34800,
    oldPrice: 39500,
    tag: 'Sale',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
  {
    id: 4,
    name: 'Hana Bookshelf',
    category: 'storage',
    categoryLabel: 'Storage',
    desc: 'Open modular shelving in birch ply. 5 tiers, brass pin hardware.',
    price: 28400,
    oldPrice: null,
    tag: null,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
  },
  {
    id: 5,
    name: 'Ombra Coffee Table',
    category: 'tables',
    categoryLabel: 'Tables',
    desc: 'Smoked glass top with forged iron base. Conversation-starting geometry.',
    price: 41200,
    oldPrice: 46800,
    tag: 'Sale',
    image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=600&q=80',
  },
  {
    id: 6,
    name: 'Numa Bed Frame',
    category: 'bedroom',
    categoryLabel: 'Bedroom',
    desc: 'King-size low bed with padded headboard. Natural linen upholstery.',
    price: 76000,
    oldPrice: null,
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
  },
  {
    id: 7,
    name: 'Mero Sideboard',
    category: 'storage',
    categoryLabel: 'Storage',
    desc: 'Mid-century sideboard in oak veneer with sliding cane-front doors.',
    price: 53600,
    oldPrice: 59000,
    tag: null,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
  },
  {
    id: 8,
    name: 'Lumi Floor Lamp',
    category: 'seating',
    categoryLabel: 'Lighting',
    desc: 'Arched brass lamp with marble base. Warm 2700K glow.',
    price: 18200,
    oldPrice: null,
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
  },
];

/* ── STATE ── */
let cart = [];
let activeFilter = 'all';

/* ── DOM REFERENCES ── */
const productsGrid  = document.getElementById('productsGrid');
const cartSidebar   = document.getElementById('cartSidebar');
const cartBody      = document.getElementById('cartBody');
const cartFooter    = document.getElementById('cartFooter');
const cartCount     = document.getElementById('cartCount');
const cartItemCount = document.getElementById('cartItemCount');
const cartSubtotal  = document.getElementById('cartSubtotal');
const cartDelivery  = document.getElementById('cartDelivery');
const cartTotal     = document.getElementById('cartTotal');
const cartBtn       = document.getElementById('cartBtn');
const cartClose     = document.getElementById('cartClose');
const overlay       = document.getElementById('overlay');
const toast         = document.getElementById('toast');
const header        = document.getElementById('header');

/* ═══════════════════════════════════════
   FORMAT CURRENCY
   ═══════════════════════════════════════ */
function formatPrice(n) {
  return '₹' + n.toLocaleString('en-IN');
}

/* ═══════════════════════════════════════
   RENDER PRODUCTS
   ═══════════════════════════════════════ */
function renderProducts(filter = 'all') {
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  // Animate out existing cards
  const existing = productsGrid.querySelectorAll('.product-card');
  existing.forEach((card, i) => {
    card.style.transition = `opacity 0.25s ease ${i * 0.04}s, transform 0.25s ease ${i * 0.04}s`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
  });

  setTimeout(() => {
    productsGrid.innerHTML = '';

    filtered.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('data-id', product.id);
      card.style.animationDelay = `${index * 0.08}s`;

      card.innerHTML = `
        <div class="product-img-wrap">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          />
          ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
          <button class="product-wishlist" aria-label="Wishlist" data-wishlist="${product.id}"></button>
        </div>
        <div class="product-info">
          <p class="product-category">${product.categoryLabel}</p>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-footer">
            <div class="product-price-wrap">
              <span class="product-price">${formatPrice(product.price)}</span>
              ${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ''}
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    // Re-attach events
    attachProductEvents();
    observeCards();
  }, existing.length ? 300 : 0);
}

/* ── ATTACH PRODUCT EVENTS ── */
function attachProductEvents() {
  // Add to cart buttons
  productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      addToCart(id, e.currentTarget);
    });
  });

  // Wishlist buttons
  productsGrid.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('liked');
      // Heart bounce animation
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });
}

/* ═══════════════════════════════════════
   CART LOGIC
   ═══════════════════════════════════════ */
function addToCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  animateCartBtn();
  showToast(`"${product.name}" added to cart`);

  // Button feedback
  btn.textContent = '✓ Added';
  btn.style.background = 'var(--sage)';
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.style.background = '';
  }, 1400);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery   = subtotal >= 50000 ? 0 : 999;
  const total      = subtotal + delivery;

  // Badge
  cartCount.textContent = totalItems;
  if (totalItems > 0) {
    cartCount.classList.add('visible');
  } else {
    cartCount.classList.remove('visible');
  }
  cartItemCount.textContent = `(${totalItems})`;

  // Totals
  cartSubtotal.textContent = formatPrice(subtotal);
  cartDelivery.textContent = delivery === 0 ? 'Free' : formatPrice(delivery);
  cartTotal.textContent    = formatPrice(total);

  // Body
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    cartFooter.style.display = 'none';
  } else {
    cartBody.innerHTML = cart.map(item => `
      <div class="cart-item" data-item="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="cart-item-controls">
            <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
            <button class="remove-item" data-id="${item.id}" aria-label="Remove">🗑</button>
          </div>
        </div>
      </div>
    `).join('');

    cartFooter.style.display = 'block';

    // Cart item events
    cartBody.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id    = parseInt(btn.getAttribute('data-id'));
        const delta = parseInt(btn.getAttribute('data-delta'));
        changeQty(id, delta);
      });
    });
    cartBody.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const el = cartBody.querySelector(`[data-item="${id}"]`);
        if (el) {
          el.style.transition = 'opacity 0.25s, transform 0.25s';
          el.style.opacity = '0';
          el.style.transform = 'translateX(20px)';
          setTimeout(() => removeFromCart(id), 260);
        }
      });
    });
  }
}

/* ── CART OPEN / CLOSE ── */
function openCart() {
  cartSidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartSidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

/* ── CART BTN ANIMATION ── */
function animateCartBtn() {
  cartBtn.style.transform = 'scale(1.22) rotate(-6deg)';
  setTimeout(() => { cartBtn.style.transform = ''; }, 300);
}

/* ═══════════════════════════════════════
   TOAST
   ═══════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ═══════════════════════════════════════
   FILTER TABS
   ═══════════════════════════════════════ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.getAttribute('data-filter');
    renderProducts(activeFilter);
  });
});

/* ═══════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeRevealElements() {
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

function observeCards() {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card').forEach(card => {
    cardObserver.observe(card);
  });
}

/* ═══════════════════════════════════════
   HEADER SCROLL EFFECT
   ═══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ═══════════════════════════════════════
   SMOOTH ANCHOR SCROLL (nav links)
   ═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════
   INIT
   ═══════════════════════════════════════ */
renderProducts('all');
observeRevealElements();
updateCartUI();