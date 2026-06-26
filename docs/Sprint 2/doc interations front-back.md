# 📂 DOSSIER TECHNIQUE & BILAN DE SPRINT : VALIDATION DU DASHBOARD (SPRINT 2)

Ce document rassemble l'architecture technique, la documentation des flux, la mise à jour des exigences fonctionnelles (User Stories) et le bilan de l'usage de l'IA pour le Sprint 2 du projet Wystrelia.

---

## 1. Architecture Globale et Interactions Frontend / Backend

Le projet Wystrelia utilise une architecture en **Monorepo** pour lier l'interface utilisateur et le moteur de modération Discord.

### A. Structure des Dossiers
* **`apps/dashboard` (Frontend) :** Application React / Vite / TypeScript. C'est l'interface visuelle utilisée par les administrateurs du serveur.
* **`apps/bot-api` (Backend) :** Application Node.js / Discord.js. C'est le moteur qui applique la modération en direct sur les salons Discord et gère la base de données.
* **`packages/shared` (Contrat de Données) :** Contient les types TypeScript stricts partagés entre le Front et le Back (ex: les interfaces `DashboardServer` et `Member`).

### B. Cycle de Vie d'un Échange de Données
La communication entre le Frontend et le Backend suit un protocole strict :

1. **Lecture (HTTP GET) :** Au chargement d'une page (ex: la liste des mots filtrés), le Frontend envoie une requête HTTP à l'API du Backend. Le Backend le lit en base de données et renvoie un fichier JSON propre au Frontend.
2. **Écriture (HTTP POST / DELETE) :** Lorsque l'administrateur effectue une action (ajouter un mot banni, modifier une exemption), le Frontend envoie la modification au Backend.
3. **Application en Temps Réel :** Dès que le Backend valide et sauvegarde la modification en base de données, il met à jour le comportement du **Bot Discord** instantanément sur le serveur via une connexion permanente (WebSocket).

### C. Sécurité et Répartition des Responsabilités
* **Le Frontend (`apps/dashboard`)** s'occupe de l'expérience utilisateur. Il valide la surface (par exemple, désactiver un bouton si un champ est vide) pour éviter d'envoyer des requêtes réseau inutiles.
* **Le Backend (`apps/bot-api`)** détient la vérité absolue et gère la sécurité. À chaque requête reçue, il vérifie de manière agnostique auprès de l'API de Discord que l'utilisateur possède bien les droits administratifs requis avant de modifier la base de données.

---

## 2. Mise à jour des User Stories & Critères d'Acceptation

Pour ce Sprint 2, les fonctionnalités développées ont été verrouillées par des critères d'acceptation stricts, tous validés par des tests automatisés (`Vitest` + `React Testing Library`).

### US 1 : Gestion de la liste noire (Filter-Word)
*En tant qu'administrateur, je veux ajouter des mots à une liste noire afin de modérer automatiquement les salons Discord.*
* **Critère 1 :** Interdiction stricte des doublons sans tenir compte de la casse (si "Test" est enregistré, refuser "test" ou "TEST").
* **Critère 2 :** Le bouton de validation doit être désactivé si le champ de saisie est vide.
* **Critère 3 :** Le champ doit se vider automatiquement après une soumission réussie.
* **Critère 4 :** Si la liste est vide, un message d'attente clair doit s'afficher.

### US 2 : Exemptions de rôles pour le filtre
*En tant qu'administrateur, je veux exempter le rôle "Modo" afin que l'équipe de modération ne soit pas bloquée par le bot.*
* **Critère 1 :** L'interface doit séparer visuellement les rôles déjà exemptés des rôles encore disponibles.
* **Critère 2 :** Un compteur de rôles exemptés doit s'afficher dynamiquement.

