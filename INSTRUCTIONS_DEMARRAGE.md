# 🚀 INSTRUCTIONS DE DÉMARRAGE

## ⚠️ PROBLÈME RÉSOLU

L'erreur `npm error Missing script: "dev"` venait du fait que vous n'étiez **pas dans le bon répertoire**.

---

## ✅ SOLUTION RAPIDE

### Option 1 : Script automatique (RECOMMANDÉ)
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
./start.sh
```

### Option 2 : Commandes manuelles
```bash
# 1. Aller dans le dossier du projet
cd "/Users/djshek/Desktop/dj shek web banger"

# 2. Vérifier que vous êtes au bon endroit
pwd
# Doit afficher: /Users/djshek/Desktop/dj shek web banger

# 3. Démarrer le serveur
npm run dev
```

---

## 🔍 COMMENT SAVOIR SI VOUS ÊTES AU BON ENDROIT ?

### ✅ BON (vous êtes dans le projet)
```bash
djshek@MacBookPro dj shek web banger %
# ou
/Users/djshek/Desktop/dj shek web banger
```

### ❌ MAUVAIS (vous êtes ailleurs)
```bash
djshek@MacBookPro ~ %
# ou
/Users/djshek
```

---

## 📋 ÉTAPES DÉTAILLÉES

### 1. Ouvrir le Terminal

### 2. Naviguer vers le projet
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
```

### 3. Vérifier le répertoire
```bash
pwd
ls package.json
```
→ Doit afficher le chemin complet et confirmer que `package.json` existe

### 4. Démarrer le serveur
```bash
npm run dev
```

### 5. Ouvrir le navigateur
→ Le site s'ouvrira automatiquement sur `http://localhost:3000`

---

## 🛑 ARRÊTER LE SERVEUR

Appuyez sur `Ctrl + C` dans le terminal où le serveur tourne.

---

## ❓ PROBLÈMES FRÉQUENTS

### "command not found: npm"
**Solution** : Installez Node.js depuis https://nodejs.org

### "Missing script: dev"
**Solution** : Vous n'êtes pas dans le bon dossier. Utilisez `cd` pour aller dans le projet.

### "Cannot find module 'vite'"
**Solution** : Exécutez `npm install` dans le dossier du projet.

---

## ✅ VÉRIFICATION RAPIDE

Exécutez ces commandes pour vérifier :
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
pwd
ls package.json
npm run
```

Si tout est OK, vous verrez :
```
Scripts available in dj-shek-website@2.0.0 via `npm run`:
  dev
    vite
  build
    vite build
  preview
    vite preview
```

---

**Maintenant, essayez :**
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
npm run dev
```

