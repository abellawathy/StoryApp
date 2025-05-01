import { showToast } from "../../utils/ui-helper.js";
import {
  _initDb,
  _getAllStoriesFromDb,
  _deleteStoryFromDb,
} from "../../utils/db-helper.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SavedPresenter = {
  init({ storiesContainer, mapContainer, searchInput }) {
    this._container = storiesContainer;
    this._mapContainer = mapContainer;
    this._allStories = [];
    this._mapInstance = null;
  },

  async _getSavedStories() {
    try {
      await _initDb();
      const stories = await _getAllStoriesFromDb();
      return stories;
    } catch (err) {
      console.error("Gagal mengambil cerita:", err);
      showToast("Gagal mengambil cerita tersimpan", "error");
      return [];
    }
  },

  _createStoryItemTemplate(story) {
    return `
      <div class="story-card" data-id="${story.id}">
        <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${
            story.description || "Tidak ada deskripsi."
          }</p>
          <small class="story-date">🕓 ${new Date(
            story.createdAt
          ).toLocaleString("id-ID")}</small>
          <button class="delete-story-button">🗑 Buang cerita</button>
        </div>
      </div>
    `;
  },

  renderStories(stories) {
    console.log("Stories yang diteruskan ke render:", stories);
    if (!stories.length) {
      this._container.innerHTML =
        "<p class='empty-message'>Tidak ada cerita tersimpan ditemukan.</p>";

      this._renderMapWithMarkers([]);
      return;
    }

    this._container.innerHTML = stories
      .map((story) => this._createStoryItemTemplate(story))
      .join("");

    this._container.querySelectorAll(".story-card").forEach((card) => {
      const id = card.dataset.id;

      card
        .querySelector(".delete-story-button")
        .addEventListener("click", async (e) => {
          e.stopPropagation();
          await this._deleteStory(id);
        });

      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete-story-button")) {
          location.hash = `#/detail/${id}`;
        }
      });
    });

    this._renderMapWithMarkers(stories);
  },

  async loadSavedStories() {
    try {
      this._allStories = await this._getSavedStories();
      console.log("Cerita yang diambil dari IndexedDB:", this._allStories);
      this.renderStories(this._allStories);
    } catch (error) {
      console.error("Gagal memuat cerita tersimpan:", error);
      this._container.innerHTML =
        "<p class='error-message'>Gagal memuat cerita tersimpan.</p>";
    }
  },

  _renderMapWithMarkers(stories) {
    if (!this._mapContainer) return;

    if (this._mapInstance) {
      this._mapInstance.remove();
      this._mapInstance = null;
    }

    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this._mapInstance = L.map(this._mapContainer).setView(
      [-2.5489, 118.0149],
      5
    );

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

    this._mapContainer.style.height = "400px";
    this._mapContainer.style.display = "block";
    this._mapContainer.style.visibility = "visible";

    defaultLayer.addTo(this._mapInstance);

    const baseLayers = {
      Default: defaultLayer,
      "Dark Mode": darkLayer,
      Satellite: satelliteLayer,
    };

    L.control.layers(baseLayers).addTo(this._mapInstance);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon], { icon: customIcon })
          .addTo(this._mapInstance)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
    if (!stories.some((s) => s.lat && s.lon)) {
      L.popup()
        .setLatLng([-2.5489, 118.0149])
        .setContent("Belum ada marker cerita tersimpan.")
        .openOn(this._mapInstance);
    }
  },

  async _deleteStory(id) {
    try {
      await _deleteStoryFromDb(id);
      this._allStories = this._allStories.filter((story) => story.id !== id);
      this.renderStories(this._allStories);
      this._renderMapWithMarkers(this._allStories);
      showToast("Cerita berhasil dihapus.", "success");
    } catch (error) {
      console.error("Gagal menghapus cerita:", error);
      showToast("Gagal menghapus cerita.", "error");
    }
  },

  filterStories(keyword) {
    const filtered = this._allStories.filter((story) =>
      (story.description || "").toLowerCase().includes(keyword.toLowerCase())
    );
    this.renderStories(filtered);
    this._renderMapWithMarkers(filtered);
  },
};

export default SavedPresenter;
