#!/usr/bin/env node

/**
 * Script de déploiement automatique Vercel
 * Nécessite: npm install -g vercel
 * Usage: node vercel-deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement automatique Vercel');
console.log('==================================\n');

// Vérifier que vercel CLI est installé
try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI détecté\n');
} catch (error) {
    console.log('❌ Vercel CLI non installé');
    console.log('📦 Installation...\n');
    try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI installé\n');
    } catch (installError) {
        console.log('❌ Erreur lors de l\'installation');
        console.log('💡 Installez manuellement: npm install -g vercel');
        process.exit(1);
    }
}

// Vérifier les fichiers
const requiredFiles = ['index.html', 'vercel.json'];
for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.log(`❌ Fichier manquant: ${file}`);
        process.exit(1);
    }
}

console.log('✅ Tous les fichiers sont présents\n');

// Déploiement
console.log('🚀 Déploiement sur Vercel...\n');

try {
    // Vérifier si déjà connecté
    try {
        execSync('vercel whoami', { stdio: 'ignore' });
        console.log('✅ Connecté à Vercel\n');
    } catch (error) {
        console.log('⚠️  Non connecté à Vercel');
        console.log('🔐 Connexion nécessaire...\n');
        execSync('vercel login', { stdio: 'inherit' });
    }

    // Déployer
    console.log('📤 Déploiement en cours...\n');
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    
    console.log('\n✅ Déploiement réussi!');
    console.log('🌐 Votre site est maintenant en ligne!');
    
} catch (error) {
    console.log('\n❌ Erreur lors du déploiement');
    console.log('💡 Vérifiez vos credentials Vercel');
    process.exit(1);
}







