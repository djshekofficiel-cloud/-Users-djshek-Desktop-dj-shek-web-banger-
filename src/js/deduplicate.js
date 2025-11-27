/**
 * Point d'entrée de l'application de dédoublonnage
 * Initialise l'application complète
 */

import { DeduplicateApp } from './deduplicate/app.js'

let appInstance = null

export function initDeduplicate() {
  const container = document.getElementById('deduplicate-section')
  if (!container) {
    console.warn('Container deduplicate-section not found')
    return
  }

  // Créer l'instance de l'application
  appInstance = new DeduplicateApp('deduplicate-section')
}

// Exposer globalement pour compatibilité
window.initDeduplicate = initDeduplicate
