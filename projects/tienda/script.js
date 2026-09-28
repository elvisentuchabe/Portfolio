/**
 * ================================================================
 * MAISON — Tienda de Diseño Premium
 * script.js — Lógica completa de la SPA
 *
 * Módulos:
 *  1. Datos de productos
 *  2. Estado de la aplicación
 *  3. Header con scroll
 *  4. Menú mobile
 *  5. Renderer de productos (con filtros)
 *  6. Carrito de compras
 *  7. Modal de checkout y pasarela de pago (mockup)
 *  8. Toasts / notificaciones
 *  9. Animaciones Intersection Observer
 * 10. Formato de inputs de tarjeta
 * 11. Inicialización
 * ================================================================
 */

'use strict';

/* ----------------------------------------------------------------
   1. DATOS DE PRODUCTOS
   Array de catálogo con 6 artículos de alta gama
   ---------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: 1,
    name: 'Reloj Bauhaus I',
    category: 'reloj',
    categoryLabel: 'Relojería',
    price: 385,
    description: 'Acero inoxidable cepillado, esfera minimalista. Movimiento suizo. Edición limitada.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Cuenco Wabi-Sabi',
    category: 'ceramica',
    categoryLabel: 'Cerámica',
    price: 128,
    description: 'Cerámica artesanal de alta temperatura. Vidriado reactivo único. Hecho en Kyoto.',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Sérum Lumière N°3',
    category: 'cosmetica',
    categoryLabel: 'Cosmética',
    price: 210,
    description: 'Vitamina C estabilizada al 15 %, fermentos de galanga y retinal encapsulado. 30 ml.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Lámpara Arc Studio',
    category: 'iluminacion',
    categoryLabel: 'Iluminación',
    price: 490,
    description: 'Perfil de aluminio anodizado, pantalla de mármol Carrara. Luz LED regulable 2200–4000K.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Reloj Meridian Noir',
    category: 'reloj',
    categoryLabel: 'Relojería',
    price: 620,
    description: 'Caja de titanio DLC, correa de cuero napa italiana. Resistente al agua 10 ATM.',
    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Jarrón Totem',
    category: 'ceramica',
    categoryLabel: 'Cerámica',
    price: 175,
    description: 'Terracota de Oaxaca, moldeada a mano. Cada pieza es irrepetible. Altura 28 cm.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80&auto=format&fit=crop',
  },
];


/* ----------------------------------------------------------------
   2. ESTADO DE LA APLICACIÓN
   Fuente única de verdad para el carrito
   ---------------------------------------------------------------- */
const state = {
  cart: [],         // Array de { product, quantity }
  filter: 'all',    // Filtro de categoría activo
};


/* ----------------------------------------------------------------
   3. HEADER CON SCROLL
   Añade clase .scrolled cuando el usuario hace scroll
   ---------------------------------------------------------------- */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  // Usar requestAnimationFrame para rendimiento óptimo
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ----------------------------------------------------------------
   4. MENÚ MOBILE
   Toggle del menú desplegable en dispositivos móviles
   ---------------------------------------------------------------- */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  // Cerrar al hacer clic en un enlace del menú mobile
  mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
})();


/* ----------------------------------------------------------------
   5. RENDERER DE PRODUCTOS (con filtros)
   ---------------------------------------------------------------- */

/**
 * Formatea un número como precio en euros.
 * @param {number} amount
 * @returns {string} e.g. "€ 385,00"
 */
