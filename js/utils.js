// Utility functions

// Debounce function for performance optimization
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll/resize events
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Intersection Observer for scroll animations
class ScrollReveal {
  constructor(selector = '.reveal', options = {}) {
    this.elements = document.querySelectorAll(selector);
    this.options = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };

    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, this.options);

      this.elements.forEach(element => observer.observe(element));
    } else {
      // Fallback for browsers without IntersectionObserver
      this.elements.forEach(element => element.classList.add('active'));
    }
  }
}

// Lazy load images
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for browsers without native lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      this.images.forEach(img => imageObserver.observe(img));
    } else {
      // Load all images immediately if no IntersectionObserver
      this.images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }
}

// Local Storage helper
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }
};

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Format time
function formatTime(time) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(`2000-01-01T${time}`));
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Show notification
function showNotification(message, type = 'success', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} notification-enter`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '100px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '400px';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    notification.style.transition = 'all 0.3s ease-out';

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, duration);
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get query parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    ScrollReveal,
    LazyLoader,
    storage,
    formatCurrency,
    formatDate,
    formatTime,
    generateId,
    sanitizeHTML,
    showNotification,
    isInViewport,
    getQueryParams
  };
}
