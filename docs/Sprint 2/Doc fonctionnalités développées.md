# 📄 Documentation Technique : Architecture Transversale et Flux de Données (Back/Front)

Cette documentation décrit l'écosystème technique de l'application **Wystrelia** (Dashboard de gestion de communauté et Bot Discord). Elle met en évidence la communication, la sécurité et la synchronisation entre la partie cliente (Front-end) et le moteur logique (Back-end).

---

## 1. Vue d'Ensemble de l'Architecture (Monorepo)

Le projet adopte une architecture en **Monorepo**. Ce choix technique centralise l'application cliente, le bot/API et les structures de données communes au sein d'un même dépôt, facilitant la maintenance et le déploiement.

* **`apps/dashboard` (Front-end) :** * **Technologies :** React, Vite, TypeScript, Tailwind CSS.
    * **Rôle :** Interface utilisateur (UI). Permet aux administrateurs de visualiser les statistiques du serveur, de gérer les membres et de configurer les modules de modération.
* **`apps/bot-api` (Back-end) :**
    * **Technologies :** Node.js, TypeScript, Discord.js, Base de données.
    * **Rôle :** Logique métier et API. Il interagit en temps réel avec l'API officielle de Discord, applique les sanctions sur les salons textuels/vocaux, et expose des points d'accès (Endpoints HTTP) pour alimenter le Dashboard.
* **`packages/shared` (Contrat d'Interface) :**
    * **Technologies :** TypeScript pur.
    * **Rôle :** Centralisation des types et des interfaces métiers partagés entre le Front et le Back.

---

## 2. Le Contrat de Données Strict : `@wystrelia/shared`

Pour garantir qu'une donnée envoyée par le Back-end soit lue sans erreur par le Front-end, l'application s'appuie sur un couplage fort par types TypeScript via le package partagé.

### Mécanisme de synchronisation des types
1. Le **Back-end** utilise les interfaces du package partagé pour structurer ses requêtes, ses réponses d'API et ses modèles de base de données.
2. Le **Front-end** importe ces mêmes types exacts :
   ```typescript
   import type { DashboardServer, Member } from "@wystrelia/shared/types";