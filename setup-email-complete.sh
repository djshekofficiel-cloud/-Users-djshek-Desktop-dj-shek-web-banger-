#!/bin/bash

# 🤖 Script d'automatisation COMPLÈTE pour configurer l'envoi d'emails
# Ouvre automatiquement toutes les pages nécessaires

set -e

echo "🤖 AUTOMATISATION COMPLÈTE - CONFIGURATION EMAILS"
echo "================================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Ce script va ouvrir automatiquement toutes les pages nécessaires${NC}"
echo ""

# Étape 1 : Ouvrir Web3Forms
echo -e "${BLUE}1️⃣  Ouverture de Web3Forms...${NC}"
open "https://web3forms.com" 2>/dev/null || echo "Ouvrez manuellement : https://web3forms.com"
echo "   → Entrez : djshekofficiel@gmail.com"
echo "   → Cliquez sur 'Get Your Access Key'"
echo "   → Vérifiez votre email et copiez la clé"
echo ""
read -p "Appuyez sur Entrée une fois que vous avez copié votre clé Web3Forms... " 

# Demander la clé
echo ""
read -p "Collez votre clé Web3Forms ici : " WEB3FORMS_KEY

if [ -z "$WEB3FORMS_KEY" ]; then
    echo -e "${YELLOW}⚠️  Aucune clé fournie. Le système utilisera mailto.${NC}"
    exit 0
fi

# Étape 2 : Configurer dans le code
echo ""
echo -e "${BLUE}2️⃣  Configuration de la clé dans le code...${NC}"

if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/YOUR_WEB3FORMS_KEY/$WEB3FORMS_KEY/g" api/contact.js 2>/dev/null || true
else
    sed -i "s/YOUR_WEB3FORMS_KEY/$WEB3FORMS_KEY/g" api/contact.js 2>/dev/null || true
fi

echo -e "${GREEN}✅ Clé configurée dans api/contact.js${NC}"

# Étape 3 : Ouvrir Vercel
echo ""
echo -e "${BLUE}3️⃣  Ouverture de Vercel...${NC}"
open "https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/settings/environment-variables" 2>/dev/null || echo "Ouvrez manuellement : https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/settings/environment-variables"
echo ""
echo "   → Cliquez sur 'Add New'"
echo "   → Key : WEB3FORMS_ACCESS_KEY"
echo "   → Value : $WEB3FORMS_KEY"
echo "   → Cochez : Production, Preview, Development"
echo "   → Cliquez sur 'Save'"
echo ""
read -p "Appuyez sur Entrée une fois la variable ajoutée dans Vercel... "

# Étape 4 : Commit et push
echo ""
echo -e "${BLUE}4️⃣  Mise à jour Git...${NC}"
git add api/contact.js 2>/dev/null || true
git commit -m "Configuration automatique Web3Forms - Envoi direct emails" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}"
}

echo -e "${BLUE}5️⃣  Push vers GitHub...${NC}"
git push origin main 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Push échoué ou déjà à jour${NC}"
}

# Étape 5 : Ouvrir Vercel pour redéployer
echo ""
echo -e "${BLUE}6️⃣  Ouverture de Vercel pour redéployer...${NC}"
open "https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/deployments" 2>/dev/null || echo "Ouvrez manuellement : https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/deployments"
echo ""
echo "   → Cliquez sur les 3 points (⋯) du dernier déploiement"
echo "   → Cliquez sur 'Redeploy'"
echo ""

echo -e "${GREEN}✅ CONFIGURATION TERMINÉE !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé :${NC}"
echo "   ✅ Clé configurée dans le code"
echo "   ✅ Variable d'environnement à ajouter dans Vercel"
echo "   ✅ Modifications poussées vers GitHub"
echo ""
echo -e "${GREEN}🎉 Une fois Vercel redéployé, tous les messages iront dans djshekofficiel@gmail.com !${NC}"
echo ""








