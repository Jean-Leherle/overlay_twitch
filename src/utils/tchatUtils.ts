export type ParsedMessage = {
  username: string;
  message: string;
};

export function handleChatMessage(rawMessage: string, callback: (parsedMessage: ParsedMessage) => void): void {
  const parsedMessage = parseTwitchMessage(rawMessage);

  if (parsedMessage) {
    callback(parsedMessage);
  }
}

function parseTwitchMessage(rawMessage: string): ParsedMessage | null {
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
