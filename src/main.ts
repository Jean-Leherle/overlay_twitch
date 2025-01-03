import { FollowOverlay } from './page/FollowOverlay';
import { ChatOverlay } from './page/tchatOverlay';
import { WebcamOverlay } from './page/webCamOverlays';

const routes: Record<string, () => void> = {
  '#webcam': () => new WebcamOverlay('app'),
  '#tchat': () => new ChatOverlay('app'),
  '#overlay': () => new FollowOverlay('app'),
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
      <div id="router">
        <p>Page introuvable : <strong>${hash}</strong></p>
        <p>Choisissez parmi les pages suivantes :</p>
        <p>${Object.keys(routes).map((route) => `<a href="${route}">${route.replace('#', '')}</a>`).join('')
      }</p>
      </div>
    `;
  }
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', handleRouteChange);