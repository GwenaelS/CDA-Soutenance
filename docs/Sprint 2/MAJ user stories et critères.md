# 📋 Mise à jour des User Stories (US) et Critères d'Acceptation

Pour ce Sprint 2, les User Stories ont été affinées et complétées par des critères d'acceptation techniques et fonctionnels stricts. Chaque critère est directement lié à un test unitaire ou d'intégration exécuté avec succès.

---

## US 1 : Gestion de la liste noire des mots (Filter-Word)

**En tant qu'** administrateur du serveur  
**Je veux** pouvoir ajouter des mots ou des expressions à une liste noire  
**Afin de** modérer automatiquement les propos et éviter les débordements sur les salons Discord.

### Critères d'acceptation mis à jour :
1. **Validation de l'unicité (Case-Insensitive) :** L'application doit bloquer l'ajout d'un mot si celui-je est déjà présent dans la configuration du serveur, peu importe sa casse (ex: si "Test" existe, refuser "test" ou "TEST").
   * *Validation technique :* Couvert par le test `FilterwordPage.spec.tsx` (`Should prevent adding duplicate words case-insensitively`).
2. **Contrôle de saisie du formulaire :** Le bouton de soumission du formulaire d'ajout doit rester désactivé tant que le champ de texte est vide.
   * *Validation technique :* Couvert par le test `AddFilterWord.spec.tsx` (`should disable the add button when the input is empty`).
3. **Réinitialisation de l'état :** Après une soumission réussie, le champ de saisie doit se vider automatiquement pour permettre une nouvelle saisie.
   * *Validation technique :* Couvert par le test `AddFilterWord.spec.tsx` (`Should call onAddWord and clear the input field after submission`).
4. **Retour visuel (Fallback) :** Si la liste noire ne contient aucun mot, un message explicite ("Aucun mot filtré sur ce serveur.") doit s'afficher à l'écran.
   * *Validation technique :* Couvert par le test `FilterWordList.spec.tsx` (`Should render fallback message when the list is empty`).

---

## US 2 : Exemptions de rôles pour le système de filtrage

**En tant qu'** administrateur du serveur  
**Je veux** exempter certains rôles (comme l'équipe de modération) du filtre de mots  
**Afin qu'** ils puissent analyser des contenus ou travailler sans être bloqués par le bot.

### Critères d'acceptation mis à jour :
1. **Séparation visuelle et fonctionnelle :** L'interface doit clairement distinguer et séparer les rôles déjà exemptés des rôles encore disponibles à l'attribution.
   * *Validation technique :* Couvert par le test `RoleExemptions.spec.tsx` (`Should correctly separate exempted roles from available roles`).
2. **Affichage du compteur :** Un badge dynamique doit indiquer précisément le nombre de rôles actuellement exemptés.
   * *Validation technique :* Vérifié par l'assertion du texte `"1 exempté(s)"` dans le composant d'exemption.

---

## US 3 : Visualisation et Recherche des Membres

**En tant qu'** administrateur du serveur  
**Je veux** visualiser la liste des membres et pouvoir filtrer cette liste par leur nom d'utilisateur  
**Afin de** trouver rapidement un utilisateur pour consulter ses informations ou le modérer.

### Critères d'acceptation mis à jour :
1. **Filtrage dynamique (Temps réel) :** Lorsque je saisis un pseudonyme dans la barre de recherche, la liste doit se mettre à jour instantanément pour n'afficher que les membres correspondants.
   * *Validation technique :* Couvert par le test `MemberPage.spec.tsx` (`Should filter the members list based on search input`).
2. **Affichage des détails de l'entité :** Chaque ligne du tableau doit afficher de manière lisible le pseudonyme, le nom d'affichage, le niveau d'XP (avec une barre de progression) et la date d'arrivée.
   * *Validation technique :* Couvert par le test `MemberRow.spec.tsx` (`Should display member details`).
3. **Copie rapide de l'ID utilisateur (UX) :** Un clic sur l'ID textuel d'un membre doit déclencher l'écriture automatique de cet identifiant unique dans le presse-papier du système (Clipboard).
   * *Validation technique :* Couvert par le test `MemberRow.spec.tsx` (`copy ID to clipboard on click`).

---

## 5. Synthèse de la Matrice de Traçabilité

Grâce à la mise à jour de ces critères, **100% des exigences fonctionnelles décrites dans les User Stories possèdent un équivalent technique automatisé sous forme de test**. Cela garantit la non-régression du produit à chaque modification du code entre le Back-end et le Front-end.