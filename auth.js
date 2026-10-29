document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-panel');
  const registerForm = document.getElementById('register-panel');
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const message = document.getElementById('auth-message');
  const serviceNotice = document.getElementById('auth-service-notice');
  const serviceDetail = document.getElementById('auth-service-detail');
  const successPanel = document.getElementById('auth-success');
  const welcomeTitle = document.getElementById('welcome-title');
  const logoutButton = document.getElementById('logout-button');

  if (!loginForm || !registerForm) return;

  function showMessage(text, isSuccess) {
    message.textContent = text;
    message.classList.toggle('success', Boolean(isSuccess));
    message.hidden = false;
  }

  function setServiceAvailable(available, detail) {
    loginForm.querySelectorAll('input, button[type="submit"]').forEach(control => {
      control.disabled = !available;
    });
    registerForm.querySelectorAll('input, button[type="submit"]').forEach(control => {
      control.disabled = !available;
    });
    serviceDetail.textContent = detail;
    serviceNotice.hidden = available;
  }

  function setMode(mode) {
    const isLogin = mode === 'login';
    loginForm.hidden = !isLogin;
    registerForm.hidden = isLogin;
    loginTab.classList.toggle('active', isLogin);
    registerTab.classList.toggle('active', !isLogin);
    loginTab.setAttribute('aria-selected', String(isLogin));
    registerTab.setAttribute('aria-selected', String(!isLogin));
    message.hidden = true;
  }

  function showSignedIn(user) {
    loginForm.hidden = true;
    registerForm.hidden = true;
    document.querySelector('.auth-tabs').hidden = true;
    message.hidden = true;
    successPanel.hidden = false;
    welcomeTitle.textContent = `Welcome, ${user.name}`;
  }

  async function request(url, options) {
    const response = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.error || 'The request could not be completed.');
      error.status = response.status;
      throw error;
    }
    return data;
  }

  async function checkAccountService() {
    if (window.location.protocol === 'file:') {
      try {
        await fetch('http://127.0.0.1:8000/api/status', {
          mode: 'no-cors',
          cache: 'no-store'
        });
        window.location.replace('http://127.0.0.1:8000/auth.html');
        return false;
      } catch (error) {
        setServiceAvailable(
          false,
          'This page was opened directly from a file, and the local server is not running. Start the server, then open the sign-in page from it.'
        );
        return false;
      }
    }

    try {
      await request('/api/status', { method: 'GET', headers: {} });
      setServiceAvailable(true, '');
      return true;
    } catch (error) {
      setServiceAvailable(
        false,
        'The page loaded, but the account server is not responding. Start or restart server.py, then open this page from the local server.'
      );
      return false;
    }
  }

  async function submitForm(form, endpoint) {
    const button = form.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(form).entries());
    button.disabled = true;
    message.hidden = true;
    let serviceLost = false;
    try {
      const data = await request(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showSignedIn(data.user);
    } catch (error) {
      if (!error.status) {
        serviceLost = true;
        setServiceAvailable(
          false,
          'The connection to the account server was lost. Start or restart server.py, then reload this page.'
        );
      } else {
        const detail = error.status === 401
          ? 'Email or password is incorrect. If you have not registered on this server yet, select Register to create your account first.'
          : error.message;
        showMessage(detail, false);
      }
    } finally {
      if (!serviceLost) button.disabled = false;
    }
  }

  loginTab.addEventListener('click', () => setMode('login'));
  registerTab.addEventListener('click', () => setMode('register'));
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    submitForm(loginForm, '/api/login');
  });
  registerForm.addEventListener('submit', event => {
    event.preventDefault();
    submitForm(registerForm, '/api/register');
  });
  logoutButton.addEventListener('click', async () => {
    try {
      await request('/api/logout', { method: 'POST', body: '{}' });
      successPanel.hidden = true;
      document.querySelector('.auth-tabs').hidden = false;
      loginForm.reset();
      registerForm.reset();
      setMode('login');
    } catch (error) {
      showMessage(error.status ? error.message : 'Unable to sign out. Please try again.', false);
    }
  });

  checkAccountService().then(available => {
    if (!available) return;
    request('/api/me', { method: 'GET', headers: {} })
      .then(data => showSignedIn(data.user))
      .catch(error => {
        if (error.status !== 401) {
          setServiceAvailable(
            false,
            'The connection to the account server was lost. Start or restart server.py, then reload this page.'
          );
        }
      });
  });
});
