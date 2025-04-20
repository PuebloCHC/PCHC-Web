const ADMIN_PASSWORD = "Acts2:38!";

// Firebase config + init FIRST
const firebaseConfig = {
  apiKey: "AIzaSyDoP12wQz5Rw9RamCq-v7swBZCL5zC602M",
  authDomain: "pchc-web-changes.firebaseapp.com",
  projectId: "pchc-web-changes",
  storageBucket: "pchc-web-changes.firebasestorage.app",
  messagingSenderId: "982218349771",
  appId: "1:982218349771:web:7cdc052b0e4bddb6524f4e",
  measurementId: "G-3BBDS55VMW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const submitLogin = document.getElementById('submitLogin');
  const loginError = document.getElementById('loginError');
  const adminControls = document.getElementById('adminControls');

  if (loginBtn && loginModal && closeModal && submitLogin) {
    loginBtn.onclick = () => loginModal.style.display = 'block';
    closeModal.onclick = () => loginModal.style.display = 'none';
    submitLogin.onclick = () => {
      const input = document.getElementById('adminPassword').value;
      if (input === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        loginModal.style.display = 'none';
        if (adminControls) adminControls.style.display = 'block';
        if (loginError) loginError.style.display = 'none';
      } else {
        if (loginError) loginError.style.display = 'block';
      }
    };
  }

  if (localStorage.getItem('isAdmin') === 'true' && adminControls) {
    adminControls.style.display = 'block';
  }

  loadAnnouncementsFromFirebase();
});

// Save announcements to Firebase
function saveAnnouncementsToFirebase() {
  const listItems = document.querySelectorAll('#announcementList li');
  const data = [];

  listItems.forEach(li => {
    const text = li.childNodes[0]?.textContent.trim();
    if (text) data.push(text);
  });

  db.ref('announcements').set(data);
}

// Load announcements from Firebase
function loadAnnouncementsFromFirebase() {
  const list = document.getElementById('announcementList');
  if (!list) return;

  db.ref('announcements').once('value', snapshot => {
    const data = snapshot.val();
    list.innerHTML = '';

    if (Array.isArray(data)) {
      data.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '10px';
        removeBtn.onclick = () => {
          li.remove();
          saveAnnouncementsToFirebase();
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
      });
    }
  });
}

// Add a new announcement
function addAnnouncement() {
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
    saveAnnouncementsToFirebase();
  };

  li.appendChild(removeBtn);
  list.appendChild(li);

  document.getElementById('newAnnouncement').value = '';
  saveAnnouncementsToFirebase();
}
