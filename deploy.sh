#!/bin/bash

# 🚀 Script de déploiement automatique pour Vercel
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement automatique du site DJ SHEK"
echo "=========================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erreur: index.html non trouvé. Assurez-vous d'être dans le dossier du projet.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vérification des fichiers...${NC}"

# Vérifier les fichiers essentiels
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  vercel.json non trouvé. Création...${NC}"
    # Le fichier devrait déjà exister, mais on vérifie
fi

if [ ! -d "audio" ]; then
    echo -e "${RED}❌ Erreur: Dossier audio non trouvé.${NC}"
    exit 1
fi

if [ ! -d "images" ]; then
    echo -e "${RED}❌ Erreur: Dossier images non trouvé.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tous les fichiers sont présents${NC}"
echo ""

# Vérifier Git
echo -e "${GREEN}📦 Vérification Git...${NC}"
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Git non initialisé. Initialisation...${NC}"
    git init
    git remote add origin https://github.com/djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-.git 2>/dev/null || true
fi

# Vérifier le remote
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REMOTE_URL" ]; then
    echo -e "${YELLOW}⚠️  Remote non configuré. Ajout...${NC}"
    git remote add origin https://github.com/djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-.git
fi

echo -e "${GREEN}✅ Git configuré${NC}"
echo ""

# Ajouter tous les fichiers
echo -e "${GREEN}📝 Ajout des fichiers à Git...${NC}"
git add .

# Vérifier s'il y a des changements
if git diff --staged --quiet; then
    echo -e "${YELLOW}ℹ️  Aucun changement à commiter${NC}"
else
    echo -e "${GREEN}💾 Création du commit...${NC}"
    git commit -m "Déploiement automatique - $(date +'%Y-%m-%d %H:%M:%S')" || true
fi

# Pousser vers GitHub
echo -e "${GREEN}🚀 Push vers GitHub...${NC}"
git push origin main || git push origin master || {
    echo -e "${YELLOW}⚠️  Push échoué. Vérifiez vos credentials Git.${NC}"
    echo -e "${YELLOW}   Vous pouvez pousser manuellement avec: git push origin main${NC}"
}

echo ""
echo -e "${GREEN}✅ Déploiement Git terminé!${NC}"
echo ""
echo -e "${YELLOW}📋 Prochaines étapes:${NC}"
echo "1. Si Vercel est connecté à GitHub, le déploiement se fera automatiquement"
echo "2. Sinon, connectez votre dépôt sur: https://vercel.com"
echo "3. Vérifiez le statut sur: https://vercel.com/djshekofficiel-9102s-projects/users-djshek-desktop-dj-shek-web-banger"
echo ""
echo -e "${GREEN}🎉 Terminé!${NC}"







