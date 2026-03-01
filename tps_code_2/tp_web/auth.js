const MOCK_CREDENTIALS = [
  { email: 'eve.holt@reqres.in',  password: 'cityslicka' },
  { email: 'admin@demo.com',      password: 'password123' },
  { email: 'user@test.com',       password: 'test1234' },
];

const TOKEN_KEY   = 'auth_token';
const USER_KEY    = 'auth_user';
const DASHBOARD   = 'dashboard.html';
const LOGIN_PAGE  = 'index.html';

function saveSession(token, email) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, email);
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  return localStorage.getItem(USER_KEY) || '';
}

function requireAuth() {
  if (!getToken()) {
    window.location.replace(LOGIN_PAGE);
  }
}

function logout() {
  clearSession();
  window.location.replace(LOGIN_PAGE);
}

function setFieldError(inputEl, message) {
  const errorEl = inputEl.parentElement.querySelector('.field-error');
  if (!errorEl) return;

  if (message) {
    inputEl.classList.add('invalid');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  } else {
    inputEl.classList.remove('invalid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateLoginForm(emailInput, passwordInput) {
  let valid = true;

  setFieldError(emailInput, '');
  setFieldError(passwordInput, '');

  if (!emailInput.value.trim()) {
    setFieldError(emailInput, 'Email is required.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, 'Please enter a valid email address.');
    valid = false;
  }

  if (!passwordInput.value) {
    setFieldError(passwordInput, 'Password is required.');
    valid = false;
  } else if (passwordInput.value.length < 4) {
    setFieldError(passwordInput, 'Password must be at least 4 characters.');
    valid = false;
  }

  return valid;
}

function showAlert(containerEl, type, message) {
  const icons = {
    success: `<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>`,
    error:   `<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
              </svg>`,
    warning: `<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948
                     3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                     3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
              </svg>`,
  };

  containerEl.innerHTML = `
    <div class="alert alert-${type}">
      ${icons[type] || ''}
      <span>${message}</span>
    </div>`;

  if (type === 'success') {
    setTimeout(() => { containerEl.innerHTML = ''; }, 4000);
  }
}

function setButtonLoading(btn, loading, originalText) {
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-inline"></span> Signing in…`;
  } else {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const form         = event.target;
  const emailInput   = form.querySelector('#email');
  const passwordInput= form.querySelector('#password');
  const submitBtn    = form.querySelector('#login-btn');
  const alertBox     = document.getElementById('login-alert');

  if (!validateLoginForm(emailInput, passwordInput)) return;

  const btnOriginalText = submitBtn.textContent;
  setButtonLoading(submitBtn, true, btnOriginalText);
  alertBox.innerHTML = '';

  try {
    await new Promise(resolve => setTimeout(resolve, 600));

    const email    = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const account = MOCK_CREDENTIALS.find(
      c => c.email.toLowerCase() === email && c.password === password
    );

    if (account) {
      const fakeToken = btoa(`${email}:${Date.now()}`);

      saveSession(fakeToken, account.email);
      showAlert(alertBox, 'success', 'Login successful! Redirecting…');

      setTimeout(() => {
        window.location.href = DASHBOARD;
      }, 800);
    } else {
      showAlert(alertBox, 'error', 'Invalid email or password. Please try again.');
      setButtonLoading(submitBtn, false, btnOriginalText);
    }

  } catch (err) {
    console.error('Login error:', err);
    showAlert(alertBox, 'error', 'An unexpected error occurred. Please try again.');
    setButtonLoading(submitBtn, false, btnOriginalText);
  }
}

function redirectIfAuthenticated() {
  if (getToken()) {
    window.location.replace(DASHBOARD);
  }
}
