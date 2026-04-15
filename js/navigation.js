// Navigation functionality
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navbarToggle = document.querySelector('.navbar-toggle');
    this.navbarMenu = document.querySelector('.navbar-menu');
    this.navbarLinks = document.querySelectorAll('.navbar-link');

    this.init();
  }

  init() {
    // Mobile menu toggle
    if (this.navbarToggle) {
      this.navbarToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking on a link
    this.navbarLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && this.navbarMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => this.handleScroll());

    // Set active link based on current page
    this.setActiveLink();

    // Smooth scroll for anchor links
    this.setupSmoothScroll();
  }

  toggleMenu() {
    this.navbarToggle.classList.toggle('active');
    this.navbarMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (this.navbarMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.navbarToggle.classList.remove('active');
    this.navbarMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    this.navbarLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Scroll to top button
class ScrollToTop {
  constructor() {
    this.button = document.querySelector('.scroll-top');
    if (this.button) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  handleScroll() {
    if (window.scrollY > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  new ScrollToTop();
});
