const API_URL = 'http://localhost:8080/api';

// State
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user'));

// DOM Elements
const app = document.getElementById('app');
const userDisplay = document.getElementById('user-display');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const cartCount = document.getElementById('cart-count');

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartUI();

    const page = document.body.getAttribute('data-page');
    if (page === 'home') loadProducts();
    if (page === 'cart') loadCart();
    if (page === 'orders') loadOrders(); // Optional
});

// Auth Functions
function updateAuthUI() {
    if (user) {
        if (userDisplay) userDisplay.textContent = `Hi, ${user.username}`;
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
        if (userDisplay) userDisplay.textContent = '';
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('user');
    user = null;
    window.location.href = 'index.html';
}

// Product Functions
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products.php`);
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts(items) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = items.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">฿${parseFloat(product.price).toLocaleString()}</p>
                <button onclick="addToCart(${product.id})" class="btn btn-primary" style="width:100%">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    if (!user) {
        alert('Please login to shop!');
        window.location.href = 'login.html';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.product_id === productId);
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
    alert('Added to cart!');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (cartCount) cartCount.textContent = `(${count})`;
}

function loadCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align:center">Your cart is empty</td></tr>';
        totalEl.textContent = '0.00';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <tr>
                <td><img src="${item.image_url}" style="width:50px;height:50px;object-fit:cover"></td>
                <td>${item.name}</td>
                <td>฿${parseFloat(item.price).toLocaleString()}</td>
                <td>
                    <button onclick="updateQty(${index}, -1)" class="btn" style="padding:0.2rem 0.5rem">-</button>
                    ${item.quantity}
                    <button onclick="updateQty(${index}, 1)" class="btn" style="padding:0.2rem 0.5rem">+</button>
                </td>
                <td>฿${itemTotal.toLocaleString()}</td>
                <td><button onclick="removeFromCart(${index})" style="color:red;background:none;border:none;cursor:pointer">X</button></td>
            </tr>
        `;
    }).join('');

    totalEl.textContent = total.toLocaleString();
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
        alert('Please login first');
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
            alert('Order placed successfully!');
            cart = [];
            saveCart();
            window.location.href = 'index.html';
        } else {
            alert('Order failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order');
    }
}
