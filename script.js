const firebaseConfig = {
  apiKey: "AIzaSyDMMu-QNPL6RlGYdGGQVJLzZqCC_hsLa8I",
  authDomain: "night-ac2a0.firebaseapp.com",
  databaseURL: "https://night-ac2a0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "night-ac2a0",
  storageBucket: "night-ac2a0.appspot.com",
  messagingSenderId: "202751732517",
  appId: "1:202751732517:web:5d458d19aac8d7135848cc"
};

const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCategory = document.getElementById("lightbox-category");
const closeBtn = document.getElementById("lightbox-close");
const downloadBtn = document.getElementById("downloadBtn");
const scrollTopBtn = document.getElementById("scrollTopBtn");

let images = [];

function renderImages(filter = "", category = "") {
  gallery.innerHTML = "";
  const filtered = images.filter(img => {
    const matchSearch = img.title.toLowerCase().includes(filter.toLowerCase());
    const matchCategory = !category || img.category === category;
    return matchSearch && matchCategory;
  });

  filtered.forEach(({ url, title, category }) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = url;
    img.alt = title;
    img.addEventListener("click", () => openLightbox({ src: url, title, category }));

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = category;

    card.appendChild(img);
    card.appendChild(caption);
    card.appendChild(meta);
    gallery.appendChild(card);
  });
}

function openLightbox({ src, title, category }) {
  lightboxImg.src = src;
  lightboxTitle.textContent = title;
  lightboxCategory.textContent = `Category: ${category}`;
  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = title.replaceAll(" ", "_") + ".jpg";
    a.click();
  };
  lightbox.style.display = "flex";
}

closeBtn.onclick = () => (lightbox.style.display = "none");

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.style.display = "none";
});

searchInput.addEventListener("input", () => {
  renderImages(searchInput.value.trim(), categorySelect.value);
});

categorySelect.addEventListener("change", () => {
  renderImages(searchInput.value.trim(), categorySelect.value);
});

window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// جلب الصور من Firestore وتحديث المعرض تلقائيًا
db.collection("images")
  .orderBy("timestamp", "desc")
  .onSnapshot((snapshot) => {
    images = [];
    snapshot.forEach((doc) => {
      images.push(doc.data());
    });
    renderImages(searchInput.value.trim(), categorySelect.value);
  });
