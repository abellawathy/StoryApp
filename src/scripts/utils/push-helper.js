import CONFIG from "../config.js";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api"; // kalau kamu punya
const VAPID_PUBLIC_KEY = CONFIG.VAPID_PUBLIC_KEY;
import { showToast } from "../utils/ui-helper.js";

export async function requestPermission() {
  if (!("Notification" in window)) {
    console.error("Notification API tidak didukung.");
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    showToast("Izin notifikasi tidak diberikan.");
    return false;
  }

  return true;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function subscribe() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    showToast("Push Notification tidak didukung di browser ini.", "error");
    return false;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.error("VAPID_PUBLIC_KEY tidak tersedia.");
    showToast("Konfigurasi server key tidak ditemukan.");
    return false;
  }

  if (!(await requestPermission())) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) {
      console.log("Sudah terdaftar, gunakan subscription lama.");
      return true;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log("Berlangganan push:", JSON.stringify(subscription));

    if (typeof subscribePushNotification === "function") {
      const { endpoint, keys } = subscription.toJSON();
      await subscribePushNotification({ endpoint, keys });
    }

    return true;
  } catch (error) {
    console.error("Gagal berlangganan notifikasi:", error);
    showToast("Gagal melakukan langganan notifikasi.");
    return false;
  }
}

export async function unsubscribe() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    showToast("Push Notification tidak didukung di browser ini.", "error");
    return false;
  }
  const subscription = await getPushSubscription();
  if (!subscription) {
    showToast("Belum ada langganan yang aktif.");
    return false;
  }

  const { endpoint } = subscription.toJSON();

  if (typeof unsubscribePushNotification === "function") {
    try {
      await unsubscribePushNotification({ endpoint });
    } catch (error) {
      console.warn(
        "Gagal menghapus langganan dari server. Lanjutkan unsubscribe lokal.",
        error
      );
    }
  }

  await subscription.unsubscribe();
  console.log("Langganan push berhasil dihentikan.");

  return true;
}

export async function sendPushMessage({ title, message }) {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const controller = navigator.serviceWorker.controller;

    if (controller) {
      controller.postMessage({
        type: "simulate-push",
        payload: { title, message },
      });
    } else if (registration.active) {
      registration.active.postMessage({
        type: "simulate-push",
        payload: { title, message },
      });
    } else {
      console.warn("Tidak ada service worker aktif.");
    }
  }
}
