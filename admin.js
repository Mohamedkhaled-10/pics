// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMMu-QNPL6RlGYdGGQVJLzZqCC_hsLa8I",
  authDomain: "night-ac2a0.firebaseapp.com",
  databaseURL: "https://night-ac2a0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "night-ac2a0",
  storageBucket: "night-ac2a0.appspot.com",
  messagingSenderId: "202751732517",
  appId: "1:202751732517:web:5d458d19aac8d7135848cc"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = firebase.firestore();

const form = document.getElementById("uploadForm");
const status = document.getElementById("status");
const progress = document.getElementById("progressBar");

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
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
  const storageRef = storage.ref(`gallery/${fileName}`);
  const uploadTask = storageRef.put(file);

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
      const url = await uploadTask.snapshot.ref.getDownloadURL();
      await db.collection("images").add({ src: url, title, category });

      progress.style.width = "0%";
      progress.textContent = "";
      form.reset();
      showToast("✅ تم رفع الصورة بنجاح!");
    }
  );
});
