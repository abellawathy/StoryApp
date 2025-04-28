import "../styles/styles.css";

import App from "./pages/app";
import { renderAuthNav } from "./utils/auth-helper";
import { requestPermission } from "./utils/push-helper";
import { requestLocation } from "./utils/location-helper.js";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  const router = async () => {
    await app.renderPage();
  };

  window.addEventListener("hashchange", router);
  
  await router();

  renderAuthNav();

  const skipLink = document.querySelector(".skip-to-content");
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      const mainContent = document.querySelector("#main-content");
      if (mainContent) {
        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus();
      }
    });
  }


    const coords = await requestLocation();

    if (coords) {
      console.log("Koordinat:", coords.latitude, coords.longitude);
    } else {
      console.log("Lokasi tidak tersedia atau izin ditolak.");
    }

    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js', { type: 'module' });
        console.log('✅ Service Worker Registered');
      } catch (err) {
        console.error('❌ SW registration failed: ', err);
      }
    }

    requestPermission();
});
