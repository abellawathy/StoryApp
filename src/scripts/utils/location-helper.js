export async function requestLocation() {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation tidak didukung di browser ini.');
      return null;
    }
  
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Lokasi didapat:', latitude, longitude);
          resolve({ latitude, longitude });
        },
        (error) => {
          console.warn('Gagal mengambil lokasi:', error);
          resolve(null); 
        }
      );
    });
  }
  