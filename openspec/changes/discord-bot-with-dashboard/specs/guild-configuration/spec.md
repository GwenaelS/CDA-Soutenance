## Exigences AJOUTÉES

> **Note MPD** : La configuration est stockée dans la table `GUILD_CONFIG` (une ligne par serveur, clé étrangère `guild_id`). Les colonnes incluent : `welcome_channel_id`, `member_count_channel_id`, `all_log_channel_id`, `birthday_channel_id`, `twitch_channel_id`. Le routing des logs par type d'action est géré par la table `CHANNEL_LOG` (`type` ENUM, `channel_id`, clé étrangère `guild_id`).

---

### Exigence : Chaque serveur possède un enregistrement de configuration
Le système DOIT maintenir une ligne `GUILD_CONFIG` par serveur, créée avec des valeurs par défaut quand le bot rejoint et modifiable via l'API.

#### Scénario : Config par défaut au join
- **QUAND** le bot rejoint un nouveau serveur
- **ALORS** une ligne `GUILD_CONFIG` est créée avec toutes les colonnes à `null`, et des entrées `CHANNEL_LOG` vides sont créées pour chaque catégorie de log

#### Scénario : La ligne de config existe déjà au re-join
- **QUAND** le bot rejoint à nouveau un serveur qu'il avait quitté
- **ALORS** la `GUILD_CONFIG` existante est conservée (upsert — pas de réinitialisation des paramètres)

---

### Exigence : La configuration du serveur est lisible via l'API
L'API DOIT exposer un endpoint GET retournant la configuration courante d'un serveur.

#### Scénario : Lecture de la config pour un serveur autorisé
- **QUAND** un admin authentifié envoie une requête GET à `/api/guilds/{guildId}/config`
- **ALORS** la réponse contient les champs `GUILD_CONFIG` courants en JSON, incluant `welcomeChannelId`, `memberCountChannelId`, `allLogChannelId`, `birthdayChannelId`

#### Scénario : Tentative de lecture non autorisée
- **QUAND** une requête est faite sans JWT valide ou par un utilisateur non admin de ce serveur
- **ALORS** l'API retourne 403 Forbidden

---

### Exigence : La configuration du serveur est modifiable via l'API
L'API DOIT exposer un endpoint PATCH pour mettre à jour un ou plusieurs champs de config d'un serveur.

#### Scénario : Mise à jour du salon de logs global
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/config` avec `{ "allLogChannelId": "987654321" }`
- **ALORS** `GUILD_CONFIG.all_log_channel_id` est mis à jour ; toutes les actions de modération publieront désormais un embed dans ce salon en plus du salon de catégorie correspondant

#### Scénario : ID de salon invalide
- **QUAND** un ID de salon fourni n'est pas un snowflake Discord valide
- **ALORS** l'API retourne 422 Unprocessable Entity avec un message d'erreur de validation

#### Scénario : Mise à jour du salon d'anniversaires
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/config` avec `{ "birthdayChannelId": "123456789" }`
- **ALORS** `GUILD_CONFIG.birthday_channel_id` est mis à jour ; le cron d'anniversaires utilisera ce salon à partir de la prochaine exécution

---

### Exigence : Le routing des logs par catégorie est configurable
La table `CHANNEL_LOG` DOIT permettre d'associer une catégorie de log à un salon Discord spécifique. Les catégories sont : `MODERATION`, `AUTOMOD`, `XP`, `SYSTEM`.

En plus du salon de catégorie, chaque embed est également posté dans `GUILD_CONFIG.all_log_channel_id` si configuré (RG-14).

