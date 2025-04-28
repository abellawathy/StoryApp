import NotFoundPresenter from './not-found-presenter';

class NotFoundPage {
  async render() {
    return `
      <section class="not-found container">
        <div class="not-found-content">
          <h1 class="not-found-title">404</h1>
          <p class="not-found-message">Oops! Halaman yang kamu cari tidak ditemukan.</p>
          <a href="#/" class="not-found-button" id="back-home-button">Kembali ke Beranda</a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const backHomeButton = document.querySelector('#back-home-button');

    const notFoundPresenter = new NotFoundPresenter({ backHomeButton });
    notFoundPresenter.init();
  }
}

export default NotFoundPage;
