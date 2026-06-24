// MIENNE — Main JS logic

// Product database
const PRODUCTS = {
  p1: {
    id: 'p1',
    title: 'Восстанавливающий гель для тела',
    price: 2900,
    priceStr: '2 900 RUB',
    img: '/assets/product_body_wash.png',
    desc: 'Деликатное очищение с нотами сандала и иланг-иланга.',
    volume: '250 мл',
    ingredients: 'Вода, кокоглюкозид, глицерин, экстракт сандалового дерева, эфирное масло иланг-иланга, лимонная кислота, сорбат калия, натуральный парфюм.'
  },
  p2: {
    id: 'p2',
    title: 'Парфюмированный набор ухода',
    price: 6500,
    priceStr: '6 500 RUB',
    img: '/assets/product_body_set.png',
    desc: 'Дуэт из восстанавливающего геля для душа и питательного молочка для тела.',
    volume: '2 x 250 мл',
    ingredients: 'Набор включает: 1. Восстанавливающий гель для душа (экстракт сандала, масло иланг-иланга). 2. Увлажняющее молочко для тела (масло макадамии, сквалан, пантенол).'
  },
  p3: {
    id: 'p3',
    title: 'Увлажняющий крем для тела',
    price: 3400,
    priceStr: '3 400 RUB',
    img: '/assets/product_body_wash.png',
    imgStyle: 'filter: brightness(0.95);',
    desc: 'Глубокое питание кожи с экстрактами макадамии и женьшеня.',
    volume: '200 мл',
    ingredients: 'Масло ши, масло макадамии, экстракт корня женьшеня, сок алоэ вера, пантенол, натуральный эмульгатор, витамин Е, эфирное масло лаванды.'
  },
  p4: {
    id: 'p4',
    title: 'Массажное масло с афродизиаками',
    price: 4200,
    priceStr: '4 200 RUB',
    img: '/assets/product_body_set.png',
    imgStyle: 'filter: hue-rotate(15deg) brightness(0.9);',
    desc: 'Масло премиум-класса для глубокого расслабления и чувственности.',
    volume: '100 мл',
    ingredients: 'Масло сладкого миндаля, масло виноградных косточек, масло жожоба, экстракт пачули, эфирное масло дамасской розы, витамин Е, натуральный лимонен.'
  }
};

// Global state
let cart = JSON.parse(localStorage.getItem('mienne_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementBar();
  initHeaderScroll();
  initMobileMenu();
  initFilters();
  initCarousel();
  initBookingForm();
  initCart();
  initProductDetails();
  initNewsletter();
});

// 1. Announcement Bar Rotation
function initAnnouncementBar() {
  const slides = document.querySelectorAll('.announcement-slide');
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}

// 2. Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 3. Mobile menu
function initMobileMenu() {
  const burger = document.getElementById('menu-burger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn-link');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// 4. Products filter
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      products.forEach(product => {
        const category = product.getAttribute('data-category');
        
        // Добавляем эффект плавного исчезновения перед скрытием
        product.style.opacity = '0';
        product.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            product.classList.remove('hidden');
            setTimeout(() => {
              product.style.opacity = '1';
              product.style.transform = 'scale(1)';
            }, 50);
          } else {
            product.classList.add('hidden');
          }
        }, 300);
      });
    });
  });
}

// 5. Carousel slider
function initCarousel() {
  const carousel = document.getElementById('product-carousel');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (!carousel) return;

  const scrollAmount = 340; // Card width + gap

  prevBtn.addEventListener('click', () => {
    carousel.parentElement.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    carousel.parentElement.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });

  // Drag to scroll
  let isDown = false;
  let startX;
  let scrollLeft;
  const slider = carousel.parentElement;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
}

// 6. Booking Form Drawer & Submission
function initBookingForm() {
  const openBtn = document.getElementById('open-booking-nav');
  const heroBtn = document.getElementById('hero-booking-btn');
  const serviceBookBtns = document.querySelectorAll('.book-service-btn');
  
  const overlay = document.getElementById('booking-overlay');
  const drawer = document.getElementById('booking-drawer');
  const closeBtn = document.getElementById('booking-close');
  
  const form = document.getElementById('booking-form');
  const serviceSelect = document.getElementById('booking-service');
  const timeSlots = document.querySelectorAll('.time-slot-btn');
  const timeInput = document.getElementById('booking-time');
  const statusDiv = document.getElementById('booking-status');

  // Open Drawer
  const openDrawer = () => {
    overlay.classList.add('active');
  };

  const closeDrawer = () => {
    overlay.classList.remove('active');
    statusDiv.style.display = 'none';
    form.reset();
    timeSlots.forEach(btn => btn.classList.remove('active'));
    timeInput.value = '';
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (heroBtn) heroBtn.addEventListener('click', openDrawer);
  
  serviceBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.service-card');
      const serviceName = card.getAttribute('data-service-name');
      if (serviceName) {
        serviceSelect.value = serviceName;
      }
      openDrawer();
    });
  });

  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  // Time slot selection
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      timeInput.value = slot.getAttribute('data-time');
    });
  });

  // Set min date to today
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!timeInput.value) {
      statusDiv.className = 'booking-status error';
      statusDiv.textContent = 'Пожалуйста, выберите удобное время для визита';
      statusDiv.style.display = 'block';
      return;
    }

    const payload = {
      name: document.getElementById('booking-name').value,
      phone: document.getElementById('booking-phone').value,
      service: serviceSelect.value,
      date: dateInput.value,
      time: timeInput.value,
      notes: document.getElementById('booking-notes').value
    };

    statusDiv.className = 'booking-status loading';
    statusDiv.textContent = 'Отправка данных записи...';
    statusDiv.style.display = 'block';

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        statusDiv.className = 'booking-status success';
        statusDiv.textContent = 'Вы успешно записаны. Администратор свяжется с вами в течение 10 минут.';
        form.reset();
        timeSlots.forEach(s => s.classList.remove('active'));
        timeInput.value = '';
      } else {
        throw new Error(result.error || 'Ошибка при сохранении записи');
      }
    } catch (err) {
      statusDiv.className = 'booking-status error';
      statusDiv.textContent = 'Не удалось совершить запись: ' + err.message;
    }
  });
}

