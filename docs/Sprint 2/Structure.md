# Structure Globale

```
CDA-SOUTENANCE/
│
├── apps/
│   │
│   ├── api/
│   ├── bot/
│   └── dashboard/
│
├── docs/
├── openspec/
│
├── packages/
│   └── shared/
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.base.json
```

# Structure Shared

C'est ici que vivent les briques utilisées par plusieurs applications. C'est ce qui justifie tout le choix d'archi.

```
packages/shared/
│
├── dist/
├── src/
│   │
│   ├── entities/                  # entities TypeORM — importées par api ET bot
│   │   ├── guild.entity.ts
│   │   ├── guild-config.entity.ts
│   │   ├── member.entity.ts
│   │   ├── level-config.entity.ts
│   │   ├── level-reward.entity.ts
│   │   ├── mute.entity.ts
│   │   ├── warning.entity.ts
│   │   ├── log.entity.ts
│   │   ├── filtered-word.entity.ts
│   │   ├── moc-channel.entity.ts
│   │   ├── automatic-role.entity.ts
│   │   ├── exempted-role.entity.ts
│   │   ├── embed.entity.ts
│   │   ├── birthday.entity.ts
│   │   ├── twitch.entity.ts
│   │   └── channel-log.entity.ts
│   │
│   ├── domain/                    # logique métier pure — importée par api ET bot
│   │   ├── leveling/
│   │   │   ├── xp-calculator.ts       # 15-25 XP/msg, niveau dérivé de l'XP
│   │   │   └── level-thresholds.ts
│   │   └── moderation/
│   │       ├── spam-detector.ts       # 5 msg/5s, 5 mentions/msg
│   │       └── word-filter.ts
│   │
│   ├── types/                     # interfaces & contrats — importés PARTOUT
│   │   ├── guild.types.ts
│   │   ├── member.types.ts
│   │   └── ...
│   │
│   ├── enums/                     # ENUM partagés (type de log, type de sanction…)
│   │   ├── log-type.enum.ts
│   │   └── ...
│   │
│   └── index.ts                   # ré-exporte tout (point d'entrée du package)
│
├── package.json
└── tsconfig.json
```

# Structure Back

Conséquence directe : les modules de l'API n'ont plus de dossier entities/ (il est dans shared). Ils gardent leurs DTO, parce qu'un DTO porte la validation HTTP (décorateurs class-validator) — c'est une préoccupation de la couche présentation, pas une donnée partagée.

```
api/
│
├── dist/
├── node_modules/
│
├── src/
│   │
│   ├── config/           # variables d'environnement, validation de config
│   ├── database/         # config TypeORM (pointe vers shared/entities) + migrations
│   │
│   ├── common/           # transversal : filtres, intercepteurs, pipes, décorateurs
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── decorators/
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/                   # OAuth2 Discord (stateless) + protection admin
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   └── strategies/
│   │   │       └── discord.strategy.ts
│   │   │
│   │   ├── guilds/                 # GUILD + GUILD_CONFIG
│   │   │   ├── dto/
│   │   │   │   ├── create-guild.dto.ts
│   │   │   │   └── update-guild.dto.ts
│   │   │   ├── guilds.module.ts
│   │   │   ├── guilds.controller.ts
│   │   │   └── guilds.service.ts
│   │   │                #  ↑ l'entity vient de @shared, plus de dossier entities/
│   │   │
│   │   ├── members/                # MEMBER (liste, profils, XP en lecture)
│   │   ├── leveling/               # LEVEL_CONFIG + LEVEL_REWARD
│   │   ├── moderation/             # MUTE + WARNING + LOGS
│   │   ├── filtering/              # FILTERED_WORD
│   │   ├── moc/                    # MOC_CHANNEL
│   │   ├── roles/                  # AUTOMATIC_ROLES + EXEMPTED_ROLE
│   │   ├── embeds/                 # EMBED
│   │   ├── birthdays/              # BIRTHDAY
│   │   ├── twitch/                 # TWITCH + intégration API Twitch
│   │   └── channel-logs/           # CHANNEL_LOG
│   │                      #  ↑ chaque module = dto/ + .module + .controller + .service
│   │
│   ├── app.module.ts
│   ├── app.controller.ts           # health check (GET /) — utile pour CI/CD & déploiement
│   ├── app.service.ts
│   └── main.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env / .env.sample / .gitignore
├── .prettierrc / .eslintrc.js
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.json / tsconfig.build.json
```

