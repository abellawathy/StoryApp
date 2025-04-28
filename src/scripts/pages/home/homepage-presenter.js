import { getStories } from "../../data/api.js";
import { showToast, showLoading, hideLoading } from "../../utils/ui-helper.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const HomePagePresenter = {
  async init({ storiesContainer, mapContainer, searchInput }) {
    const token = localStorage.getItem("token");

    if (!token) {
      storiesContainer.innerHTML = `
        <div class="login-reminder">
          <p>✨ Silakan <a href="#/login">login</a> untuk melihat cerita dari pengguna lain.</p>
        </div>
      `;
      mapContainer.style.display = "none";
      searchInput.style.display = "none";
      return;
    }

    try {
      showLoading();
      storiesContainer.innerHTML = "<p>Loading...</p>";
      const stories = await getStories();
      hideLoading();

      let filteredStories = [...stories];

      const renderStories = () => {
        if (!filteredStories.length) {
          storiesContainer.innerHTML = "<p>Tidak ada cerita ditemukan.</p>";
          return;
        }

        storiesContainer.innerHTML = filteredStories
          .map((story) => {
            return `
              <div class="story-card" data-id="${story.id}">
                <img src="${story.photoUrl}" alt="${
              story.name
            }" class="story-image">
                <div class="story-content">
                  <h3 class="story-title">${story.name}</h3>
                  <p class="story-description">${story.description}</p>
                  <small class="story-date">🕓 ${new Date(
                    story.createdAt
                  ).toLocaleString("id-ID")}</small>
                </div>
              </div>
            `;
          })
          .join("");

        const storyCards = document.querySelectorAll(".story-card");
        storyCards.forEach((card) => {
          card.addEventListener("click", () => {
            const id = card.dataset.id;
            console.log("ID kartu yang diklik:", id);
            location.hash = `#/detail/${id}`;
          });
        });
      };

      searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        filteredStories = stories.filter((story) => {
          const content = story.description.toLowerCase();
          return content.includes(keyword);
        });
        renderStories();
      });

      renderStories();

      const customIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      mapContainer.innerHTML = "";
      const map = L.map(mapContainer).setView([-2.5489, 118.0149], 5);

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

      stories.forEach((story) => {
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${story.name}</b><br>${story.description}`);
        }
      });
    } catch (error) {
      hideLoading();
      console.error("Gagal memuat cerita:", error);
      showToast("Gagal memuat data cerita. Silakan coba lagi.", "error");
    }
  },
};

export default HomePagePresenter;
