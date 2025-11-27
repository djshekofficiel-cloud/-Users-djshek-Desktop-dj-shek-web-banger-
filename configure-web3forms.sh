#!/bin/bash

# 🤖 Configuration automatique de Web3Forms
# Usage: ./configure-web3forms.sh VOTRE_CLE_ICI

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔧 CONFIGURATION AUTOMATIQUE WEB3FORMS"
echo "======================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "api/contact.js" ]; then
    echo -e "${RED}❌ Erreur: api/contact.js non trouvé${NC}"
    exit 1
fi

# Récupérer la clé depuis l'argument ou demander
WEB3FORMS_KEY="$1"

if [ -z "$WEB3FORMS_KEY" ]; then
    echo -e "${YELLOW}📝 Entrez votre clé Web3Forms :${NC}"
    echo "   (Obtenez-la sur https://web3forms.com)"
    echo ""
    read -p "Clé Web3Forms : " WEB3FORMS_KEY
fi

if [ -z "$WEB3FORMS_KEY" ]; then
    echo -e "${RED}❌ Aucune clé fournie${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Configuration de la clé...${NC}"

# Mettre à jour api/contact.js
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/process\.env\.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY'/process.env.WEB3FORMS_ACCESS_KEY || '$WEB3FORMS_KEY'/g" api/contact.js 2>/dev/null || true
    # Alternative si la première ne fonctionne pas
    sed -i '' "s/YOUR_ACCESS_KEY/$WEB3FORMS_KEY/g" api/contact.js 2>/dev/null || true
else
    # Linux
    sed -i "s/process\.env\.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY'/process.env.WEB3FORMS_ACCESS_KEY || '$WEB3FORMS_KEY'/g" api/contact.js 2>/dev/null || true
    sed -i "s/YOUR_ACCESS_KEY/$WEB3FORMS_KEY/g" api/contact.js 2>/dev/null || true
fi

echo -e "${GREEN}✅ Clé configurée dans api/contact.js${NC}"
echo ""

# Afficher les instructions pour Vercel
echo -e "${BLUE}📋 PROCHAINE ÉTAPE : Configurer dans Vercel${NC}"
echo ""
echo "1. Allez sur : https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/settings/environment-variables"
echo "2. Cliquez sur 'Add New'"
echo "3. Key : WEB3FORMS_ACCESS_KEY"
echo "4. Value : $WEB3FORMS_KEY"
echo "5. Cochez : Production, Preview, Development"
echo "6. Save"
echo ""

# Ouvrir Vercel automatiquement
echo -e "${BLUE}🌐 Ouverture de Vercel...${NC}"
open "https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/settings/environment-variables" 2>/dev/null || echo "Ouvrez manuellement le lien ci-dessus"

echo ""
read -p "Appuyez sur Entrée une fois la variable ajoutée dans Vercel... "

# Commit et push
echo ""
echo -e "${BLUE}📦 Mise à jour Git...${NC}"
git add api/contact.js 2>/dev/null || true
git commit -m "Configuration Web3Forms - Envoi direct emails" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}"
}

echo -e "${BLUE}🚀 Push vers GitHub...${NC}"
git push origin main 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Push échoué ou déjà à jour${NC}"
}

echo ""
echo -e "${GREEN}✅ CONFIGURATION TERMINÉE !${NC}"
echo ""
echo -e "${BLUE}📋 Dernière étape : Redéployer sur Vercel${NC}"
echo "   → Allez dans Deployments"
echo "   → Cliquez sur Redeploy"
echo ""
echo -e "${GREEN}🎉 Ensuite, tous les messages iront dans djshekofficiel@gmail.com !${NC}"
echo ""









