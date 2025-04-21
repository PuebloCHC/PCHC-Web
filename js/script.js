// js/script.js
import { db, auth } from './firebase-init.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  loadAnnouncements();
  loadVideo();
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

  loadAnnouncements(user); // <--- pass the user explicitly
};


// Load announcements from Firebase
function loadAnnouncements(user = null) {
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

        if (user) {
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

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.dropdown-toggle');
  const dropdown = toggle.closest('.dropdown');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });
});
function loadVideo() {
  const videoFrame = document.getElementById("videoFrame");
  if (!videoFrame) return;

  const videoRef = ref(db, "video/current");
  get(videoRef).then(snapshot => {
    const fullUrl = snapshot.val();
    if (fullUrl) {
      const embedUrl = convertToEmbedUrl(fullUrl);
      if (embedUrl) {
        videoFrame.src = embedUrl;
      }
    }
  });
}

window.updateVideo = function () {
  const input = document.getElementById("videoLinkInput");
  if (!input) return;

  const fullUrl = input.value.trim();
  if (fullUrl && fullUrl.includes("youtube.com") || fullUrl.includes("youtu.be")) {
    const videoRef = ref(db, "video/current");
    set(videoRef, fullUrl)
      .then(() => alert("Video updated!"))
      .catch(err => console.error("Failed to update video:", err));
  } else {
    alert("Please enter a valid YouTube URL.");
  }
};
function convertToEmbedUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // Handle standard YouTube links
    if (hostname.includes("youtube.com") && parsedUrl.searchParams.has("v")) {
      const videoId = parsedUrl.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle shortened youtu.be links
    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null; // Not a valid YouTube video URL
  } catch (e) {
    console.error("Invalid URL:", url);
    return null;
  }
}