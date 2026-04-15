// Gallery and Lightbox functionality
class Gallery {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.lightbox = null;
    this.init();
  }

  init() {
    this.createLightbox();
    this.setupGallery();
    this.setupFilters();
  }

  createLightbox() {
    const lightboxHTML = `
      <div class="modal" id="lightbox" role="dialog" aria-modal="true" aria-label="Image lightbox">
        <div class="modal-backdrop"></div>
        <div class="lightbox-content">
          <button class="modal-close" aria-label="Close lightbox">&times;</button>
          <button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>
          <img src="" alt="" class="lightbox-image">
          <button class="lightbox-next" aria-label="Next image">&rsaquo;</button>
          <div class="lightbox-counter"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    this.lightbox = document.getElementById('lightbox');

    this.setupLightboxEvents();
  }

  setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        this.images.push({
          src: img.src,
          alt: img.alt,
          category: item.dataset.category || 'all'
        });

        item.addEventListener('click', () => {
          this.openLightbox(index);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openLightbox(index);
          }
        });
      }
    });
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter gallery items
        this.filterGallery(filter);
      });
    });
  }

  filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
      const itemCategory = item.dataset.category || 'all';

      if (category === 'all' || itemCategory === category) {
        item.style.display = '';
        item.classList.add('animate-fade-in');
      } else {
        item.style.display = 'none';
      }
    });
  }

  setupLightboxEvents() {
    // Close button
    const closeBtn = this.lightbox.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.closeLightbox());

    // Backdrop click
    const backdrop = this.lightbox.querySelector('.modal-backdrop');
    backdrop.addEventListener('click', () => this.closeLightbox());

    // Navigation buttons
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');

    prevBtn.addEventListener('click', () => this.showPrevious());
    nextBtn.addEventListener('click', () => this.showNext());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;

      switch(e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.showPrevious();
          break;
        case 'ArrowRight':
          this.showNext();
          break;
      }
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus trap
    const closeBtn = this.lightbox.querySelector('.modal-close');
    closeBtn.focus();
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateLightboxImage();
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const image = this.images[this.currentIndex];
    const lightboxImage = this.lightbox.querySelector('.lightbox-image');
    const counter = this.lightbox.querySelector('.lightbox-counter');

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.gallery-item')) {
    new Gallery();
  }
});
