#!/bin/bash

# 🎵 Script de mise à jour automatique des musiques
# Scanne le dossier audio et met à jour index.html automatiquement

set -e

echo "🎵 MISE À JOUR AUTOMATIQUE DES MUSIQUES"
echo "======================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérifier qu'on est dans le bon dossier
if [ ! -f "index.html" ] || [ ! -d "audio" ]; then
    echo -e "${RED}❌ Erreur: index.html ou dossier audio non trouvé${NC}"
    exit 1
fi

echo -e "${BLUE}📂 Scan du dossier audio...${NC}"

# Créer un fichier temporaire avec la liste des pistes
TEMP_FILE=$(mktemp)
TEMP_FILE2=$(mktemp)

# Scanner les fichiers MP3 et générer le tableau JavaScript
echo "            const audioTracks = [" > "$TEMP_FILE"
echo "            const audioFiles = [" > "$TEMP_FILE2"

TRACK_COUNT=0

# Fonction pour nettoyer le nom de fichier
clean_name() {
    local file="$1"
    # Enlever les extensions .mp3 et .wav
    file="${file%.mp3}"
    file="${file%.wav}"
    # Enlever les espaces en fin
    file="${file%"${file##*[![:space:]]}"}"
    echo "$file"
}

# Parcourir tous les fichiers audio (MP3 et WAV)
while IFS= read -r -d '' file; do
    TRACK_COUNT=$((TRACK_COUNT + 1))
    filename=$(basename "$file")
    clean_name=$(clean_name "$filename")
    
    # Créer un nom lisible (enlever les caractères spéciaux en trop)
    display_name="$clean_name"
    
    # Ajouter au tableau audioTracks (pour le player principal)
    if [ $TRACK_COUNT -eq 1 ]; then
        echo "                { name: '$display_name', file: '$filename' }" >> "$TEMP_FILE"
    else
        echo "                ,{ name: '$display_name', file: '$filename' }" >> "$TEMP_FILE"
    fi
    
    # Ajouter au tableau audioFiles (pour la liste des pistes)
    if [ $TRACK_COUNT -eq 1 ]; then
        echo "                { name: '$display_name', file: '$filename' }" >> "$TEMP_FILE2"
    else
        echo "                ,{ name: '$display_name', file: '$filename' }" >> "$TEMP_FILE2"
    fi
done < <(find audio \( -name "*.mp3" -o -name "*.wav" \) -type f -print0 | sort -z)

echo "            ];" >> "$TEMP_FILE"
echo "            ];" >> "$TEMP_FILE2"

echo -e "${GREEN}✅ $TRACK_COUNT pistes trouvées${NC}"
echo ""

# Lire index.html
echo -e "${BLUE}📝 Mise à jour de index.html...${NC}"

# Créer une copie de sauvegarde
cp index.html "index.html.backup.$(date +%Y%m%d_%H%M%S)"

# Mettre à jour audioTracks (ligne ~8390)
awk '
    /const audioTracks = \[/ {
        print
        # Lire le fichier temporaire
        while ((getline line < "'"$TEMP_FILE"'") > 0) {
            print line
        }
        close("'"$TEMP_FILE"'")
        # Ignorer les lignes jusqu'à la fin du tableau
        while (getline > 0 && !/^\];/) {
            # Ignorer
        }
        next
    }
    { print }
' index.html > index.html.tmp && mv index.html.tmp index.html

# Mettre à jour audioFiles (ligne ~9343)
awk '
    /const audioFiles = \[/ {
        print
        # Lire le fichier temporaire
        while ((getline line < "'"$TEMP_FILE2"'") > 0) {
            print line
        }
        close("'"$TEMP_FILE2"'")
        # Ignorer les lignes jusqu'à la fin du tableau
        while (getline > 0 && !/^\];/) {
            # Ignorer
        }
        next
    }
    { print }
' index.html > index.html.tmp && mv index.html.tmp index.html

# Nettoyer les fichiers temporaires
rm -f "$TEMP_FILE" "$TEMP_FILE2"

echo -e "${GREEN}✅ index.html mis à jour${NC}"
echo ""

# Git : Ajouter, commit et push
echo -e "${BLUE}📦 Mise à jour Git...${NC}"

git add index.html audio/*.mp3 audio/*.wav 2>/dev/null || true
git commit -m "🎵 Mise à jour automatique des musiques - $TRACK_COUNT pistes" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}"
}

echo -e "${BLUE}🚀 Push vers GitHub...${NC}"
git push origin main 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Push échoué ou déjà à jour${NC}"
}

echo ""
echo -e "${GREEN}✅ TERMINÉ !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé :${NC}"
echo "   - $TRACK_COUNT pistes détectées"
echo "   - index.html mis à jour"
echo "   - Changements poussés vers GitHub"
echo "   - Vercel déploiera automatiquement dans quelques secondes"
echo ""
echo -e "${GREEN}🎉 Vos musiques sont maintenant en ligne !${NC}"





