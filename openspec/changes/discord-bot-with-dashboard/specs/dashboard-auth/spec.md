## Exigences AJOUTÉES

### Exigence : Les utilisateurs s'authentifient via Discord OAuth2
Le dashboard DOIT utiliser un flux Discord OAuth2 manuel ; aucune authentification par nom d'utilisateur/mot de passe n'existe. Après une callback OAuth réussie, l'API émet un JWT signé stocké dans un cookie HttpOnly.

#### Scénario : Connexion réussie
- **QUAND** un utilisateur clique sur "Se connecter avec Discord" et accorde les scopes demandés (`identify guilds`)
- **ALORS** l'API échange le code contre un token Discord, émet un JWT dans un cookie HttpOnly, et l'utilisateur est redirigé vers la page de sélection de serveur

#### Scénario : L'utilisateur refuse le consentement OAuth
- **QUAND** un utilisateur annule la fenêtre OAuth Discord
- **ALORS** Discord redirige avec un paramètre d'erreur ; le dashboard affiche un message "Authentification annulée"

---

### Exigence : L'accès au dashboard est restreint aux administrateurs de serveur
Seuls les utilisateurs possédant la permission Discord `MANAGE_GUILD` dans un serveur donné DOIVENT pouvoir accéder aux pages dashboard de ce serveur.

#### Scénario : Un admin accède au dashboard de son serveur
- **QUAND** un utilisateur authentifié navigue vers `/dashboard/{guildId}` et possède `MANAGE_GUILD` dans ce serveur
- **ALORS** la page affiche la vue d'ensemble du serveur

#### Scénario : Un non-admin tente d'accéder au dashboard d'un serveur
- **QUAND** un utilisateur authentifié navigue vers `/dashboard/{guildId}` mais n'a pas `MANAGE_GUILD`
- **ALORS** l'API retourne 403 et le dashboard affiche une page "Accès refusé"

#### Scénario : Le bot n'est pas dans le serveur demandé
- **QUAND** un admin authentifié navigue vers `/dashboard/{guildId}` mais que le bot n'est pas membre de ce serveur
- **ALORS** la page affiche une invite "Ajouter le bot à ce serveur" avec le lien d'invitation du bot

---

### Exigence : La session JWT persiste après un rechargement de page
Le JWT stocké dans le cookie HttpOnly DOIT permettre à l'utilisateur de rester authentifié entre les rechargements de page et les redémarrages du navigateur jusqu'à l'expiration du token.

#### Scénario : L'utilisateur recharge la page
- **QUAND** un utilisateur avec un cookie JWT valide recharge le dashboard
- **ALORS** l'application React lit le payload JWT décodé depuis le cookie et restaure l'état authentifié sans rediriger vers la page de connexion

#### Scénario : JWT expiré
- **QUAND** le JWT d'un utilisateur a expiré et qu'il navigue vers une route protégée
- **ALORS** l'API retourne 401 et le dashboard redirige vers la page de connexion

---

### Exigence : Les utilisateurs peuvent se déconnecter
Le dashboard DOIT fournir une action de déconnexion qui efface le cookie JWT.

#### Scénario : Déconnexion réussie
- **QUAND** un utilisateur clique sur "Se déconnecter"
- **ALORS** `POST /auth/logout` est appelé, le cookie HttpOnly est effacé par l'API, et l'utilisateur est redirigé vers la page d'accueil en état déconnecté
