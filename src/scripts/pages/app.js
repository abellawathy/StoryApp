import routes from "../routes/routes";
import { getStories } from "../data/api.js";
import { getActiveRoute } from "../routes/url-parser";
import { showLoading, hideLoading, showToast } from "../utils/ui-helper";
import {
  subscribe,
  unsubscribe,
  getPushSubscription,
} from "../utils/push-helper.js";
import {
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
} from "../template";
import { requestPermission } from "../utils/push-helper.js";
import {
  _initDb,
  _getAllStoriesFromDb,
  _deleteStoryFromDb,
  _isStorySaved,
} from "../utils/db-helper.js";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #overlay = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#overlay = document.getElementById("drawer-overlay");

    if (this.#navigationDrawer && this.#drawerButton) {
      this._setupDrawer();
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.classList.toggle("open");
      this.#overlay.classList.toggle("visible");
    });

    this.#overlay.addEventListener("click", () => {
      this.#navigationDrawer.classList.remove("open");
      this.#drawerButton.classList.remove("open");
      this.#overlay.classList.remove("visible");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.classList.remove("open");
        this.#overlay.classList.remove("visible");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
          this.#drawerButton.classList.remove("open");
          this.#overlay.classList.remove("visible");
        }
      });
    });
  }

  _updateAuthMenu() {
    const token = localStorage.getItem("token");
    const authLink = document.getElementById("auth-link");
    const authText = document.getElementById("auth-text");

    if (!authLink || !authText) return;

    if (token) {
      authText.textContent = "Logout";
      authLink.href = "#/";
      authLink.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        this._clearIndexedDb();
        showToast("Berhasil logout!", "success");
        this._updateAuthMenu();
        window.location.hash = "#/login";
      };
    } else {
      authText.textContent = "Login";
      authLink.href = "#/login";
      authLink.onclick = null;
    }
    this._renderNotifButton();
  }

  async _clearIndexedDb() {
    const db = await _initDb();
    const transaction = db.transaction(DB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);
    store.clear();
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async _renderNotifButton() {
    const container = document.getElementById("notif-button-container");
    const token = localStorage.getItem("token");
    if (!container || !token) {
      if (container) container.innerHTML = "";
      return;
    }

    const subscription = await getPushSubscription();

    if (subscription) {
      container.innerHTML = generateUnsubscribeButtonTemplate();
      container
        .querySelector("#unsubscribe-button")
        .addEventListener("click", async () => {
          await unsubscribe();
          showToast("Berhasil berhenti berlangganan notifikasi.", "success");
          this._renderNotifButton();
        });
    } else {
      container.innerHTML = generateSubscribeButtonTemplate();
      container
        .querySelector("#subscribe-button")
        .addEventListener("click", async () => {
          const permissionResult = await requestPermission();
          if (permissionResult) {
            await subscribe();
            showToast("Berhasil berlangganan notifikasi.", "success");
            this._renderNotifButton();
          } else {
            showToast("Izin notifikasi ditolak.", "error");
          }
        });
    }
  }

  async _fetchStoriesFromApi() {
    try {
      const data = await getStories();
      return data;
    } catch (error) {
      console.error("Gagal mengambil data dari API:", error);
      showToast("Gagal mengambil data cerita.", "error");
      return [];
    }
  }

  async renderPage() {
    await _initDb();

    const url = getActiveRoute();
    const page = routes[url] || routes[404];
    const storiesFromDb = await _getAllStoriesFromDb();

    const protectedRoutes = ["#/add", "#/profile"];
    const token = localStorage.getItem("token");

    let stories = storiesFromDb;
    if (stories.length === 0) {
      stories = await this._fetchStoriesFromApi();
    } else {
      stories = storiesFromDb;
    }

    console.log("Stories to display:", stories);

    if (protectedRoutes.includes(url) && !token) {
      showToast(
        "Kamu harus login dulu untuk mengakses halaman ini!",
        "warning"
      );
      window.location.hash = "#/login";
      return;
    }

    try {
      showLoading();

      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
        });
      } else {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      }
    } catch (error) {
      console.error("Gagal render halaman:", error);
      showToast("Ups! Gagal memuat halaman.", "error");
    } finally {
      hideLoading();
      this._updateAuthMenu();
      this._renderNotifButton();
    }
  }
}

export default App;
