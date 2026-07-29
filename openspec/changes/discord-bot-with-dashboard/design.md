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

### Monorepo npm workspaces
**Décision** : Un repo unique avec quatre workspaces — `apps/bot`, `apps/api`, `apps/dashboard`, `packages/shared` — où `shared` contient les entités TypeORM et types consommés par l'API et le bot.
**Pourquoi** : Les types/entités partagés éliminent les dérives entre les formes de réponse API et les consommateurs dashboard/bot. Une modification d'une entité met à jour tous les consommateurs.
**Alternatives considérées** : Repos séparés (plus de flexibilité de déploiement mais partage de types douloureux) ; **pnpm workspaces** (choix initial de cette section — l'équipe a finalement implémenté avec **npm workspaces** classique, plus simple à outiller pour l'équipe ; aucun `pnpm-workspace.yaml`/`pnpm-lock.yaml` dans le repo, `package.json` racine utilise `"workspaces": ["apps/*", "packages/*"]`).
**Correction 2026-07-29** : les dossiers `packages/bot`, `packages/api`, `packages/dashboard` envisagés initialement sont en réalité `apps/bot`, `apps/api`, `apps/dashboard` dans l'implémentation — seul `packages/shared` a gardé son nom d'origine. Toutes les références à `packages/{bot,api,dashboard}` dans ce document et `tasks.md` sont obsolètes.

### discord.js 14 avec commandes slash uniquement
**Décision** : Toutes les commandes sont enregistrées comme commandes d'application (slash) ; pas de commandes préfixées legacy.
**Pourquoi** : Discord a déprécié l'intent message-content pour les bots vérifiés ; les commandes slash fournissent autocomplétion et scoping de permissions intégrés.
**Alternatives considérées** : Commandes préfixées via intent message-content (intent privilégié, en cours de suppression).

