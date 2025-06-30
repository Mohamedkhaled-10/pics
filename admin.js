import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDMMu-QNPL6RlGYdGGQVJLzZqCC_hsLa8I",
  authDomain: "night-ac2a0.firebaseapp.com",
  databaseURL: "https://night-ac2a0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "night-ac2a0",
  storageBucket: "night-ac2a0.appspot.com",
  messagingSenderId: "202751732517",
  appId: "1:202751732517:web:5d458d19aac8d7135848cc"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const form = document.getElementById("uploadForm");
const status = document.getElementById("status");
const progress = document.getElementById("progressBar");

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("imageFile").files[0];
  const title = document.getElementById("imageTitle").value.trim();
  const category = document.getElementById("imageCategory").value;

  if (!file || !title || !category) {
    showToast("❌ من فضلك اكمل كل الحقول.", "error");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `gallery/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  // متابعة التقدم
  uploadTask.on("state_changed",
    (snapshot) => {
      const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress.style.width = `${percent.toFixed(0)}%`;
      progress.textContent = `${percent.toFixed(0)}%`;
    },
    (error) => {
      console.error(error);
      showToast("❌ فشل في رفع الصورة", "error");
    },
    async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      await addDoc(collection(db, "images"), {
        src: url,
        title,
        category
      });
      progress.style.width = "0%";
      progress.textContent = "";
      form.reset();
      showToast("✅ تم رفع الصورة بنجاح!");
    }
  );
});
