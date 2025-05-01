import { getToken, clearToken } from "./auth";

const renderAuthNav = () => {
  const token = getToken();
  const navAuth = document.getElementById('nav-auth-placeholder');
  const navBottom = document.getElementById('nav-bottom');

  if (!navAuth || !navBottom) return;

  if (token) {
    navAuth.innerHTML = `
      <a href="#/saved" class="nav-link">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 5v14l7-7 7 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
        </svg>
        Saved
      </a>

      <hr />

      <a href="#/profile" class="nav-link">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0 1 12 15c2.472 0 4.765.672 6.879 1.804M15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z" />
        </svg>
        Profil
      </a>
    `;

    navBottom.innerHTML = `
    <hr />
      <button id="logout-button" class="nav-link logout-button">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
        </svg>
        Logout
      </button>
    `;

    document.getElementById("logout-button").addEventListener("click", () => {
      clearToken();
      renderAuthNav(); // update UI
      location.hash = "#/login";
    });
  } else {
    navAuth.innerHTML = `
      <a href="#/login" class="nav-link">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h14m-7-7l7 7-7 7" />
        </svg>
        Login
      </a>
    `;
    navBottom.innerHTML = "";
  }
};

export { renderAuthNav };