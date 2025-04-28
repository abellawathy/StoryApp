import ProfilePresenter from "./presenters/profile-presenter";

class ProfilePage {
  async render() {
    return `
      <section class="profile-page container">
        <h2 class="page-title">Profil Saya</h2>
        <div id="profile-container" class="profile-card loading">
          <p>Memuat profil...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    ProfilePresenter.init({
      containerSelector: "#profile-container",
    });
  }
}

export default ProfilePage;
