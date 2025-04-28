import { showToast, showLoading, hideLoading } from "../../../utils/ui-helper.js";

const ForgotPasswordPresenter = {
  init({ formSelector }) {
    const form = document.querySelector(formSelector);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#reset-email").value;

      try {
        showLoading();

        // Simulasi kirim email reset
        console.log("Mengirim email reset ke:", email);

        hideLoading();
        showToast("Link reset telah dikirim ke email (simulasi).");

        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2500);
      } catch (error) {
        hideLoading();
        console.error("Gagal kirim email reset:", error);
        showToast("Terjadi kesalahan. Coba lagi nanti.", "error");
      }
    });
  },
};

export default ForgotPasswordPresenter;
