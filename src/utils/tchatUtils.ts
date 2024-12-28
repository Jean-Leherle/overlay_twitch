import { escapeRegex } from "./escapeRegex";

interface Emote {
  code: string;
  url: string;
}

const emoteMap: Record<string, Emote> = {}; // Map de toutes les emotes avec leur code et URL

export async function fetchGlobalEmotes(): Promise<void> {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

  const response = await fetch("https://api.twitch.tv/helix/chat/emotes/global", {
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Erreur lors de la récupération des emotes globales:", response.statusText);
    return;
  }

  const data = await response.json();
  data.data.forEach((emote: any) => {
    emoteMap[emote.name] = { code: emote.name, url: emote.images.url_1x }; // Utilisation du type Emote
  });
}

export async function fetchGlobalBTTVEmotes(): Promise<void> {
  const response = await fetch("https://api.betterttv.net/3/cached/emotes/global");
  if (response.ok) {
    const emotes = await response.json();
    emotes.forEach((emote: any) => {
      emoteMap[emote.code] = { code: emote.code, url: `https://cdn.betterttv.net/emote/${emote.id}/1x` };
    });
  } else {
    console.error("Erreur lors de la récupération des emotes BTTV globales");
  }
}

export async function fetchChannelBTTVEmotes(channelId: string): Promise<void> {
  const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`);
  if (response.ok) {
    const data = await response.json();
    data.sharedEmotes.forEach((emote: any) => {
      emoteMap[emote.code] = { code: emote.code, url: `https://cdn.betterttv.net/emote/${emote.id}/1x` };
    });
  } else {
    console.error(`Erreur lors de la récupération des emotes BTTV pour le channel ${channelId}`);
  }
}

export function replaceEmotes(message: string): string {
  // Remplace tous les noms d'emotes par leurs images
  Object.keys(emoteMap).forEach((emoteCode) => {
    const escapedCode = escapeRegex(emoteCode);
    const emoteRegex = new RegExp(`\\b${escapedCode}\\b`, "g");
    const emoteUrl = emoteMap[emoteCode].url; // Utilisation du champ 'url' de l'objet Emote
    message = message.replace(
      emoteRegex,
      `<img src="${emoteUrl}" alt="${emoteCode}" class="emote" />`
    );
  });
  return message;
}

export function handleChatMessage(rawMessage: string, callback: (message: string) => void): void {
  const parsedMessage = parseTwitchMessage(rawMessage);

  if (parsedMessage) {
    callback(parsedMessage.message);
    const messageWithEmotes = replaceEmotes(parsedMessage.message);
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      const chatMessage = document.createElement("div");
      chatMessage.className = "chat-message";

      // Remplace les noms des emotes par leurs images

      chatMessage.innerHTML = `<strong>${parsedMessage.username}:</strong> ${messageWithEmotes}`;
      chatContainer.appendChild(chatMessage);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
}

function parseTwitchMessage(rawMessage: string): { username: string; message: string } | null {
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
