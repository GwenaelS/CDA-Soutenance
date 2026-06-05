## 1. Scaffolding projet

- [ ] 1.1 Initialiser le monorepo pnpm avec `pnpm-workspace.yaml` et le `package.json` racine
- [ ] 1.2 Créer les packages : `packages/shared`, `packages/bot`, `packages/api`, `packages/dashboard`
- [ ] 1.3 Configurer le `tsconfig.json` racine avec aliases de chemins et les `tsconfig.json` par package
- [ ] 1.4 Ajouter `.env.example` avec toutes les variables d'environnement requises (`DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `JWT_SECRET`, `DASHBOARD_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)
- [ ] 1.5 Configurer ESLint et Prettier avec une config partagée à la racine

## 2. Types partagés (packages/shared)

- [ ] 2.1 Définir les interfaces TypeScript pour les formes de réponse API : `GuildDto`, `GuildConfigDto`, `AuditEntryDto`, `XpConfigDto`, `LevelRewardDto`, `UserXpDto`, `AutoModerationConfigDto`, `BirthdayDto`, `SavedEmbedDto`, `MocChannelDto`, `GuildStatsDto`, `GuildMemberDto`
- [ ] 2.2 Définir l'enum partagé `ModerationAction` : `KICK`, `BAN`, `TIMEOUT`, `WARN`, `UNBAN`, `UNTIMEOUT`, `UNWARN`, `LOCK`, `UNLOCK`, `CLEAR`, `SERVER_MUTE`, `SERVER_UNMUTE`
- [ ] 2.3 Exporter tous les types depuis `packages/shared/src/index.ts`

## 3. Schéma base de données (packages/api — entités TypeORM)

- [ ] 3.1 Configurer TypeORM dans `packages/api` avec le driver mysql2 (`synchronize: false`, migrations uniquement)
- [ ] 3.2 Définir l'entité `Guild` (`id`, `name`, `iconUrl`, `active`, `createdAt`)
- [ ] 3.3 Définir l'entité `GuildConfig` (`guildId`, `logChannelId`, `welcomeChannelId`, `welcomeMessage`, `autoRoleId`, `birthdayChannelId`)
- [ ] 3.4 Définir l'entité `AuditEntry` (`id`, `guildId`, `actorId`, `targetId`, `action` enum, `reason`, `createdAt`)
- [ ] 3.5 Définir l'entité `GuildXpConfig` (`guildId`, `xpPerMessage`, `messageCooldownSeconds`, `xpPerVoiceMinute`, `levelRewards` en JSON)
- [ ] 3.6 Définir l'entité `UserXp` (`id`, `guildId`, `userId`, `username`, `avatarUrl`, `joinedAt`, `xp`, `level`, `lastMessageAt`)
- [ ] 3.7 Définir l'entité `AutoModerationConfig` (`guildId`, `bannedWords` JSON, `spamDetectionEnabled`, `linkFilterEnabled`, `inviteFilterEnabled`, `exemptRoleIds` JSON)
- [ ] 3.8 Définir l'entité `Birthday` (`id`, `guildId`, `userId`, `month`, `day`)
- [ ] 3.9 Définir l'entité `SavedEmbed` (`id`, `guildId`, `name`, `title`, `description`, `color`, `createdAt`, `updatedAt`)
- [ ] 3.10 Définir l'entité `MocChannel` (`id`, `guildId`, `channelId`)
- [ ] 3.11 Définir l'entité `GuildStatEntry` (`id`, `guildId`, `date` DATE, `memberCount`, `joins`, `leaves`, `messageCount`)
- [ ] 3.12 Générer et exécuter la migration TypeORM initiale : `migration:generate` puis `migration:run`
- [ ] 3.13 Exporter le singleton DataSource depuis `packages/api/src/data-source.ts`

## 4. Bot Core (packages/bot)

