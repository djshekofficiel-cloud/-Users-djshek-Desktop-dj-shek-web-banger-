#!/bin/bash

# 🚀 Configuration automatique de la variable d'environnement Web3Forms dans Vercel
# Usage: ./setup-vercel-env.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

WEB3FORMS_KEY="4650301f-d665-4ddc-b4d3-9bbefff2e801"

echo -e "${BLUE}🚀 CONFIGURATION AUTOMATIQUE VERCEL - WEB3FORMS${NC}"
echo "=================================================="
echo ""

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI n'est pas installé${NC}"
    echo "   Installez-le avec : npm install -g vercel"
    exit 1
fi

echo -e "${BLUE}📋 Configuration de la variable d'environnement...${NC}"
echo ""

# Vérifier si l'utilisateur est connecté à Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vous devez vous connecter à Vercel${NC}"
    echo "   Exécution de : vercel login"
    echo ""
    vercel login
fi

echo -e "${BLUE}🔧 Ajout de la variable d'environnement WEB3FORMS_ACCESS_KEY...${NC}"
echo ""

# Ajouter la variable pour chaque environnement
echo "$WEB3FORMS_KEY" | vercel env add WEB3FORMS_ACCESS_KEY production 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Variable déjà existante pour Production, mise à jour...${NC}"
    echo "$WEB3FORMS_KEY" | vercel env rm WEB3FORMS_ACCESS_KEY production --yes 2>/dev/null || true
    echo "$WEB3FORMS_KEY" | vercel env add WEB3FORMS_ACCESS_KEY production
}

echo "$WEB3FORMS_KEY" | vercel env add WEB3FORMS_ACCESS_KEY preview 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Variable déjà existante pour Preview, mise à jour...${NC}"
    echo "$WEB3FORMS_KEY" | vercel env rm WEB3FORMS_ACCESS_KEY preview --yes 2>/dev/null || true
    echo "$WEB3FORMS_KEY" | vercel env add WEB3FORMS_ACCESS_KEY preview
}

echo "$WEB3FORMS_KEY" | vercel env add WEB3FORMS_ACCESS_KEY development 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Variable déjà existante pour Development, mise à jour...${NC}"
    echo "$WEB3FORMS_KEY" | vercel env rm WEB3FORMS_ACCESS_KEY development --yes 2>/dev/null || true
    echo "$WEB3FORMS_KEY" | vercel env add WEB3FORMS_ACCESS_KEY development
}

echo ""
echo -e "${GREEN}✅ Variable d'environnement configurée avec succès !${NC}"
echo ""
echo -e "${BLUE}📋 Vérification...${NC}"
vercel env ls
echo ""

echo -e "${BLUE}🔄 Redéploiement recommandé...${NC}"
echo "   Vous pouvez redéployer depuis :"
echo "   https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/deployments"
echo ""
echo -e "${GREEN}✅ Configuration terminée !${NC}"
echo ""

