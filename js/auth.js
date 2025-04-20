import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const submitLogin = document.getElementById('submitLogin');
  const loginError = document.getElementById('loginError');
  const adminControls = document.getElementById('adminControls');

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
      signOut(auth);
    };
  }

  onAuthStateChanged(auth, user => {
    if (user) {
      if (adminControls) adminControls.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      if (loginBtn) loginBtn.style.display = 'none';
    } else {
      if (adminControls) adminControls.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'inline-block';
    }
  });
});
