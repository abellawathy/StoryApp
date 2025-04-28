export function generateSubscribeButtonTemplate() {
    return `
      <button id="subscribe-button" class="btn subscribe-button">
         <span>Subscribe</span>
         <i class="fas fa-bell"></i>
      </button>
    `;
  }
  
  export function generateUnsubscribeButtonTemplate() {
    return `
      <button id="unsubscribe-button" class="btn unsubscribe-button">
        <span>Unsubscribe</span>
        <i class="fas fa-bell-slash"></i>
      </button>
    `;
  }

  export function generateAuthenticatedNavigationListTemplate() {
    return `
      <li id="push-notification-tools" class="push-notification-tools"></li>
    `;
  }

  export function generateUnauthenticatedNavigationListTemplate() {
    return `
      <li id="push-notification-tools" class="push-notification-tools"></li>
    `;
  }

  export function generateStoryDetailTemplate({
    title,
    description,
    authorName,
    createdAt,
    imageUrl,
    storyLocation,
  }) {
    const createdAtFormatted = new Date(createdAt).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    return `
      <div class="story-detail__header">
        <h1 id="title" class="story-detail__title">${title}</h1>
  
        <div class="story-detail__more-info">
          <div class="story-detail__more-info__inline">
            <div id="createdat" class="story-detail__createdat" data-value="${createdAtFormatted}">
              <i class="fas fa-calendar-alt"></i> ${createdAtFormatted}
            </div>
            <div id="author" class="story-detail__author" data-value="${authorName}">
              <i class="fas fa-user"></i> ${authorName}
            </div>
          </div>
  
          <div class="story-detail__more-info__inline">
            <div id="location" class="story-detail__location" data-value="${storyLocation}">
              <i class="fas fa-map"></i> ${storyLocation}
            </div>
          </div>
        </div>
  
        <div class="story-detail__image-container">
          <img id="story-image" class="story-detail__image" src="${imageUrl}" alt="${title}" />
        </div>
  
        <div class="story-detail__body">
          <div class="story-detail__description__container">
            <h2 class="story-detail__description__title">Informasi Lengkap</h2>
            <div id="description" class="story-detail__description__body">
              ${description}
            </div>
          </div>

          <hr />

          <div class="story-detail__body__map__container">
            <h2 class="story-detail__map__title">Peta Lokasi</h2>
            <!-- Gantilah ID map di sini dengan map-container -->
            <div class="story-detail__map__container">
              <div id="map" class="story-detail__map"></div> 
            </div>
          </div>
  
          <hr />
  
          <div class="story-detail__body__actions__container">
            <h2>Aksi</h2>
            <div class="story-detail__actions__buttons">
              <div id="subscribe-actions-container"></div>
              <div id="notify-actions-container">
                <button id="story-detail-notify-me" class="btn btn-transparent">
                  Try Notify Me <i class="far fa-bell"></i>
                </button>
              </div>
            </div>
          </div>

          <hr />

          <div class="story-detail__comments__container">
            <div class="story-detail__comments-form__container">
              <h2 class="story-detail__comments-form__title">Beri Tanggapan</h2>
              <form id="comments-list-form" class="story-detail__comments-form__form">
                <textarea name="body" placeholder="Beri tanggapan terkait cerita."></textarea>
                <div id="submit-button-container">
                  <button class="btn" type="submit">Tanggapi</button>
                </div>
              </form>
            </div>

            <hr>

            <div class="story-detail__comments-list__container">
              <div id="story-detail-comments-list"></div>
              <div id="comments-list-loading-container"></div>
            </div>
        </div>
      </div>
    `;
  }
  
  
  
  
  