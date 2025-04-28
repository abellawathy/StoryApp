import LoginPresenter from "./presenters/login-presenter";

export default class LoginPage {
  async render() {
    return `
      <section class="login-wrapper">
        <div class="login-container">
          <h1 class="login-title">Masuk ke <span>StoryApp</span></h1>
          <form id="login-form" class="story-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="text" id="login-email" placeholder="Masukkan email" required />
            </div>

            <div class="form-group">
              <label for="login-password">Kata Sandi</label>
              <div class="password-wrapper">
                <input type="password" id="login-password" placeholder="Masukkan kata sandi" required />
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
              <div class="forgot-password">
                <a href="#/forgot-password">Lupa kata sandi?</a>
              </div>
            </div>

            <button type="submit" class="submit-button">Masuk</button>
          </form>

          <p class="form-link">
            Belum punya akun? <a href="#/register">Daftar di sini</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.querySelector("#login-form");
    const emailInput = document.querySelector("#login-email");
    const passwordInput = document.querySelector("#login-password");
    const toggleBtn = document.querySelector("#toggle-password");
    const eyeIcon = document.querySelector("#eye-icon");

    // Toggle visibility
    let isVisible = false;
    toggleBtn.addEventListener("click", () => {
      isVisible = !isVisible;
      passwordInput.type = isVisible ? "text" : "password";

      const eyePath = eyeIcon.querySelector("#eye-path");
      eyePath.setAttribute(
        "d",
        isVisible
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

    // Panggil presenter login
    LoginPresenter.init({
      form: loginForm,
      emailInput,
      passwordInput,
    });
  }
}
