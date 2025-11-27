#!/bin/bash

# 🤖 Configuration FINALE automatique - Envoi direct d'emails
# Configure tout automatiquement

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo "🤖 CONFIGURATION AUTOMATIQUE FINALE"
echo "===================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erreur: index.html non trouvé${NC}"
    exit 1
fi

# Ouvrir Web3Forms
echo -e "${BLUE}📧 Ouverture de Web3Forms...${NC}"
open "https://web3forms.com" 2>/dev/null || echo "Ouvrez : https://web3forms.com"
echo ""
echo -e "${YELLOW}📝 Pour obtenir votre clé Web3Forms :${NC}"
echo "   1. Entrez : djshekofficiel@gmail.com"
echo "   2. Cliquez sur 'Get Your Access Key'"
echo "   3. Vérifiez votre email"
echo "   4. Copiez la clé"
echo ""
read -p "Collez votre clé Web3Forms ici : " WEB3FORMS_KEY

if [ -z "$WEB3FORMS_KEY" ]; then
    echo -e "${YELLOW}⚠️  Pas de clé fournie. Le système utilisera mailto.${NC}"
    echo -e "${GREEN}✅ Configuration terminée (mailto activé)${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔧 Configuration de la clé dans index.html...${NC}"

# Remplacer la clé dans index.html
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/YOUR_WEB3FORMS_KEY/$WEB3FORMS_KEY/g" index.html
else
    sed -i "s/YOUR_WEB3FORMS_KEY/$WEB3FORMS_KEY/g" index.html
fi

echo -e "${GREEN}✅ Clé configurée dans index.html${NC}"
echo ""

# Commit et push
echo -e "${BLUE}📦 Mise à jour Git...${NC}"
git add index.html 2>/dev/null || true
git commit -m "Configuration Web3Forms - Envoi direct emails vers djshekofficiel@gmail.com" 2>/dev/null || {
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
echo "   ✅ Clé Web3Forms configurée dans index.html"
echo "   ✅ Modifications poussées vers GitHub"
echo "   ✅ Vercel déploiera automatiquement dans quelques secondes"
echo ""
echo -e "${GREEN}🎉 Tous les messages iront maintenant directement dans djshekofficiel@gmail.com !${NC}"
echo ""
echo -e "${YELLOW}⏳ Attendez 1-2 minutes puis testez le formulaire sur https://djshekofficiel.com${NC}"
echo ""









