## Exigences AJOUTÉES

### Exigence : Chaque serveur possède un enregistrement de configuration
Le système DOIT maintenir une ligne `GuildConfig` par serveur, créée avec des valeurs par défaut quand le bot rejoint et modifiable via l'API.

#### Scénario : Config par défaut au join
- **QUAND** le bot rejoint un nouveau serveur
- **ALORS** une ligne `GuildConfig` est créée avec `logChannelId = null`, `welcomeChannelId = null`, `welcomeMessage = null`, `autoRoleId = null`, `birthdayChannelId = null`

#### Scénario : La ligne de config existe déjà au re-join
- **QUAND** le bot rejoint à nouveau un serveur qu'il avait quitté
- **ALORS** la `GuildConfig` existante est conservée (upsert — pas de réinitialisation des paramètres)

---

### Exigence : La configuration du serveur est lisible via l'API
L'API DOIT exposer un endpoint GET retournant la configuration courante d'un serveur.

#### Scénario : Lecture de la config pour un serveur autorisé
- **QUAND** un admin authentifié envoie une requête GET à `/api/guilds/{guildId}/config`
- **ALORS** la réponse contient les champs `GuildConfig` courants en JSON

#### Scénario : Tentative de lecture non autorisée
- **QUAND** une requête est faite sans JWT valide ou par un utilisateur non admin de ce serveur
- **ALORS** l'API retourne 403 Forbidden

---

### Exigence : La configuration du serveur est modifiable via l'API
L'API DOIT exposer un endpoint PATCH pour mettre à jour un ou plusieurs champs de config d'un serveur.

#### Scénario : Mise à jour du salon de logs
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/config` avec `{ "logChannelId": "987654321" }`
- **ALORS** `GuildConfig.logChannelId` est mis à jour et la réponse contient la config complète mise à jour

#### Scénario : ID de salon invalide
- **QUAND** l'`logChannelId` fourni n'est pas un snowflake Discord valide
- **ALORS** l'API retourne 422 Unprocessable Entity avec un message d'erreur de validation

#### Scénario : Mise à jour du salon d'anniversaires
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/config` avec `{ "birthdayChannelId": "123456789" }`
- **ALORS** `GuildConfig.birthdayChannelId` est mis à jour ; le cron d'anniversaires utilisera ce salon à partir de la prochaine exécution

---

### Exigence : Le rôle automatique est assigné aux nouveaux membres
Si `autoRoleId` est défini, le bot DOIT assigner ce rôle à chaque nouveau membre qui rejoint le serveur.

#### Scénario : Nouveau membre avec auto-rôle configuré
- **QUAND** un nouveau membre rejoint un serveur avec `autoRoleId` défini et que le bot a la permission Manage Roles
- **ALORS** le bot assigne le rôle configuré au nouveau membre dans les 5 secondes

#### Scénario : Le bot n'a pas la permission Manage Roles
- **QUAND** un nouveau membre rejoint mais que le bot n'a pas la permission Manage Roles
- **ALORS** le bot logue un avertissement et passe l'assignation sans crash

---

### Exigence : Un message de bienvenue est envoyé aux nouveaux membres
Si `welcomeChannelId` est défini, le bot DOIT envoyer un embed de bienvenue dans ce salon quand un nouveau membre rejoint.

#### Scénario : Nouveau membre avec salon de bienvenue configuré
- **QUAND** un nouveau membre rejoint un serveur avec `welcomeChannelId` défini
- **ALORS** le bot envoie un embed dans ce salon mentionnant le nouveau membre ; si `welcomeMessage` est défini il est inclus dans le corps de l'embed, sinon un message par défaut est utilisé

#### Scénario : Salon de bienvenue non configuré
- **QUAND** un nouveau membre rejoint et qu'aucun `welcomeChannelId` n'est défini
- **ALORS** aucun message n'est envoyé et aucune erreur n'est levée

---

### Exigence : Chaque serveur possède une configuration XP
Le système DOIT maintenir une ligne `GuildXpConfig` par serveur, créée avec des valeurs par défaut au join et modifiable via l'API.

#### Scénario : Config XP par défaut au join
- **QUAND** le bot rejoint un nouveau serveur
- **ALORS** une ligne `GuildXpConfig` est créée avec `xpPerMessage = 10`, `messageCooldownSeconds = 60`, `xpPerVoiceMinute = 5`, `levelRewards = []`

#### Scénario : Mise à jour de la config XP
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/xp/config` avec `{ "xpPerMessage": 15, "messageCooldownSeconds": 30 }`
- **ALORS** la `GuildXpConfig` est mise à jour et la réponse contient la config complète mise à jour

#### Scénario : Mise à jour des récompenses de niveau
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/xp/config` avec `{ "levelRewards": [{ "level": 5, "roleId": "123456789" }] }`
- **ALORS** le JSON `levelRewards` est remplacé entièrement et le bot utilise les nouveaux paliers dès ce moment
