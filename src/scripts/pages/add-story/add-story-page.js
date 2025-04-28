import AddStoryPresenter from "./addstory-presenter.js";
import { showToast } from "../../utils/ui-helper.js";

export default class AddStoryPage {
  async render() {
    return `
    <section class="container add-story-section">
      <h1>Tambah Cerita Baru</h1>
      <form id="add-story-form" class="story-form">
        <div class="form-group">
          <label for="story-name">Judul</label>
          <input type="text" id="story-name" placeholder="Masukkan judul cerita" required>
        </div>
  
        <div class="form-group">
          <label for="story-description">Deskripsi</label>
          <textarea id="story-description" rows="5" placeholder="Tuliskan cerita kamu di sini..." required></textarea>
        </div>
  
        <div class="form-group photo-section">
          <label for="story-photo">Foto Cerita</label>
          <div class="photo-upload-wrapper">
            <input type="file" id="story-photo" accept="image/*">
            <button type="button" id="open-camera-btn" class="camera-btn">📷 Ambil dari Kamera</button>
            <button type="button" id="clear-photo-btn" class="delete-btn">🗑️ Hapus Gambar</button>
          </div>

          <div class="camera-container" style="position: relative; display: none;">
            <video id="camera-preview" autoplay playsinline style="width: 100%; border-radius: 10px;"></video>
            <button type="button" id="close-camera-btn" class="close-camera-btn">❌</button>
          </div>
          
          <img id="photo-preview" class="photo-preview" alt="Preview Foto" style="display: none;" />
        </div>
  
        <div class="form-group">
          <label>Pilih Lokasi</label>
          <div id="map" class="map-container" style="height: 300px;"></div>
          <button type="button" id="clear-location-btn" class="delete-btn">🗑️ Hapus Lokasi</button>
        </div>
  
        <button type="submit" class="submit-button">Kirim Cerita</button>
      </form>
    </section>
  `;
  }

  async afterRender() {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast(
        "Anda harus login terlebih dahulu untuk menambahkan cerita.",
        "warning"
      );
      window.location.hash = "#/login";
      return;
    }


    const presenter = new AddStoryPresenter(this);
    presenter.run();
  }
}
