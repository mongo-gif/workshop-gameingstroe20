const API_URL = 'http://localhost:8080/api';

// ===== STATE =====
let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user'));
let currentSlide = 0;
let carouselInterval;
let activeCategory = 'all';

// ===== CATEGORIES =====
const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '🏠' },
    { id: 'Mouse', name: 'เมาส์', icon: '🖱️' },
    { id: 'Keyboard', name: 'คีย์บอร์ด', icon: '⌨️' },
    { id: 'Headset', name: 'หูฟัง', icon: '🎧' },
    { id: 'Monitor', name: 'จอมอนิเตอร์', icon: '🖥️' },
    { id: 'Chair', name: 'เก้าอี้เกมมิ่ง', icon: '🪑' },
    { id: 'CPU', name: 'ซีพียู', icon: '🧠' },
    { id: 'GPU', name: 'การ์ดจอ', icon: '🎮' },
    { id: 'RAM', name: 'แรม', icon: '💾' },
    { id: 'SSD', name: 'SSD', icon: '💿' },
    { id: 'PSU', name: 'พาวเวอร์ซัพพลาย', icon: '🔌' },
    { id: 'Case', name: 'เคส', icon: '🖤' },
];

// ===== DOM ELEMENTS =====
const userDisplay = document.getElementById('user-display');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const cartCount = document.getElementById('cart-count');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartUI();

    const page = document.body.getAttribute('data-page');
    if (page === 'home') {
        initCarousel();
        renderCategories();
        loadProducts();
    }
    if (page === 'cart') loadCart();
    if (page === 'product') loadProductDetail();
});

// ===== AUTH =====
function updateAuthUI() {
    if (user) {
        if (userDisplay) userDisplay.textContent = user.username;
        if (loginBtn) loginBtn.onclick = (e) => e.preventDefault();
        if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
        if (userDisplay) userDisplay.textContent = 'เข้าสู่ระบบ';
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('user');
    user = null;
    window.location.href = 'index.html';
}

// ===== CAROUSEL =====
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer || slides.length === 0) return;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    });

    startCarousel();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const inner = document.getElementById('carousel-inner');
    if (!inner || slides.length === 0) return;

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    inner.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    goToSlide(currentSlide + 1);
    resetCarousel();
}

function prevSlide() {
    goToSlide(currentSlide - 1);
    resetCarousel();
}

function startCarousel() {
    carouselInterval = setInterval(() => nextSlide(), 5000);
}

function resetCarousel() {
    clearInterval(carouselInterval);
    startCarousel();
}

// ===== CATEGORIES =====
function renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;

    grid.innerHTML = categories.map(cat => `
        <div class="category-card ${activeCategory === cat.id ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.name}</span>
        </div>
    `).join('');
}

function filterByCategory(categoryId) {
    activeCategory = categoryId;
    renderCategories();

    const heading = document.getElementById('products-heading');

    if (categoryId === 'all') {
        filteredProducts = [...products];
        if (heading) heading.textContent = 'สินค้าแนะนำ';
    } else {
        filteredProducts = products.filter(p => p.category === categoryId);
        const cat = categories.find(c => c.id === categoryId);
        if (heading) heading.textContent = cat ? cat.name : categoryId;
    }

    renderProducts(filteredProducts);

    // Scroll to products
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToCategories() {
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== SEARCH =====
function searchProducts() {
    const input = document.getElementById('search-input');
    if (!input) return;

    const query = input.value.trim().toLowerCase();
    if (!query) {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query)) ||
            (p.category && p.category.toLowerCase().includes(query))
        );
    }

    const heading = document.getElementById('products-heading');
    if (heading) {
        heading.textContent = query ? `ผลการค้นหา "${input.value.trim()}"` : 'สินค้าแนะนำ';
    }

    activeCategory = 'all';
    renderCategories();
    renderProducts(filteredProducts);

    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Enter key search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchProducts();
        });
    }
});

// ===== PRODUCTS =====
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products.php`);
        products = await response.json();
        filteredProducts = [...products];
        renderProducts(filteredProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        const grid = document.getElementById('products-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <span class="empty-icon">😕</span>
                    <p>ไม่สามารถโหลดสินค้าได้ กรุณาลองใหม่อีกครั้ง</p>
                    <button class="btn btn-primary" onclick="loadProducts()">ลองอีกครั้ง</button>
                </div>`;
        }
    }
}

