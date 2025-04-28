class NotFoundPresenter {
    constructor({ backHomeButton }) {
      this._backHomeButton = backHomeButton;
    }
  
    init() {
      this._backHomeButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = '/';
      });
      console.log('Halaman 404 ditampilkan');
    }
  }
  
  export default NotFoundPresenter;
  