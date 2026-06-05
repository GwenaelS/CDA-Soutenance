## Exigences AJOUTÉES

### Exigence : Les utilisateurs autorisés peuvent envoyer un embed ponctuel via commande slash
La commande slash `/announce` DOIT envoyer un embed Discord avec un titre, une description, une couleur et un salon cible configurables. La commande requiert la permission `MANAGE_GUILD`.

#### Scénario : Annonce réussie
- **QUAND** un utilisateur avec `MANAGE_GUILD` exécute `/announce titre:"Bienvenue !" description:"Lancement du serveur aujourd'hui." couleur:#5865F2 salon:#annonces`
- **ALORS** le bot envoie un embed avec les champs fournis dans le salon spécifié et répond avec une confirmation éphémère "Annonce envoyée"

#### Scénario : Utilisateur sans permission tente d'annoncer
- **QUAND** un utilisateur sans `MANAGE_GUILD` exécute `/announce`
- **ALORS** le bot répond avec un message éphémère "Vous n'avez pas la permission d'utiliser cette commande" et n'envoie aucun embed

#### Scénario : Le salon cible n'est pas un salon textuel
- **QUAND** le salon fourni est un salon vocal ou une catégorie
- **ALORS** le bot répond avec une erreur de validation éphémère et n'envoie aucun embed

#### Scénario : Le bot n'a pas la permission d'envoyer des messages dans le salon cible
- **QUAND** le bot n'a pas la permission Send Messages dans le salon cible
- **ALORS** le bot répond avec une erreur éphémère décrivant la permission manquante et n'envoie aucun embed

---

### Exigence : La couleur de l'embed utilise une valeur par défaut si non fournie
Si l'option `couleur` est omise, l'embed DOIT utiliser la couleur d'accent du bot.

#### Scénario : Annonce sans couleur
- **QUAND** un utilisateur exécute `/announce` sans l'option `couleur`
- **ALORS** l'embed est envoyé avec la couleur d'accent par défaut du bot

#### Scénario : Couleur hexadécimale invalide
- **QUAND** un utilisateur fournit une chaîne de couleur malformée (ex. "pastouleur")
- **ALORS** le bot répond avec une erreur de validation éphémère et n'envoie aucun embed

---

### Exigence : Les admins peuvent créer et sauvegarder des templates d'embeds via le dashboard
L'API DOIT exposer des endpoints CRUD pour la table `SavedEmbed`, permettant aux admins de créer, modifier et supprimer des templates d'embeds réutilisables par serveur.

#### Scénario : Création d'un embed sauvegardé
- **QUAND** un admin envoie `POST /api/guilds/{guildId}/embeds` avec `{ "name": "Annonce hebdo", "title": "Récap de la semaine", "description": "...", "color": "#5865F2" }`
- **ALORS** une ligne `SavedEmbed` est créée en base et la réponse contient l'embed créé avec son `id`

#### Scénario : Modification d'un embed sauvegardé
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/embeds/{embedId}` avec les champs à modifier
- **ALORS** la ligne `SavedEmbed` est mise à jour et `updatedAt` est rafraîchi

#### Scénario : Suppression d'un embed sauvegardé
- **QUAND** un admin envoie `DELETE /api/guilds/{guildId}/embeds/{embedId}`
- **ALORS** la ligne `SavedEmbed` est supprimée de la base

#### Scénario : Listage des embeds sauvegardés
- **QUAND** un admin envoie `GET /api/guilds/{guildId}/embeds`
- **ALORS** la réponse contient tous les `SavedEmbed` du serveur, ordonnés par `createdAt` décroissant

---

### Exigence : Les admins peuvent envoyer un embed sauvegardé depuis le dashboard
L'API DOIT exposer un endpoint d'envoi qui utilise le token bot via Discord REST pour poster un embed sauvegardé dans le salon spécifié.

#### Scénario : Envoi d'un embed sauvegardé
- **QUAND** un admin envoie `POST /api/guilds/{guildId}/embeds/{embedId}/send` avec `{ "channelId": "123456789" }`
- **ALORS** l'API appelle Discord REST avec le token bot pour envoyer l'embed dans le salon cible, et la réponse confirme l'envoi avec l'ID du message Discord créé

#### Scénario : Le salon cible est invalide ou le bot n'a pas les permissions
- **QUAND** le `channelId` fourni n'existe pas ou que le bot n'a pas la permission d'y écrire
- **ALORS** l'API retourne une erreur 422 avec un message décrivant le problème
