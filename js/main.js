// Main JavaScript - Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll reveal animations
  if (typeof ScrollReveal !== 'undefined') {
    new ScrollReveal();
  }

  // Initialize lazy loading
  if (typeof LazyLoader !== 'undefined') {
    new LazyLoader();
  }

  // Set minimum date for date inputs (today)
  const dateInputs = document.querySelectorAll('input[type="date"].no-past-dates');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });

  // Initialize form validators
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    new FormValidator(`#${form.id}`);
  });

  // Handle reservation form
  const reservationForm = document.getElementById('reservation-form');
  if (reservationForm) {
    new FormValidator('#reservation-form');
  }

  // Handle contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    new FormValidator('#contact-form');
  }

  // Handle event inquiry form
  const eventForm = document.getElementById('event-form');
  if (eventForm) {
    new FormValidator('#event-form');
  }

  // Handle newsletter signup
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;

      if (email) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('Thank you for subscribing!', 'success');
        newsletterForm.reset();
      }
    });
  }

  // Populate time slots for reservations
  const timeSelect = document.getElementById('reservation-time');
  if (timeSelect) {
    populateTimeSlots(timeSelect);
  }

  // Handle order type selection (pickup/delivery)
  const orderTypeButtons = document.querySelectorAll('.order-type-btn');
  orderTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      orderTypeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const orderType = button.dataset.type;
      const deliverySection = document.getElementById('delivery-section');

      if (deliverySection) {
        deliverySection.style.display = orderType === 'delivery' ? 'block' : 'none';
      }
    });
  });

  // Handle checkout
  const checkoutButton = document.querySelector('.checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      if (cart && cart.items.length > 0) {
        window.location.href = 'checkout.html';
      }
    });
  }

  // Handle order submission
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!cart || cart.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
      }

      const formData = new FormData(orderForm);
      const orderData = {
        items: cart.items,
        customer: Object.fromEntries(formData.entries()),
        total: cart.getTotal(),
        orderNumber: generateId().toUpperCase()
      };

      // Show loading
      const submitButton = orderForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner"></span> Processing...';

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear cart
        cart.clearCart();

        // Show confirmation
        showOrderConfirmation(orderData);

      } catch (error) {
        showNotification('Order failed. Please try again.', 'error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Place Order';
      }
    });
  }

  // Add animation classes to elements as they scroll into view
  const animateElements = document.querySelectorAll('[data-animate]');
  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.animate;
          entry.target.classList.add(`animate-${animation}`);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));
  }
});

// Populate time slots for reservations
function populateTimeSlots(selectElement) {
  const times = [];
  const startHour = 11; // 11 AM
  const endHour = 21; // 9 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const hour12 = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;

      times.push({ value: time24, label: time12 });
    }
  }

  times.forEach(time => {
    const option = document.createElement('option');
    option.value = time.value;
    option.textContent = time.label;
    selectElement.appendChild(option);
  });
}

// Show order confirmation
function showOrderConfirmation(orderData) {
  const confirmationHTML = `
    <div class="order-confirmation">
      <div class="confirmation-icon">✓</div>
      <h2>Order Confirmed!</h2>
      <p>Your order number is: <strong>${orderData.orderNumber}</strong></p>
      <p>We'll have your order ready in approximately 30-45 minutes.</p>
      <p>A confirmation email has been sent to ${sanitizeHTML(orderData.customer.email)}</p>
      <button class="btn btn-primary" onclick="window.location.href='index.html'">Back to Home</button>
    </div>
  `;

  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.innerHTML = confirmationHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Handle any resize-specific logic here
  }, 250);
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden
  } else {
    // Page is visible
    // Refresh cart UI if needed
    if (typeof cart !== 'undefined') {
      cart.updateCartUI();
    }
  }
});

// Service Worker registration (for PWA support in future)
if ('serviceWorker' in navigator) {
  // Uncomment when service worker is ready
  // navigator.serviceWorker.register('/sw.js')
  //   .then(reg => console.log('Service Worker registered'))
  //   .catch(err => console.log('Service Worker registration failed'));
}
