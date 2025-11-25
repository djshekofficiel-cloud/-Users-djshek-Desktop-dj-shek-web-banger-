# 🤖 INSTALLATION ET DÉPLOIEMENT AUTOMATIQUE

## ⚡ DÉPLOIEMENT EN UNE COMMANDE

```bash
cd "/Users/djshek/Desktop/dj shek web banger"
./deploy-auto.sh
```

**C'est tout !** Le script fait :
- ✅ Vérifie les fichiers
- ✅ Met à jour Git
- ✅ Push vers GitHub
- ✅ Installe Vercel CLI (si nécessaire)
- ✅ Se connecte à Vercel (si nécessaire)
- ✅ Déploie sur Vercel

---

## 📋 PRÉREQUIS

### Option 1 : Avec Node.js (Recommandé)
```bash
# Vérifier si Node.js est installé
node --version

# Si pas installé, installez-le :
# - macOS : https://nodejs.org/ (téléchargez et installez)
# - Ou via Homebrew : brew install node
```

### Option 2 : Sans Node.js
Le script vous guidera pour déployer manuellement via l'interface Vercel.

---

## 🚀 UTILISATION

### Première fois
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
./deploy-auto.sh
```

Le script va :
1. Installer Vercel CLI automatiquement (si Node.js est installé)
2. Vous demander de vous connecter (ouvrira le navigateur)
3. Déployer automatiquement

### Déploiements suivants
```bash
./deploy-auto.sh
```

C'est tout ! Plus rapide que la première fois.

---

## 🔧 SI ÇA NE FONCTIONNE PAS

### Erreur : "npm non trouvé"
1. Installez Node.js : https://nodejs.org/
2. Relancez : `./deploy-auto.sh`

### Erreur : "Permission denied"
```bash
chmod +x deploy-auto.sh
./deploy-auto.sh
```

### Erreur : "Vercel login failed"
1. Le script ouvrira votre navigateur
2. Connectez-vous à Vercel
3. Autorisez l'accès
4. Le script continuera automatiquement

### Si tout échoue
Le script vous donnera un lien direct pour déployer manuellement :
1. Allez sur : https://vercel.com/new
2. Importez le dépôt GitHub
3. Cliquez sur "Deploy"

---

## ✅ RÉSULTAT

Une fois le script terminé :
- ✅ Votre site sera sur GitHub
- ✅ Votre site sera déployé sur Vercel
- ✅ Vous aurez une URL Vercel (ex: `votre-projet.vercel.app`)
- ✅ Les déploiements futurs seront automatiques

---

## 🌐 AJOUTER LE DOMAINE

Après le premier déploiement :

1. **Dans Vercel** : Settings > Domains
2. **Ajoutez** : `djshekofficiel.com`
3. **Configurez les DNS** sur GoDaddy selon Vercel

---

## 🎉 C'EST TOUT !

**Un seul script fait tout automatiquement !**

```bash
./deploy-auto.sh
```

**Votre site sera en ligne en quelques minutes ! 🚀**







