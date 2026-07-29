## Exigences AJOUTÉES

> **Note MPD** : Les mots interdits sont stockés dans la table `FILTERED_WORD` (une ligne par mot, clé étrangère `guild_id`) et les rôles exemptés dans la table `EXEMPTED_ROLE` (une ligne par rôle). Ces données ne sont pas stockées en JSON dans une seule colonne.
>
> **Écart connu (2026-07-29)** : `spamDetectionEnabled`, `linkFilterEnabled`, `inviteFilterEnabled` et `autoMuteDurationMinutes`, utilisés dans les scénarios ci-dessous, **n'ont aucune colonne correspondante** dans le schéma actuel (ni sur `Guild_config`, ni ailleurs — voir `design.md`). Seul le filtre de mots interdits est implémenté à ce jour (`apps/bot/src/events/message-create.listener.ts`) ; spam, liens et invitations restent à coder, et nécessitent d'abord d'ajouter ces colonnes (nouvelle entité `AutoModerationConfig` ou extension de `Guild_config`).

---

### Exigence : Les messages contenant des mots interdits sont supprimés automatiquement
Le bot DOIT supprimer tout message dont le contenu contient un mot présent dans la table `FILTERED_WORD` du serveur.

#### Scénario : Message contenant un mot interdit
- **QUAND** un utilisateur envoie un message contenant un mot de la liste `FILTERED_WORD` (comparaison insensible à la casse)
- **ALORS** le message est supprimé, un embed de log est posté dans le salon configuré pour les logs d'auto-modération, indiquant l'auteur, le salon et le mot déclenché (masqué partiellement)

> **Écart connu (2026-07-29)** : implémenté dans `apps/bot/src/events/message-create.listener.ts` — le message est bien supprimé et l'exemption par rôle fonctionne, mais **aucun log n'est encore posté** (commentaire dans le code : `// Au futur écrire une log, et envoyer log sur discord`). La partie "embed de log" de ce scénario n'est pas encore vraie.

#### Scénario : Message ne contenant aucun mot interdit
- **QUAND** un utilisateur envoie un message sans mot interdit
- **ALORS** aucune action n'est prise par l'auto-modération

#### Scénario : Liste de mots interdits vide
- **QUAND** aucune entrée `FILTERED_WORD` n'existe pour ce serveur
- **ALORS** le filtre de mots interdits ne s'applique pas

---

### Exigence : Les messages de spam sont supprimés et le membre est muté automatiquement
Si `spamDetectionEnabled` est `true`, le bot DOIT supprimer les messages excessifs et appliquer un timeout automatique à l'auteur.

Le spam est détecté dans deux cas (RG-08) :
- Un utilisateur envoie plus de 5 messages en moins de 5 secondes dans le même salon.
- Un utilisateur envoie un message contenant 5 mentions ou plus.

#### Scénario : Spam par volume de messages détecté
- **QUAND** un utilisateur envoie 6 messages en moins de 5 secondes dans le même salon
- **ALORS** les messages en excès sont supprimés, un mute automatique (timeout Discord) d'une durée de `autoMuteDurationMinutes` (défaut 60 min) est appliqué, et un embed de log est posté dans le salon de logs d'auto-modération si configuré
- **ET** aucun avertissement (`WARNING`) n'est créé automatiquement — seul le mute et le log sont générés (RG-09)

#### Scénario : Spam par mentions détecté
- **QUAND** un utilisateur envoie un message contenant 5 mentions ou plus (utilisateurs, rôles ou `@everyone`/`@here`)
- **ALORS** le message est supprimé, un mute automatique d'une durée de `autoMuteDurationMinutes` est appliqué, et un embed de log est posté

#### Scénario : Détection de spam désactivée
- **QUAND** `spamDetectionEnabled` est `false`
- **ALORS** aucune vérification de spam n'est effectuée, quel que soit le rythme d'envoi ou le nombre de mentions

#### Scénario : Durée du mute automatique configurable
- **QUAND** un admin modifie `autoMuteDurationMinutes` depuis le dashboard
- **ALORS** tous les mutes automatiques suivants utilisent cette durée ; la valeur par défaut est 60 minutes (RG-13)
- **ET** cette durée est distincte du timeout manuel dont la durée est choisie par le modérateur

---

### Exigence : Les messages contenant des liens sont supprimés automatiquement
Si `linkFilterEnabled` est `true`, le bot DOIT supprimer tout message contenant une URL.

#### Scénario : Message avec lien détecté
- **QUAND** un utilisateur envoie un message contenant `http://`, `https://` ou `www.` et que `linkFilterEnabled` est `true`
- **ALORS** le message est supprimé et un embed de log est posté dans le salon de logs d'auto-modération si configuré

#### Scénario : Filtre de liens désactivé
- **QUAND** `linkFilterEnabled` est `false`
- **ALORS** les messages contenant des liens ne sont pas affectés par ce filtre

---

