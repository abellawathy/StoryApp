import ForgotPasswordPresenter from "./presenters/forgot-pass-presenter.js";

export default class ForgotPasswordPage {
  async render() {
    return `
      <section class="login-wrapper">
        <div class="login-container">
          <h1 class="login-title">Lupa <span>Kata Sandi</span></h1>
          <form id="forgot-password-form" class="story-form">
            <div class="form-group">
              <label for="reset-email">Email</label>
              <input type="email" id="reset-email" placeholder="Masukkan email yang terdaftar" required />
            </div>
            <button type="submit" class="submit-button">Kirim Link Reset</button>
          </form>

          <p class="form-link">
            Sudah ingat? <a href="#/login">Kembali ke Login</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    ForgotPasswordPresenter.init({
      formSelector: "#forgot-password-form",
    });
  }
}
