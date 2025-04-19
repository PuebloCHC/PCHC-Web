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
        enableEditing?.();
      } else {
        if (loginError) loginError.style.display = 'block';
      }
    };
  }

  if (localStorage.getItem('isAdmin') === 'true' && adminControls) {
    adminControls.style.display = 'block';
    enableEditing?.();
  }
});

function addAnnouncement() {
  const list = document.getElementById('announcementList');
  const newItemText = document.getElementById('newAnnouncement').value;
  if (newItemText.trim() === "") return;

  const li = document.createElement('li');
  li.textContent = newItemText;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.style.marginLeft = '10px';
  removeBtn.onclick = () => li.remove();

  li.appendChild(removeBtn);
  list.appendChild(li);

  document.getElementById('newAnnouncement').value = '';
}

function enableEditing() {
  const items = document.querySelectorAll('#announcementList li');
  items.forEach(item => {
    if (!item.querySelector('button')) {
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.marginLeft = '10px';
      removeBtn.onclick = () => item.remove();
      item.appendChild(removeBtn);
    }
  });
}
