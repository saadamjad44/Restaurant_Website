// Form validation and handling
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;

    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.submitForm();
    } else {
      // Focus on first error
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.focus();
      }
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    this.clearError(field);

    // Required validation
    if (required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (isValid && type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (isValid && type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Number validation
    if (isValid && type === 'number' && value) {
      const min = field.getAttribute('min');
      const max = field.getAttribute('max');

      if (min && parseFloat(value) < parseFloat(min)) {
        isValid = false;
        errorMessage = `Value must be at least ${min}`;
      }

      if (max && parseFloat(value) > parseFloat(max)) {
        isValid = false;
        errorMessage = `Value must be at most ${max}`;
      }
    }

    // Date validation (no past dates for reservations)
    if (isValid && type === 'date' && value && field.classList.contains('no-past-dates')) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        isValid = false;
        errorMessage = 'Please select a future date';
      }
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    }

    return isValid;
  }

  showError(field, message) {
    field.classList.add('error');

    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');

    field.parentElement.appendChild(errorElement);
  }

  clearError(field) {
    field.classList.remove('error');

    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  async submitForm() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Submitting...';

    try {
      // Get form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Simulate API call (replace with actual API endpoint)
      await this.sendFormData(data);

      // Show success message
      this.showSuccess();

      // Reset form
      this.form.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('An error occurred. Please try again.', 'error');
    } finally {
      // Restore button state
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  async sendFormData(data) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data:', data);
        resolve();
      }, 1500);
    });

    // Real implementation would be:
    // const response = await fetch('/api/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
  }

  showSuccess() {
    const successMessage = this.form.dataset.successMessage || 'Form submitted successfully!';
    showNotification(successMessage, 'success');

    // Scroll to top of form
    this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Phone number formatting
function formatPhoneNumber(input) {
  const value = input.value.replace(/\D/g, '');
  let formatted = '';

  if (value.length > 0) {
    formatted = '(' + value.substring(0, 3);
  }
  if (value.length >= 4) {
    formatted += ') ' + value.substring(3, 6);
  }
  if (value.length >= 7) {
    formatted += '-' + value.substring(6, 10);
  }

  input.value = formatted;
}

// Setup phone formatting
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', () => formatPhoneNumber(input));
  });
});
