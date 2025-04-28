import {
  showToast,
  showLoading,
  hideLoading,
} from "../../../utils/ui-helper.js";
import { renderAuthNav } from "../../../utils/auth-helper.js";
import { loginUser } from "../../../data/api.js";

const LoginPresenter = {
  async init({ form, emailInput, passwordInput }) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        showToast("Email dan password tidak boleh kosong", "error");
        return;
      }

      try {
        showLoading();

        const loginResult = await loginUser(email, password);
        hideLoading();

        localStorage.setItem("token", loginResult.token);
        localStorage.setItem("name", loginResult.name);
        localStorage.setItem("email", loginResult.email);

        showToast("Berhasil masuk!");

        renderAuthNav();

        window.dispatchEvent(new Event("userLoggedIn"));
        window.location.hash = "#/";
      } catch (error) {
        hideLoading();
        console.error("Login error:", error);
        showToast("Terjadi kesalahan saat login.", "error");
      }
    });
  },
};

export default LoginPresenter;
