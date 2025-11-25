#!/bin/bash

# Script de déploiement automatique pour Vercel
# Usage: ./deploy-auto.sh "Message de commit"

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Déploiement automatique sur Vercel${NC}"
echo ""

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git n'est pas initialisé. Initialisation...${NC}"
    git init
    git branch -M main
fi

# Message de commit
COMMIT_MSG="${1:-Mise à jour automatique $(date +'%Y-%m-%d %H:%M:%S')}"

echo -e "${BLUE}📝 Message de commit: ${COMMIT_MSG}${NC}"
echo ""

# Ajouter tous les fichiers
echo -e "${BLUE}📦 Ajout des fichiers...${NC}"
git add .

# Commit
echo -e "${BLUE}💾 Création du commit...${NC}"
git commit -m "$COMMIT_MSG" || echo "Aucun changement à commiter"

# Vérifier si un remote existe
if ! git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  Aucun remote 'origin' trouvé.${NC}"
    echo -e "${YELLOW}   Pour connecter à GitHub, exécutez:${NC}"
    echo -e "${YELLOW}   git remote add origin VOTRE_URL_GITHUB${NC}"
    echo ""
    echo -e "${BLUE}🔄 Déploiement direct sur Vercel...${NC}"
    
    # Déployer directement sur Vercel si Vercel CLI est installé
    if command -v vercel &> /dev/null; then
        vercel --prod
    else
        echo -e "${YELLOW}⚠️  Vercel CLI n'est pas installé.${NC}"
        echo -e "${YELLOW}   Installez-le avec: npm i -g vercel${NC}"
        echo ""
        echo -e "${BLUE}✅ Fichiers prêts pour le déploiement manuel sur Vercel${NC}"
    fi
else
    # Push vers GitHub (déclenchera le déploiement automatique Vercel)
    echo -e "${BLUE}🚀 Push vers GitHub...${NC}"
    git push origin main || {
        echo -e "${YELLOW}⚠️  Erreur lors du push. Tentative avec --set-upstream...${NC}"
        git push -u origin main
    }
    
    echo ""
    echo -e "${GREEN}✅ Déploiement déclenché !${NC}"
    echo -e "${GREEN}   Vercel déploiera automatiquement dans quelques instants.${NC}"
    echo ""
    echo -e "${BLUE}📊 Vérifiez le statut sur:${NC}"
    echo -e "${BLUE}   https://vercel.com/dashboard${NC}"
fi

echo ""
echo -e "${GREEN}✨ Terminé !${NC}"
