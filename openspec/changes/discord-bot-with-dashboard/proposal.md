## Pourquoi

Les communautés Discord manquent d'un outil unifié combinant gestion automatisée du serveur et interface de contrôle visuelle — les administrateurs jonglent entre plusieurs bots publiques ayant parfois des fonctionnalités restrictives et payantes mais aussi les paramètres bruts de Discord. Ce projet livre un bot Discord auto-hébergé couplé à un dashboard web permettant aux administrateurs de configurer, surveiller et modérer leur serveur depuis une interface unique.

## Ce qui change

- **Nouveau** : Bot Discord (discord.js 14, TypeScript) gérant commandes slash de modération, auto-modération passive, système XP/niveau, anniversaires, MOC et annonces embed
- **Nouveau** : Configuration par serveur persistée en MySQL (salon de logs, bienvenue, auto-rôle, règles d'auto-modération, taux XP, paliers de niveau, anniversaires, salons MOC)
- **Nouveau** : Couche API REST (NestJS) exposant données et endpoints de configuration, authentifiée via JWT
- **Nouveau** : Dashboard web React/Vite authentifié via Discord OAuth2 + JWT — vue d'ensemble avec stats, logs de modération, gestion des membres, paramètres, XP/niveau, anniversaires, embeds, MOC
- **Nouveau** : Système d'audit log enregistrant toutes les actions de modération, y compris les server mutes détectés via `voiceStateUpdate`
- **Nouveau** : Auto-modération passive — filtrage de mots interdits, détection de spam, suppression de liens et d'invitations Discord ; rôles exemptés configurables
- **Nouveau** : Système XP/niveau — pool unifié messages + vocal ; taux configurables, paliers de niveau avec récompenses de rôles automatiques ; commandes admin Discord + dashboard
- **Nouveau** : Système d'anniversaires — stockage des dates par membre, cron quotidien, message automatique dans le salon configuré
- **Nouveau** : Média-Only-Channels (MOC) — suppression automatique des messages non-médias dans les salons configurés
- **Nouveau** : Embeds personnalisés — créer, modifier, enregistrer et envoyer des templates d'embeds via dashboard ; commande `/announce` pour envoi ponctuel

## Capacités

### Nouvelles capacités

- `bot-core` : Initialisation du bot, enregistrement des commandes slash, dispatcher d'événements, hooks de cycle de vie du serveur (join/leave), gestion globale des erreurs
- `auto-moderation` : Handler passif sur `messageCreate` — mots interdits, détection de spam, suppression de liens et d'invitations Discord ; rôles exemptés configurables ; log dans le salon de modération
- `moderation-commands` : Commandes slash — `/kick`, `/ban`, `/unban`, `/timeout`, `/untimeout`, `/warn`, `/unwarn`, `/warnings`, `/userinfo`, `/lock`, `/unlock`, `/clear`, `/ping`, `/modhelp` ; chacune enregistrant une entrée d'audit selon l'action
- `audit-log` : Enregistrement permanent de toutes les actions de modération par serveur, incluant la détection des server mutes manuels via `voiceStateUpdate` ; queryable par acteur, cible et type d'action
- `guild-configuration` : Paramètres par serveur (salon de logs, salon de bienvenue, message de bienvenue, auto-rôle, salon d'anniversaires) stockés et éditables via API et dashboard
- `dashboard-auth` : Flux Discord OAuth2 émettant des JWT signés en cookie HttpOnly ; accès restreint aux utilisateurs ayant `MANAGE_GUILD` dans un serveur où le bot est présent
- `dashboard-ui` : Pages React — vue d'ensemble avec statistiques, logs de modération, gestion des membres (avec actions en 1 clic), paramètres généraux, config auto-modération, config XP/niveau + leaderboard, anniversaires, embeds sauvegardés, MOC
- `xp-level-system` : Pool XP unifié messages + vocal ; taux configurables (avec cooldown), paliers de niveau, récompenses de rôles automatiques ; commandes utilisateur `/rank`, `/top` ; commandes admin `/addxp`, `/setxp`, `/addlevels`, `/setlevels`, `/reset`
- `birthday-system` : Table `Birthday` par serveur, cron quotidien à minuit UTC, embed automatique envoyé dans le salon configuré
- `embed-announcements` : Table `SavedEmbed` par serveur ; créer, modifier, enregistrer et envoyer des templates depuis le dashboard ; commande `/announce` pour envoi ponctuel sans sauvegarde
- `moc` : Table `MocChannel` par serveur ; handler sur `messageCreate` supprimant les messages ne contenant aucun média dans les salons configurés

### Capacités modifiées

_(aucune — projet nouveau)_

## Impact

- **Nouveau projet** : aucun code existant impacté
- **Dépendances externes** : API Discord (token bot + app OAuth2), base MySQL
- **Infrastructure** : Runtime Node.js pour le processus bot et l'API NestJS ; hébergement statique ou serveur Node pour le dashboard Vite compilé
- **Stack technique** : TypeScript partout — discord.js 14 (bot), NestJS (API REST), React 18 + Vite (dashboard), TypeORM + mysql2 (ORM), Tailwind CSS (styles)
