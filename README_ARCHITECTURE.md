# 🚀 GUIDE D'UTILISATION - ARCHITECTURE MODULAIRE

## ⚠️ IMPORTANT : Comment utiliser le nouveau système

### ❌ NE PAS FAIRE
- ❌ Ouvrir `index.html` directement dans le navigateur
- ❌ Utiliser un serveur HTTP simple (python -m http.server)

### ✅ À FAIRE
- ✅ Utiliser **Vite** pour le développement
- ✅ Utiliser **Vite** pour le build de production

---

## 📦 PREMIÈRE INSTALLATION

```bash
# Installer les dépendances (Vite)
npm install
```

---

## 🛠️ DÉVELOPPEMENT

### Démarrer le serveur de développement
```bash
npm run dev
```

**Résultat** :
- ✅ Serveur démarre sur `http://localhost:3000`
- ✅ Hot Module Replacement (HMR) activé
- ✅ Changements visibles instantanément
- ✅ Navigateur s'ouvre automatiquement

### Arrêter le serveur
Appuyez sur `Ctrl + C` dans le terminal

---

## 🏗️ BUILD PRODUCTION

### Créer le build optimisé
```bash
npm run build
```

**Résultat** :
- ✅ Dossier `dist/` créé avec les fichiers optimisés
- ✅ CSS minifié
- ✅ JavaScript minifié
- ✅ Assets optimisés

### Prévisualiser le build
```bash
npm run preview
```

---

## 🔧 POURQUOI ÇA NE MARCHAIT PAS ?

### Problème 1 : Vite non installé
**Solution** : `npm install` ✅ (fait)

### Problème 2 : Ouvrir index.html directement
**Pourquoi ça ne marche pas** :
- Les imports ES6 (`import './css/style.css'`) ne fonctionnent pas sans serveur
- Les chemins `/src/main.js` ne sont pas résolus
- Vite est nécessaire pour traiter les modules

**Solution** : Utiliser `npm run dev`

### Problème 3 : Cache du navigateur
**Solution** :
- Vider le cache (Cmd+Shift+R sur Mac)
- Ou utiliser le mode navigation privée

---

## 📁 STRUCTURE DES FICHIERS

```
index.html          → Point d'entrée HTML
src/
  ├── main.js      → Point d'entrée JavaScript
  ├── css/
  │   └── style.css → Tous les styles
  └── data/
      └── tracks.js → Données audio
public/
  ├── audio/       → Fichiers MP3
  └── images/      → Images
```

---

## 🎯 COMMANDES RAPIDES

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

---

## ✅ VÉRIFICATION

Si tout fonctionne, vous devriez voir :
- ✅ Le site se charge avec les styles
- ✅ Le lecteur audio fonctionne
- ✅ Les animations sont actives
- ✅ Le design Bleu Nuit / Orange / Noir est appliqué

---

**Besoin d'aide ?** Vérifiez que :
1. ✅ `npm install` a été exécuté
2. ✅ `npm run dev` est lancé
3. ✅ Vous êtes sur `http://localhost:3000`