### US 3 : Recherche et Gestion des Membres
*En tant qu'administrateur, je veux voir la liste des membres et faire une recherche par pseudo pour trouver rapidement un utilisateur.*
* **Critère 1 :** La liste des membres doit se filtrer en temps réel dès que l'on tape une lettre dans la barre de recherche.
* **Critère 2 :** Chaque ligne doit afficher le pseudo, le niveau d'XP (avec barre de progression) et la date d'arrivée.
* **Critère 3 (UX) :** Un clic sur l'ID d'un membre (ex: `12345`) doit copier automatiquement cet identifiant dans le presse-papier de l'ordinateur.

---

## 3. Bilan des Usages de l'IA durant le Sprint

L'Intelligence Artificielle a été utilisée comme un outil de productivité ciblé pour résoudre les blocages techniques liés à l'environnement de développement et aux tests.

### A. Alignement du Typage TypeScript Strict
* **Problème :** Erreurs de compilation sur les fausses données de test (*mocks*). Il manquait des propriétés obligatoires imposées par le package partagé (`isBooster`, `icon`, `gradient`, etc.) et le type de l'ID entrait en conflit (`string` au lieu de `number`).
* **Action de l'IA :** Analyse rapide des codes d'erreurs TypeScript pour identifier les structures manquantes.
* **Résultat :** Données de tests corrigées et synchronisées à 100% avec les types réels de l'application.

### B. Débogage de l'Environnement de Test (Vitest)
* **Problème :** Les tests crashaient avec l'erreur `Invalid Chai property` sur des fonctions d'affichage basiques (`toBeInTheDocument`, `toBeDisabled`).
* **Action de l'IA :** Diagnostic de la configuration. L'IA a détecté l'absence de l'extension de rendu du DOM dans le cycle d'exécution de Vitest.
* **Résultat :** Résolution immédiate en forçant l'importation de `@testing-library/jest-dom` au début des fichiers de tests.

### C. Ajustement des Sélecteurs de Tests (QA)
* **Problème :** Échecs de tests dus à des erreurs de casse (majuscule/minuscule sur un pseudo) ou à des éléments HTML non visibles lors du rendu de test pour le sélecteur de rôles.
* **Action de l'IA :** Analyse des rapports de rendu HTML générés par le terminal pour corriger les requêtes de recherche de boutons (`screen.getByRole`).
* **Résultat :** 9 tests sur 9 validés avec succès (100% de réussite côté Frontend).

---

## 4. Validation et Tests Automatisés du Backend (Jest)

La logique métier côté serveur et les réactions du Bot Discord sont également couvertes par une suite de tests unitaires et d'intégration développée avec **Jest**. L'exécution globale est centralisée à la racine du projet via la commande `npm run test:all`.

### A. Validation des Règles Métiers du Bot (`apps/bot`)
Le composant critique `MessageCreateListener` (gestionnaire des messages du serveur Discord) a été testé face aux comportements attendus :
* **Isolation :** Le Bot ne s'auto-modère pas et ignore les messages provenant d'autres applications automatisées (*bots*).
* **Respect des privilèges (US 2) :** Les membres possédant un rôle configuré comme "exempté" (ex: l'équipe de modération) peuvent utiliser l'ensemble du dictionnaire sans que leurs messages ne soient supprimés.
* **Sanction immédiate (US 1) :** Tout message contenant un mot inscrit sur la liste noire envoyé par un utilisateur non exempté est instantanément intercepté et supprimé des salons Discord.

### B. Validation de l'Infrastructure API (`apps/api`)
Les composants fondamentaux (`app.controller` et `app.service`) qui exposent les données au Dashboard ont été validés et certifiés stables (2 tests passés).

---

## 5. Indicateurs de Clôture du Sprint 2 (QA)

* **Tests Frontend (Vitest) :** 9 tests sur 9 validés avec succès.
* **Tests Backend (Jest) :** 6 tests sur 6 validés avec succès.
* **Bilan :** 100% de réussite sur les objectifs d'assurance qualité du Sprint 2. Le produit est stable, entièrement typé et sécurisé de bout en bout pour la soutenance.