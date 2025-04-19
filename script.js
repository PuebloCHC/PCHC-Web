const ADMIN_PASSWORD = "Acts2:38!";

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
  loadAnnouncementsFromStorage();

});

function saveAnnouncementsToStorage() {
    const listItems = document.querySelectorAll('#announcementList li');
    const data = [];
  
    listItems.forEach(li => {
      const text = li.childNodes[0]?.textContent.trim(); // get only the text before the remove button
      if (text) data.push(text);
    });
  
    localStorage.setItem('announcements', JSON.stringify(data));
  }
  
  function loadAnnouncementsFromStorage() {
    const stored = localStorage.getItem('announcements');
    const list = document.getElementById('announcementList');
  
    if (stored && list) {
      const data = JSON.parse(stored);
      list.innerHTML = ''; // clear current list
  
      data.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '10px';
        removeBtn.onclick = () => {
          li.remove();
          saveAnnouncementsToStorage();
        };
  
        li.appendChild(removeBtn);
        list.appendChild(li);
      });
    }
  }
  
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
      saveAnnouncementsToStorage();
    };
  
    li.appendChild(removeBtn);
    list.appendChild(li);
  
    document.getElementById('newAnnouncement').value = '';
    saveAnnouncementsToStorage();
  }
  
  <script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDoP12wQz5Rw9RamCq-v7swBZCL5zC602M",
    authDomain: "pchc-web-changes.firebaseapp.com",
    projectId: "pchc-web-changes",
    storageBucket: "pchc-web-changes.firebasestorage.app",
    messagingSenderId: "982218349771",
    appId: "1:982218349771:web:7cdc052b0e4bddb6524f4e",
    measurementId: "G-3BBDS55VMW"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>