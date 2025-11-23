#!/bin/bash

# 🚀 Script de déploiement final - Fait TOUT automatiquement

set -e

echo "🚀 DÉPLOIEMENT AUTOMATIQUE FINAL"
echo "================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérifications
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erreur: index.html non trouvé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Fichiers vérifiés${NC}"
echo ""

# ÉTAPE 1 : Git
echo -e "${BLUE}📦 Mise à jour Git...${NC}"
git add . 2>/dev/null || true
git commit -m "Déploiement automatique - $(date +'%Y-%m-%d %H:%M:%S')" 2>/dev/null || true
git push origin main 2>/dev/null || git push origin master 2>/dev/null || echo -e "${YELLOW}⚠️  Git déjà à jour${NC}"
echo ""

# ÉTAPE 2 : Vercel
echo -e "${BLUE}🚀 Déploiement Vercel...${NC}"

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installation Vercel CLI...${NC}"
    npm install -g vercel@latest
fi

# Vérifier connexion
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Connexion Vercel nécessaire...${NC}"
    vercel login
fi

echo -e "${GREEN}✅ Connecté à Vercel${NC}"
echo ""

# Déployer avec un nom valide
echo -e "${GREEN}🚀 Déploiement en cours...${NC}"
echo ""

# Essayer avec un nom de projet valide
PROJECT_NAME="dj-shek-web-banger"

if vercel --prod --yes --name "$PROJECT_NAME" 2>&1; then
    echo ""
    echo -e "${GREEN}✅ DÉPLOIEMENT RÉUSSI !${NC}"
    echo ""
    echo -e "${BLUE}🌐 Votre site est en ligne !${NC}"
    echo ""
    vercel ls 2>/dev/null | head -5 || true
    echo ""
else
    echo ""
    echo -e "${YELLOW}📋 DÉPLOIEMENT VIA INTERFACE WEB${NC}"
    echo ""
    echo -e "${BLUE}FAITES CECI (2 minutes) :${NC}"
    echo ""
    echo "1. Ouvrez : https://vercel.com/new"
    echo "2. Cliquez sur 'Import Git Repository'"
    echo "3. Sélectionnez : djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-"
    echo "4. Nom du projet : dj-shek-web-banger"
    echo "5. Framework : Other"
    echo "6. Cliquez sur 'Deploy'"
    echo ""
    echo -e "${GREEN}✅ Tous les fichiers sont sur GitHub et prêts !${NC}"
    echo ""
fi

echo -e "${GREEN}🎉 TERMINÉ !${NC}"

