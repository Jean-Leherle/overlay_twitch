export class TwitchApiClient {
  private readonly clientId: string;
  private readonly accessToken: string;
  private readonly channelName: string;
  private channelId: string | null = null;

  constructor() {
    this.clientId = import.meta.env.VITE_CLIENT_ID;
    this.accessToken = import.meta.env.VITE_ACCESS_TOKEN;
    this.channelName = import.meta.env.VITE_CHANNEL;

    this.getChannelId();
  }

  private async fetch(url: string) {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Client-Id": this.clientId,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async getChannelId(): Promise<string | null> {
    if (this.channelId) return this.channelId;
    try {
      const apiUrl = `https://api.twitch.tv/helix/users?login=${this.channelName}`;

      const data = await this.fetch(apiUrl);
      this.channelId = data.data[0]?.id || null;
      return this.channelId;
    } catch (error) {
      console.error("Error getting channel ID:", error);
      return null;
    }
  }

  async fetchNewFollowers(): Promise<{ username: string; followedAt: string }[]> {
    try {
      if (!this.channelId) {
        console.error("Unable to get channel ID");
        return [];
      }

      const apiUrl = `https://api.twitch.tv/helix/channels/followers/?broadcaster_id=${this.channelId}`;

      const data = await this.fetch(apiUrl);


      return data.data.map((follow: any) => ({
        username: follow.user_name,
        followedAt: follow.followed_at,
      }));
    } catch (error) {
      console.error("Error fetching followers:", error);
      return [];
    }
  }
}

// Usage example:
// const twitchClient = new TwitchApiClient();
// const followers = await twitchClient.fetchNewFollowers();