// js/auth.js
import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const submitLogin = document.getElementById('submitLogin');
  const loginError = document.getElementById('loginError');

  if (loginBtn) loginBtn.onclick = () => loginModal.style.display = 'block';
  if (closeModal) closeModal.onclick = () => loginModal.style.display = 'none';

  if (submitLogin) {
    submitLogin.onclick = () => {
      const email = document.getElementById('adminEmail').value;
      const password = document.getElementById('adminPassword').value;
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          loginModal.style.display = 'none';
          loginError.style.display = 'none';
        })
        .catch(() => {
          loginError.style.display = 'block';
        });
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      signOut(auth).then(() => window.location.reload());
    };
  }

  // Delegating user state handling to script.js
  onAuthStateChanged(auth, user => {
    if (typeof window.onUserChange === 'function') {
      window.onUserChange(user);
    }
  });
});
