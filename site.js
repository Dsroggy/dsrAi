import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWpp-y0OQ0RfT3ghf5zCnZGWgIzhUbudU",
  authDomain: "dsr-super-admin.firebaseapp.com",
  projectId: "dsr-super-admin",
  appId: "1:494683172524:web:c7d40a4456d574fc187909"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 REALTIME LISTENER
onSnapshot(doc(db, "siteContent", "homepage"), (snap) => {
  if (snap.exists()) {
    document.getElementById("title").innerText = snap.data().title;
    document.getElementById("subtitle").innerText = snap.data().subtitle;
  }
});
