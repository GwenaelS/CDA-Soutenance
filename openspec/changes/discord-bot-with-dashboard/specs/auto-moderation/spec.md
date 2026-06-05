## Exigences AJOUTÉES

### Exigence : Les messages contenant des mots interdits sont supprimés automatiquement
Le bot DOIT supprimer tout message dont le contenu contient un mot présent dans `AutoModerationConfig.bannedWords` du serveur.

#### Scénario : Message contenant un mot interdit
- **QUAND** un utilisateur envoie un message contenant un mot de la liste `bannedWords` (comparaison insensible à la casse)
- **ALORS** le message est supprimé, un embed de log est posté dans `logChannelId` si configuré, indiquant l'auteur, le salon et le mot déclenché (masqué partiellement)

#### Scénario : Message ne contenant aucun mot interdit
- **QUAND** un utilisateur envoie un message sans mot interdit
- **ALORS** aucune action n'est prise par l'auto-modération

#### Scénario : Liste de mots interdits vide
- **QUAND** `bannedWords` est un tableau vide pour ce serveur
- **ALORS** le filtre de mots interdits ne s'applique pas

---

### Exigence : Les messages de spam sont supprimés automatiquement
Si `spamDetectionEnabled` est `true`, le bot DOIT supprimer les messages d'un utilisateur qui envoie plus de 5 messages en moins de 5 secondes dans le même salon.

#### Scénario : Spam détecté
- **QUAND** un utilisateur envoie 6 messages en moins de 5 secondes dans le même salon
- **ALORS** le 6ème message (et les suivants dans la fenêtre) est supprimé et un embed de log est posté dans `logChannelId` si configuré

#### Scénario : Détection de spam désactivée
- **QUAND** `spamDetectionEnabled` est `false`
- **ALORS** aucune vérification de spam n'est effectuée, quel que soit le rythme d'envoi

---

### Exigence : Les messages contenant des liens sont supprimés automatiquement
Si `linkFilterEnabled` est `true`, le bot DOIT supprimer tout message contenant une URL.

#### Scénario : Message avec lien détecté
- **QUAND** un utilisateur envoie un message contenant `http://`, `https://` ou `www.` et que `linkFilterEnabled` est `true`
- **ALORS** le message est supprimé et un embed de log est posté dans `logChannelId` si configuré

#### Scénario : Filtre de liens désactivé
- **QUAND** `linkFilterEnabled` est `false`
- **ALORS** les messages contenant des liens ne sont pas affectés par ce filtre

---

### Exigence : Les messages contenant des invitations Discord sont supprimés automatiquement
Si `inviteFilterEnabled` est `true`, le bot DOIT supprimer tout message contenant un lien d'invitation Discord.

#### Scénario : Invitation Discord détectée
- **QUAND** un utilisateur envoie un message contenant `discord.gg/` ou `discord.com/invite/` et que `inviteFilterEnabled` est `true`
- **ALORS** le message est supprimé et un embed de log est posté dans `logChannelId` si configuré

#### Scénario : Filtre d'invitations désactivé
- **QUAND** `inviteFilterEnabled` est `false`
- **ALORS** les messages contenant des invitations Discord ne sont pas affectés

---

### Exigence : Les membres possédant un rôle exempté ne sont pas soumis aux filtres
Si l'auteur d'un message possède un rôle présent dans `AutoModerationConfig.exemptRoleIds`, aucun filtre d'auto-modération ne s'applique à ce message.

#### Scénario : Membre exempté envoie un mot interdit
- **QUAND** un membre avec un rôle exempté envoie un message contenant un mot interdit
- **ALORS** aucune action n'est prise et aucun log n'est posté

#### Scénario : Membre non exempté envoie un mot interdit
- **QUAND** un membre sans rôle exempté envoie un message contenant un mot interdit
- **ALORS** le filtre s'applique normalement

---

### Exigence : La configuration d'auto-modération est lisible et modifiable via l'API
L'API DOIT exposer des endpoints GET et PATCH pour `AutoModerationConfig`, protégés par les guards d'authentification.

#### Scénario : Lecture de la config d'auto-modération
- **QUAND** un admin envoie `GET /api/guilds/{guildId}/auto-moderation`
- **ALORS** la réponse contient la config complète (`bannedWords`, toggles, `exemptRoleIds`)

#### Scénario : Mise à jour de la liste de mots interdits
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/auto-moderation` avec `{ "bannedWords": ["mot1", "mot2"] }`
- **ALORS** le tableau `bannedWords` est remplacé entièrement, le cache en mémoire du bot est invalidé, et la réponse contient la config mise à jour

#### Scénario : Activation du filtre de spam
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/auto-moderation` avec `{ "spamDetectionEnabled": true }`
- **ALORS** `spamDetectionEnabled` passe à `true`, le cache est invalidé, et le bot commence à détecter le spam
