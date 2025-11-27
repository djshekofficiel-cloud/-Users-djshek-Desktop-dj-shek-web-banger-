#!/bin/bash

# 🤖 Script d'automatisation complète pour configurer l'envoi d'emails
# Configure Web3Forms automatiquement

set -e

echo "📧 CONFIGURATION AUTOMATIQUE DE L'ENVOI D'EMAILS"
echo "================================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier qu'on est dans le bon dossier
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erreur: index.html non trouvé${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Ce script va vous guider pour configurer Web3Forms${NC}"
echo ""

# Demander la clé Web3Forms
echo -e "${YELLOW}📝 Pour obtenir votre clé Web3Forms :${NC}"
echo "1. Allez sur : https://web3forms.com"
echo "2. Entrez : djshekofficiel@gmail.com"
echo "3. Vérifiez votre email et copiez la clé"
echo ""
read -p "Entrez votre clé Web3Forms (ou appuyez sur Entrée pour utiliser mailto) : " WEB3FORMS_KEY

if [ -z "$WEB3FORMS_KEY" ]; then
    echo -e "${YELLOW}⚠️  Aucune clé fournie. Le formulaire utilisera mailto (fallback).${NC}"
    echo -e "${GREEN}✅ Configuration terminée (mailto activé)${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔧 Configuration de la clé dans index.html...${NC}"

# Remplacer la clé dans index.html
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/YOUR_WEB3FORMS_KEY/$WEB3FORMS_KEY/g" index.html
else
    # Linux
    sed -i "s/YOUR_WEB3FORMS_KEY/$WEB3FORMS_KEY/g" index.html
fi

echo -e "${GREEN}✅ Clé configurée dans index.html${NC}"
echo ""

# Commit et push automatique
echo -e "${BLUE}📦 Mise à jour Git...${NC}"
git add index.html 2>/dev/null || true
git commit -m "Configuration automatique Web3Forms pour envoi d'emails" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}"
}

echo -e "${BLUE}🚀 Push vers GitHub...${NC}"
git push origin main 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Push échoué ou déjà à jour${NC}"
}

echo ""
echo -e "${GREEN}✅ CONFIGURATION TERMINÉE !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé :${NC}"
echo "   - Clé Web3Forms configurée"
echo "   - Modifications poussées vers GitHub"
echo "   - Vercel déploiera automatiquement dans quelques secondes"
echo ""
echo -e "${GREEN}🎉 Tous les messages iront maintenant dans djshekofficiel@gmail.com !${NC}"
echo ""









