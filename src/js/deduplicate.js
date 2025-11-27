/**
 * Point d'entrée de l'application de dédoublonnage
 * Initialise l'application complète
 */

import { DeduplicateApp } from './deduplicate/app.js'

let appInstance = null

export function initDeduplicate() {
  // Attendre que le DOM soit complètement chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeApp()
    })
  } else {
    // DOM déjà chargé
      initializeApp()
  }
}

function initializeApp() {
  const container = document.getElementById('deduplicate-section')
  if (!container) {
    console.warn('Container deduplicate-section not found, retrying...')
    // Retry après un court délai au cas où le DOM n'est pas encore prêt
    setTimeout(() => {
      const retryContainer = document.getElementById('deduplicate-section')
      if (retryContainer) {
        appInstance = new DeduplicateApp('deduplicate-section')
      } else {
        console.error('Container deduplicate-section not found after retry')
      }
    }, 100)
    return
  }

  // Créer l'instance de l'application
  try {
    appInstance = new DeduplicateApp('deduplicate-section')
    console.log('Deduplicate app initialized successfully')
  } catch (error) {
    console.error('Error initializing deduplicate app:', error)
  }
}

// Exposer globalement pour compatibilité
window.initDeduplicate = initDeduplicate
