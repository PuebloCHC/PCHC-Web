// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoP12wQz5Rw9RamCq-v7swBZCL5zC602M",
  authDomain: "pchc-web-changes.firebaseapp.com",
  databaseURL: "https://pchc-web-changes-default-rtdb.firebaseio.com",
  projectId: "pchc-web-changes",
  storageBucket: "pchc-web-changes.appspot.com",
  messagingSenderId: "982218349771",
  appId: "1:982218349771:web:7cdc052b0e4bddb6524f4e",
  measurementId: "G-3BBDS55VMW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
