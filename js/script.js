// js/script.js
import { db, auth } from './firebase-init.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  loadAnnouncements();
});

// Define global function to handle user auth state UI
window.onUserChange = function (user) {
  const adminControls = document.getElementById('adminControls');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');

  if (user) {
    if (adminControls) adminControls.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    if (adminControls) adminControls.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'inline-block';
  }

  loadAnnouncements();
};

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

function toggleDropdown(event) {
  event.preventDefault();
  const dropdown = event.target.closest('.dropdown');
  dropdown.classList.toggle('open');

  document.querySelectorAll('.dropdown').forEach(d => {
    if (d !== dropdown) d.classList.remove('open');
  });
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  }
});
