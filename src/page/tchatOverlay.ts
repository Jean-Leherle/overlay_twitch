export function initTchatOverlay(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container avec l'ID '${containerId}' introuvable.`);
    return;
  }
  container.innerHTML = generateChatOverlayHTML();
  connectToTwitchChat(containerId);
}

function generateChatOverlayHTML() {
  return `
    <div id="chat-overlay">
      <div id="chatContainer"></div>
    </div>
  `;
}

function connectToTwitchChat(containerId: string) {
  const socket = new WebSocket("wss://irc-ws.chat.twitch.tv");
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
  const channel = import.meta.env.VITE_CHANNEL;
  const nick = import.meta.env.VITE_NICK;

  socket.addEventListener("open", () => {
    socket.send(`PASS oauth:${accessToken}`);
    socket.send(`NICK ${nick}`);
    socket.send(`JOIN #${channel}`);
  });

  socket.addEventListener("message", (event) => handleChatMessage(event.data));
  socket.addEventListener("error", (event) => console.error("Erreur WebSocket : ", event));
  socket.addEventListener("close", () => {
    console.error("Connexion WebSocket fermée, tentative de reconnexion...");
    setTimeout(() => connectToTwitchChat(containerId), 5000);
  });
}

function handleChatMessage(rawMessage: string) {
  const parsedMessage = parseTwitchMessage(rawMessage);
  if (parsedMessage) {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
      const chatMessage = document.createElement('div');
      chatMessage.className = 'chat-message';
      chatMessage.innerHTML = `<strong>${parsedMessage.username}:</strong> ${parsedMessage.message}`;
      chatContainer.appendChild(chatMessage);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
}

function parseTwitchMessage(rawMessage: string) {
  const regex = /:(?<username>\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG #\w+ :(?<message>.+)/;
  const match = rawMessage.match(regex);

  if (match && match.groups) {
    return {
      username: match.groups.username,
      message: match.groups.message,
    };
  }
  return null;
}
