import SavedPresenter from "./saved-presenter";

export default class SavedPage {
  async render() {
    return `
        <section class="container">
          <div class="welcome-message">
            <h1>Jelajahi cerita yang telah kamu simpan!</h1>
          </div>
          <input id="search-input" type="text" placeholder="Cari cerita..." class="search-input" />
          <h2 style="margin-top: 40px; color: #8F87F1;">Cerita Tersimpan</h2>
          <div id="saved-stories-container" class="stories-grid"></div>
          <div id="map" class="map-container"></div>
        </section>
      `;
  }

  async afterRender() {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const storiesContainer = document.querySelector("#saved-stories-container");
    const searchInput = document.querySelector("#search-input");
    const mapContainer = document.querySelector("#map");

    this._presenter = SavedPresenter;
    this._presenter.init({
      storiesContainer,
      mapContainer,
      searchInput,
    });

    await this._presenter.loadSavedStories();

    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase();
      this._presenter.filterStories(keyword);
    });
  }
}
