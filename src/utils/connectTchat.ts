import { fetchGlobalBTTVEmotes, fetchGlobalEmotes, handleChatMessage } from "./tchatUtils";

export async function connectToTwitchChat(callback: (message: string) => void) {
  const socket = new WebSocket("wss://irc-ws.chat.twitch.tv");
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
  const channel = import.meta.env.VITE_CHANNEL;
  const nick = import.meta.env.VITE_NICK;
  await fetchGlobalEmotes()
  await fetchGlobalBTTVEmotes()


  socket.addEventListener("open", () => {
    socket.send(`PASS oauth:${accessToken}`);
    socket.send(`NICK ${nick}`);
    socket.send(`JOIN #${channel}`);
  });

  // Récupère les emoticons globaux au démarrage
  socket.addEventListener("message", (event) => { handleChatMessage(event.data, callback); console.log(event) });
  socket.addEventListener("error", (event) => console.error("Erreur WebSocket : ", event));
  socket.addEventListener("close", () => {
    console.error("Connexion WebSocket fermée, tentative de reconnexion...");
    setTimeout(() => connectToTwitchChat(callback), 1000);
  });
}