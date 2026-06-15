# ARCHITECTURE FRONTEND / BACKEND — WYSTRELIA BOT & DASHBOARD

---

## 1. Structure Globale et Typologie Applicative

Le projet adopte une architecture **découplée de type Client/Serveur**. Chaque partie du système a un rôle unique et communique avec les autres via des protocoles définis. Aucune couche ne mélange les responsabilités d'une autre.

L'écosystème repose sur **trois composants principaux** qui partagent tous la même base de données MySQL :

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   Bot Discord    │        │    API REST       │        │   Dashboard      │
│  (discord.js)   │◀──DB──▶│    (NestJS)       │◀─HTTP─▶│  (React / Vite)  │
└──────────────────┘        └──────────────────┘        └──────────────────┘
         │                          │                            │
         └──────────────────────────┼────────────────────────────┘
                                    ▼
                            [ MySQL + TypeORM ]
```

**1. Le Bot Discord** est un processus Node.js qui tourne en permanence. Il maintient une connexion WebSocket avec Discord et réagit aux événements en temps réel : messages, arrivée de membres, commandes slash, activité vocale. C'est lui qui exécute les actions directement sur le serveur Discord (ban, kick, suppression de message…).

**2. L'API REST (NestJS)** est le cerveau de l'application. Elle expose des routes HTTP consommées par le dashboard, applique les règles de sécurité (authentification, vérification des permissions), et contient toute la logique métier. Elle peut aussi envoyer des messages Discord directement, sans passer par le bot.

**3. Le Dashboard (React)** est une interface web réservée aux administrateurs de serveur. C'est une *Single Page Application* : elle s'exécute entièrement dans le navigateur et dialogue uniquement avec l'API via des requêtes HTTP. Elle n'a aucun accès direct à Discord ni à la base de données.

---

## 2. Organisation du Code (Monorepo)

Tout le code est hébergé dans **un seul dépôt Git**, structuré en plusieurs applications indépendantes :

```
CDA-Soutenance/
├── apps/
│   ├── api/          → Serveur NestJS (API REST + logique métier)
│   ├── bot/          → Processus Bot discord.js
│   └── dashboard/    → Interface React (SPA admin)
├── packages/
│   └── shared/       → Types TypeScript et DTOs communs
└── docs/             → Documentation
```

Le dossier `packages/shared` joue un rôle clé : il centralise les **interfaces TypeScript et les DTOs** (objets de transfert de données) utilisés à la fois par l'API et le dashboard. Cela garantit que si la forme d'une réponse API change, le dashboard en est informé immédiatement par le compilateur TypeScript — sans aucune dérive silencieuse.

---

## 3. Stack Technique

L'ensemble du projet est écrit en **TypeScript**, aussi bien côté bot, API que dashboard. Ce choix unifie le langage sur toute la chaîne et permet de partager des types entre les applications.

| Composant | Technologie | Rôle |
|---|---|---|
| Bot | discord.js 14 | Connexion à la gateway Discord, gestion des événements |
| API | NestJS 11 | Serveur HTTP structuré en modules (Controller / Service / Entity) |
| ORM | TypeORM 1.x | Mapping entre les classes TypeScript et les tables MySQL |
| Base de données | MySQL 8 | Persistance de toutes les données (config, XP, audit…) |
| Dashboard | React 18 + Vite | SPA compilée, rendu côté navigateur |
| Styles | Tailwind CSS | Styles utilitaires, sans bibliothèque de composants tierce |
| Authentification | Discord OAuth2 + JWT | Connexion via Discord, session sécurisée par cookie HttpOnly |

---

## 4. Les Trois Processus et Leurs Responsabilités

### 4.1 Bot Discord — Réactivité aux événements

Le bot est le seul composant qui parle directement à Discord en temps réel. Il écoute un ensemble d'**événements** émis par la gateway Discord et déclenche les actions correspondantes :

| Événement | Ce que le bot fait |
|---|---|
| `messageCreate` | Vérifie les règles d'auto-modération (mots interdits, spam, liens), attribue de l'XP, applique les règles MOC |
| `interactionCreate` | Traite les commandes slash (`/kick`, `/ban`, `/rank`, `/announce`…) |
| `guildMemberAdd` | Crée le profil XP du membre, attribue l'auto-rôle, envoie le message de bienvenue |
| `guildMemberRemove` | Met à jour les statistiques de départs du jour |
| `voiceStateUpdate` | Calcule et attribue l'XP vocal, détecte les mutes manuels |
| `guildCreate / guildDelete` | Crée ou désactive les configurations du serveur en base |

Le bot dispose également d'un **cron quotidien** qui s'exécute à minuit UTC pour envoyer automatiquement les messages d'anniversaire dans les salons configurés.

> Les commandes slash sont enregistrées **une seule fois** via un script dédié (`deploy-commands`), pas à chaque redémarrage du bot.

### 4.2 API REST (NestJS) — Logique métier et sécurité

Le serveur NestJS est organisé en **modules**, un par domaine fonctionnel (guilds, xp, audit-log, auto-moderation, embeds, birthdays, moc…). Chaque module suit la même structure interne :

- **Controller** : reçoit la requête HTTP, délègue au service, retourne la réponse.
- **Service** : contient la logique métier (calculs, appels TypeORM, appels Discord REST).
- **Entity** : représente une table MySQL via des décorateurs TypeORM.
- **DTO** : valide et type les données entrantes grâce à `class-validator`.

Toutes les routes `/api/guilds/:guildId/*` sont protégées par deux **Guards NestJS** appliqués en séquence : d'abord la vérification du JWT, ensuite la vérification de la permission `MANAGE_GUILD` sur le serveur demandé.

L'API peut aussi **envoyer des messages Discord directement** (pour les embeds sauvegardés par exemple) en utilisant `@discordjs/rest` avec le token du bot — sans avoir besoin de communiquer avec le processus bot.

### 4.3 Dashboard React — Interface d'administration

Le dashboard est une **SPA statique** compilée par Vite et servie séparément. Il s'exécute entièrement dans le navigateur et ne fait qu'appeler l'API via `fetch`.

Il n'y a **pas de WebSocket** côté dashboard : les données sont rechargées à chaque navigation (polling HTTP simple), ce qui est suffisant pour un usage d'administration.

**Pages disponibles :**

| Route | Contenu |
|---|---|
| `/dashboard` | Sélection du serveur à administrer |
| `/dashboard/:guildId` | Vue d'ensemble : stats, activité, dernières sanctions |
| `/dashboard/:guildId/audit-log` | Historique de modération filtrable et paginé |
| `/dashboard/:guildId/settings` | Paramètres généraux (salons, auto-rôle, bienvenue) |
| `/dashboard/:guildId/auto-moderation` | Mots interdits, filtres spam/liens/invitations, rôles exemptés |
| `/dashboard/:guildId/xp` | Taux XP, paliers de niveau, leaderboard |
| `/dashboard/:guildId/members` | Liste des membres avec actions de modération en 1 clic |
| `/dashboard/:guildId/embeds` | Création, prévisualisation et envoi d'embeds Discord |
| `/dashboard/:guildId/birthdays` | Gestion des anniversaires |
| `/dashboard/:guildId/moc` | Configuration des salons Média-Only |

L'interface est **responsive** (de 375px mobile à 1440px desktop) et respecte les critères de contraste **WCAG 2.1 AA**.

---

## 5. Base de Données

Toutes les données sont persistées dans une base **MySQL 8**, accessible par le bot et l'API via **TypeORM**. Le schéma évolue uniquement par des **migrations versionnées** (`synchronize: false` — aucune modification automatique au démarrage).

Le schéma est organisé autour de la table centrale `GUILD`, à laquelle toutes les autres tables sont rattachées via une clé étrangère `guild_id`.

**Tables rattachées au serveur (`guild_id`) :**

| Table | Colonnes principales | Rôle |
|---|---|---|
| `GUILD` | `guild_id` (PK BigInt), `guild_name`, `guild_picture` | Référentiel des serveurs Discord |
| `GUILD_CONFIG` | `welcome_channel_id`, `member_count_channel_id`, `all_log_channel_id`, `birthday_channel_id`, `twitch_channel_id` | Paramètres généraux du serveur |
| `LEVEL_CONFIG` | `max_level`, `xp_multiplier`, `xp_per_message`, `xp_per_voice_min`, `xp_cooldown_sec` | Configuration du système d'XP |
| `LEVEL_REWARD` | `level`, `role_id` | Rôles attribués à chaque palier de niveau |
| `MEMBER` | `discord_user_id`, `current_xp`, `current_level`, `last_xp_at`, `joined_at`, `left_at` | Profil XP et présence de chaque membre |
| `LOGS` | `target_id`, `author_id`, `type` (ENUM), `reason`, `datetime` | Historique de modération (audit log) |
| `CHANNEL_LOG` | `type` (ENUM), `channel_id` | Salons de logs par type d'événement |
| `FILTERED_WORD` | `word` | Mots interdits par l'auto-modération |
| `EXEMPTED_ROLE` | `role_id` | Rôles exemptés de l'auto-modération |
| `AUTOMATIC_ROLES` | `role_id` | Rôles attribués automatiquement à l'arrivée |
| `EMBED` | `title`, `description`, `color` | Templates d'embeds Discord sauvegardés |
| `MOC_CHANNEL` | `moc_channel_id`, `allow_files`, `allow_images`, `allow_videos`, `allow_links`, `allow_text` | Configuration des salons Média-Only |
| `TWITCH` | `twitch_username` | Streamers Twitch à surveiller par serveur |

**Tables rattachées à un membre (`member_id`) :**

| Table | Colonnes principales | Rôle |
|---|---|---|
| `WARNING` | `target_id`, `author_id`, `reason`, `is_active` | Avertissements actifs ou levés |
| `MUTE` | `mute_duration`, `started_at`, `expire_at` | Historique des mutes temporaires |
| `BIRTHDAY` | `discord_user_id`, `datetime`, `date_post` | Date d'anniversaire et date du dernier post |

> Les entrées de `LOGS` sont **immuables** : aucun DELETE ni UPDATE n'est autorisé. Lever un avertissement (`WARNING.is_active = false`) écrit une nouvelle ligne dans `LOGS` avec le type `UNWARN` — l'entrée d'origine est conservée pour la traçabilité.

---

## 6. Flux d'Authentification

L'authentification repose sur un flux **Discord OAuth2 manuel** — sans Passport.js ni NextAuth. Le JWT émis est stocké dans un **cookie HttpOnly**, invisible au JavaScript du navigateur, ce qui protège contre le vol de session par XSS.

```
Utilisateur clique "Se connecter avec Discord"
        │
        ▼
Dashboard redirige vers GET /auth/discord (API NestJS)
        │
        ▼
L'API redirige vers Discord OAuth2 (scopes : identify + guilds)
        │
        ▼
L'utilisateur accepte → Discord rappelle GET /auth/discord/callback?code=XXX
        │
        ▼
L'API échange le code contre un access_token Discord
        │
        ▼
L'API vérifie que l'utilisateur a MANAGE_GUILD sur au moins un serveur
        │
        ├── Non → accès refusé
        │
        ▼
L'API génère un JWT signé (userId, username, guilds accessibles)
        │
        ▼
JWT stocké dans un cookie HttpOnly → redirection vers /dashboard
```

À chaque requête vers `/api/guilds/:guildId/*`, deux vérifications sont effectuées en séquence :

1. **Guard JWT** : le cookie est présent et le token est valide. Sinon → `401 Unauthorized`.
2. **Guard Guild** : l'utilisateur possède `MANAGE_GUILD` sur ce serveur. Sinon → `403 Forbidden`.

---

## 7. Communication entre les Composants

Le bot et l'API sont deux processus **totalement indépendants** : ils ne se parlent jamais directement. Leur seul point de contact est la base de données MySQL.

```
         Discord (Gateway WebSocket)
                │ événements temps réel
                ▼
         Bot discord.js  ──────────────▶  MySQL  ◀──────────────  API NestJS
                                                                        │
                                                                        │ HTTP REST
                                                                        ▼
                                                                  Dashboard React
                                                                  (navigateur admin)
```

Ce découplage apporte deux avantages concrets :
- **Indépendance des redémarrages** : relancer l'API n'interrompt pas le bot, et vice versa.
- **Simplicité** : pas de queue de messages, pas d'IPC, pas de WebSocket inter-processus à maintenir.

Le dashboard ne communique **jamais directement avec Discord**. Toutes ses actions passent par l'API, qui est le seul point d'entrée autorisé pour modifier les données ou déclencher des actions Discord.