function formatPrice(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Crea el HTML de una tarjeta de producto.
 * @param {Object} product
 * @param {number} index - Índice para calcular el delay de animación
 * @returns {HTMLElement}
 */
function createProductCard(product, index) {
  const article = document.createElement('article');
  article.classList.add('product-card');
  article.setAttribute('role', 'listitem');
  article.setAttribute('data-category', product.category);
  article.style.animationDelay = `${index * 0.07}s`;

  article.innerHTML = `
    <!-- Imagen con overlay de acción rápida -->
    <div class="product-card__image-wrap">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        width="600"
        height="450"
      />
      <span class="product-card__badge">${product.categoryLabel}</span>
      <div class="product-card__overlay" aria-hidden="true">
        <button
          class="product-card__quick-add"
          aria-label="Añadir ${product.name} al carrito"
          data-product-id="${product.id}"
          tabindex="-1"
        >
          + Añadir
        </button>
      </div>
    </div>

    <!-- Información del producto -->
    <div class="product-card__info">
      <div class="product-card__meta">
        <h3 class="product-card__name">${product.name}</h3>
        <span class="product-card__price">${formatPrice(product.price)}</span>
      </div>
      <p class="product-card__description">${product.description}</p>

      <!-- Botón principal de añadir al carrito -->
      <button
        class="product-card__add-btn"
        aria-label="Añadir ${product.name} al carrito"
        data-product-id="${product.id}"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Añadir al carrito
      </button>
    </div>
  `;

  return article;
}

/**
 * Renderiza el grid de productos según el filtro activo.
 * Aplica animaciones de entrada/salida al cambiar filtro.
 */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const currentFilter = state.filter;
  const filtered = currentFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentFilter);

  // Vaciar el grid y reinsertar las tarjetas filtradas
  grid.innerHTML = '';
  filtered.forEach((product, index) => {
    const card = createProductCard(product, index);
    grid.appendChild(card);
  });

  // Delegar los clics de "Añadir al carrito" en el grid
  // (evita registrar listeners múltiples)
  grid.querySelectorAll('[data-product-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.productId, 10);
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
    });
  });
}

/**
 * Inicializa los botones de filtro.
 */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar estado y clases activas
      state.filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Re-renderizar
      renderProducts();
    });
  });
}


/* ----------------------------------------------------------------
   6. CARRITO DE COMPRAS
   ---------------------------------------------------------------- */

// Referencias al DOM del carrito
const cartSidebar  = document.getElementById('cartSidebar');
const cartTrigger  = document.getElementById('cartTrigger');
const cartClose    = document.getElementById('cartClose');
const cartBadge    = document.getElementById('cartBadge');
const cartItemsEl  = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartShipping = document.getElementById('cartShipping');
const cartTotalEl  = document.getElementById('cartTotal');
const cartEmpty    = document.getElementById('cartEmpty');
const overlay      = document.getElementById('overlay');
const checkoutBtn  = document.getElementById('checkoutBtn');

/**
 * Abre el sidebar del carrito.
 */
function openCart() {
  cartSidebar.classList.add('open');
  cartSidebar.setAttribute('aria-hidden', 'false');
  cartTrigger.setAttribute('aria-expanded', 'true');
  overlay.classList.add('visible');
  document.body.classList.add('no-scroll');
  // Mover foco al botón de cierre para accesibilidad
  cartClose.focus();
}

/**
 * Cierra el sidebar del carrito.
 */
function closeCart() {
  cartSidebar.classList.remove('open');
  cartSidebar.setAttribute('aria-hidden', 'true');
  cartTrigger.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('visible');
  document.body.classList.remove('no-scroll');
  cartTrigger.focus();
}

/**
 * Añade un producto al carrito o incrementa su cantidad si ya existe.
 * @param {Object} product
 */
function addToCart(product) {
  const existing = state.cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ product, quantity: 1 });
  }
  updateCartUI();
  openCart();
  showToast(`"${product.name}" añadido al carrito`);
}

/**
 * Elimina un item del carrito por ID de producto.
 * @param {number} productId
 */
function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.product.id !== productId);
  updateCartUI();
}

/**
 * Cambia la cantidad de un item del carrito.
 * Si la cantidad llega a 0, elimina el item.
 * @param {number} productId
 * @param {number} delta - +1 o -1
 */
