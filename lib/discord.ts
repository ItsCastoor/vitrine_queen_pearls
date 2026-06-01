import "server-only";

export interface DiscordEmbed {
  title: string;
  description?: string;
  color?: number;
  url?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: string;
}

/**
 * Envoie un embed vers un webhook Discord.
 * Si webhookUrl est absent/vide ou si l'envoi échoue, on absorbe silencieusement
 * pour ne jamais bloquer la soumission utilisateur.
 */
export async function notifyDiscord(
  webhookUrl: string | undefined,
  embed: DiscordEmbed,
): Promise<void> {
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [{ ...embed, timestamp: new Date().toISOString() }] }),
    });
  } catch {
    // Notification non critique — ne jamais propager l'erreur
  }
}
