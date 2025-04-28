import { showLoading, hideLoading, showToast } from "../../utils/ui-helper.js";
import { getStoryDetail } from "../../data/api.js";
import { generateStoryDetailTemplate } from "../../template.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { sendPushMessage } from "../../utils/push-helper.js";

const DetailPagePresenter = {
  async init({ id, container }) {
    try {
      showLoading();
      console.log(`Memuat detail cerita dengan ID: ${id}`);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Token tidak ditemukan. Silakan login terlebih dahulu."
        );
      }

      const story = await getStoryDetail(id);
      if (!story) {
        throw new Error("Cerita tidak ditemukan.");
      }
      
      console.log("Data cerita:", story);

      this._renderDetail(container, story);
      this._initCommentForm(container);
    } catch (error) {
      console.error("Gagal memuat detail cerita:", error);
      showToast(`Gagal memuat detail cerita: ${error.message}`, "error");
    } finally {
      hideLoading();
    }
  },

  _renderDetail(container, story) {
    const imageUrl = story.photoUrl || "default-image-url.jpg";

    container.innerHTML = generateStoryDetailTemplate({
      title: story.name,
      description: story.description,
      authorName: story.name,
      createdAt: story.createdAt,
      imageUrl: imageUrl,
      storyLocation: (story.lat && story.lon) ? "Lokasi tersedia" : "Lokasi tidak tersedia",
    });

    this._renderMap(container, story);
  },

  _renderMap(container, story) {
    const mapContainer = container.querySelector("#map");
  
    if (!story.lat || !story.lon) {
      console.error("Lokasi cerita tidak tersedia.");
      if (mapContainer) {
        mapContainer.innerHTML = "<p>Peta tidak tersedia untuk cerita ini.</p>";
      }
      return;
    }
  
    if (!mapContainer) {
      console.error("Element #map tidak ditemukan di dalam container.");
      return;
    }
  
    mapContainer.style.height = "400px";
  
    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  
    const map = L.map(mapContainer).setView([story.lat, story.lon], 13);
  
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
  
    defaultLayer.addTo(map);
  
    const baseLayers = {
      Default: defaultLayer,
      "Dark Mode": darkLayer,
      Satellite: satelliteLayer,
    };
  
    L.control.layers(baseLayers).addTo(map);
  
    L.marker([story.lat, story.lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${story.name}</b><br>${story.description}`);
  },

  async _initCommentForm(container) {
    const form = container.querySelector("#comments-list-form");
    const commentsListContainer = container.querySelector("#story-detail-comments-list");
    const name = localStorage.getItem("name") || "Pengguna Anonim";;

    if (!form) {
      console.error("Form komentar tidak ditemukan.");
      return;
    }
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const textarea = form.querySelector("textarea[name='body']");
      const commentText = textarea.value.trim();
  
      if (commentText.length === 0) {
        showToast("Komentar tidak boleh kosong.", "warning");
        return;
      }
  
      const newCommentElement = document.createElement("div");
      newCommentElement.classList.add("comment-item");
      newCommentElement.innerHTML = `
        <article tabindex="0" class="comment-item">
          <svg class="comment-item-photo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.472 0 
                  4.765.672 6.879 1.804M15 11a3 3 0 
                  10-6 0 3 3 0 006 0z" />
          </svg>
          <div class="comment-body">
            <div class="comment-body__more-info">
              <div class="comment-body__author">${name}</div>
            </div>
            <div class="comment-body__text">${commentText}</div>
          </div>
        </article>
      `;
      
      await sendPushMessage({
        title: "Komentar Baru!",
        message: `Ada tanggapan baru di cerita "${name}"!`,
      });

      commentsListContainer.appendChild(newCommentElement);
      
      showToast("Komentar berhasil dikirim!", "success");
  
      textarea.value = "";
    });
  },
};

export default DetailPagePresenter;