function changeQuantity(productId, delta) {
  const item = state.cart.find(i => i.product.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

/**
 * Calcula el total del carrito.
 * @returns {number}
 */
function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

/**
 * Calcula el número total de unidades en el carrito.
 * @returns {number}
 */
function getCartItemCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Actualiza toda la UI del carrito: items, totales y badge.
 */
function updateCartUI() {
  const isEmpty = state.cart.length === 0;

  // Estado vacío vs. con productos
  cartSidebar.classList.toggle('is-empty', isEmpty);

  // Renderizar items
  cartItemsEl.innerHTML = '';
  state.cart.forEach(item => {
    const el = createCartItemElement(item);
    cartItemsEl.appendChild(el);
  });

  // Calcular y mostrar totales
  const subtotal = getCartTotal();
  const shipping  = subtotal >= 150 ? 'Gratuito' : formatPrice(8.95);
  const total     = subtotal >= 150 ? subtotal : subtotal + 8.95;

  cartSubtotal.textContent = formatPrice(subtotal);
  cartShipping.textContent = shipping;
  cartTotalEl.textContent  = formatPrice(total);

  // Actualizar badge del icono del carrito
  const count = getCartItemCount();
  cartBadge.textContent = count;
  cartBadge.classList.toggle('visible', count > 0);

  // Actualizar total en el modal de checkout
  const modalTotal = document.getElementById('modalTotal');
  if (modalTotal) {
    modalTotal.textContent = formatPrice(total);
  }
}

/**
 * Crea el elemento HTML de un item del carrito.
 * @param {{ product: Object, quantity: number }} item
 * @returns {HTMLElement}
 */
function createCartItemElement({ product, quantity }) {
  const div = document.createElement('div');
  div.classList.add('cart-item');
  div.setAttribute('data-item-id', product.id);

  div.innerHTML = `
    <div class="cart-item__image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" width="72" height="72" />
    </div>

    <div class="cart-item__details">
      <span class="cart-item__name">${product.name}</span>
      <span class="cart-item__price">${formatPrice(product.price)}</span>
      <div class="cart-item__qty" role="group" aria-label="Cantidad de ${product.name}">
        <button
          class="qty-btn"
          aria-label="Reducir cantidad de ${product.name}"
          data-action="decrease"
          data-id="${product.id}"
        >−</button>
        <span class="qty-display" aria-label="Cantidad: ${quantity}">${quantity}</span>
        <button
          class="qty-btn"
          aria-label="Aumentar cantidad de ${product.name}"
          data-action="increase"
          data-id="${product.id}"
        >+</button>
      </div>
    </div>

    <button
      class="cart-item__remove"
      aria-label="Eliminar ${product.name} del carrito"
      data-remove="${product.id}"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
    </button>
  `;

  // Listeners de cantidad
  div.querySelector('[data-action="decrease"]').addEventListener('click', () => {
    changeQuantity(product.id, -1);
  });
  div.querySelector('[data-action="increase"]').addEventListener('click', () => {
    changeQuantity(product.id, 1);
  });

  // Listener de eliminar
  div.querySelector('[data-remove]').addEventListener('click', () => {
    removeFromCart(product.id);
    showToast(`"${product.name}" eliminado`);
  });

  return div;
}

/**
 * Inicializa los eventos del carrito.
 */
function initCart() {
  // Abrir carrito
  cartTrigger.addEventListener('click', openCart);

  // Cerrar carrito
  cartClose.addEventListener('click', closeCart);

  // Cerrar con overlay
  overlay.addEventListener('click', () => {
    closeCart();
    closeModal();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeModal();
    }
  });

  // Botón de checkout en el carrito
  checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;
    closeCart();
    openModal();
  });

  // Estado inicial
  updateCartUI();
}


/* ----------------------------------------------------------------
   7. MODAL DE CHECKOUT Y PASARELA DE PAGO (MOCKUP)
   ---------------------------------------------------------------- */