#### Scénario : Configuration d'un salon de logs de modération
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/config/log-channels` avec `{ "type": "MODERATION", "channelId": "111222333" }`
- **ALORS** la ligne `CHANNEL_LOG` de type `MODERATION` est mise à jour ; toutes les actions de modération (KICK, BAN, WARN, etc.) publieront un embed dans ce salon

#### Scénario : Action loguée sans salon de catégorie configuré
- **QUAND** une action de modération se produit et que la `CHANNEL_LOG` correspondante n'a pas de `channel_id`
- **ALORS** aucun log de catégorie n'est posté, mais le log est quand même posté dans `all_log_channel_id` si défini

---

### Exigence : Le rôle automatique est assigné aux nouveaux membres
Si `GUILD_CONFIG.auto_role_id` est défini, le bot DOIT assigner ce rôle à chaque nouveau membre qui rejoint le serveur (RG-21).

#### Scénario : Nouveau membre avec auto-rôle configuré
- **QUAND** un nouveau membre rejoint un serveur avec `auto_role_id` défini et que le bot a la permission Manage Roles
- **ALORS** le bot assigne le rôle configuré au nouveau membre dans les 5 secondes

#### Scénario : Le bot n'a pas la permission Manage Roles
- **QUAND** un nouveau membre rejoint mais que le bot n'a pas la permission Manage Roles
- **ALORS** le bot logue un avertissement et passe l'assignation sans crash

---

### Exigence : Un message de bienvenue est envoyé aux nouveaux membres
Si `GUILD_CONFIG.welcome_channel_id` est défini, le bot DOIT envoyer un embed de bienvenue dans ce salon quand un nouveau membre rejoint.

#### Scénario : Nouveau membre avec salon de bienvenue configuré
- **QUAND** un nouveau membre rejoint un serveur avec `welcome_channel_id` défini
- **ALORS** le bot envoie un embed dans ce salon mentionnant le nouveau membre ; si `welcome_message` est défini il est inclus dans le corps de l'embed, sinon un message par défaut est utilisé

#### Scénario : Salon de bienvenue non configuré
- **QUAND** un nouveau membre rejoint et qu'aucun `welcome_channel_id` n'est défini
- **ALORS** aucun message n'est envoyé et aucune erreur n'est levée

---

### Exigence : Un salon vocal affiche le nombre de membres humains en temps réel
Si `GUILD_CONFIG.member_count_channel_id` est défini, le bot DOIT rafraîchir périodiquement le nom de ce salon vocal pour afficher le nombre actuel de membres humains du serveur (RG-22).

#### Scénario : Rafraîchissement du compteur
- **QUAND** un intervalle de 5 à 10 minutes s'écoule (pour respecter les limites de l'API Discord sur les renommages de salon)
- **ALORS** le bot renomme le salon vocal configuré avec le format `Membres : {n}` où `n` est le nombre de membres humains (hors bots)

#### Scénario : Arrivée ou départ d'un membre
- **QUAND** un membre rejoint ou quitte le serveur
- **ALORS** le compteur sera mis à jour au prochain rafraîchissement périodique (pas de mise à jour immédiate pour respecter la limite de rate-limit Discord)

#### Scénario : Salon non configuré
- **QUAND** `member_count_channel_id` est null
- **ALORS** aucun rafraîchissement périodique n'est déclenché

#### Scénario : Le bot n'a pas la permission de renommer le salon
- **QUAND** le bot tente de renommer le salon mais n'a pas la permission Manage Channels
- **ALORS** l'erreur est loguée et le bot continue sans crash

---

### Exigence : Chaque serveur possède une configuration XP
Le système DOIT maintenir une ligne `LEVEL_CONFIG` par serveur, créée avec des valeurs par défaut au join et modifiable via l'API. Les paliers de niveau sont stockés dans la table `LEVEL_REWARD` (une ligne par palier).

#### Scénario : Config XP par défaut au join
- **QUAND** le bot rejoint un nouveau serveur
- **ALORS** une ligne `LEVEL_CONFIG` est créée avec `xp_per_message = 10`, `xp_cooldown_sec = 60`, `xp_per_voice_min = 5`, `xp_multiplier = 1.0`, `max_level = 100`

#### Scénario : Mise à jour de la config XP
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/xp/config` avec `{ "xpPerMessage": 15, "messageCooldownSeconds": 30 }`
- **ALORS** `LEVEL_CONFIG` est mise à jour et la réponse contient la config complète mise à jour

#### Scénario : Mise à jour des récompenses de niveau
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/xp/config` avec `{ "levelRewards": [{ "level": 5, "roleId": "123456789" }] }`
- **ALORS** les lignes `LEVEL_REWARD` du serveur sont remplacées entièrement et le bot utilise les nouveaux paliers dès ce moment
