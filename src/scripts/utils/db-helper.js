const DB_NAME = "storyapp";
const DB_VERSION = 1;
const DB_STORE_NAME = "stories";

let db;

export async function _initDb() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(DB_STORE_NAME, {
        keyPath: "id",
        autoIncrement: false,
      });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function _saveStoryToDb(story) {
  console.log("Menyimpan cerita:", story);
  if (!story || !story.id) {
    console.error("Tidak bisa menyimpan cerita tanpa ID:", story);
    return;
  }

  const db = await _initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);
    const request = store.put(story);

    request.onsuccess = () => {
      console.log("Cerita berhasil disimpan ke IndexedDB:", story);
      resolve(request.result);
    };
    request.onerror = (event) => {
      console.error("Error saat menyimpan ke DB:", event.target.error);
      reject(event.target.error || new Error("Gagal menyimpan story"));
    };
  });
}

export async function _getAllStoriesFromDb() {
  const db = await _initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_STORE_NAME, "readonly");
    const store = transaction.objectStore(DB_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error saat menyimpan ke DB:", event.target.error);
      reject(event.target.error || new Error("Gagal menyimpan story"));
    };
  });
}

export async function _deleteStoryFromDb(id) {
  const db = await _initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error saat menyimpan ke DB:", event.target.error);
      reject(event.target.error || new Error("Gagal menyimpan story"));
    };
  });
}

export async function _isStorySaved(id) {
  const db = await _initDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE_NAME, "readonly");
    const store = tx.objectStore(DB_STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = (event) => {
      console.error("Error saat menyimpan ke DB:", event.target.error);
      reject(event.target.error || new Error("Gagal menyimpan story"));
    };
  });
}