// 7. Cart Drawer Management
function initCart() {
  const toggle = document.getElementById('cart-toggle');
  const overlay = document.getElementById('cart-overlay');
  const close = document.getElementById('cart-close');
  const itemsContainer = document.getElementById('cart-items-container');
  const totalPriceEl = document.getElementById('cart-total-price');
  const countBadge = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  const openCart = () => overlay.classList.add('active');
  const closeCart = () => overlay.classList.remove('active');

  toggle.addEventListener('click', openCart);
  close.addEventListener('click', closeCart);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCart();
  });

  // Render cart items
  const renderCart = () => {
    itemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      itemsContainer.innerHTML = '<div class="cart-empty-msg">Ваша корзина пуста</div>';
      totalPriceEl.textContent = '0 RUB';
      countBadge.textContent = '0';
      return;
    }

    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.qty;
      count += item.qty;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-price">${(item.price * item.qty).toLocaleString()} RUB</span>
          <div class="cart-item-actions">
            <button class="cart-qty-btn decrease-qty" data-id="${item.id}">-</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn increase-qty" data-id="${item.id}">+</button>
            <button class="cart-remove-btn remove-item" data-id="${item.id}">УДАЛИТЬ</button>
          </div>
        </div>
      `;
      itemsContainer.appendChild(itemEl);
    });

    totalPriceEl.textContent = total.toLocaleString() + ' RUB';
    countBadge.textContent = count;

    // Hook listeners
    document.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', () => updateQty(btn.dataset.id, 1));
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', () => updateQty(btn.dataset.id, -1));
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
  };

  const updateQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    
    localStorage.setItem('mienne_cart', JSON.stringify(cart));
    renderCart();
  };

  const removeItem = (id) => {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('mienne_cart', JSON.stringify(cart));
    renderCart();
  };

  // Add to cart globally
  window.addToCart = (id) => {
    const product = PRODUCTS[id];
    if (!product) return;

    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        img: product.img,
        qty: 1
      });
    }

    localStorage.setItem('mienne_cart', JSON.stringify(cart));
    renderCart();
    openCart();
  };

  // Add to cart from quick action button
  document.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const id = card.getAttribute('data-id');
      window.addToCart(id);
    });
  });

  // Simulated Checkout / Order Processing
  checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;

    checkoutBtn.disabled = true;
    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'ОФОРМЛЕНИЕ ЗАКАЗА...';

    // Format products string for CRM and Telegram
    const cartSummary = cart.map(i => `${i.title} (${i.qty} шт.)`).join(', ');
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const payload = {
      name: 'Покупатель Бутика',
      phone: 'Онлайн-заказ',
      service: `Покупка косметики: ${cartSummary}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      notes: `Итоговая стоимость заказа: ${totalPrice.toLocaleString()} RUB`
    };

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert('Заказ успешно оформлен! Детали заказа отправлены администратору.');
        cart = [];
        localStorage.removeItem('mienne_cart');
        renderCart();
        closeCart();
      } else {
        throw new Error(result.error || 'Ошибка сети при создании заказа');
      }
    } catch (err) {
      alert('Не удалось оформить заказ: ' + err.message);
    } finally {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = originalText;
    }
  });

  // Init render
  renderCart();
}

// 8. Product details modal
function initProductDetails() {
  const overlay = document.getElementById('detail-overlay');
  const content = document.getElementById('detail-modal-content');
  const close = document.getElementById('detail-close');
  const cards = document.querySelectorAll('.product-card');

  const openModal = (id) => {
    const product = PRODUCTS[id];
    if (!product) return;

    content.innerHTML = `
      <div class="modal-img-col">
        <img src="${product.img}" alt="${product.title}" style="${product.imgStyle || ''}">
      </div>
      <div class="modal-info-col">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">${product.priceStr}</div>
        
        <h4 class="modal-details-title">Объем / Вес</h4>
        <div class="modal-details-val">${product.volume}</div>
        
        <h4 class="modal-details-title">Описание</h4>
        <div class="modal-details-val">${product.desc}</div>
        
        <h4 class="modal-details-title">Активные ингредиенты</h4>
        <div class="modal-details-val">${product.ingredients}</div>
        
        <button class="btn btn-primary" onclick="addToCart('${product.id}'); document.getElementById('detail-overlay').classList.remove('active');">
          ДОБАВИТЬ В КОРЗИНУ
        </button>
      </div>
    `;
    overlay.classList.add('active');
  };

  const closeModal = () => overlay.classList.remove('active');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open if clicked on quick-add button
      if (e.target.classList.contains('quick-add-btn')) return;
      const id = card.getAttribute('data-id');
      openModal(id);
    });
  });

  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

// 9. Newsletter subscription
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const status = document.getElementById('newsletter-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    
    status.className = 'newsletter-status';
    status.textContent = 'Обработка подписки...';
    
    // Simulate API delay
    setTimeout(() => {
      status.className = 'newsletter-status success';
      status.textContent = 'Благодарим вас за подписку на закрытый клуб MIENNE';
      input.value = '';
    }, 1000);
  });
}
