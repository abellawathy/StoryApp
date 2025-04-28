import AddStoryModel from "../../data/addstory-model.js";
import { showLoading, hideLoading, showToast } from "../../utils/ui-helper.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { sendPushMessage } from "../../utils/push-helper.js";

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.map = null;
    this.marker = null;
    this.selectedLocation = null;
  }

  initMap() {
    const mapContainer = document.querySelector("#map");

    const defaultLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    );

    const darkLayer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; CartoDB",
      }
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "&copy; Esri",
      }
    );

    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.map = L.map(mapContainer, {
      center: [-2.5489, 118.0149],
      zoom: 5,
      layers: [defaultLayer],
    });

    const baseLayers = {
      Default: defaultLayer,
      "Dark Mode": darkLayer,
      Satellite: satelliteLayer,
    };

    L.control.layers(baseLayers).addTo(this.map);

    this.map.on("click", (event) => {
      this.selectedLocation = event.latlng;
      if (this.marker) this.map.removeLayer(this.marker);

      this.marker = L.marker(this.selectedLocation, { icon: customIcon })
        .addTo(this.map)
        .bindPopup("Lokasi dipilih! 📍")
        .openPopup();
    });
  }

  bindForm() {
    const form = document.querySelector("#add-story-form");
    const openCameraBtn = document.querySelector("#open-camera-btn");
    const videoPreview = document.querySelector("#camera-preview");
    const fileInputElement = document.querySelector("#story-photo");
    const previewImage = document.querySelector("#photo-preview");
    const clearPhotoBtn = document.querySelector("#clear-photo-btn");
    const clearLocationBtn = document.querySelector("#clear-location-btn");
    const closeCameraBtn = document.querySelector("#close-camera-btn");
    const cameraContainer = document.querySelector(".camera-container");

    let stream;
    let photoBlob;

    const stopCamera = () => {
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((track) => track.stop());
      }
      stream = null;
      videoPreview.srcObject = null;
      cameraContainer.style.display = "none";
    };

    // ========== Preview saat file diunggah ==========
    fileInputElement.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        previewImage.src = url;
        previewImage.style.display = "block";
        photoBlob = null;
        stopCamera();

        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          stream = null;
          videoPreview.srcObject = null;
          cameraContainer.style.display = "none";
        }
      }
    });

    // ========== Preview saat ambil dari kamera ==========
    openCameraBtn.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoPreview.srcObject = stream;
        videoPreview.style.display = "block";
        cameraContainer.style.display = "block";

        showToast("Ketuk sekali di video untuk ambil gambar", "info");

        videoPreview.addEventListener(
          "click",
          () => {
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);

            imageCapture.takePhoto().then((blob) => {
              photoBlob = blob;
              showToast("Foto berhasil diambil dari kamera!");

              stopCamera();

              // Tampilkan preview dari kamera
              const reader = new FileReader();
              reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.style.display = "block";
              };
              reader.readAsDataURL(blob);
            });
          },
          { once: true }
        );
      } catch (err) {
        showToast("Gagal membuka kamera", "error");
      }
    });

    closeCameraBtn.addEventListener("click", () => {
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((track) => track.stop());
      }

      stream = null;
      videoPreview.srcObject = null;
      cameraContainer.style.display = "none";
      showToast("Kamera dimatikan.");
    });

    // ========== Submit Form ==========
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.querySelector("#story-name").value.trim();
      const desc = document.querySelector("#story-description").value.trim();
      const fileInput = fileInputElement.files[0];
      const photo = photoBlob || fileInput;

      if (!this.selectedLocation) {
        showToast("Silakan pilih lokasi di peta!", "warning");
        return;
      }

      if (!title || !desc || !photo) {
        showToast("Semua kolom wajib diisi!", "warning");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(photo.type)) {
        showToast("Format foto tidak didukung!", "warning");
        return;
      }

      const description = `${title}\n\n${desc}`;
      const formData = new FormData();
      formData.append("description", description);
      formData.append("lat", this.selectedLocation.lat);
      formData.append("lon", this.selectedLocation.lng);
      formData.append("photo", photo);

      try {
        showLoading();
        const result = await AddStoryModel.uploadStory(
          formData,
          localStorage.getItem("token")
        );
        hideLoading();

        await sendPushMessage({
          title: 'Cerita Baru!',
          message: 'Ada cerita baru yang baru saja ditambahkan. Yuk cek!',
        });

        showToast("Cerita berhasil ditambahkan!");
        window.location.hash = "#/";
        setTimeout(() => window.location.reload(), 300);

      } catch (error) {
        hideLoading();
        console.error("Error:", error);
        showToast(
          error.message || "Terjadi kesalahan saat mengirim cerita.",
          "error"
        );
      }
    });

    // ======= Hapus Gambar =======
    clearPhotoBtn.addEventListener("click", () => {
      previewImage.src = "";
      previewImage.style.display = "none";
      fileInputElement.value = "";
      photoBlob = null;

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
        videoPreview.srcObject = null;
        cameraContainer.style.display = "none";
      }

      showToast("Gambar berhasil dihapus.");
    });

    // ======= Hapus Lokasi =======
    clearLocationBtn.addEventListener("click", () => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
        this.selectedLocation = null;
        showToast("Lokasi berhasil dihapus.");
      }
    });
  }

  run() {
    this.initMap();
    this.bindForm();
  }
}

export default AddStoryPresenter;
