## Contexte

Projet greenfield : un bot Discord auto-hébergé couplé à un dashboard web. Aucune base de code existante. La cible est le serveur communautaire "Wystrelia" avec un second serveur de développement/test, ce qui en fait un bot privé multi-serveurs.

Le système comprend deux processus runtime : un **processus bot** long-running (discord.js) et un **serveur API** (NestJS). Le dashboard React/Vite est un SPA statique servi séparément. Les trois partagent une base MySQL via TypeORM.

## Objectifs / Non-objectifs

**Objectifs :**
- Commandes slash de modération complètes avec audit trail
- Auto-modération passive (mots interdits, spam, liens, invitations)
- Configuration par serveur persistée en MySQL
- Dashboard web — stats serveur, logs de modération, gestion des membres, paramètres, config XP/niveau, leaderboard, anniversaires, embeds sauvegardés, MOC
- Système XP/niveau avec pool unifié messages + vocal, taux configurables, récompenses de rôles aux paliers
- Système d'anniversaires avec cron quotidien et message automatique
- Média-Only-Channels (MOC) avec suppression automatique des messages non-médias
- Embeds personnalisés sauvegardables, envoyables via dashboard et commande slash
- Monorepo TypeScript unique pour partager les types entre bot, API et dashboard

**Non-objectifs :**
- Hébergement SaaS multi-tenant — auto-hébergé par opérateur
- Application mobile ou client desktop natif
- Push WebSocket temps-réel vers le dashboard (polling suffisant en v1)
- Lecture musicale ou fonctionnalités économiques
- Détection de streams Twitch (hors périmètre)
- Planification hebdomadaire (hors périmètre)
- Réponses aléatoires au ping du bot (bonus uniquement)

## Décisions

### Monorepo pnpm workspaces
**Décision** : Un repo unique avec quatre packages — `packages/bot`, `packages/api`, `packages/dashboard`, `packages/shared` — où `shared` contient les interfaces TypeScript et DTOs consommés par l'API et le dashboard.
**Pourquoi** : Les types partagés éliminent les dérives entre les formes de réponse API et les consommateurs dashboard. Une modification d'un DTO met à jour tous les consommateurs.
**Alternatives considérées** : Repos séparés (plus de flexibilité de déploiement mais partage de types douloureux).

### discord.js 14 avec commandes slash uniquement
**Décision** : Toutes les commandes sont enregistrées comme commandes d'application (slash) ; pas de commandes préfixées legacy.
**Pourquoi** : Discord a déprécié l'intent message-content pour les bots vérifiés ; les commandes slash fournissent autocomplétion et scoping de permissions intégrés.
**Alternatives considérées** : Commandes préfixées via intent message-content (intent privilégié, en cours de suppression).

### NestJS pour l'API REST
**Décision** : NestJS comme framework API, avec modules TypeORM et Guards pour l'application de l'authentification.
**Pourquoi** : Le pattern module/contrôleur/service se mappe proprement à chaque domaine fonctionnel (serveurs, audit-log, config, XP, auto-modération, anniversaires, embeds, MOC). Les pipes intégrés gèrent la validation DTO via class-validator.
**Alternatives considérées** : Fastify (plus léger mais moins structuré), Express (trop basique), routes API Next.js (couplage dashboard/API, impose Next.js côté front).

