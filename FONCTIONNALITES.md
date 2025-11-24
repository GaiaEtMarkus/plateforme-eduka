# Fonctionnalités de la Plateforme Eduka

## INTERVENANT (Formateur)

### 📅 Calendrier
- Afficher toutes les missions (terminées, en cours, planifiées) dans un calendrier mensuel
- Visualiser les sessions de formation avec code couleur par statut
- Cliquer sur une mission pour voir les détails (école, classe, horaires, volume horaire)
- Navigation rapide entre les mois

### 📋 Missions
- Consulter la liste complète des missions assignées
- Filtrer les missions par statut (toutes, planifiées, en cours, terminées)
- Voir les détails de chaque mission : cours, école, classe, sessions, volume horaire
- Accéder au planning détaillé des sessions (numéro, date, horaires, durée)
- Voir le logo de l'école et informations de contact

### 💰 Factures
- Consulter toutes les factures (soumises, validées, payées)
- Filtrer les factures par statut
- Voir les statistiques : total factures, montant total, répartition par statut
- Détails d'une facture : numéro, école, montant, date d'échéance, lignes de facturation
- **Upload de facture** : télécharger un PDF de facture manuellement
- **Génération automatique** : générer une facture à partir d'une mission terminée sans facture
- Identifier les missions terminées sans facture associée
- Alertes visuelles pour les factures en retard

### 📄 Propositions de Mission
- Consulter les offres de missions disponibles
- Filtrer par statut (ouverte, en attente, acceptée, refusée)
- Voir les détails complets : cours, école, classe, dates, rémunération, volume horaire
- Visualiser le planning des sessions pour les propositions multi-sessions
- Postuler à une mission (statut passe à "en_attente")
- Retirer sa candidature

### 👤 Profil
- Voir et modifier ses informations personnelles (nom, prénom, email, téléphone, adresse)
- Gérer ses compétences techniques avec niveau d'expertise
- Consulter ses statistiques : nombre de missions, heures enseignées, note globale, tarif horaire
- **Upload de documents** : télécharger CV et diplômes (fonctionnalité à implémenter côté backend)
- Gérer ses disponibilités hebdomadaires par jour et plage horaire

---

## ADMINISTRATEUR

### 📊 Dashboard
- Vue d'ensemble avec KPIs :
  - Total formateurs actifs
  - Missions en cours
  - Écoles partenaires
  - Volume horaire total
- Graphique d'évolution des missions (6 derniers mois)
- Liste des missions récentes avec statuts

### 👥 Gestion des Formateurs
- Liste complète des formateurs avec photo, compétences, statistiques
- Filtrer par compétence technique
- Rechercher par nom
- Voir le détail d'un formateur :
  - Informations personnelles et contact
  - Compétences avec niveaux
  - Documents uploadés (CV, diplômes)
  - Disponibilités hebdomadaires
  - Historique des missions
- **Modal de détails formateur** : cliquer sur le nom d'un formateur pour voir sa fiche complète avec ses missions

### 🏫 Gestion des Écoles
- Liste des écoles partenaires avec logos
- Filtrer par ville
- Statistiques par école : nombre de missions, total heures, satisfaction
- Voir les missions actives et terminées par école
- Informations complètes : adresse, contact, type d'école

### 📚 Gestion des Missions
- Vue d'ensemble de toutes les missions (toutes écoles, tous formateurs)
- Filtrer par statut (planifiée, en cours, terminée)
- Rechercher par formateur, école ou cours
- Voir les détails complets : intervenant, école, classe, dates, sessions, volume horaire
- **Modal de détails mission** : vue complète d'une mission avec planning des sessions
- **Modal de détails formateur** : cliquer sur l'intervenant pour accéder à sa fiche depuis la liste ou le détail de mission
- Identifier rapidement les missions multi-sessions vs missions sur une journée
- Affichage adapté des dates (jj/mm/aaaa pour journée, jj/mm/aa pour multi-sessions)

### 📝 Gestion des Propositions
- Créer de nouvelles propositions de missions
- **Support multi-sessions** : définir plusieurs sessions avec dates/horaires différents
- Calculer automatiquement le volume horaire total
- Voir toutes les propositions avec statuts (ouverte, en attente, acceptée, refusée, clôturée)
- Filtrer par statut et école
- Voir les candidatures reçues pour chaque proposition
- Accepter ou refuser les candidatures
- Clôturer une proposition

### 💳 Gestion des Factures
- Vue d'ensemble de toutes les factures (tous formateurs)
- Filtrer par statut et formateur
- Statistiques globales : total factures, montant total, répartition
- Voir les détails de chaque facture
- Valider les factures soumises
- Marquer les factures comme payées
- Alertes pour les factures en retard
- Exporter les données de facturation (à implémenter)

---

## Fonctionnalités Transverses

### 🔔 Notifications
- Badge de compteur sur l'icône de notifications
- Liste des notifications non lues
- Types de notifications :
  - Nouvelle mission assignée
  - Proposition acceptée/refusée
  - Facture validée/payée
  - Rappel de session à venir
- Marquer comme lu
- Supprimer une notification

### 🔐 Authentification
- Connexion simplifiée (démo sans mot de passe)
- Liste des comptes de test disponibles (formateurs et admin)
- Connexion rapide en un clic
- Redirection automatique selon le rôle (admin → dashboard, formateur → calendrier)
- Gestion de session (localStorage)

### 🎨 Interface
- Design moderne avec Tailwind CSS
- Couleurs de marque Eduka (orange principal)
- Responsive design (desktop optimisé)
- Modales pour les détails et actions
- Badges de statut avec code couleur
- Navigation intuitive avec menu latéral
- Logos des écoles affichés partout

### 📱 Navigation
- **Formateur** :
  - Calendrier (page d'accueil)
  - Missions
  - Factures
  - Propositions
  - Profil
  - Notifications

- **Administrateur** :
  - Dashboard (page d'accueil)
  - Formateurs
  - Écoles
  - Missions
  - Propositions
  - Factures
  - Notifications

---

## Fonctionnalités Techniques

### 🎯 Points Forts
- **Angular 20.3.12** : dernière version stable avec signals et control flow
- **Architecture standalone** : composants modernes sans modules NgModule
- **Gestion d'état réactive** : signals pour performance optimale
- **Services centralisés** : AuthService, MissionService, FactureService, etc.
- **Données mockées** : JSON files pour démo sans backend
- **Multi-sessions** : support complet des formations sur plusieurs jours
- **Déploiement automatisé** : GitHub Actions pour GitHub Pages

### 🔄 Statuts
- **Missions** : planifiee, en_cours, terminee
- **Propositions** : ouverte, en_attente, acceptee, refusee, cloturee
- **Factures** : soumise, validee, payee

### 📊 Statistiques Calculées
- Nombre total de missions par formateur
- Volume horaire total enseigné
- Montants facturés et répartition
- Missions sans facture (terminées mais non facturées)
- Évolution mensuelle des missions

---

## À Venir (Backend requis)

- Upload réel de fichiers (factures, CV, diplômes)
- Génération automatique de factures PDF
- Envoi d'emails de notification
- Authentification sécurisée avec mot de passe
- Persistance des données en base
- Recherche full-text avancée
- Export Excel/CSV des données
- Validation de documents
- Gestion des congés et absences
- Système de messagerie interne
