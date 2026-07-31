import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild } from '@wystrelia/shared';
import { In, Repository } from 'typeorm';

// Discord permissions are a bitfield: each permission is one specific bit.
// MANAGE_GUILD is bit 5 -> 0x20 in hex -> 32 in decimal.
// BigInt (the `n` suffix) is needed because a user's combined permissions
// can exceed what a regular JS `number` can represent precisely.
const MANAGE_GUILD = 0x20n;

// Shapes of the JSON responses Discord's API sends back,
// just enough fields to type what we actually use here
interface DiscordTokenResponse {
  access_token: string;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
}

interface DiscordGuild {
  id: string;
  name: string;
  permissions: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
  ) {}

  // Step 1 : builds the URL Discord's login/consent screen lives at
  // The controller redirects the browser here for GET /auth/discord
  getDiscordAuthorizeUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.get<string>('DISCORD_CLIENT_ID')!,
      redirect_uri: this.config.get<string>('DISCORD_REDIRECT_URI')!,
      // "guilds" scope is required to later list servers the user manages
      response_type: 'code',
      scope: 'identify guilds',
    });
    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  // Orchestrates steps 2-5: called by the /auth/discord/callback route
  // once Discord redirects back with a one-time 'code'
  async handleCallback(code: string): Promise<string> {
    const accessToken = await this.exchangeCodeForToken(code);
    const user = await this.fetchDiscordUser(accessToken);
    const guildIds = await this.fetchManagedGuildIds(accessToken);

    // Signs a JWT containing just enough to identify the user and
    // authorize them later without re-calling Discord on every request
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
      guilds: guildIds,
    });
  }

  // Step 2 : server-to-server exchange of the one-time `code` for a real
  // access_token. Uses client_secret, so this can only happen backend-side
  // (never exposed to the browser)
  private async exchangeCodeForToken(code: string): Promise<string> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.get<string>('DISCORD_REDIRECT_URI')!,
      client_id: this.config.get<string>('DISCORD_CLIENT_ID')!,
      client_secret: this.config.get<string>('DISCORD_CLIENT_SECRET')!,
    });

    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = (await response.json()) as DiscordTokenResponse;
    return data.access_token;
  }

  // Step 3 : confirms who the user is, using the access_token as proof
  private async fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json() as Promise<DiscordUser>;
  }

  // Step 4 : lists the user's guilds, keeps only the ones where they have
  // MANAGE_GUILD permission (servers they're allowed to configure the bot on)
  private async fetchManagedGuildIds(accessToken: string): Promise<string[]> {
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const guilds = (await response.json()) as DiscordGuild[];

    // Step A : keep only guilds where the user has MANAGE_GUILD
    const managedGuildIds = guilds
      .filter(
        (guild) => (BigInt(guild.permissions) & MANAGE_GUILD) === MANAGE_GUILD,
      )
      .map((guild) => guild.id);

    if (managedGuildIds.length === 0) return [];

    // Step B : keep only guilds the bot is actually present on
    // (rows that exist in the 'guild' table)
    const knownGuilds = await this.guildRepository.find({
      where: { guild_id: In(managedGuildIds) },
      select: { guild_id: true },
    });

    return knownGuilds.map((guild) => guild.guild_id);
  }
}
