import CONFIG from "../config";

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  USER_PROFILE: `${CONFIG.BASE_URL}/users/me`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  NOTIFICATIONS_SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  NOTIFICATIONS_UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getStories() {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(ENDPOINTS.STORIES, { headers });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data cerita");
  }

  return result.listStory;
}

export async function getStoryDetail(id) { 
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), { headers });

    const result = await response.json();
    // Memeriksa jika respons tidak OK
    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil detail cerita");
    }

    // Mengembalikan detail cerita
    return result.story;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil detail cerita:", error);
    throw new Error(error.message || "Gagal memuat detail cerita");
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal login");
    }

    return result.loginResult;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(name, email, password) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mendaftar");
    }

    return result.registerResult;
  } catch (error) {
    throw error;
  }
}

export function getUserInfo() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name || "Pengguna",
      email: payload.email || "email@example.com",
    };
  } catch {
    return null;
  }
}

export async function getUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token tidak ditemukan. Anda harus login terlebih dahulu.");
  }

  try {
    const response = await fetch(ENDPOINTS.USER_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw new Error("Tidak ada respons dari server");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil data pengguna: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil profil pengguna:", error);
    throw new Error(`Terjadi kesalahan: ${error.message}`);
  }
}


export function logoutUser() {
  localStorage.removeItem("token");
}


export async function subscribePushNotification({ endpoint, keys }) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new error("Token tidak ditemukan");
  }

  console.log("Token ditemukan:", token);
  console.log("Endpoint yang digunakan untuk subscribe:", endpoint);

  const requestBody = {
    endpoint: endpoint,
    keys: {
      p256dh: keys.p256dh,
      auth: keys.auth,
    }
  };

  try {
    const response = await fetch(ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal berlangganan push notification");
    }

    console.log("Berhasil subscribe:", result);
    return result.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Terjadi error saat subscribe:", error);
  }
}

export async function unsubscribePushNotification({ endpoint }) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token tidak ditemukan");
    return;
  }

  console.log("Token ditemukan:", token);
  console.log("Endpoint yang digunakan untuk unsubscribe:", endpoint);

  const requestBody = {
    endpoint: endpoint,
  };

  try {
    const response = await fetch(ENDPOINTS.NOTIFICATIONS_UNSUBSCRIBE, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal unsubscribe dari push notification");
    }

    console.log("Berhasil unsubscribe:", result);
    return result; 
  } catch (error) {
    console.error("Terjadi error saat unsubscribe:", error);
    throw new Error(error.message || "Gagal unsubscribe");
  }
}