const checkoutModal    = document.getElementById('checkoutModal');
const modalClose       = document.getElementById('modalClose');
const checkoutForm     = document.getElementById('checkoutForm');
const checkoutFormView = document.getElementById('checkoutFormView');
const processingView   = document.getElementById('processingView');
const successView      = document.getElementById('successView');
const successCloseBtn  = document.getElementById('successCloseBtn');
const orderNumberEl    = document.getElementById('orderNumber');

/**
 * Abre el modal de checkout.
 */
function openModal() {
  // Asegurar que se muestre el formulario al abrir
  showView(checkoutFormView);

  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');
  document.body.classList.add('no-scroll');

  // Foco al primer campo para accesibilidad
  const firstInput = checkoutModal.querySelector('input');
  if (firstInput) setTimeout(() => firstInput.focus(), 300);
}

/**
 * Cierra el modal de checkout.
 */
function closeModal() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('visible');
  document.body.classList.remove('no-scroll');
}

/**
 * Muestra una vista dentro del modal y oculta las demás.
 * @param {HTMLElement} viewToShow
 */
function showView(viewToShow) {
  [checkoutFormView, processingView, successView].forEach(view => {
    view.classList.toggle('modal__view--hidden', view !== viewToShow);
  });
}

/**
 * Genera un número de pedido aleatorio con prefijo MSN.
 * @returns {string}
 */
function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '#MSN-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Valida el formulario de checkout.
 * Marca campos inválidos y muestra mensajes de error.
 * @returns {boolean} true si el formulario es válido
 */
function validateCheckoutForm() {
  let isValid = true;

  const rules = [
    { id: 'firstName',  label: 'Nombre',                     type: 'text' },
    { id: 'lastName',   label: 'Apellidos',                  type: 'text' },
    { id: 'email',      label: 'Email válido',               type: 'email' },
    { id: 'address',    label: 'Dirección',                  type: 'text' },
    { id: 'city',       label: 'Ciudad',                     type: 'text' },
    { id: 'zip',        label: 'Código postal',              type: 'zip' },
    { id: 'cardName',   label: 'Titular',                    type: 'text' },
    { id: 'cardNumber', label: 'Número de tarjeta (16 dígitos)', type: 'card' },
    { id: 'cardExpiry', label: 'Fecha válida (MM/AA)',       type: 'expiry' },
    { id: 'cardCvv',    label: 'CVV (3-4 dígitos)',          type: 'cvv' },
  ];

  rules.forEach(rule => {
    const input = document.getElementById(rule.id);
    const errorEl = input.nextElementSibling?.classList.contains('form-error')
      ? input.nextElementSibling
      : input.parentElement?.nextElementSibling;

    let errorMsg = '';

    // Limpiar estado previo
    input.classList.remove('is-error');
    if (errorEl) errorEl.textContent = '';

    const value = input.value.trim();

    if (!value) {
      errorMsg = `${rule.label} es obligatorio.`;
    } else {
      switch (rule.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errorMsg = 'Introduce un email válido.';
          }
          break;
        case 'zip':
          if (!/^\d{4,6}$/.test(value)) {
            errorMsg = 'Código postal no válido.';
          }
          break;
        case 'card':
          if (value.replace(/\s/g, '').length !== 16) {
            errorMsg = 'El número debe tener 16 dígitos.';
          }
          break;
        case 'expiry':
          if (!/^\d{2}\/\d{2}$/.test(value)) {
            errorMsg = 'Formato inválido. Usa MM/AA.';
          }
          break;
        case 'cvv':
          if (!/^\d{3,4}$/.test(value)) {
            errorMsg = 'El CVV debe tener 3 o 4 dígitos.';
          }
          break;
      }
    }

    if (errorMsg) {
      isValid = false;
      input.classList.add('is-error');
      // El span de error es el siguiente hermano del input (o del wrapper)
      const errSpan = input.closest('.form-group')?.querySelector('.form-error');
      if (errSpan) errSpan.textContent = errorMsg;
    }
  });

  return isValid;
}