- [ ] 4.1 Installer discord.js 14 et initialiser `src/index.ts` avec `Client` (intents : `Guilds`, `GuildMembers`, `GuildVoiceStates`, `GuildMessages`, `MessageContent`)
- [ ] 4.2 Implémenter le loader de commandes qui lit tous les fichiers de `src/commands/` et construit une `Collection<string, Command>`
- [ ] 4.3 Implémenter le handler `interactionCreate` qui dispatche les interactions de commandes slash au bon module
- [ ] 4.4 Implémenter les handlers `guildCreate` et `guildDelete` qui font un upsert/désactivation des lignes `Guild` et créent les lignes par défaut `GuildConfig`, `GuildXpConfig` et `AutoModerationConfig`
- [ ] 4.5 Implémenter le handler `guildMemberAdd` : assigner `autoRoleId`, envoyer un embed de bienvenue dans `welcomeChannelId`, mettre à jour `UserXp` (username, avatarUrl, joinedAt), incrémenter `GuildStatEntry.joins` du jour
- [ ] 4.6 Implémenter le handler `guildMemberRemove` : incrémenter `GuildStatEntry.leaves` du jour
- [ ] 4.7 Implémenter le handler `voiceStateUpdate` : suivre les timestamps de join/leave en mémoire, accorder `xpPerVoiceMinute` au départ ; détecter les server mutes/unmutes et écrire une `AuditEntry`
- [ ] 4.8 Ajouter les handlers globaux d'erreurs non gérées qui loggent et répondent avec un message éphémère "Une erreur est survenue"
- [ ] 4.9 Créer le script `src/deploy-commands.ts` qui enregistre toutes les définitions de commandes slash (par serveur en dev via `GUILD_ID`, globalement en prod)

## 5. Auto-modération (packages/bot)

- [ ] 5.1 Créer `src/handlers/auto-mod.ts` — handler sur `messageCreate` ; charger et mettre en cache la config `AutoModerationConfig` par serveur
- [ ] 5.2 Implémenter la vérification des rôles exemptés : si l'auteur possède un rôle dans `exemptRoleIds`, ne pas appliquer de filtres
- [ ] 5.3 Implémenter le filtrage des mots interdits : supprimer le message si son contenu (en minuscules) contient un mot de `bannedWords`
- [ ] 5.4 Implémenter la détection de spam : supprimer le message si l'utilisateur a envoyé plus de 5 messages en moins de 5 secondes dans le même salon
- [ ] 5.5 Implémenter la suppression des liens : supprimer le message s'il contient une URL (`http://`, `https://`, `www.`) et que `linkFilterEnabled` est `true`
- [ ] 5.6 Implémenter la suppression des invitations Discord : supprimer le message s'il contient `discord.gg/` ou `discord.com/invite/` et que `inviteFilterEnabled` est `true`
- [ ] 5.7 Après chaque suppression, poster un embed de log dans `logChannelId` (si configuré) indiquant la règle déclenchée, le salon et l'auteur

## 6. Commandes de modération (packages/bot)

- [ ] 6.1 Créer `src/commands/kick.ts` — valider permissions + hiérarchie des rôles, exclure le membre, écrire `AuditEntry` (KICK), envoyer confirmation éphémère
- [ ] 6.2 Créer `src/commands/ban.ts` — valider permissions, bannir par mention ou ID, supprimer messages (0–7 jours), écrire `AuditEntry` (BAN)
- [ ] 6.3 Créer `src/commands/unban.ts` — vérifier que l'utilisateur est banni, lever le ban, écrire `AuditEntry` (UNBAN)
- [ ] 6.4 Créer `src/commands/timeout.ts` — valider durée (1–40320 min), appliquer `communicationDisabledUntil`, écrire `AuditEntry` (TIMEOUT)
- [ ] 6.5 Créer `src/commands/untimeout.ts` — lever le timeout (mettre `communicationDisabledUntil` à null), écrire `AuditEntry` (UNTIMEOUT)
- [ ] 6.6 Créer `src/commands/warn.ts` — écrire `AuditEntry` (WARN), DM la cible, gérer l'échec du DM gracieusement
- [ ] 6.7 Créer `src/commands/unwarn.ts` — supprimer un warn par ID (option `warn_id`), écrire `AuditEntry` (UNWARN)
- [ ] 6.8 Créer `src/commands/warnings.ts` — lister tous les warns actifs d'un utilisateur dans le serveur, répondre en éphémère avec ID, raison et date de chaque warn
- [ ] 6.9 Créer `src/commands/userinfo.ts` — afficher avatar, username, date d'arrivée, rôles, niveau, XP et nombre de warns actifs d'un utilisateur
- [ ] 6.10 Créer `src/commands/lock.ts` — retirer la permission `SendMessages` à `@everyone` dans le salon ciblé (ou salon courant), écrire `AuditEntry` (LOCK)
- [ ] 6.11 Créer `src/commands/unlock.ts` — rétablir la permission `SendMessages` à `@everyone` dans le salon ciblé, écrire `AuditEntry` (UNLOCK)
- [ ] 6.12 Créer `src/commands/clear.ts` — supprimer N messages (1–100, défaut 10) dans le salon courant via `bulkDelete`, écrire `AuditEntry` (CLEAR)
- [ ] 6.13 Créer `src/commands/ping.ts` — répondre avec la latence WebSocket du bot et le temps de réponse de l'API Discord en ms
- [ ] 6.14 Créer `src/commands/modhelp.ts` — envoyer un embed listant toutes les commandes de modération avec leur description et permissions requises
- [ ] 6.15 Créer `src/utils/permission-check.ts` — valider `MANAGE_GUILD` / `Kick Members` / `Ban Members` et la hiérarchie des rôles avant chaque action
- [ ] 6.16 Créer `src/utils/audit.ts` — écrire `AuditEntry` en DB et poster l'embed de log dans `logChannelId` si configuré

