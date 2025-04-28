import HomePagePresenter from "./homepage-presenter.js";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <div class="welcome-message">
          <h1>Selamat Datang di StoryApp!</h1>
          <p>Jelajahi pengalaman baru dengan desain yang lebih fresh dan menarik.</p>
        </div>
        <input id="search-input" type="text" placeholder="Cari cerita..." class="search-input" />
        <h2 style="margin-top: 40px; color: #8F87F1;">Daftar Cerita</h2>
        <div id="stories-list" class="stories-container"></div>
        <div id="map" class="map-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const storiesContainer = document.querySelector("#stories-list");
    const mapContainer = document.querySelector("#map");
    const searchInput = document.querySelector("#search-input");

    HomePagePresenter.init({
      storiesContainer,
      mapContainer,
      searchInput,
    });
  }
}