/**
 * Maneja el envío del formulario de checkout.
 * 1. Valida los campos.
 * 2. Muestra el loader durante 2.5 segundos (simulación).
 * 3. Muestra la pantalla de éxito con número de pedido.
 */
function initCheckoutForm() {
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateCheckoutForm()) {
      // Hacer scroll al primer error
      const firstError = checkoutModal.querySelector('.is-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // 1. Mostrar loader
    showView(processingView);

    // 2. Simular proceso de pago (2500 ms)
    await delay(2500);

    // 3. Mostrar pantalla de éxito
    orderNumberEl.textContent = generateOrderNumber();
    showView(successView);

    // 4. Limpiar carrito
    state.cart = [];
    updateCartUI();
  });

  // Cerrar modal con el botón X
  modalClose.addEventListener('click', closeModal);

  // Botón "Seguir comprando" en pantalla de éxito
  successCloseBtn.addEventListener('click', () => {
    closeModal();
    // Resetear el formulario para una próxima compra
    setTimeout(() => {
      checkoutForm.reset();
      checkoutForm.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
      checkoutForm.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
    }, 400);
  });
}

/**
 * Pequeña utilidad para esperar N milisegundos.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ----------------------------------------------------------------
   8. TOASTS / NOTIFICACIONES
   ---------------------------------------------------------------- */

const toastContainer = document.getElementById('toastContainer');

/**
 * Muestra un toast de notificación temporal.
 * @param {string} message - Texto del toast
 * @param {number} duration - Duración en ms (por defecto 2800)
 */
function showToast(message, duration = 2800) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Eliminar el toast tras la duración indicada
  setTimeout(() => {
    toast.classList.add('toast--out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}


/* ----------------------------------------------------------------
   9. ANIMACIONES INTERSECTION OBSERVER
   Observa elementos .reveal y aplica .is-visible al entrar en viewport
   ---------------------------------------------------------------- */
function initRevealAnimations() {
  // Añadir clase .reveal a secciones que deben animarse
  const targets = document.querySelectorAll(
    '.editorial__text, .editorial__image, .about__image-wrap, .about__content, .about__stats li, .footer__brand, .footer__nav, .footer__newsletter'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Añadir delays escalonados a ciertos grupos
    if (el.closest('.about__stats')) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      el.classList.add(`reveal--delay-${idx + 1}`);
    }
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo sin animación
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animar solo una vez
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
}


/* ----------------------------------------------------------------
   10. FORMATO DE INPUTS DE TARJETA
   Autoformatea número de tarjeta (grupos de 4) y fecha de caducidad
   ---------------------------------------------------------------- */
function initCardInputFormatters() {
  // Número de tarjeta: insertar espacios cada 4 dígitos
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = value;
    });
  }

  // Fecha de caducidad: insertar "/" tras los 2 primeros dígitos
  const cardExpiryInput = document.getElementById('cardExpiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      e.target.value = value;
    });
  }

  // CVV: solo dígitos
  const cardCvvInput = document.getElementById('cardCvv');
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
  }
}


/* ----------------------------------------------------------------
   11. INICIALIZACIÓN
   Punto de entrada principal: arranca todos los módulos
   ---------------------------------------------------------------- */
function init() {
  // Renderizar el catálogo
  renderProducts();

  // Inicializar filtros de categoría
  initFilters();

  // Inicializar carrito
  initCart();

  // Inicializar modal de checkout y formulario
  initCheckoutForm();

  // Inicializar formateadores de inputs de tarjeta
  initCardInputFormatters();

  // Inicializar animaciones de scroll
  initRevealAnimations();

  // Newsletter: feedback al usuario
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        showToast('¡Gracias! Te has suscrito correctamente.');
        input.value = '';
      } else {
        showToast('Por favor, introduce un email válido.');
      }
    });
  }

  console.log('%cMAISON Store v1.0 🛍', 'color:#0A0A0A;font-family:serif;font-size:18px;font-style:italic;');
}

// Arrancar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
