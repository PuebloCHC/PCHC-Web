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

  loadAnnouncementsFromFirebase();
});

// Firebase functions

function saveAnnouncementsToFirebase() {
  const listItems = document.querySelectorAll('#announcementList li');
  const data = [];

  listItems.forEach(li => {
    const text = li.childNodes[0]?.textContent.trim(); // get only the text before the remove button
    if (text) data.push(text);
  });

  // Save to Firebase Realtime Database
  db.ref('announcements').set(data);
}

function loadAnnouncementsFromFirebase() {
  const list = document.getElementById('announcementList');
  if (!list) return;

  // Fetch from Firebase Realtime Database
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
          saveAnnouncementsToFirebase();  // Save to Firebase after removal
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
      });
    }
  });
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
    saveAnnouncementsToFirebase();  // Save to Firebase after removal
  };

  li.appendChild(removeBtn);
  list.appendChild(li);

  document.getElementById('newAnnouncement').value = '';
  saveAnnouncementsToFirebase();  // Save to Firebase
}
