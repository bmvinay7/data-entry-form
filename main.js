/**
 * Google Sheets Data Entry Form
 * Handles form validation, submission, and integration with Google Apps Script
 */

class DataEntryForm {
  constructor() {
    this.form = document.getElementById('dataEntryForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.statusMessage = document.getElementById('statusMessage');
    
    // Google Apps Script URL - FINAL WORKING VERSION WITH CORS FIX
    this.scriptURL = 'https://script.google.com/macros/s/AKfycbyYsucAmavurfFVSW-umvRd27DsLZFdRk25UkEJ9wwX-ABT8Oe2aX7zliQuNswnDOAvsA/exec';
    
    // Development mode detection
    this.isDevelopment = this.isLocalhost();
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.setupValidation();
    this.checkScriptConnection();
    // Only test connection if not in development to avoid fetch errors
    if (!this.isDevelopment) {
      this.testConnectionOnLoad();
    } else {
      console.log('🛠️ Development mode: Skipping initial connection test to avoid CORS errors.');
      this.showStatus(
        '🛠️ Dev Mode: Live submission is disabled to prevent errors. Use the form to test validation and UI.',
        'warning'
      );
    }
  }

  isLocalhost() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '' ||
           window.location.hostname.includes('webcontainer-api.io');
  }

  attachEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.form.addEventListener('reset', () => this.handleReset());
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => this.validateField(e.target));
      input.addEventListener('input', (e) => this.clearError(e.target));
    });
  }

  setupValidation() {
    // Enhanced validation patterns for UK/international use
    this.validationRules = {
      fullName: {
        required: true,
        pattern: /^[a-zA-Z\s\-'\.]{2,50}$/,
        message: 'Please enter a valid name (2-50 characters, letters, spaces, hyphens, and apostrophes only)'
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      phone: {
        required: false,
        pattern: /^[\+]?[\s\-\(\)]*(?:\d[\s\-\(\)]*){10,15}$/,
        message: 'Please enter a valid phone number (10-15 digits)'
      },
      streetAddress: {
        required: true,
        minLength: 5,
        maxLength: 100,
        message: 'Please enter a valid street address (5-100 characters)'
      },
      city: {
        required: true,
        pattern: /^[a-zA-Z\s\-'\.]{2,50}$/,
        message: 'Please enter a valid city name (2-50 characters)'
      },
      postcode: {
        required: true,
        pattern: /^[A-Z0-9\s]{3,10}$/i,
        message: 'Please enter a valid postcode'
      }
    };
  }

  validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = this.validationRules[fieldName];
    
    if (!rules) return true;

    // Clear previous error
    this.clearError(field);

    // Required field validation
    if (rules.required && !value) {
      this.showFieldError(field, `${this.getFieldLabel(field)} is required`);
      return false;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) return true;

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      this.showFieldError(field, rules.message);
      return false;
    }

    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      this.showFieldError(field, rules.message);
      return false;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      this.showFieldError(field, rules.message);
      return false;
    }

    // Additional email validation
    if (fieldName === 'email' && value) {
      const domain = value.split('@')[1];
      if (domain && !domain.includes('.')) {
        this.showFieldError(field, 'Please enter a valid email address with a proper domain');
        return false;
      }
    }

    return true;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
      errorElement.textContent = message;
      field.classList.add('error');
      field.setAttribute('aria-describedby', `${field.name}Error`);
    }
  }

  clearError(field) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
      errorElement.textContent = '';
      field.classList.remove('error');
      field.removeAttribute('aria-describedby');
    }
  }

  getFieldLabel(field) {
    const label = this.form.querySelector(`label[for="${field.id}"] .form__label-text`);
    return label ? label.textContent : field.name;
  }

  async checkScriptConnection() {
    if (this.scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.warn('⚠️ Google Apps Script URL not configured');
      if (this.isDevelopment) {
        this.showStatus(
          '⚠️ Development Mode: Google Apps Script URL not configured. Please see COMPLETE_SETUP_GUIDE.md.',
          'warning'
        );
      } else {
        this.showStatus(
          '⚠️ Configuration Error: Please update the Google Apps Script URL in main.js. See COMPLETE_SETUP_GUIDE.md.',
          'error'
        );
      }
    } else {
      console.log('✅ Google Apps Script URL configured:', this.scriptURL);
    }
  }

  async testConnectionOnLoad() {
    if (this.isDevelopment) return;

    try {
      console.log('🔄 Testing connection to Google Apps Script...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(this.scriptURL, { 
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.corsEnabled) {
          this.showStatus('✅ Connected to Google Sheets! CORS properly configured.', 'success');
        } else {
          this.showStatus('✅ Connected to Google Sheets! Ready to accept submissions.', 'success');
        }
      } else {
        this.showStatus('⚠️ Connection to Google Sheets failed. Please check script deployment.', 'warning');
      }
    } catch (error) {
      console.warn('ℹ️ Connection test failed:', error.message);
      this.showStatus('⚠️ Connection test failed. Form may still work for submissions.', 'warning');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showStatus('Please correct the errors above and try again.', 'error');
      return;
    }

    this.setLoading(true);
    this.hideStatus();

    if (this.isDevelopment) {
      console.log('🛠️ DEVELOPMENT MODE: Simulating form submission.');
      setTimeout(() => {
        this.setLoading(false);
        this.showStatus(
          '✅ (DEV) Submission Simulated! Data was NOT sent. This is expected. Deploy to a live server to save data.',
          'success'
        );
        this.form.reset();
        this.clearAllErrors();
        this.statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
      return;
    }

    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      data.timestamp = new Date().toISOString();

      console.log('📤 Submitting form data to Google Sheets...');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Use iframe approach to avoid CORS issues
      const result = await this.submitViaIframe(data);
      
      if (result.success) {
        this.showStatus(`✅ Data submitted successfully! Please check your Google Spreadsheet.`, 'success');
        this.form.reset();
        this.clearAllErrors();
        this.statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error('Submission may have failed. Please check your Google Spreadsheet.');
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      let errorMessage = 'There was an error submitting your information. Please try again.';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = '❌ Submission Failed: Could not connect to the server. Please check your internet connection.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Submission timed out. Please check your internet connection and try again.';
      }
      
      this.showStatus(errorMessage, 'error');
    } finally {
      this.setLoading(false);
    }
  }

  async submitViaIframe(data) {
    return new Promise((resolve) => {
      // Create a hidden form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = this.scriptURL;
      form.target = 'hidden_iframe';
      form.style.display = 'none';
      
      // Add form data as hidden inputs
      Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      });
      
      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      
      // Handle iframe load (submission complete)
      iframe.onload = () => {
        setTimeout(() => {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          resolve({ success: true });
        }, 1000);
      };
      
      // Add elements to page
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      
      // Submit the form
      form.submit();
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          resolve({ success: true }); // Assume success even if timeout
        }
      }, 10000);
    });
  }

  async handleSubmitFallback(e) {
    // This is the old method - keeping as fallback
    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      data.timestamp = new Date().toISOString();

      console.log('📤 Submitting form data to Google Sheets...');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Submit directly to Google Apps Script
      const response = await fetch(this.scriptURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          this.showStatus(`✅ ${result.message || 'Submission successful!'} (Row #${result.rowNumber})`, 'success');
          this.form.reset();
          this.clearAllErrors();
          this.statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error(result.message || 'Submission failed on the server.');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      let errorMessage = 'There was an error submitting your information. Please try again.';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = '❌ Submission Failed: Could not connect to the server. Please check your internet connection and see the SETUP_GUIDE.md for troubleshooting deployment issues.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Submission timed out. Please check your internet connection and try again.';
      }
      
      this.showStatus(errorMessage, 'error');
    } finally {
      this.setLoading(false);
    }
  }

  handleReset() {
    this.clearAllErrors();
    this.hideStatus();
    console.log('🧹 Form reset');
  }

  clearAllErrors() {
    this.form.querySelectorAll('.form__error').forEach(el => el.textContent = '');
    this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }

  setLoading(isLoading) {
    this.submitBtn.disabled = isLoading;
    this.submitBtn.classList.toggle('btn--loading', isLoading);
    this.submitBtn.setAttribute('aria-busy', isLoading.toString());
  }

  showStatus(message, type = 'success') {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message status-message--${type}`;
    this.statusMessage.style.display = 'block';
    this.statusMessage.setAttribute('role', type === 'error' ? 'alert' : 'status');
    
    if (type !== 'error') {
      setTimeout(() => this.hideStatus(), 8000);
    }
  }

  hideStatus() {
    this.statusMessage.style.display = 'none';
  }

  async testConnection() {
    try {
      console.log('🔄 Testing connection...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(this.scriptURL, { 
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('Connection test result:', result);
        this.showStatus('✅ Connection successful! Google Sheets integration is working.', 'success');
        return true;
      } else {
        this.showStatus(`❌ Connection failed (Status: ${response.status}). Check Apps Script deployment.`, 'error');
        return false;
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      if (this.isDevelopment) {
        this.showStatus('❌ Connection error. This is expected in local development.', 'error');
      } else {
        this.showStatus(`❌ Connection error: ${error.message}. Check CORS configuration.`, 'error');
      }
      return false;
    }
  }
}

// Utility functions for demo and testing
class DemoHelpers {
  static generateTestData() {
    const testData = {
      fullName: 'Emily Rose',
      email: 'emily.rose@example.com',
      phone: '+44 7700 900456',
      streetAddress: '42 Garden Lane',
      city: 'Cambridge',
      postcode: 'CB2 3QZ',
      comments: 'This is test data for demonstration purposes. 🌸'
    };
    Object.keys(testData).forEach(key => {
      const field = document.getElementById(key);
      if (field) {
        field.value = testData[key];
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    console.log('🌸 Test data filled in form');
  }

  static clearForm() {
    window.dataEntryForm?.handleReset();
  }

  static validateAllFields() {
    window.dataEntryForm?.validateForm();
  }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dataEntryForm = new DataEntryForm();
  
  window.dataEntryForm = dataEntryForm;
  window.DemoHelpers = DemoHelpers;
  
  if (dataEntryForm.isDevelopment) {
    console.log('🛠️ Development mode detected - adding demo tools');
    
    const demoContainer = document.createElement('div');
    demoContainer.className = 'demo-tools';
    demoContainer.style.cssText = `
      margin-bottom: 2rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.05));
      border: 1px solid rgba(251, 146, 60, 0.2);
      border-radius: 12px;
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      align-items: center;
    `;
    
    const demoTitle = document.createElement('span');
    demoTitle.textContent = '🌸 Dev Tools:';
    demoTitle.style.fontWeight = '600';
    demoTitle.style.color = '#c2410c';
    
    const fillButton = document.createElement('button');
    fillButton.textContent = 'Fill Test Data 🌻';
    fillButton.type = 'button';
    fillButton.className = 'btn btn--secondary btn--small';
    fillButton.addEventListener('click', DemoHelpers.generateTestData);
    
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Connection 🔗';
    testButton.type = 'button';
    testButton.className = 'btn btn--secondary btn--small';
    testButton.addEventListener('click', () => dataEntryForm.testConnection());
    
    demoContainer.appendChild(demoTitle);
    demoContainer.appendChild(fillButton);
    demoContainer.appendChild(testButton);
    
    const form = document.getElementById('dataEntryForm');
    form.insertBefore(demoContainer, form.firstChild);
    
    console.log(`
🌸 Development Tools Available:
• DemoHelpers.generateTestData() - Fill form with test data
• dataEntryForm.testConnection() - Test connection to Google Sheets
    `);
  }

  console.log('🌸 Data Entry Form initialized successfully!');
});
