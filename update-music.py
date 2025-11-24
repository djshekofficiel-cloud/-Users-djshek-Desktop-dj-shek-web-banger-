#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de mise à jour automatique des musiques
Scanne le dossier audio et met à jour index.html
"""

import os
import re
import subprocess
from pathlib import Path

def clean_track_name(filename):
    """Nettoie le nom de fichier pour l'affichage"""
    # Enlever l'extension
    name = filename.replace('.mp3', '')
    # Enlever les espaces en fin
    name = name.strip()
    return name

def get_audio_files():
    """Récupère tous les fichiers MP3 du dossier audio"""
    audio_dir = Path('audio')
    if not audio_dir.exists():
        print("❌ Dossier audio non trouvé")
        return []
    
    files = sorted(audio_dir.glob('*.mp3'))
    return files

def generate_tracks_array(files):
    """Génère le tableau JavaScript des pistes"""
    lines = ["            const audioTracks = ["]
    
    for i, file in enumerate(files):
        filename = file.name
        display_name = clean_track_name(filename)
        
        if i == 0:
            lines.append(f"                {{ name: '{display_name}', file: '{filename}' }}")
        else:
            lines.append(f"                ,{{ name: '{display_name}', file: '{filename}' }}")
    
    lines.append("            ];")
    return '\n'.join(lines)

def update_index_html():
    """Met à jour index.html avec les nouvelles pistes"""
    print("📂 Scan du dossier audio...")
    
    files = get_audio_files()
    if not files:
        print("❌ Aucun fichier MP3 trouvé")
        return False
    
    print(f"✅ {len(files)} pistes trouvées")
    
    # Lire index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Générer le nouveau tableau
    new_tracks_array = generate_tracks_array(files)
    
    # Remplacer audioTracks
    pattern1 = r'const audioTracks = \[.*?\];'
    content = re.sub(pattern1, new_tracks_array, content, flags=re.DOTALL)
    
    # Remplacer audioFiles (même contenu)
    pattern2 = r'const audioFiles = \[.*?\];'
    content = re.sub(pattern2, new_tracks_array, content, flags=re.DOTALL)
    
    # Sauvegarder
    backup_name = f"index.html.backup.{subprocess.check_output(['date', '+%Y%m%d_%H%M%S']).decode().strip()}"
    with open(backup_name, 'w', encoding='utf-8') as f:
        with open('index.html', 'r', encoding='utf-8') as original:
            f.write(original.read())
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ index.html mis à jour (sauvegarde: {backup_name})")
    return True

def git_update():
    """Met à jour Git"""
    print("\n📦 Mise à jour Git...")
    
    try:
        subprocess.run(['git', 'add', 'index.html', 'audio/*.mp3'], check=True, capture_output=True)
        subprocess.run(['git', 'commit', '-m', f'🎵 Mise à jour automatique des musiques - {len(get_audio_files())} pistes'], 
                      check=False, capture_output=True)
        print("✅ Changements commités")
        
        subprocess.run(['git', 'push', 'origin', 'main'], check=False, capture_output=True)
        print("✅ Push vers GitHub effectué")
        print("🚀 Vercel déploiera automatiquement dans quelques secondes")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Erreur Git: {e}")
        return False

if __name__ == '__main__':
    print("🎵 MISE À JOUR AUTOMATIQUE DES MUSIQUES")
    print("======================================\n")
    
    if update_index_html():
        git_update()
        print("\n✅ TERMINÉ !")
        print(f"🌐 Votre site sera mis à jour sur https://djshekofficiel.com")
    else:
        print("\n❌ Échec de la mise à jour")

