import {
  showToast,
  showLoading,
  hideLoading,
} from "../../../utils/ui-helper.js";
import { getUserInfo } from "../../../data/api.js";

const ProfilePresenter = {
  async init({ containerSelector }) {
    const container = document.querySelector(containerSelector);
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email") || "email@example.com";

    if (!token) {
      container.innerHTML =
        "<p>Anda belum login. Silakan login terlebih dahulu.</p>";
      return;
    }

    showLoading();
    try {
      const data = getUserInfo();

      if (!data) {
        throw new Error("Token tidak valid atau tidak ditemukan.");
      }

      container.classList.remove("loading");
      container.innerHTML = `
        <div class="profile-card-content">
          <div class="avatar-wrapper">
            <div class="avatar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M5.121 17.804A13.937 13.937 0 0112 15c2.472 0 
                    4.765.672 6.879 1.804M15 11a3 3 0 
                    10-6 0 3 3 0 006 0z" />
              </svg>
            </div>
          </div>
          <div class="user-details">
            <p class="user-name"><strong>Nama:</strong> ${name}</p>
            <p class="user-email"><strong>Email:</strong> ${email}</p>
          </div>
        </div>
      `;
    } catch (error) {
      container.innerHTML = "<p>Gagal memuat data profil.</p>";
      showToast(error.message || "Gagal mengambil data profil", "error");
    } finally {
      hideLoading();
    }
  },
};

export default ProfilePresenter;
