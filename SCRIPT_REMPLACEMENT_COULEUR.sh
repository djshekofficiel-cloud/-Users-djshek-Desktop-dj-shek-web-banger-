#!/bin/bash

# Script pour remplacer une couleur par une autre dans tout le projet
# Usage: ./SCRIPT_REMPLACEMENT_COULEUR.sh "#AABBCC" "#FF8844"

OLD_COLOR="${1:-#AABBCC}"
NEW_COLOR="${2:-#FF8844}"

echo "🔄 Remplacement de $OLD_COLOR par $NEW_COLOR"
echo ""

# Trouver tous les fichiers contenant la couleur
FILES=$(find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.md" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./backups/*" \
    -exec grep -l "$OLD_COLOR" {} \; 2>/dev/null)

if [ -z "$FILES" ]; then
    echo "❌ Aucun fichier trouvé contenant $OLD_COLOR"
    echo ""
    echo "Couleurs disponibles dans le projet:"
    grep -roE '#[0-9a-fA-F]{6}' . --include="*.html" --include="*.css" --include="*.js" 2>/dev/null | \
        grep -v node_modules | grep -v ".git" | cut -d: -f2 | sort -u | head -10
    exit 1
fi

echo "📁 Fichiers à modifier:"
echo "$FILES" | while read file; do
    echo "  - $file"
done
echo ""

# Créer un backup
BACKUP_DIR="./backups/color_replacement_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "💾 Création d'un backup dans $BACKUP_DIR"

# Remplacer dans chaque fichier
echo "$FILES" | while read file; do
    if [ -f "$file" ]; then
        # Backup
        cp "$file" "$BACKUP_DIR/$(basename $file).backup"
        
        # Remplacer (insensible à la casse)
        sed -i '' "s/$OLD_COLOR/$NEW_COLOR/gi" "$file"
        
        echo "✅ Modifié: $file"
    fi
done

echo ""
echo "✨ Remplacement terminé !"
echo "📊 Vérification:"
grep -r "$NEW_COLOR" . --include="*.html" --include="*.css" --include="*.js" 2>/dev/null | \
    grep -v node_modules | grep -v ".git" | wc -l | xargs echo "  Occurrences de $NEW_COLOR:"

