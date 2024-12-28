import '../style.css';
import { connectToTwitchChat } from "../utils/connectTchat";

export function initTchatOverlay(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container avec l'ID '${containerId}' introuvable.`);
    return;
  }
  container.innerHTML = generateChatOverlayHTML();
  connectToTwitchChat((message: string) => console.log('message : ', message));
}

function generateChatOverlayHTML() {
  return `
    <div id="chat-overlay">
      <div id="chatContainer"></div>
    </div>
  `;
}








