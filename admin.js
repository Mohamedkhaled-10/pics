const form = document.getElementById("uploadForm");
const progressBar = document.getElementById("progressBar");

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

// عدّل هنا بياناتك
const CLOUD_NAME = "dogk78w9z"; // غيره بـ cloud name بتاعك
const UPLOAD_PRESET = "unsigned_preset"; // غيره باسم الـ preset اللي عملته

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("imageFile");
  const titleInput = document.getElementById("imageTitle");
  const categorySelect = document.getElementById("imageCategory");

  if (!fileInput.files.length || !titleInput.value.trim() || !categorySelect.value) {
    showToast("❌ من فضلك اكمل كل الحقول.", "error");
    return;
  }

  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const category = categorySelect.value;

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = percent + "%";
        progressBar.textContent = percent + "%";
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        progressBar.style.width = "0%";
        progressBar.textContent = "";

        showToast("✅ تم رفع الصورة بنجاح!");

        console.log("رابط الصورة في Cloudinary:", response.secure_url);

        // هنا تقدر تخزن response.secure_url + title + category في قاعدة بياناتك

        form.reset();
      } else {
        showToast("❌ فشل رفع الصورة، حاول مرة أخرى.", "error");
      }
    };

    xhr.onerror = () => {
      showToast("❌ حدث خطأ أثناء رفع الصورة.", "error");
    };

    xhr.send(formData);

  } catch (err) {
    console.error(err);
    showToast("❌ حدث خطأ غير متوقع.", "error");
  }
});
