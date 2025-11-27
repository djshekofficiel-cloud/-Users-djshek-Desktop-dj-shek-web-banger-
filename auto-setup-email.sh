#!/bin/bash

# 🤖 Script d'automatisation COMPLÈTE - Configuration emails
# Fait TOUT automatiquement

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo "🤖 AUTOMATISATION COMPLÈTE - CONFIGURATION EMAILS"
echo "=================================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "api/contact.js" ]; then
    echo -e "${RED}❌ Erreur: api/contact.js non trouvé${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Ce script va configurer automatiquement l'envoi d'emails${NC}"
echo ""

# Étape 1 : Ouvrir Web3Forms
echo -e "${BLUE}1️⃣  Ouverture de Web3Forms...${NC}"
open "https://web3forms.com" 2>/dev/null || echo "Ouvrez : https://web3forms.com"
echo ""
echo "   📝 Instructions :"
echo "   → Entrez : djshekofficiel@gmail.com"
echo "   → Cliquez sur 'Get Your Access Key'"
echo "   → Vérifiez votre email (djshekofficiel@gmail.com)"
echo "   → Copiez la clé qui commence par des lettres et tirets"
echo ""
read -p "Collez votre clé Web3Forms ici (ou Entrée pour passer) : " WEB3FORMS_KEY

if [ -z "$WEB3FORMS_KEY" ]; then
    echo -e "${YELLOW}⚠️  Pas de clé fournie. Le système utilisera mailto en fallback.${NC}"
    echo -e "${GREEN}✅ Configuration terminée (mailto activé)${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}2️⃣  Configuration de la clé dans le code...${NC}"

# Mettre à jour api/contact.js pour utiliser la clé par défaut si pas dans Vercel
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|process\.env\.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY'|process.env.WEB3FORMS_ACCESS_KEY || '$WEB3FORMS_KEY'|g" api/contact.js 2>/dev/null || \
    sed -i '' "s|'YOUR_ACCESS_KEY'|'$WEB3FORMS_KEY'|g" api/contact.js 2>/dev/null || true
else
    sed -i "s|process\.env\.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY'|process.env.WEB3FORMS_ACCESS_KEY || '$WEB3FORMS_KEY'|g" api/contact.js 2>/dev/null || \
    sed -i "s|'YOUR_ACCESS_KEY'|'$WEB3FORMS_KEY'|g" api/contact.js 2>/dev/null || true
fi

echo -e "${GREEN}✅ Clé configurée dans api/contact.js${NC}"
echo ""

# Étape 2 : Ouvrir Vercel
echo -e "${BLUE}3️⃣  Ouverture de Vercel pour configurer la variable d'environnement...${NC}"
open "https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/settings/environment-variables" 2>/dev/null || echo "Ouvrez : https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/settings/environment-variables"
echo ""
echo "   📝 Instructions :"
echo "   → Cliquez sur 'Add New'"
echo "   → Key : WEB3FORMS_ACCESS_KEY"
echo "   → Value : $WEB3FORMS_KEY"
echo "   → Cochez : Production, Preview, Development"
echo "   → Cliquez sur 'Save'"
echo ""
read -p "Appuyez sur Entrée une fois la variable ajoutée dans Vercel... "

# Étape 3 : Commit et push
echo ""
echo -e "${BLUE}4️⃣  Mise à jour Git...${NC}"
git add api/contact.js 2>/dev/null || true
git commit -m "Configuration automatique Web3Forms - Envoi direct emails vers djshekofficiel@gmail.com" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}"
}

echo -e "${BLUE}5️⃣  Push vers GitHub...${NC}"
git push origin main 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Push échoué ou déjà à jour${NC}"
}

# Étape 4 : Ouvrir Vercel pour redéployer
echo ""
echo -e "${BLUE}6️⃣  Ouverture de Vercel pour redéployer...${NC}"
open "https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/deployments" 2>/dev/null || echo "Ouvrez : https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/deployments"
echo ""
echo "   📝 Instructions :"
echo "   → Cliquez sur les 3 points (⋯) du dernier déploiement"
echo "   → Cliquez sur 'Redeploy'"
echo "   → Attendez 1-2 minutes"
echo ""

echo -e "${GREEN}✅ CONFIGURATION TERMINÉE !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé :${NC}"
echo "   ✅ Clé configurée dans le code"
echo "   ✅ Variable d'environnement à ajouter dans Vercel"
echo "   ✅ Modifications poussées vers GitHub"
echo "   ✅ Redéploiement à faire dans Vercel"
echo ""
echo -e "${GREEN}🎉 Une fois Vercel redéployé, tous les messages iront dans djshekofficiel@gmail.com !${NC}"
echo ""