## 7. Système XP & Niveaux (packages/bot)

- [ ] 7.1 Créer `src/handlers/xp-message.ts` — sur `messageCreate`, charger `GuildXpConfig`, appliquer le cooldown par utilisateur, accorder `xpPerMessage`, détecter le passage de niveau, assigner la récompense de rôle si un palier est atteint ; incrémenter `GuildStatEntry.messageCount`
- [ ] 7.2 Créer `src/handlers/xp-voice.ts` — sur `voiceStateUpdate`, suivre les timestamps de join/leave en mémoire, accorder `xpPerVoiceMinute` au départ ; détecter le passage de niveau et assigner la récompense de rôle
- [ ] 7.3 Créer `src/commands/rank.ts` — afficher l'XP, le niveau et le classement du membre appelant dans le serveur
- [ ] 7.4 Créer `src/commands/top.ts` — afficher les 10 premiers membres par XP dans le serveur
- [ ] 7.5 Créer `src/commands/addxp.ts` — ajouter N points XP à un utilisateur (requiert `MANAGE_GUILD`), recalculer le niveau
- [ ] 7.6 Créer `src/commands/setxp.ts` — définir l'XP d'un utilisateur à une valeur exacte (requiert `MANAGE_GUILD`), recalculer le niveau
- [ ] 7.7 Créer `src/commands/addlevels.ts` — ajouter N niveaux à un utilisateur (requiert `MANAGE_GUILD`), recalculer l'XP correspondant
- [ ] 7.8 Créer `src/commands/setlevels.ts` — définir le niveau d'un utilisateur directement (requiert `MANAGE_GUILD`), recalculer l'XP correspondant
- [ ] 7.9 Créer `src/commands/reset.ts` — remettre l'XP et le niveau d'un utilisateur à 0 dans le serveur (requiert `MANAGE_GUILD`)

## 8. Annonces embed (packages/bot)

- [ ] 8.1 Créer `src/commands/announce.ts` — commande slash avec options `title`, `description`, `color` (hex), `channel` (mention de salon) ; requiert `MANAGE_GUILD` ; envoie un embed rich au salon spécifié

## 9. Système d'anniversaires (packages/bot + packages/api)

- [ ] 9.1 Créer `src/cron/birthday.ts` dans le bot — job cron quotidien à minuit UTC : récupérer tous les `Birthday` dont `month` et `day` correspondent à aujourd'hui, envoyer un embed dans `GuildConfig.birthdayChannelId` si configuré
- [ ] 9.2 Implémenter le démarrage du cron dans `src/index.ts` au démarrage du bot
- [ ] 9.3 Créer le module `BirthdaysModule` dans l'API avec :
  - `GET /guilds/:guildId/birthdays` — lister tous les anniversaires du serveur
  - `POST /guilds/:guildId/birthdays` — ajouter un anniversaire (`userId`, `month`, `day`)
  - `DELETE /guilds/:guildId/birthdays/:userId` — supprimer l'anniversaire d'un utilisateur

## 10. Média-Only-Channels / MOC (packages/bot + packages/api)

