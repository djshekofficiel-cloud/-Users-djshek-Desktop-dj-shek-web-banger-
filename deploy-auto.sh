#!/bin/bash

# 🚀 Script de déploiement automatique complet
# Fait TOUT automatiquement : Git + Vercel

set -e

echo "🚀 DÉPLOIEMENT AUTOMATIQUE COMPLET"
echo "==================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérifier qu'on est dans le bon dossier
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erreur: index.html non trouvé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Fichiers vérifiés${NC}"
echo ""

# ÉTAPE 1 : Git
echo -e "${BLUE}📦 ÉTAPE 1 : Mise à jour Git...${NC}"
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    git init
    git remote add origin https://github.com/djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-.git 2>/dev/null || true
fi

git add .
if ! git diff --staged --quiet; then
    git commit -m "Déploiement automatique - $(date +'%Y-%m-%d %H:%M:%S')" || true
fi

echo -e "${GREEN}📤 Push vers GitHub...${NC}"
git push origin main 2>/dev/null || git push origin master 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Push Git échoué (normal si déjà à jour)${NC}"
}
echo ""

# ÉTAPE 2 : Vercel
echo -e "${BLUE}🚀 ÉTAPE 2 : Déploiement Vercel...${NC}"

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installation de Vercel CLI...${NC}"
    if command -v npm &> /dev/null; then
        npm install -g vercel@latest
    else
        echo -e "${RED}❌ npm non trouvé. Installez Node.js d'abord.${NC}"
        echo -e "${YELLOW}💡 Allez sur https://vercel.com/new et importez le dépôt GitHub manuellement${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Vercel CLI détecté${NC}"

# Vérifier si connecté
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Connexion à Vercel nécessaire...${NC}"
    echo -e "${YELLOW}   Ouvrez votre navigateur pour vous connecter...${NC}"
    vercel login
fi

echo -e "${GREEN}✅ Connecté à Vercel${NC}"
echo ""

# Déployer
echo -e "${GREEN}🚀 Déploiement en cours...${NC}"
echo ""

if vercel --prod --yes 2>&1; then
    echo ""
    echo -e "${GREEN}✅ DÉPLOIEMENT RÉUSSI !${NC}"
    echo ""
    echo -e "${BLUE}🌐 Votre site est maintenant en ligne !${NC}"
    echo ""
    echo -e "${YELLOW}📋 Prochaines étapes :${NC}"
    echo "1. Allez sur https://vercel.com/dashboard pour voir votre site"
    echo "2. Ajoutez le domaine djshekofficiel.com dans Settings > Domains"
    echo "3. Configurez les DNS sur GoDaddy selon les instructions Vercel"
    echo ""
else
    echo ""
    echo -e "${YELLOW}⚠️  Déploiement Vercel nécessite une configuration manuelle${NC}"
    echo ""
    echo -e "${BLUE}📋 FAITES CECI :${NC}"
    echo "1. Allez sur : https://vercel.com/new"
    echo "2. Cliquez sur 'Import Git Repository'"
    echo "3. Sélectionnez : djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-"
    echo "4. Cliquez sur 'Deploy'"
    echo "5. C'est tout !"
    echo ""
fi

echo -e "${GREEN}🎉 TERMINÉ !${NC}"

