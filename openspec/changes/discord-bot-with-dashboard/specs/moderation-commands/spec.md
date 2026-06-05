## Exigences AJOUTÉES

### Exigence : La commande kick expulse un membre du serveur
La commande slash `/kick` DOIT expulser le membre ciblé du serveur et enregistrer une entrée d'audit.

#### Scénario : Kick réussi
- **QUAND** un modérateur exécute `/kick @utilisateur raison:"Spam"` dans un serveur où le bot a la permission Kick Members
- **ALORS** la cible est expulsée, une ligne `AuditEntry` (KICK) est écrite, et le modérateur reçoit une confirmation éphémère

#### Scénario : Kick sans permission
- **QUAND** un utilisateur sans permission `Kick Members` exécute `/kick`
- **ALORS** le bot répond avec un message éphémère "Vous n'avez pas la permission d'utiliser cette commande" et ne prend aucune action

#### Scénario : La cible a un rôle supérieur ou égal
- **QUAND** le membre ciblé a un rôle égal ou supérieur au rôle le plus haut du modérateur
- **ALORS** le bot répond avec une erreur éphémère et n'expulse pas le membre

---

### Exigence : La commande ban bannit définitivement un membre
La commande slash `/ban` DOIT bannir l'utilisateur ciblé du serveur, supprimer optionnellement ses messages récents, et enregistrer une entrée d'audit.

#### Scénario : Ban réussi
- **QUAND** un modérateur exécute `/ban @utilisateur raison:"Harcèlement" supprimer_messages:7`
- **ALORS** la cible est bannie, les messages des 7 derniers jours sont supprimés, une `AuditEntry` (BAN) est écrite, et le modérateur reçoit une confirmation

#### Scénario : Bannir un utilisateur absent du serveur
- **QUAND** un modérateur fournit un ID Discord valide pour un utilisateur absent du serveur
- **ALORS** le bot applique le ban par ID et enregistre l'entrée d'audit

---

### Exigence : La commande unban lève un bannissement
La commande slash `/unban` DOIT retirer le ban d'un utilisateur par ID Discord et enregistrer une entrée d'audit.

#### Scénario : Unban réussi
- **QUAND** un modérateur exécute `/unban user_id:123456789 raison:"Appel accepté"`
- **ALORS** le ban est levé, une `AuditEntry` (UNBAN) est écrite, et une confirmation est envoyée

#### Scénario : L'utilisateur n'est pas banni
- **QUAND** l'ID fourni n'est pas dans la liste des bans du serveur
- **ALORS** le bot répond avec un message éphémère "Cet utilisateur n'est pas banni"

---

### Exigence : La commande timeout applique un silence temporaire
La commande slash `/timeout` DOIT appliquer un timeout de communication à un membre pour une durée spécifiée (1 à 40 320 minutes) et enregistrer une entrée d'audit.

#### Scénario : Timeout réussi
- **QUAND** un modérateur exécute `/timeout @utilisateur durée:60 raison:"Calmez-vous"`
- **ALORS** `communicationDisabledUntil` du membre est défini pour 60 minutes, une `AuditEntry` (TIMEOUT) est écrite, et une confirmation est envoyée

#### Scénario : Durée hors plage
- **QUAND** un modérateur fournit une durée de 0 ou supérieure à 40 320 minutes (28 jours)
- **ALORS** le bot répond avec une erreur de validation et n'applique aucun timeout

---

### Exigence : La commande untimeout lève un timeout
La commande slash `/untimeout` DOIT lever le timeout d'un membre en remettant `communicationDisabledUntil` à null et enregistrer une entrée d'audit.

#### Scénario : Untimeout réussi
- **QUAND** un modérateur exécute `/untimeout @utilisateur raison:"Fin de sanction"`
- **ALORS** le timeout est levé, une `AuditEntry` (UNTIMEOUT) est écrite, et une confirmation est envoyée

#### Scénario : Le membre n'est pas en timeout
- **QUAND** le membre ciblé n'a pas de timeout actif
- **ALORS** le bot répond avec un message éphémère "Ce membre n'est pas actuellement en timeout"

---

### Exigence : La commande warn enregistre un avertissement
La commande slash `/warn` DOIT enregistrer un avertissement en base de données et envoyer un DM à la cible sans action Discord de niveau serveur.

#### Scénario : Warn réussi
- **QUAND** un modérateur exécute `/warn @utilisateur raison:"Hors-sujet"`
- **ALORS** une `AuditEntry` (WARN) est écrite et la cible reçoit un DM avec la raison et le nom du serveur

#### Scénario : La cible a les DMs désactivés
- **QUAND** l'utilisateur ciblé ne peut pas recevoir de DMs
- **ALORS** le warn est quand même enregistré en base et le modérateur est informé que le DM n'a pas pu être délivré

---

### Exigence : La commande unwarn supprime un avertissement
La commande slash `/unwarn` DOIT supprimer un warn existant par son ID et enregistrer une entrée d'audit.

