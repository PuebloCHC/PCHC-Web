const ADMIN_USERNAME = "admin";
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
      const username = document.getElementById('adminUsername').value;
      const password = document.getElementById('adminPassword').value;
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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
    if (text) data.push({ announcement: text });
  });

  // Save the array of announcements to Firebase
  db.ref('announcements').set(data)
    .then(() => {
      console.log('Announcements saved successfully');
    })
    .catch(error => {
      console.error('Error saving announcements: ', error);
    });
}

// Load announcements from Firebase
function loadAnnouncementsFromFirebase() {
  const list = document.getElementById('announcementList');
  if (!list) return;

  db.ref('announcements').once('value', snapshot => {
    const data = snapshot.val();
    list.innerHTML = '';

    if (Array.isArray(data)) {
      data.forEach(announcementObj => {
        const li = document.createElement('li');
        li.textContent = announcementObj.announcement;

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

  // Clear the text input field
  document.getElementById('newAnnouncement').value = '';
  saveAnnouncementsToFirebase();
}