### React 18 + Vite pour le dashboard
**Décision** : SPA React 18 compilé avec Vite ; Tailwind CSS pour les styles ; pas de bibliothèque de composants.
**Pourquoi** : Vite offre un HMR rapide et un pipeline de build simple sans complexité SSR. Tailwind garde le bundle léger sans dépendance lourde.
**Alternatives considérées** : Next.js (SSR surdimensionné pour un dashboard admin privé), Remix (écosystème moins mature pour ce cas d'usage).

### TypeORM + mysql2
**Décision** : TypeORM comme ORM avec mysql2 comme driver, ciblant une base MySQL.
**Pourquoi** : TypeORM s'intègre nativement avec NestJS via `@nestjs/typeorm`. Les entités sont des classes TypeScript avec décorateurs, gardant le schéma co-localisé avec les types. mysql2 est le driver MySQL moderne recommandé.
**Alternatives considérées** : Prisma (bonne tooling mais intégration NestJS moins native), Drizzle (plus léger mais moins mature), requêtes brutes (pas de typage).

### Discord OAuth2 + JWT pour l'authentification dashboard
**Décision** : Flux Discord OAuth2 manuel ; à la callback, échange du code contre un token Discord, vérification du statut admin, émission d'un JWT signé stocké dans un cookie HttpOnly.
**Pourquoi** : Pas de dépendance framework (NextAuth supprimé avec Next.js). JWT stateless — le processus bot et l'API font confiance au même secret JWT. Cookie HttpOnly prévient le vol de token via XSS.
**Alternatives considérées** : Passport.js (complexité ajoutée pour un seul provider OAuth), sessions server-side (nécessitent un store de sessions et un état partagé entre processus).

### XP comme pool unifié
**Décision** : Messages et activité vocale contribuent à un seul compteur XP par utilisateur par serveur. Taux configurables : `xpPerMessage` (avec fenêtre de cooldown par utilisateur en secondes), `xpPerVoiceMinute`. Les paliers de niveau et leurs récompenses de rôles sont stockés en colonne JSON (`levelRewards: [{level, roleId}]`) dans `GuildXpConfig`.
**Pourquoi** : Modèle de données plus simple — les utilisateurs ne suivent pas deux barres séparées. Le cooldown sur les messages prévient le farming XP.
**Alternatives considérées** : Pools séparés (plus de granularité mais complexité inutile pour ce périmètre).

### Audit log comme table de premier ordre
**Décision** : Chaque action de modération écrit une ligne dans `AuditEntry` de façon synchrone avant que l'appel API Discord ne se termine. Le server mute manuel détecté via `voiceStateUpdate` est également loggé automatiquement.
**Pourquoi** : Garantit la cohérence du log même si l'audit log Discord est indisponible ou que le bot redémarre.

### Auto-modération via handler passif sur messageCreate
**Décision** : Un handler sur l'événement `messageCreate` vérifie séquentiellement : rôle exempté, mots interdits, spam, liens, invitations. Si une règle est déclenchée, le message est supprimé et un embed de log est posté dans `logChannelId`.
**Pourquoi** : Simple à implémenter et déboguer. La config d'auto-modération est mise en cache en mémoire pour éviter une requête DB à chaque message.
**Alternatives considérées** : Middleware dédié (sur-ingénierie pour ce périmètre).

### Anniversaires via cron quotidien
**Décision** : Un job cron s'exécute chaque jour à minuit UTC et vérifie les entrées `Birthday` dont `month` et `day` correspondent à la date du jour. Un message embed est envoyé dans `birthdayChannelId` si configuré.
**Pourquoi** : Simple et prévisible. Pas de dépendance à un gestionnaire de tâches externe.
**Compromis** : Le cron tourne à minuit UTC — le message peut arriver à des heures décalées selon le fuseau horaire des membres. Acceptable en v1.

### MOC via suppression de messages non-médias
**Décision** : Un handler sur `messageCreate` vérifie si le salon est dans `MocChannel`. Si le message ne contient ni pièce jointe ni embed avec image/vidéo, il est supprimé et l'auteur reçoit un message éphémère d'explication.
**Pourquoi** : Logique cohérente avec le reste de l'auto-modération.

### Embeds sauvegardés en DB, envoi via token bot dans l'API
**Décision** : Les templates d'embeds sont stockés dans `SavedEmbed`. L'envoi depuis le dashboard appelle un endpoint API dédié qui utilise le token bot (via Discord REST) pour poster l'embed — sans nécessiter de communication inter-processus avec le bot.
**Pourquoi** : Évite l'architecture complexe queue/IPC. L'API NestJS peut utiliser `@discordjs/rest` directement avec le bot token pour envoyer des messages.

### Statistiques serveur via entité GuildStatEntry
**Décision** : Les handlers `guildMemberAdd`, `guildMemberRemove` et `messageCreate` incrémentent les compteurs de la ligne `GuildStatEntry` du jour courant (upsert par `guildId` + `date`).
**Pourquoi** : Permet au dashboard d'afficher des statistiques historiques sans appeler l'API Discord à chaque requête.

## Schéma de base de données

| Entité | Champs clés |
|---|---|
| `Guild` | `id`, `name`, `iconUrl`, `active`, `createdAt` |
| `GuildConfig` | `guildId`, `logChannelId`, `welcomeChannelId`, `welcomeMessage`, `autoRoleId`, `birthdayChannelId` |
| `AuditEntry` | `id`, `guildId`, `actorId`, `targetId`, `action` (enum), `reason`, `createdAt` |
| `GuildXpConfig` | `guildId`, `xpPerMessage`, `messageCooldownSeconds`, `xpPerVoiceMinute`, `levelRewards` (JSON) |
| `UserXp` | `id`, `guildId`, `userId`, `username`, `avatarUrl`, `joinedAt`, `xp`, `level`, `lastMessageAt` |
| `AutoModerationConfig` | `guildId`, `bannedWords` (JSON), `spamDetectionEnabled`, `linkFilterEnabled`, `inviteFilterEnabled`, `exemptRoleIds` (JSON) |
| `Birthday` | `id`, `guildId`, `userId`, `month`, `day` |
| `SavedEmbed` | `id`, `guildId`, `name`, `title`, `description`, `color`, `createdAt`, `updatedAt` |
| `MocChannel` | `id`, `guildId`, `channelId` |
| `GuildStatEntry` | `id`, `guildId`, `date` (DATE), `memberCount`, `joins`, `leaves`, `messageCount` |

**Enum `ModerationAction`** : `KICK`, `BAN`, `TIMEOUT`, `WARN`, `UNBAN`, `UNTIMEOUT`, `UNWARN`, `LOCK`, `UNLOCK`, `CLEAR`, `SERVER_MUTE`, `SERVER_UNMUTE`

## Risques / Compromis

- **Exposition du token bot** → Variables d'environnement uniquement ; ne jamais commiter dans le repo. Utiliser Docker secrets ou un gestionnaire de secrets en production.
- **Rate limits Discord API** → L'enregistrement des commandes slash est global et mis en cache ; éviter de ré-enregistrer à chaque démarrage. Enregistrement par serveur en développement.
- **Scope OAuth token** → Demander uniquement les scopes `identify guilds` ; jamais le scope `bot` depuis le flux OAuth (le bot est ajouté séparément via le lien d'invitation).
- **Rotation du secret JWT** → Faire pivoter `JWT_SECRET` invalide toutes les sessions actives ; tous les utilisateurs doivent se reconnecter après rotation.
- **Processus bot unique = SPOF** → Acceptable pour un usage auto-hébergé v1 ; utiliser PM2 ou systemd pour la résilience.
- **Obsolescence des données dashboard** → Le dashboard lit la DB directement, pas l'API Discord, donc les compteurs de membres peuvent être légèrement décalés. Acceptable vs complexité temps-réel.
- **Précision XP vocal** → XP accordé quand l'utilisateur quitte le vocal ; un crash entre join et leave perdrait l'XP de cette session. Acceptable en v1.
- **Anniversaires et fuseaux horaires** → Cron à minuit UTC ; le message peut arriver à des heures décalées selon le fuseau horaire des membres. Acceptable en v1.
- **Performance auto-modération** → Le handler `messageCreate` effectue plusieurs vérifications séquentielles ; la config d'auto-modération doit être mise en cache en mémoire et invalidée sur PATCH config.

## Plan de migration

1. Provisionner une instance MySQL (Docker local ou PaaS managé)
2. Définir les variables d'environnement (`DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `JWT_SECRET`, `DASHBOARD_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)
3. Exécuter les migrations TypeORM : `pnpm --filter api run migration:run`
4. Enregistrer les commandes slash (par serveur pour le dev, global pour la prod) : `pnpm --filter bot run deploy-commands`
5. Démarrer le serveur API : `pnpm --filter api start`
6. Démarrer le processus bot : `pnpm --filter bot start`
7. Compiler et servir le dashboard : `pnpm --filter dashboard build` puis servir `dist/`

Rollback : arrêter les deux processus ; pas de changements DB irréversibles en v1 (toutes les migrations sont additives).

## Questions ouvertes

- La commande `/announce` devrait-elle permettre de sélectionner un embed sauvegardé, ou rester un envoi ponctuel uniquement ?
- Stratégie de rate limit pour les opérations de ban en masse — reporter en v2.
- Format du message d'anniversaire : embed fixe ou message configurable par serveur ?
