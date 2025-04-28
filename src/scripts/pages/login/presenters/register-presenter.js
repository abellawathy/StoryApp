import { showToast, showLoading, hideLoading } from "../../../utils/ui-helper.js";
import { registerUser } from "../../../data/api.js";

const RegisterPresenter = {
  init({ formSelector, passwordSelector, toggleSelector, eyeIconSelector }) {
    this.registerForm = document.querySelector(formSelector);
    this.passwordInput = document.querySelector(passwordSelector);
    this.toggleBtn = document.querySelector(toggleSelector);
    this.eyeIcon = document.querySelector(eyeIconSelector);
    this.isVisible = false;

    this._setupTogglePassword();
    this._handleSubmit();
  },

  _setupTogglePassword() {
    this.toggleBtn.addEventListener("click", () => {
      this.isVisible = !this.isVisible;
      this.passwordInput.type = this.isVisible ? "text" : "password";

      const eyePath = this.eyeIcon.querySelector("#eye-path");
      eyePath.setAttribute(
        "d",
        this.isVisible
          ? `M13.875 18.825A10.05 10.05 0 0112 19
              c-4.477 0-8.268-2.943-9.542-7
              a9.956 9.956 0 012.034-3.368
              m3.278-2.623A9.956 9.956 0 0112 5
              c4.477 0 8.268 2.943 9.542 7
              a9.963 9.963 0 01-1.357 2.572
              M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 10L4 4`
          : `M15 12a3 3 0 11-6 0 3 3 0 016 0z
              M2.458 12C3.732 7.943 7.523 5 12 5
              c4.477 0 8.268 2.943 9.542 7
              -1.274 4.057-5.065 7-9.542 7
              -4.477 0-8.268-2.943-9.542-7z`
      );
    });
  },

  _handleSubmit() {
    this.registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.querySelector("#register-name").value;
      const email = document.querySelector("#register-email").value;
      const password = this.passwordInput.value;

      try {
        showLoading();
        const result = await registerUser(name, email, password);

        hideLoading();

        if (response.ok) {
          showToast("Pendaftaran berhasil! Silakan login.");
          window.location.hash = "#/login";
        } else {
          showToast(`Pendaftaran gagal: ${result.message}`, "error");
        }
      } catch (error) {
        hideLoading();
        console.error("Register error:", error);
        showToast("Terjadi kesalahan saat mendaftar.", "error");
      }
    });
  },
};

export default RegisterPresenter;
