#!/bin/bash

# Script de démarrage pour DJ SHEK Website
# Usage: ./start.sh

cd "$(dirname "$0")"

echo "🚀 Démarrage du serveur de développement..."
echo ""
echo "📍 Répertoire: $(pwd)"
echo ""

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    echo "   Assurez-vous d'être dans le dossier du projet"
    exit 1
fi

# Vérifier que Vite est installé
if [ ! -d "node_modules/vite" ]; then
    echo "📦 Installation de Vite..."
    npm install
fi

# Démarrer le serveur
echo "✅ Démarrage de Vite..."
echo "🌐 Le site s'ouvrira sur http://localhost:3000"
echo ""
npm run dev