// Category-specific fallback images
const categoryFallbacks = {
    'Mouse': { icon: '🖱️', gradient: 'linear-gradient(135deg,%23667eea,%234facfe)' },
    'Keyboard': { icon: '⌨️', gradient: 'linear-gradient(135deg,%2343e97b,%2338f9d7)' },
    'Headset': { icon: '🎧', gradient: 'linear-gradient(135deg,%23fa709a,%23fee140)' },
    'Monitor': { icon: '🖥️', gradient: 'linear-gradient(135deg,%23a18cd1,%23fbc2eb)' },
    'Chair': { icon: '🪑', gradient: 'linear-gradient(135deg,%23ffecd2,%23fcb69f)' },
    'CPU': { icon: '🧠', gradient: 'linear-gradient(135deg,%2384fab0,%238fd3f4)' },
    'GPU': { icon: '🎮', gradient: 'linear-gradient(135deg,%23a1c4fd,%23c2e9fb)' },
    'RAM': { icon: '💾', gradient: 'linear-gradient(135deg,%23d4fc79,%2396e6a1)' },
    'SSD': { icon: '💿', gradient: 'linear-gradient(135deg,%23fbc2eb,%23a6c1ee)' },
    'PSU': { icon: '🔌', gradient: 'linear-gradient(135deg,%23ffeaa7,%23dfe6e9)' },
    'Case': { icon: '🖤', gradient: 'linear-gradient(135deg,%23b8c6db,%23f5f7fa)' },
};

function getFallbackImage(category, name) {
    const fb = categoryFallbacks[category] || { icon: '📦', gradient: 'linear-gradient(135deg,%23e0e0e0,%23f5f5f5)' };
    const shortName = encodeURIComponent(name.substring(0, 20));
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f0f4ff"/><stop offset="100%" style="stop-color:%23e8ecf4"/></linearGradient></defs><rect fill="url(%23g)" width="300" height="300" rx="8"/><text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" font-size="72">${fb.icon}</text><text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14" font-family="sans-serif">${category || 'Product'}</text></svg>`)}`;
}

function handleImageError(img, category, name) {
    img.onerror = null;
    img.src = getFallbackImage(category, name);
}

function renderProducts(items) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (!items || items.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <span class="empty-icon">🔍</span>
                <p>ไม่พบสินค้าที่ค้นหา</p>
            </div>`;
        return;
    }

    grid.innerHTML = items.map(product => {
        const price = parseFloat(product.price);
        const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
        const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : null;
        const badge = product.badge || (discount ? 'SALE' : null);

        let badgeClass = '';
        if (badge === 'NEW' || badge === 'ใหม่') badgeClass = 'new';
        else if (badge === 'HOT' || badge === 'ขายดี') badgeClass = 'hot';

        const escapedName = product.name.replace(/'/g, "\\'");

        return `
        <div class="product-card" onclick="goToProductDetail(${product.id})">
            ${badge ? `<span class="product-badge ${badgeClass}">${badge}</span>` : ''}
            <div class="product-img-wrap">
                <img src="${product.image_url}" alt="${product.name}" class="product-img" 
                     onerror="handleImageError(this, '${product.category}', '${escapedName}')">
            </div>
            <div class="product-info">
                <span class="product-category-tag">${product.category || 'อุปกรณ์'}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price-row">
                    <span class="product-price">฿${price.toLocaleString()}</span>
                    ${originalPrice ? `<span class="product-original-price">฿${originalPrice.toLocaleString()}</span>` : ''}
                    ${discount ? `<span class="product-discount">-${discount}%</span>` : ''}
                </div>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="add-to-cart-btn">
                    🛒 เพิ่มลงตะกร้า
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// ===== CART =====
function addToCart(productId) {
    if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
        window.location.href = 'login.html';
        return;
    }

    const product = products.find(p => p.id === productId || p.id === String(productId));
    if (!product) return;

    const existingItem = cart.find(item => item.product_id === productId || item.product_id === String(productId));
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: 1
        });
    }

    saveCart();

    // Show mini notification
    showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว`);
}

function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `✅ ${message}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #333;
        color: white;
        padding: 14px 24px;
        border-radius: 10px;
        font-size: 0.9rem;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.4s ease;
        font-family: 'Prompt', sans-serif;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (cartCount) cartCount.textContent = count;
}

function loadCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <span class="empty-icon">🛒</span>
                        <p>ตะกร้าของคุณว่างเปล่า</p>
                        <a href="index.html" class="btn btn-primary">เลือกซื้อสินค้า</a>
                    </div>
                </td>
            </tr>`;
        if (totalEl) totalEl.textContent = '0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        const itemTotal = parseFloat(item.price) * item.quantity;
        total += itemTotal;
        return `
            <tr>
                <td><img src="${item.image_url}" class="cart-item-img" alt="${item.name}" 
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect fill=%22%23f5f5f5%22 width=%2260%22 height=%2260%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23ccc%22 font-size=%2220%22>📦</text></svg>'"></td>
                <td style="font-weight:500">${item.name}</td>
                <td style="color:var(--primary-red);font-weight:600">฿${parseFloat(item.price).toLocaleString()}</td>
                <td>
                    <div class="qty-controls">
                        <button onclick="updateQty(${index}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td style="font-weight:600">฿${itemTotal.toLocaleString()}</td>
                <td><button onclick="removeFromCart(${index})" class="remove-btn" title="ลบ">✕</button></td>
            </tr>
        `;
    }).join('');

    if (totalEl) totalEl.textContent = total.toLocaleString();
}

function updateQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    loadCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    loadCart();
}

async function checkout() {
    if (cart.length === 0) return;
    if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        return;
    }

    const orderData = {
        user_id: user.id,
        items: cart
    };

    try {
        const response = await fetch(`${API_URL}/orders.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
            cart = [];
            saveCart();
            window.location.href = 'index.html';
        } else {
            alert('สั่งซื้อไม่สำเร็จ: ' + result.message);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
}

// ===== PRODUCT DETAIL =====
function goToProductDetail(productId) {
    window.location.href = `product.html?id=${productId}`;
}

let pdQty = 1;
let currentProduct = null;

async function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.getElementById('product-detail-content');

    if (!productId) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">😕</span>
                <p>ไม่พบสินค้าที่ต้องการ</p>
                <a href="index.html" class="btn btn-primary">กลับหน้าแรก</a>
            </div>`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products.php?id=${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const product = await response.json();
        if (product.message) throw new Error(product.message);

        currentProduct = product;
        pdQty = 1;
        renderProductDetail(product);
    } catch (error) {
        console.error('Error loading product detail:', error);
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">😕</span>
                <p>ไม่พบสินค้าที่ต้องการ</p>
                <a href="index.html" class="btn btn-primary">กลับหน้าแรก</a>
            </div>`;
    }
}

