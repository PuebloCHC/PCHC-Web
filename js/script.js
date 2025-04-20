import { db, auth } from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const submitLogin = document.getElementById('submitLogin');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginError = document.getElementById('loginError');
  const adminControls = document.getElementById('adminControls');
  const announcementList = document.getElementById('announcementList');

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
      signOut(auth).then(() => {
        window.location.reload();
      });
    };
  }

  // Check auth state
  onAuthStateChanged(auth, (user) => {
    if (user && adminControls) {
      adminControls.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
      if (adminControls) adminControls.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
    loadAnnouncements();
  });
});

// Load announcements from Firebase
function loadAnnouncements() {
  const list = document.getElementById('announcementList');
  if (!list) return;

  const dbRef = ref(db, 'announcements');
  get(dbRef).then(snapshot => {
    const data = snapshot.val();
    list.innerHTML = '';

    if (Array.isArray(data)) {
      data.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;

        if (auth.currentUser) {
          const removeBtn = document.createElement('button');
          removeBtn.textContent = 'Remove';
          removeBtn.style.marginLeft = '10px';
          removeBtn.onclick = () => {
            li.remove();
            saveAnnouncements();
          };
          li.appendChild(removeBtn);
        }

        list.appendChild(li);
      });
    }
  });
}

// Save announcements to Firebase
function saveAnnouncements() {
  const listItems = document.querySelectorAll('#announcementList li');
  const data = [];

  listItems.forEach(li => {
    const text = li.firstChild?.textContent.trim();
    if (text) data.push(text);
  });

  const dbRef = ref(db, 'announcements');
  set(dbRef, data);
}

// Add a new announcement
window.addAnnouncement = function () {
  const list = document.getElementById('announcementList');
  const newItemText = document.getElementById('newAnnouncement').value;
  if (newItemText.trim() === "") return;

  const li = document.createElement('li');
  li.textContent = newItemText;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.style.marginLeft = '10px';
  removeBtn.onclick = () => {
    li.remove();
    saveAnnouncements();
  };

  li.appendChild(removeBtn);
  list.appendChild(li);

  document.getElementById('newAnnouncement').value = '';
  saveAnnouncements();
};
