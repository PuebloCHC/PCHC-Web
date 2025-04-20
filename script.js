// Firebase config + init
const firebaseConfig = {
    apiKey: "AIzaSyDoP12wQz5Rw9RamCq-v7swBZCL5zC602M",
    authDomain: "pchc-web-changes.firebaseapp.com",
    databaseURL: "https://pchc-web-changes-default-rtdb.firebaseio.com/",
    projectId: "pchc-web-changes",
    storageBucket: "pchc-web-changes.appspot.com",
    messagingSenderId: "982218349771",
    appId: "1:982218349771:web:7cdc052b0e4bddb6524f4e",
    measurementId: "G-3BBDS55VMW"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const auth = firebase.auth();
  
  document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const submitLogin = document.getElementById('submitLogin');
    const loginError = document.getElementById('loginError');
    const adminControls = document.getElementById('adminControls');
    const logoutBtn = document.getElementById('logoutBtn');
  
    loginBtn.onclick = () => loginModal.style.display = 'block';
    closeModal.onclick = () => loginModal.style.display = 'none';
  
    submitLogin.onclick = () => {
      const email = document.getElementById('adminEmail').value;
      const password = document.getElementById('adminPassword').value;
  
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          loginModal.style.display = 'none';
          loginError.style.display = 'none';
        })
        .catch(error => {
          console.error("Login error:", error);
          loginError.style.display = 'block';
        });
    };
  
    logoutBtn.onclick = () => {
      auth.signOut();
    };
  
    auth.onAuthStateChanged(user => {
      if (user) {
        if (adminControls) adminControls.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
      } else {
        if (adminControls) adminControls.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
      }
    });
  
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
  
          if (auth.currentUser) {
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.marginLeft = '10px';
            removeBtn.onclick = () => {
              li.remove();
              saveAnnouncementsToFirebase();
            };
            li.appendChild(removeBtn);
          }
  
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
  