- [ ] 10.1 Créer `src/handlers/moc.ts` dans le bot — sur `messageCreate`, vérifier si le salon est dans `MocChannel` ; si le message ne contient ni pièce jointe ni embed image/vidéo, supprimer le message et informer l'auteur (message éphémère ou DM)
- [ ] 10.2 Créer le module `MocModule` dans l'API avec :
  - `GET /guilds/:guildId/moc-channels` — lister les salons MOC configurés
  - `POST /guilds/:guildId/moc-channels` — ajouter un salon MOC (`channelId`)
  - `DELETE /guilds/:guildId/moc-channels/:channelId` — retirer un salon de la liste MOC
- [ ] 10.3 Mettre en cache la liste des salons MOC en mémoire dans le bot ; invalider sur modification via API

## 11. API NestJS (packages/api)

- [ ] 11.1 Scaffolder l'app NestJS avec `@nestjs/cli` ; configurer `AppModule` avec `TypeOrmModule.forRoot`, `ConfigModule.forRoot`
- [ ] 11.2 Créer `AuthModule` avec `POST /auth/callback` — recevoir le code d'autorisation Discord OAuth2, échanger contre le token Discord, récupérer utilisateur + liste de serveurs, émettre un JWT signé dans un cookie HttpOnly
- [ ] 11.3 Créer `POST /auth/logout` — effacer le cookie JWT
- [ ] 11.4 Créer `JwtAuthGuard` — valider le cookie JWT et attacher le payload décodé à la requête
- [ ] 11.5 Créer `GuildAdminGuard` — vérifier `MANAGE_GUILD` pour le `guildId` demandé via le token Discord stocké
- [ ] 11.6 Créer `GuildsModule` avec `GET /guilds` — retourner les serveurs gérés par l'utilisateur où le bot est actif
- [ ] 11.7 Créer `AuditLogModule` avec `GET /guilds/:guildId/audit-log` — paginé (25/page), filtrable par `action` et `targetId` ; protégé par les guards
- [ ] 11.8 Créer `GuildConfigModule` avec `GET /guilds/:guildId/config` et `PATCH /guilds/:guildId/config` — validé avec DTOs class-validator ; protégé par les guards
- [ ] 11.9 Créer `XpModule` avec `GET /guilds/:guildId/xp/config`, `PATCH /guilds/:guildId/xp/config` et `GET /guilds/:guildId/xp/leaderboard` (top 50 par XP) ; protégé par les guards
- [ ] 11.10 Créer `AutoModerationModule` avec `GET /guilds/:guildId/auto-moderation` et `PATCH /guilds/:guildId/auto-moderation` ; protégé par les guards ; invalider le cache en mémoire du bot sur PATCH
- [ ] 11.11 Créer `BirthdaysModule` (voir tâche 9.3)
- [ ] 11.12 Créer `MocModule` (voir tâche 10.2)
- [ ] 11.13 Créer `EmbedsModule` avec :
  - `GET /guilds/:guildId/embeds` — lister les embeds sauvegardés
  - `POST /guilds/:guildId/embeds` — créer un embed
  - `PATCH /guilds/:guildId/embeds/:embedId` — modifier un embed
  - `DELETE /guilds/:guildId/embeds/:embedId` — supprimer un embed
  - `POST /guilds/:guildId/embeds/:embedId/send` — envoyer l'embed dans un salon via Discord REST (bot token)
- [ ] 11.14 Créer `StatsModule` avec `GET /guilds/:guildId/stats` — retourner les statistiques du serveur (membres actuels, arrivées/départs du jour, messages du jour, top 5 membres les plus actifs par XP)
- [ ] 11.15 Créer `MembersModule` avec `GET /guilds/:guildId/members` — retourner la liste des membres avec `UserXp` (username, avatarUrl, joinedAt, xp, level) et le nombre de warns actifs depuis `AuditEntry`
- [ ] 11.16 Ajouter dans `MembersModule` les endpoints d'actions de modération en 1 clic :
  - `POST /guilds/:guildId/members/:userId/warn`
  - `POST /guilds/:guildId/members/:userId/timeout`
  - `POST /guilds/:guildId/members/:userId/kick`
  - `POST /guilds/:guildId/members/:userId/ban`

## 12. Dashboard React/Vite (packages/dashboard)