### Le processus bot est un module NestJS encapsulant discord.js
**Décision** : `apps/bot` n'est pas un script discord.js minimal (`src/index.ts` + `Client`) comme envisagé initialement, mais une application NestJS à part entière (`app.module.ts`, `discord/bot.module.ts`, `discord/bot.service.ts` qui expose le client discord.js, `events/event.module.ts` avec des listeners injectables comme `MessageCreateListener`).
**Pourquoi** : Cohérence avec `apps/api` (même stack NestJS + TypeORM, même pattern module/service/DI) ; injection directe des repositories TypeORM (`@InjectRepository`) dans les listeners d'événements Discord ; testabilité (chaque listener est un provider Nest testable unitairement, cf. `message-create.listener.spec.ts`).
**Alternatives considérées** : Script discord.js minimal (approche d'origine) — écartée au profit de la cohérence d'ensemble du monorepo.
**Statut réel (2026-07-29)** : seul `MessageCreateListener` existe, gérant uniquement le filtre de mots interdits + rôles exemptés (capability `auto-moderation`, partiellement). Aucune commande slash, pas de détection de spam/liens/invitations, pas de système XP, pas de cron anniversaire, pas de MOC côté bot à ce jour.

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

**Obsolète — remplacé le 2026-07-29.** Le schéma ci-dessous (10 entités, plusieurs colonnes JSON) était la première intention. L'implémentation réelle a divergé pendant le Sprint 1 vers un schéma plus normalisé (16 entités, voir `docs/Sprint 1` et les MCD/MLD/MPD dans `docs/Document Brief.pdf`), défini dans `packages/shared/src/entities/`. Table à jour :

| Entité (fichier) | Champs clés | Écart vs schéma d'origine |
|---|---|---|
| `Guild` | `guild_id` (PK, snowflake Discord), `guild_name` | Pas de `iconUrl`/`active`/`createdAt` |
| `Guild_config` | `id`, `welcome_channel_id`, `member_count_channel_id`, `all_log_channel_id`, `birthday_channel_id`, `twitch_channel_id`, relation 1,1 `guild` | Pas de `welcomeMessage`/`autoRoleId` (voir `Automatic_role`) |
| `Log` | `id`, `target_id`, `author_id`, `type` (enum `LogType`), `reason`, `datetime`, relation `guild` | Remplace `AuditEntry` ; `type` au lieu de `action` |
| `Channel_log` | `id`, `type`, `channel_id`, relation `guild` | Salon de logs par type d'action (RG-14), absent du schéma d'origine |
| `Warning` | `id`, `target_id`, `author_id`, `reason`, `is_active`, relation `member` | Table dédiée (pas fondue dans `AuditEntry`), permet le flag `is_active` pour `/unwarn` (US-12) |
| `Mute` | `id`, `user_id`, `mute_duration`, `started_at`, `expire_at`, relation `member` | Table dédiée pour le mute anti-spam (RG-13), absente du schéma d'origine |
| `Filtered_word` | `id`, `word`, relation `guild` | Remplace la colonne JSON `bannedWords` de `AutoModerationConfig` |
| `Exempted_role` | `id`, `role_id`, relation `guild` | Remplace la colonne JSON `exemptRoleIds` |
| `Automatic_role` | `id`, `role_id`, relation `guild` | Rôles attribués à l'arrivée (RG-21), absent du schéma d'origine |
| `Level_config` | `id`, `max_level`, `xp_multiplier`, `xp_per_message`, `xp_per_voice_min`, `xp_cooldown_sec`, relation 1,1 `guild` | Remplace `GuildXpConfig` (sans la colonne JSON `levelRewards`, voir `Level_reward`) |
| `Level_reward` | `id`, `level`, `role_id`, relation `guild` | Table dédiée au lieu de `levelRewards` en JSON — une ligne par palier |
| `Member` | `member_id`, `discord_user_id`, `current_xp`, `current_level`, `last_xp_at`, `joined_at`, `left_at`, relation `guild` | Remplace `UserXp` |
| `Birthday` | `id`, `discord_user_id`, `datetime`, `date_post`, relation 0,1 `member` | — |
| `Embed` | `id`, `title`, `description`, `color`, relation `guild` | Remplace `SavedEmbed` ; **pas de `name`** (impossible de distinguer plusieurs embeds sauvegardés par nom) ni de `createdAt`/`updatedAt` |
| `Moc_channel` | `id`, `moc_channel_id`, `allow_files`, `allow_images`, `allow_videos`, `allow_links`, `allow_text`, relation `guild` | Bien plus riche que `MocChannel` d'origine — types de contenus autorisés déclaratifs (cf. RG-20) |
| `Twitch` | `id`, `twitch_username`, relation `guild` | Existe en base alors que Twitch est un **non-objectif v1** (voir Objectifs/Non-objectifs plus haut) — code d'anticipation, non prioritaire |

**Écarts connus / travail restant identifiés le 2026-07-29 :**
- **Aucune entité `GuildStatEntry`** (ou équivalent) n'existe : la page dashboard `StatsPage.tsx` (capability `dashboard-ui`, US-09) tourne entièrement sur des données mockées, sans aucune persistance ni endpoint API réels derrière.
- **Aucune colonne de toggle** (`spamDetectionEnabled`, `linkFilterEnabled`, `inviteFilterEnabled`, `autoMuteDurationMinutes`) n'existe nulle part dans le schéma actuel — ni sur `Guild_config`, ni ailleurs. Nécessaire avant de pouvoir implémenter RG-06/07/08/09 (spam, liens, invitations) côté bot. À ajouter (nouvelle entité `AutoModerationConfig` ou colonnes sur `Guild_config`) avant de commencer ces fonctionnalités.
- `synchronize: true` est utilisé en développement (`apps/api/src/database/database.module.ts`) plutôt que des migrations TypeORM versionnées — acceptable en dev, mais `data-source.ts` a besoin d'être réactivé avec ses migrations avant la mise en production (voir aussi `api-roadmap-journal.txt`).

**Enum `ModerationAction`** (`LogType`, dans `packages/shared/src/enum`) : à vérifier/aligner avec la liste `KICK`, `BAN`, `TIMEOUT`, `WARN`, `UNBAN`, `UNTIMEOUT`, `UNWARN`, `LOCK`, `UNLOCK`, `CLEAR`, `SERVER_MUTE`, `SERVER_UNMUTE` envisagée initialement — non vérifié lors de cette passe de mise à jour, à confirmer contre `packages/shared/src/enum` avant l'implémentation des commandes de modération.

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
