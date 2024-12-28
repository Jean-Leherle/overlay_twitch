import { initTchatOverlay } from './page/tchatOverlay';
import { initWebcamOverlay } from './page/webCamOverlays';

const routes: Record<string, () => void> = {
  '#webcam': () => initWebcamOverlay('app'),
  '#tchat': () => initTchatOverlay('app'),
  '#overlay': () => {
    const app = document.getElementById('app');
    if (app) app.innerHTML = '<div>Page Overlay Principale</div>';
  },
};

function handleRouteChange() {
  const app = document.getElementById('app');
  if (!app) return;

  const hash = window.location.hash;
  const routeHandler = routes[hash];

  if (routeHandler) {
    routeHandler();
  } else {
    app.innerHTML = `
      <div>
        <p>Page introuvable : <strong>${hash}</strong></p>
        <p>Choisissez parmi les pages suivantes :</p>
        <p>${Object.keys(routes)
        .map((route) => `<a href="${route}">${route.replace('#', '')}</a>`)
        .join(' | ')}</p>
      </div>
    `;
  }
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', handleRouteChange);