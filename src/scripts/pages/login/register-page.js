import RegisterPresenter from "./presenters/register-presenter";

export default class RegisterPage {
  async render() {
    return `
      <section class="login-wrapper">
        <div class="login-container">
          <h1 class="login-title">Daftar <span>StoryApp</span></h1>
          <form id="register-form" class="story-form">
            <div class="form-group">
              <label for="register-name">Nama Lengkap</label>
              <input type="text" id="register-name" placeholder="Masukkan nama lengkap" required />
            </div>

            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="text" id="register-email" placeholder="Masukkan email" required />
            </div>

            <div class="form-group">
              <label for="register-password">Kata Sandi</label>
              <div class="password-wrapper">
                <input type="password" id="register-password" placeholder="Masukkan kata sandi" required />
                <button type="button" id="toggle-password" class="toggle-password" aria-label="Toggle Password">
                  <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" class="icon-eye" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path id="eye-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z
                         M2.458 12C3.732 7.943 7.523 5 12 5
                         c4.477 0 8.268 2.943 9.542 7
                         -1.274 4.057-5.065 7-9.542 7
                         -4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="submit-button">Daftar</button>
          </form>

          <p class="form-link">
            Sudah punya akun? <a href="#/login">Masuk di sini</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    RegisterPresenter.init({
      formSelector: "#register-form",
      passwordSelector: "#register-password",
      toggleSelector: "#toggle-password",
      eyeIconSelector: "#eye-icon",
    });
  }
}
