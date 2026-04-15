// Shopping Cart functionality
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.updateCartUI();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        const button = e.target;
        const itemData = {
          id: button.dataset.id,
          name: button.dataset.name,
          price: parseFloat(button.dataset.price),
          image: button.dataset.image || ''
        };
        this.addItem(itemData);
      }

      // Remove from cart
      if (e.target.classList.contains('remove-from-cart')) {
        const itemId = e.target.dataset.id;
        this.removeItem(itemId);
      }

      // Update quantity
      if (e.target.classList.contains('quantity-decrease')) {
        const itemId = e.target.dataset.id;
        this.updateQuantity(itemId, -1);
      }

      if (e.target.classList.contains('quantity-increase')) {
        const itemId = e.target.dataset.id;
        this.updateQuantity(itemId, 1);
      }
    });
  }

  addItem(itemData) {
    const existingItem = this.items.find(item => item.id === itemData.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        ...itemData,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateCartUI();
    showNotification(`${itemData.name} added to cart!`, 'success', 2000);
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateCartUI();
    showNotification('Item removed from cart', 'success', 2000);
  }

  updateQuantity(itemId, change) {
    const item = this.items.find(item => item.id === itemId);

    if (item) {
      item.quantity += change;

      if (item.quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.saveCart();
        this.updateCartUI();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  saveCart() {
    storage.set('cart', this.items);
  }

  loadCart() {
    return storage.get('cart') || [];
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
  }

  updateCartUI() {
    // Update cart badge
    const cartBadge = document.querySelector('.cart-badge');
    const itemCount = this.getItemCount();

    if (cartBadge) {
      cartBadge.textContent = itemCount;
      cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
    }

    // Update cart items list
    const cartItemsList = document.querySelector('.cart-items');
    if (cartItemsList) {
      if (this.items.length === 0) {
        cartItemsList.innerHTML = '<p class="text-center">Your cart is empty</p>';
      } else {
        cartItemsList.innerHTML = this.items.map(item => `
          <div class="cart-item" data-id="${item.id}">
            ${item.image ? `<img src="${item.image}" alt="${sanitizeHTML(item.name)}" class="cart-item-image">` : ''}
            <div class="cart-item-details">
              <h4 class="cart-item-name">${sanitizeHTML(item.name)}</h4>
              <p class="cart-item-price">${formatCurrency(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
              <button class="quantity-decrease" data-id="${item.id}" aria-label="Decrease quantity">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-from-cart" data-id="${item.id}" aria-label="Remove item">×</button>
          </div>
        `).join('');
      }
    }

    // Update cart total
    const cartTotal = document.querySelector('.cart-total');
    if (cartTotal) {
      const subtotal = this.getTotal();
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      cartTotal.innerHTML = `
        <div class="cart-total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="cart-total-row">
          <span>Tax (8%):</span>
          <span>${formatCurrency(tax)}</span>
        </div>
        <div class="cart-total-row cart-total-final">
          <span>Total:</span>
          <span>${formatCurrency(total)}</span>
        </div>
      `;
    }

    // Update checkout button state
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
      checkoutButton.disabled = this.items.length === 0;
    }
  }
}

// Initialize cart
let cart;
document.addEventListener('DOMContentLoaded', () => {
  cart = new ShoppingCart();
});