- [ ] 12.1 Scaffolder l'app Vite + React 18 + TypeScript ; configurer Tailwind CSS
- [ ] 12.2 Configurer React Router v6 avec les routes : `/`, `/auth/callback`, `/dashboard`, `/dashboard/:guildId`, `/dashboard/:guildId/audit-log`, `/dashboard/:guildId/settings`, `/dashboard/:guildId/auto-moderation`, `/dashboard/:guildId/xp`, `/dashboard/:guildId/announce`, `/dashboard/:guildId/birthdays`, `/dashboard/:guildId/moc`, `/dashboard/:guildId/members`
- [ ] 12.3 Implémenter `AuthContext` — décoder le payload JWT depuis le cookie ; fournir `login()` (redirection vers Discord OAuth) et `logout()` (appel `POST /auth/logout`, réinitialiser l'état)
- [ ] 12.4 Implémenter le composant `ProtectedRoute` — redirige vers `/` si non authentifié
- [ ] 12.5 Construire la page de connexion `/` — bouton "Se connecter avec Discord"
- [ ] 12.6 Construire la page callback OAuth `/auth/callback` — envoyer le code à `POST /auth/callback`, rediriger vers `/dashboard` en cas de succès
- [ ] 12.7 Construire la page de sélection de serveur `/dashboard` — liste les serveurs gérables où le bot est présent ; section séparée "Ajouter le bot" pour les autres
- [ ] 12.8 Construire la vue d'ensemble `/dashboard/:guildId` — nombre de membres, arrivées/départs du jour, messages du jour, top 5 membres les plus actifs, 3 dernières entrées d'audit
- [ ] 12.9 Construire la page des logs de modération `/dashboard/:guildId/audit-log` — table paginée avec filtres action/cible ; URL reflète les filtres actifs
- [ ] 12.10 Construire la page des paramètres généraux `/dashboard/:guildId/settings` — formulaire prérempli depuis `GuildConfig` (salon de logs, salon de bienvenue, message de bienvenue, auto-rôle, salon d'anniversaires) ; PATCH à la sauvegarde, erreurs de validation inline, toast de succès
- [ ] 12.11 Construire la page d'auto-modération `/dashboard/:guildId/auto-moderation` — gestion des mots interdits (ajouter/supprimer), rôles exemptés (ajouter/supprimer), toggles spam/liens/invitations ; PATCH à la sauvegarde
- [ ] 12.12 Construire la page de config XP `/dashboard/:guildId/xp` — champs `xpPerMessage`, `messageCooldownSeconds`, `xpPerVoiceMinute` ; lignes de paliers niveau → rôle éditables ; tableau leaderboard top 50 ; PATCH config à la sauvegarde
- [ ] 12.13 Construire la page des annonces `/dashboard/:guildId/announce` — liste des embeds sauvegardés (créer, modifier, supprimer, envoyer) ; formulaire d'embed avec titre, description, couleur (color picker), salon cible ; prévisualisation live de l'embed
- [ ] 12.14 Construire la page des anniversaires `/dashboard/:guildId/birthdays` — liste des anniversaires (username, date) ; ajouter (ID Discord, mois, jour) / supprimer un anniversaire
- [ ] 12.15 Construire la page MOC `/dashboard/:guildId/moc` — liste des salons MOC configurés ; ajouter (ID de salon) / supprimer un salon
- [ ] 12.16 Construire la page de gestion des membres `/dashboard/:guildId/members` — liste paginée avec avatar, username, date d'arrivée, niveau, XP, nombre de warns ; boutons d'action en 1 clic (warn, timeout, kick, ban) avec modale de confirmation et champ raison
- [ ] 12.17 Construire le layout sidebar responsive (desktop) / menu hamburger (mobile ≤ 375px) englobant toutes les pages `/dashboard/*`
- [ ] 12.18 Vérifier le contraste WCAG 2.1 AA sur toutes les pages avec un outil d'accessibilité navigateur

## 13. Intégration & Finitions

- [ ] 13.1 Écrire un `docker-compose.yml` avec un service `mysql` et les variables d'environnement pour le développement local
- [ ] 13.2 Ajouter un script `dev` racine démarrant le processus bot, le serveur dev NestJS et le serveur dev Vite en parallèle
- [ ] 13.3 Smoke-test du flux complet : bot rejoint le serveur de test → commande `/ban` → entrée d'audit visible dans le dashboard → auto-modération déclenche sur mot interdit → XP gagné sur message → rôle assigné au palier → anniversaire envoyé → embed sauvegardé et envoyé depuis le dashboard → salon MOC supprime un message texte
- [ ] 13.4 Documenter les étapes de mise en place dans `README.md` (prérequis, variables d'environnement, `deploy-commands`, `docker-compose up`)
