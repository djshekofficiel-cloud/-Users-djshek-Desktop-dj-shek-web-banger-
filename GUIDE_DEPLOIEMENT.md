# 🚀 GUIDE DE DÉPLOIEMENT - djshekofficiel.com

**Domaine** : djshekofficiel.com  
**Hébergeur** : GoDaddy  
**Date** : $(date)

---

## ✅ VÉRIFICATIONS PRÉ-DÉPLOIEMENT

### 1. Configuration du Domaine
- ✅ Nom de domaine : **djshekofficiel.com** (déjà configuré sur GoDaddy)
- ✅ Vérifier que le domaine pointe vers votre hébergement GoDaddy

### 2. Fichiers à Déployer

#### Structure des fichiers :
```
/
├── index.html          (fichier principal)
├── images/
│   └── Gemini_Generated_Image_exfw8sexfw8sexfw.png
└── audio/
    └── [30 fichiers MP3]
```

### 3. Vérifications du Code

#### Liens et Références
- ✅ Email : `djshekofficiel@gmail.com` (déjà configuré)
- ✅ SoundCloud : `https://soundcloud.com/djshekofficiel2025`
- ✅ Instagram : `https://instagram.com/djshek`
- ✅ Tous les liens utilisent `rel="noopener"` pour la sécurité

#### Chemins des Fichiers
- ✅ Images : `images/Gemini_Generated_Image_exfw8sexfw8sexfw.png`
- ✅ Audio : `audio/[nom_du_fichier].mp3`
- ⚠️ **IMPORTANT** : Vérifier que tous les chemins sont relatifs (sans `/` au début)

---

## 📤 ÉTAPES DE DÉPLOIEMENT SUR GODADDY

### Étape 1 : Accéder à votre Hébergement GoDaddy

1. Connectez-vous à votre compte GoDaddy
2. Allez dans **Mon compte** > **Hébergement Web**
3. Sélectionnez votre plan d'hébergement
4. Cliquez sur **Gérer**

### Étape 2 : Accéder au Gestionnaire de Fichiers

1. Dans le panneau de contrôle, trouvez **Fichiers** ou **File Manager**
2. Ouvrez le dossier `public_html` ou `www` (selon votre configuration)

### Étape 3 : Télécharger les Fichiers

#### Option A : Via File Manager (Recommandé pour débutants)

1. Dans `public_html`, créez les dossiers :
   - `images/`
   - `audio/`

2. Téléchargez les fichiers :
   - `index.html` → racine de `public_html`
   - `Gemini_Generated_Image_exfw8sexfw8sexfw.png` → dans `images/`
   - Tous les fichiers MP3 → dans `audio/`

#### Option B : Via FTP (Plus rapide)

1. Utilisez un client FTP (FileZilla, Cyberduck, etc.)
2. Connectez-vous avec vos identifiants FTP GoDaddy
3. Uploadez tous les fichiers dans la même structure

### Étape 4 : Vérifier les Permissions

Assurez-vous que :
- `index.html` a les permissions : **644** (lecture/écriture pour vous, lecture pour tous)
- Les dossiers `images/` et `audio/` ont les permissions : **755**

---

## 🔧 CONFIGURATION POST-DÉPLOIEMENT

### 1. Vérifier le Fichier Index

Assurez-vous que `index.html` est bien le fichier par défaut :
- GoDaddy utilise généralement `index.html` par défaut
- Si nécessaire, vérifiez dans les paramètres d'hébergement

### 2. Tester le Site

1. Ouvrez votre navigateur
2. Allez sur `http://djshekofficiel.com`
3. Vérifiez que :
   - ✅ La page se charge correctement
   - ✅ L'image s'affiche
   - ✅ Le lecteur audio fonctionne
   - ✅ Tous les liens fonctionnent
   - ✅ Le site est responsive (testez sur mobile)

### 3. Activer HTTPS (SSL)

**IMPORTANT** : Activez le certificat SSL gratuit de GoDaddy

1. Dans le panneau GoDaddy, allez dans **SSL**
2. Activez le certificat SSL gratuit
3. Redirigez HTTP vers HTTPS (optionnel mais recommandé)

Une fois activé, votre site sera accessible via `https://djshekofficiel.com`

---

## ⚙️ OPTIMISATIONS RECOMMANDÉES

### 1. Compression des Fichiers Audio

Les 30 fichiers MP3 peuvent être lourds. Options :
- Utiliser un CDN (Content Delivery Network)
- Compresser les fichiers audio
- Utiliser le lazy loading

### 2. Cache Browser

Ajoutez ces règles dans votre `.htaccess` (si GoDaddy supporte Apache) :

```apache
# Cache pour les images
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType audio/mpeg "access plus 1 year"
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 3. Optimisation des Images

- Compresser l'image PNG si nécessaire
- Utiliser des formats modernes (WebP) si supporté

---

## 🔍 VÉRIFICATIONS FINALES

### Checklist de Déploiement

- [ ] Tous les fichiers sont uploadés
- [ ] La structure des dossiers est correcte
- [ ] Les permissions sont correctes
- [ ] Le site est accessible via `djshekofficiel.com`
- [ ] L'image s'affiche correctement
- [ ] Le lecteur audio fonctionne
- [ ] Tous les liens fonctionnent
- [ ] Le site est responsive (test mobile)
- [ ] SSL/HTTPS est activé
- [ ] Les fichiers audio se chargent correctement

### Tests à Effectuer

1. **Desktop** :
   - Chrome, Firefox, Safari, Edge
   - Vérifier toutes les fonctionnalités

2. **Mobile** :
   - Test sur iPhone (Safari)
   - Test sur Android (Chrome)
   - Vérifier le menu hamburger
   - Vérifier le lecteur audio

3. **Performance** :
   - Temps de chargement < 3 secondes
   - Images optimisées
   - Audio se charge progressivement

---

## 🆘 DÉPANNAGE

### Problème : L'image ne s'affiche pas
- ✅ Vérifier le chemin : `images/Gemini_Generated_Image_exfw8sexfw8sexfw.png`
- ✅ Vérifier les permissions du fichier (644)
- ✅ Vérifier que le fichier est bien uploadé

### Problème : Les fichiers audio ne se chargent pas
- ✅ Vérifier le chemin : `audio/[nom_fichier].mp3`
- ✅ Vérifier les permissions du dossier audio (755)
- ✅ Vérifier que tous les fichiers sont uploadés
- ✅ Vérifier la console du navigateur pour les erreurs

### Problème : Le site ne se charge pas
- ✅ Vérifier que `index.html` est dans `public_html`
- ✅ Vérifier les permissions (644)
- ✅ Vérifier que le domaine pointe vers le bon hébergement

### Problème : HTTPS ne fonctionne pas
- ✅ Activer le certificat SSL dans GoDaddy
- ✅ Attendre 24-48h pour la propagation
- ✅ Vérifier dans les paramètres DNS

---

## 📞 SUPPORT GODADDY

Si vous avez des problèmes :
- **Support GoDaddy** : 0800 90 13 57 (France)
- **Chat en ligne** : Disponible 24/7
- **Documentation** : help.godaddy.com

---

## ✅ RÉSUMÉ

**Domaine** : djshekofficiel.com  
**Fichier principal** : index.html  
**Dossiers nécessaires** : images/, audio/  
**SSL** : À activer (gratuit avec GoDaddy)

**Temps estimé de déploiement** : 30-60 minutes

---

**Bon déploiement ! 🚀**