function renderProductDetail(product) {
    const container = document.getElementById('product-detail-content');
    const price = parseFloat(product.price);
    const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : null;
    const badge = product.badge || (discount ? 'SALE' : null);
    const stock = parseInt(product.stock) || 0;

    let badgeClass = '';
    if (badge === 'NEW' || badge === 'ใหม่') badgeClass = 'new';
    else if (badge === 'HOT' || badge === 'ขายดี') badgeClass = 'hot';

    let stockClass = '';
    let stockText = '';
    if (stock > 10) {
        stockText = `✅ มีสินค้า (${stock} ชิ้น)`;
    } else if (stock > 0) {
        stockClass = 'low-stock';
        stockText = `⚠️ เหลือเพียง ${stock} ชิ้น`;
    } else {
        stockClass = 'out-of-stock';
        stockText = '❌ สินค้าหมด';
    }

    const escapedName = product.name.replace(/'/g, "\\'");
    const sku = `SKU-${String(product.id).padStart(5, '0')}`;

    // Generate tags from product info
    const tags = [];
    if (product.category) tags.push(`#${product.category}`);
    const words = product.name.split(' ');
    if (words[0]) tags.push(`#${words[0]}`);
    if (product.badge) tags.push(`#${product.badge}`);

    // Update breadcrumb
    const bcCategory = document.getElementById('breadcrumb-category');
    const bcProduct = document.getElementById('breadcrumb-product');
    if (bcCategory) bcCategory.textContent = product.category || 'อุปกรณ์';
    if (bcProduct) bcProduct.textContent = product.name;

    // Update page title
    document.title = `${product.name} | G-STORE`;

    container.innerHTML = `
        <div class="pd-grid">
            <div class="pd-image-wrap">
                <img src="${product.image_url}" alt="${product.name}" 
                     onerror="handleImageError(this, '${product.category}', '${escapedName}')">
            </div>
            <div class="pd-info">
                ${badge ? `<span class="pd-badge ${badgeClass}">${badge}</span>` : ''}
                <h1 class="pd-title">${product.name}</h1>
                <div class="pd-meta">
                    <span>แบรนด์: <strong>${words[0] || 'ไม่ระบุ'}</strong></span>
                    <span>|</span>
                    <span>รหัสสินค้า: <strong>${sku}</strong></span>
                </div>
                <div class="pd-share-row">
                    <button class="pd-share-btn" title="แชร์ลิงก์" onclick="copyProductLink()">🔗</button>
                    <button class="pd-share-btn" title="ถูกใจ" onclick="this.innerHTML='❤️'">🤍</button>
                </div>
                <div class="pd-price-section">
                    <span class="pd-price">฿${price.toLocaleString()}</span>
                    ${originalPrice ? `<span class="pd-original-price">฿${originalPrice.toLocaleString()}</span>` : ''}
                    ${discount ? `<span class="pd-discount-tag">ลด ${discount}%</span>` : ''}
                    <div class="pd-stock-info ${stockClass}">${stockText}</div>
                </div>
                <div class="pd-qty-row">
                    <span class="pd-qty-label">จำนวน</span>
                    <div class="pd-qty-controls">
                        <button onclick="changeQty(-1)">−</button>
                        <input type="text" id="pd-qty-input" value="01" readonly>
                        <button onclick="changeQty(1)">+</button>
                    </div>
                </div>
                <div class="pd-actions">
                    <button class="pd-btn-cart" onclick="addToCartFromDetail()" ${stock === 0 ? 'disabled' : ''}>
                        🛒 เพิ่มลงตะกร้า
                    </button>
                    <button class="pd-btn-buy" onclick="buyNow()" ${stock === 0 ? 'disabled' : ''}>
                        ซื้อเลย
                    </button>
                </div>
                <div class="pd-tags">
                    ${tags.map(tag => `<span class="pd-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        ${product.description ? `
        <div class="pd-description">
            <h3>📋 รายละเอียดสินค้า</h3>
            <p>${product.description}</p>
        </div>` : ''}
    `;
}

function changeQty(delta) {
    pdQty = Math.max(1, pdQty + delta);
    const input = document.getElementById('pd-qty-input');
    if (input) input.value = String(pdQty).padStart(2, '0');
}

function addToCartFromDetail() {
    if (!currentProduct) return;
    if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
        window.location.href = 'login.html';
        return;
    }

    const existingItem = cart.find(item =>
        item.product_id === currentProduct.id || item.product_id === String(currentProduct.id)
    );
    if (existingItem) {
        existingItem.quantity += pdQty;
    } else {
        cart.push({
            product_id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image_url: currentProduct.image_url,
            quantity: pdQty
        });
    }

    saveCart();
    showToast(`เพิ่ม "${currentProduct.name}" จำนวน ${pdQty} ชิ้น ลงตะกร้าแล้ว`);
}

function buyNow() {
    if (!currentProduct) return;
    if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
        window.location.href = 'login.html';
        return;
    }

    const existingItem = cart.find(item =>
        item.product_id === currentProduct.id || item.product_id === String(currentProduct.id)
    );
    if (existingItem) {
        existingItem.quantity += pdQty;
    } else {
        cart.push({
            product_id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image_url: currentProduct.image_url,
            quantity: pdQty
        });
    }

    saveCart();
    window.location.href = 'cart.html';
}

function copyProductLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('คัดลอกลิงก์สินค้าแล้ว');
    }).catch(() => {
        showToast('ไม่สามารถคัดลอกลิงก์ได้');
    });
}