#### Scénario : Unwarn réussi
- **QUAND** un modérateur exécute `/unwarn @utilisateur warn_id:42`
- **ALORS** la ligne `AuditEntry` correspondante est supprimée de la liste active et une `AuditEntry` (UNWARN) est écrite pour traçabilité

#### Scénario : ID de warn invalide
- **QUAND** l'ID fourni ne correspond à aucun warn actif de cet utilisateur dans ce serveur
- **ALORS** le bot répond avec un message éphémère "Aucun avertissement trouvé avec cet ID"

---

### Exigence : La commande warnings liste les avertissements d'un utilisateur
La commande slash `/warnings` DOIT afficher tous les warns actifs d'un utilisateur dans le serveur.

#### Scénario : Utilisateur avec des warns
- **QUAND** un modérateur exécute `/warnings @utilisateur`
- **ALORS** le bot répond en éphémère avec un embed listant chaque warn : ID, raison, modérateur, date

#### Scénario : Utilisateur sans warn
- **QUAND** l'utilisateur ciblé n'a aucun warn actif dans ce serveur
- **ALORS** le bot répond avec un message éphémère "Cet utilisateur n'a aucun avertissement actif"

---

### Exigence : La commande userinfo affiche les informations d'un utilisateur
La commande slash `/userinfo` DOIT afficher les informations complètes d'un membre : avatar, username, date d'arrivée, rôles, niveau, XP et nombre de warns actifs.

#### Scénario : Consultation d'un membre présent
- **QUAND** un utilisateur exécute `/userinfo @membre`
- **ALORS** le bot répond avec un embed contenant : avatar, username, date d'arrivée sur le serveur, liste des rôles, niveau XP, XP total et nombre de warns actifs

#### Scénario : Membre sans données XP
- **QUAND** le membre ciblé n'a jamais envoyé de message ni été en vocal
- **ALORS** niveau et XP s'affichent à 0

---

### Exigence : La commande lock verrouille un salon
La commande slash `/lock` DOIT retirer la permission `SendMessages` à `@everyone` dans le salon ciblé (ou le salon courant si non spécifié) et enregistrer une entrée d'audit.

#### Scénario : Lock réussi
- **QUAND** un modérateur exécute `/lock` dans un salon textuel
- **ALORS** la permission `SendMessages` de `@everyone` est retirée pour ce salon, une `AuditEntry` (LOCK) est écrite, et un message de confirmation est envoyé dans le salon

#### Scénario : Salon déjà verrouillé
- **QUAND** le salon ciblé a déjà `SendMessages` désactivé pour `@everyone`
- **ALORS** le bot répond avec un message éphémère "Ce salon est déjà verrouillé"

---

### Exigence : La commande unlock déverrouille un salon
La commande slash `/unlock` DOIT rétablir la permission `SendMessages` à `@everyone` dans le salon ciblé et enregistrer une entrée d'audit.

#### Scénario : Unlock réussi
- **QUAND** un modérateur exécute `/unlock` dans un salon verrouillé
- **ALORS** la permission `SendMessages` de `@everyone` est rétablie, une `AuditEntry` (UNLOCK) est écrite, et un message de confirmation est envoyé

---

### Exigence : La commande clear supprime des messages en masse
La commande slash `/clear` DOIT supprimer entre 1 et 100 messages dans le salon courant (défaut 10) et enregistrer une entrée d'audit.

#### Scénario : Clear réussi
- **QUAND** un modérateur exécute `/clear nombre:20`
- **ALORS** les 20 messages les plus récents du salon sont supprimés via `bulkDelete`, une `AuditEntry` (CLEAR) est écrite, et une confirmation éphémère est envoyée avec le nombre de messages supprimés

#### Scénario : Messages trop anciens pour bulkDelete
- **QUAND** certains messages ciblés ont plus de 14 jours (limite Discord pour bulkDelete)
- **ALORS** ces messages sont ignorés et le bot indique combien ont réellement été supprimés

---

### Exigence : La commande ping affiche la latence du bot
La commande slash `/ping` DOIT répondre avec la latence WebSocket du bot et le temps de réponse de l'API Discord en millisecondes.

#### Scénario : Ping réussi
- **QUAND** un utilisateur exécute `/ping`
- **ALORS** le bot répond avec un embed affichant la latence WebSocket (en ms) et le round-trip de l'API Discord (en ms)

---

### Exigence : La commande modhelp liste les commandes de modération
La commande slash `/modhelp` DOIT envoyer un embed listant toutes les commandes de modération avec leur description et les permissions requises.

#### Scénario : Affichage de l'aide
- **QUAND** un utilisateur exécute `/modhelp`
- **ALORS** le bot envoie un embed en éphémère listant chaque commande de modération avec sa syntaxe, sa description et la permission Discord requise pour l'utiliser