# Structure Bot

Le bot est lui aussi une application NestJS, mais organisée autour de l'écoute d'événements et des tâches planifiées, pas de routes HTTP. Il importe les entities et la logique de shared, et possède sa propre connexion TypeORM.

```
bot/
│
├── dist/
├── node_modules/
│
├── src/
│   │
│   ├── config/                    # config du bot (token Discord, intents…)
│   ├── database/                  # connexion TypeORM (mêmes shared/entities que l'api)
│   │
│   ├── discord/                   # cœur du client Discord
│   │   ├── discord.module.ts
│   │   └── discord.service.ts         # connexion à la Gateway, gestion du client
│   │
│   ├── events/                    # réactions aux événements Discord
│   │   ├── message-create.listener.ts     # → filtrage + auto-modération + XP
│   │   ├── voice-state.listener.ts        # → XP vocal (~10 XP/min)
│   │   ├── member-add.listener.ts         # → onboarding + rôles de bienvenue
│   │   └── member-remove.listener.ts      # → left_at sur MEMBER
│   │
│   ├── commands/                  # commandes des modérateurs
│   │   ├── mute.command.ts
│   │   ├── warn.command.ts
│   │   └── ...
│   │
│   ├── tasks/                     # tâches planifiées (cron)
│   │   ├── birthday.task.ts            # annonces anniversaires à 10h Europe/Paris
│   │   ├── member-counter.task.ts      # rafraîchissement toutes les 5-10 min
│   │   └── twitch-watcher.task.ts      # détection des lives Twitch
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/
├── .env / .env.sample / .gitignore
├── .prettierrc / .eslintrc.js
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.json / tsconfig.build.json
```

# Structure Front

J'ai retiré le types/ local (il est dans shared maintenant) et ajouté la plomberie manquante : client API, contextes, routes, hooks.

```
dashboard/
│
├── public/
├── dist/
├── node_modules/
│
├── src/
│   │
│   ├── features/                  # une feature = un module de l'api
│   │   ├── members/
│   │   │   ├── components/
│   │   │   │   ├── MembersTable.tsx
│   │   │   │   ├── MemberCard.tsx
│   │   │   │   └── MemberActions.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useMembers.ts        # appels API + état local de la feature
│   │   │   └── MembersPage.tsx
│   │   │
│   │   ├── moderation/             # même structure interne
│   │   ├── leveling/
│   │   ├── moc/
│   │   ├── embeds/
│   │   ├── roles/
│   │   ├── twitch/
│   │   └── birthdays/
│   │
│   ├── services/
│   │   └── api/
│   │       ├── client.ts           # client HTTP centralisé (URL de base, token, erreurs)
│   │       ├── members.api.ts
│   │       └── ...                     # un fichier d'appels par domaine
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx             # qui est connecté, est-il admin ?
│   │   └── SelectedGuildContext.tsx # SUR QUEL serveur je travaille (multi-serveur)
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx               # définition des pages
│   │   └── ProtectedRoute.tsx          # protection des pages admin
│   │
│   ├── components/
│   │   └── ui/                   # design system réutilisable (Button, Table, Input…)
│   │
│   ├── layout/
│   │   └── components/
│   │       ├── header/
│   │       ├── footer/
│   │       └── sidebar/                # contient typiquement le sélecteur de serveur
│   │
│   ├── hooks/                     # hooks transversaux (useAuth, useSelectedGuild…)
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css  # directives Tailwind (@tailwind base/components/utilities)
│
├── .env / .gitignore
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
├── vite.config.ts
└── tsconfig.json / tsconfig.app.json / tsconfig.node.json
```