### Exigence : Les messages contenant des invitations Discord sont supprimés automatiquement
Si `inviteFilterEnabled` est `true`, le bot DOIT supprimer tout message contenant un lien d'invitation Discord.

#### Scénario : Invitation Discord détectée
- **QUAND** un utilisateur envoie un message contenant `discord.gg/` ou `discord.com/invite/` et que `inviteFilterEnabled` est `true`
- **ALORS** le message est supprimé et un embed de log est posté dans le salon de logs d'auto-modération si configuré

#### Scénario : Filtre d'invitations désactivé
- **QUAND** `inviteFilterEnabled` est `false`
- **ALORS** les messages contenant des invitations Discord ne sont pas affectés

---

### Exigence : Les membres possédant un rôle exempté ne sont pas soumis aux filtres
Si l'auteur d'un message possède un rôle présent dans la table `EXEMPTED_ROLE` du serveur, aucun filtre d'auto-modération ne s'applique à ce message et aucun log n'est posté.

#### Scénario : Membre exempté envoie un mot interdit
- **QUAND** un membre avec un rôle présent dans `EXEMPTED_ROLE` envoie un message contenant un mot interdit
- **ALORS** aucune action n'est prise et aucun log n'est posté

#### Scénario : Membre non exempté envoie un mot interdit
- **QUAND** un membre sans rôle exempté envoie un message contenant un mot interdit
- **ALORS** le filtre s'applique normalement

---

### Exigence : La configuration d'auto-modération est lisible et modifiable via l'API
L'API DOIT exposer des endpoints GET et PATCH pour la configuration d'auto-modération, protégés par les guards d'authentification.

> **Correction 2026-07-29** : les mots interdits sont exposés via un module CRUD dédié, `FilteredWordModule` (`apps/api/src/modules/filtered-word/`), pas via les endpoints `/api/guilds/{guildId}/auto-moderation/banned-words` décrits ci-dessous à l'origine. Contrat réel, protégé par `JwtGuard` + `GuildGuard` :
> - `GET /guilds/:guildId/filtered-words` — liste
> - `GET /guilds/:guildId/filtered-words/:id` — détail
> - `POST /guilds/:guildId/filtered-words` avec `{ "word": "..." }` — création
> - `PATCH /guilds/:guildId/filtered-words/:id` avec `{ "word": "..." }` — modification
> - `DELETE /guilds/:guildId/filtered-words/:id` — suppression
>
> Pas de préfixe `/api`, pas de sous-ressource `/auto-moderation/`. Les rôles exemptés (`EXEMPTED_ROLE`) et les toggles spam/liens/invitations n'ont **pas encore** d'endpoints — scénarios ci-dessous non implémentés.

#### Scénario : Lecture de la config d'auto-modération
- **QUAND** un admin envoie `GET /api/guilds/{guildId}/auto-moderation`
- **ALORS** la réponse contient : la liste des mots interdits (`FILTERED_WORD`), les toggles (`spamDetectionEnabled`, `linkFilterEnabled`, `inviteFilterEnabled`), la durée de mute automatique (`autoMuteDurationMinutes`), et la liste des rôles exemptés (`EXEMPTED_ROLE`)

*(Non implémenté — seule la liste des mots interdits est disponible aujourd'hui, via `GET /guilds/:guildId/filtered-words`.)*

#### Scénario : Ajout d'un mot interdit
- **QUAND** un admin envoie `POST /guilds/:guildId/filtered-words` avec `{ "word": "mot1" }`
- **ALORS** une ligne est insérée dans la table `FILTERED_WORD` et la réponse confirme l'ajout

*(Invalidation du cache en mémoire du bot : non applicable pour l'instant — `apps/bot` recharge la liste depuis la base à chaque message, pas de cache en mémoire implémenté. À ajouter si la performance le justifie, voir risques listés dans `design.md`.)*

#### Scénario : Suppression d'un mot interdit
- **QUAND** un admin envoie `DELETE /guilds/:guildId/filtered-words/{id}`
- **ALORS** la ligne correspondante dans `FILTERED_WORD` est supprimée

#### Scénario : Ajout d'un rôle exempté
- **QUAND** un admin envoie `POST /api/guilds/{guildId}/auto-moderation/exempt-roles` avec `{ "roleId": "123456789" }`
- **ALORS** une ligne est insérée dans la table `EXEMPTED_ROLE` et le cache est invalidé

*(Non implémenté — aucun module API pour `EXEMPTED_ROLE` à ce jour ; le bot lit la table mais rien ne permet encore de la modifier depuis le dashboard.)*

#### Scénario : Activation du filtre de spam
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/auto-moderation` avec `{ "spamDetectionEnabled": true }`
- **ALORS** `spamDetectionEnabled` passe à `true`, le cache est invalidé, et le bot commence à détecter le spam

#### Scénario : Modification de la durée du mute automatique
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/auto-moderation` avec `{ "autoMuteDurationMinutes": 30 }`
- **ALORS** `autoMuteDurationMinutes` est mis à jour ; les prochains mutes automatiques dureront 30 minutes
