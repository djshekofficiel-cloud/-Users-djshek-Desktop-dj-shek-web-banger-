#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de synchronisation des musiques
Scanne le dossier audio et met à jour index.html
Supprime les références aux fichiers qui n'existent plus
"""

import os
import re
import subprocess
from pathlib import Path

def clean_track_name(filename):
    """Nettoie le nom de fichier pour l'affichage"""
    # Enlever les extensions
    name = filename.replace('.mp3', '').replace('.wav', '')
    # Enlever les espaces en fin
    name = name.strip()
    return name

def get_audio_files():
    """Récupère tous les fichiers audio (MP3 et WAV) du dossier audio"""
    audio_dir = Path('audio')
    if not audio_dir.exists():
        print("❌ Dossier audio non trouvé")
        return []
    
    # Récupérer MP3 et WAV
    mp3_files = sorted(audio_dir.glob('*.mp3'))
    wav_files = sorted(audio_dir.glob('*.wav'))
    files = sorted(list(mp3_files) + list(wav_files))
    return files

def normalize_filename(filename):
    """Normalise le nom de fichier pour la comparaison"""
    # Enlever les espaces multiples et normaliser
    return filename.strip()

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
    """Met à jour index.html avec les nouvelles pistes et supprime les références obsolètes"""
    print("📂 Scan du dossier audio...")
    
    # Récupérer les fichiers réellement présents
    files = get_audio_files()
    if not files:
        print("❌ Aucun fichier audio (MP3/WAV) trouvé")
        return False
    
    # Créer un set des noms de fichiers normalisés pour comparaison rapide
    existing_files = {normalize_filename(f.name) for f in files}
    
    print(f"✅ {len(files)} pistes trouvées dans le dossier")
    
    # Lire index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Générer le nouveau tableau
    new_tracks_array = generate_tracks_array(files)
    
    # Compter les fichiers référencés avant
    pattern_before = r'const audioTracks = \[(.*?)\];'
    matches_before = re.findall(pattern_before, content, flags=re.DOTALL)
    old_count = 0
    if matches_before:
        # Compter les entrées dans le premier match
        old_entries = re.findall(r"file: '([^']+)'", matches_before[0])
        old_count = len(old_entries)
    
    # Remplacer toutes les occurrences de audioTracks
    pattern = r'const audioTracks = \[.*?\];'
    content = re.sub(pattern, new_tracks_array, content, flags=re.DOTALL)
    
    # Vérifier s'il y a des références à audioFiles (si elles existent)
    pattern_audioFiles = r'const audioFiles = \[.*?\];'
    if re.search(pattern_audioFiles, content, flags=re.DOTALL):
        content = re.sub(pattern_audioFiles, new_tracks_array, content, flags=re.DOTALL)
        print("✅ audioFiles également mis à jour")
    
    # Sauvegarder
    backup_name = f"index.html.backup.{subprocess.check_output(['date', '+%Y%m%d_%H%M%S']).decode().strip()}"
    with open(backup_name, 'w', encoding='utf-8') as f:
        with open('index.html', 'r', encoding='utf-8') as original:
            f.write(original.read())
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    removed_count = old_count - len(files) if old_count > len(files) else 0
    if removed_count > 0:
        print(f"🗑️  {removed_count} référence(s) supprimée(s) (fichiers non disponibles)")
    
    print(f"✅ index.html mis à jour (sauvegarde: {backup_name})")
    print(f"📊 {len(files)} pistes actives")
    return True

if __name__ == '__main__':
    print("🎵 SYNCHRONISATION DES MUSIQUES")
    print("==============================\n")
    
    if update_index_html():
        print("\n✅ TERMINÉ !")
        print(f"🌐 Les musiques ont été synchronisées")
    else:
        print("\n❌ Échec de la synchronisation")

