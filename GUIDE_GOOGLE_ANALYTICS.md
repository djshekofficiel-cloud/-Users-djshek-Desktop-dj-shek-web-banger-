# 📊 Guide d'installation Google Analytics 4

## 🎯 Objectif
Suivre le trafic et les interactions sur votre site djshekofficiel.com

---

## 📝 Étape 1 : Créer un compte Google Analytics

1. **Aller sur Google Analytics**
   - Ouvrez : https://analytics.google.com/
   - Connectez-vous avec votre compte Google (ou créez-en un)

2. **Créer une propriété**
   - Cliquez sur **"Admin"** (icône d'engrenage en bas à gauche)
   - Dans la colonne "Propriété", cliquez sur **"Créer une propriété"**
   - Remplissez les informations :
     - **Nom de la propriété** : `DJ SHEK Website`
     - **Fuseau horaire** : `(GMT+01:00) Paris`
     - **Devise** : `EUR`
   - Cliquez sur **"Suivant"**

3. **Configurer les informations sur votre entreprise**
   - Sélectionnez votre secteur : `Divertissement / Art / Musique`
   - Taille de l'entreprise : selon votre choix
   - Cliquez sur **"Créer"**

---

## 🔑 Étape 2 : Obtenir votre ID de mesure (G-XXXXXXXXXX)

1. **Créer un flux de données Web**
   - Une fois la propriété créée, Google vous demande de créer un **flux de données**
   - Cliquez sur **"Flux de données Web"**
   - Remplissez :
     - **URL du site Web** : `https://djshekofficiel.com`
     - **Nom du flux** : `DJ SHEK Main Website`
   - Cliquez sur **"Créer un flux"**

2. **Récupérer l'ID de mesure**
   - Vous verrez maintenant une page avec votre **ID de mesure**
   - Il ressemble à : `G-XXXXXXXXXX` (exemple : `G-ABC123XYZ4`)
   - **⚠️ Copiez cet ID**, vous en aurez besoin !

---

## ⚙️ Étape 3 : Configurer le code sur votre site

### Option A : Je configure pour vous (recommandé)

**Envoie-moi ton ID de mesure** (G-XXXXXXXXXX) et je vais :
- ✅ Remplacer `G-XXXXXXXXXX` dans le code
- ✅ M'assurer que tout fonctionne correctement
- ✅ Tester les événements de tracking

### Option B : Vous le faites vous-même

1. **Ouvrir le fichier `index.html`**
   - Cherchez la ligne : `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX">`
   - Remplacez `G-XXXXXXXXXX` par votre vrai ID (exemple : `G-ABC123XYZ4`)

2. **Remplacer dans 2 endroits :**
   ```html
   <!-- Ligne 1 : Script de chargement -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID-ICI"></script>
   
   <!-- Ligne 2 : Configuration -->
   gtag('config', 'G-VOTRE-ID-ICI', {
   ```

3. **Sauvegarder et déployer**
   - Commitez les changements
   - Poussez vers GitHub
   - Vercel déploiera automatiquement

---

## 📈 Événements trackés automatiquement

Une fois configuré, les événements suivants seront suivis :

### 🎵 Audio Player
- **Lecture de piste** : Quand un utilisateur joue une musique
- **Pause** : Quand un utilisateur met en pause
- **Téléchargement** : Quand un utilisateur télécharge une piste

### 📧 Contact Form
- **Soumission de formulaire** : Quand un formulaire est envoyé
- **Type de prestation** : Le type sélectionné est enregistré

### 🔍 Stop Doublon
- **Début d'analyse** : Quand l'outil est utilisé
- **Type de fichier** : ZIP ou fichiers individuels

---

## ✅ Vérification que ça fonctionne

1. **Attendre 24-48h** après l'installation (premières données)

2. **Vérifier dans Google Analytics :**
   - Allez sur https://analytics.google.com/
   - Sélectionnez votre propriété "DJ SHEK Website"
   - Cliquez sur **"Rapports"** dans le menu gauche
   - Section **"Temps réel"** pour voir les visiteurs en direct

3. **Tester manuellement :**
   - Visitez votre site : https://djshekofficiel.com
   - Jouez une musique
   - Soumettez le formulaire de contact
   - Vérifiez dans Analytics > Temps réel (apparaît en quelques secondes)

---

## 🎛️ Dashboard Analytics recommandé

Une fois les données collectées, vous pourrez voir :

- **👥 Utilisateurs** : Nombre de visiteurs uniques
- **📄 Pages vues** : Nombre de pages consultées
- **⏱️ Temps moyen** : Temps passé sur le site
- **📍 Provenance** : D'où viennent vos visiteurs (Google, réseaux sociaux, etc.)
- **📱 Appareils** : Mobile vs Desktop
- **🌍 Géolocalisation** : Pays et villes des visiteurs

---

## 🔒 Respect de la vie privée (RGPD)

Le code est configuré avec :
- ✅ **Anonymisation IP** : Les adresses IP sont anonymisées
- ✅ **Cookies sécurisés** : Configuration SameSite et Secure
- ⚠️ **Bandeau de consentement** : À ajouter si nécessaire selon votre juridiction

---

## ❓ Besoin d'aide ?

1. **ID de mesure introuvable ?**
   - Admin > Propriété > Flux de données > Votre flux > ID de mesure

2. **Les données n'apparaissent pas ?**
   - Attendez 24-48h pour les premières données
   - Vérifiez que l'ID est bien configuré (pas de faute de frappe)
   - Testez avec la vue "Temps réel" dans Analytics

3. **Questions techniques ?**
   - Vérifiez la console du navigateur (F12) pour les erreurs
   - Assurez-vous que le script Google Analytics se charge bien

---

**✅ Une fois ton ID obtenu, envoie-le moi et je configure tout !**

