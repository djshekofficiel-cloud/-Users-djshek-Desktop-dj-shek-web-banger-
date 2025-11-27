/**
 * Service de résolution des doublons
 * Gère les règles automatiques et la sélection manuelle
 */

export class ResolutionService {
  /**
   * Applique une règle automatique de résolution
   * @param {Array} duplicateGroups - Groupes de doublons
   * @param {string} rule - Règle à appliquer ('first', 'latest', 'largest')
   * @param {Set} uniqueFiles - Fichiers uniques à garder
   * @returns {Set} Chemins des fichiers à garder
   */
  applyAutoRule(duplicateGroups, rule, uniqueFiles) {
    const keptFiles = new Set()

    // Ajouter tous les fichiers uniques
    uniqueFiles.forEach(file => keptFiles.add(file.path))

    // Appliquer la règle pour chaque groupe
    for (const group of duplicateGroups) {
      let fileToKeep

      switch (rule) {
        case 'first':
          fileToKeep = group.files[0]
          break
        case 'latest':
          fileToKeep = group.files[group.files.length - 1]
          break
        case 'largest':
          fileToKeep = group.files.reduce(
            (max, f) => f.size > max.size ? f : max,
            group.files[0]
          )
          break
        default:
          fileToKeep = group.files[0]
      }

      if (fileToKeep) {
        keptFiles.add(fileToKeep.path)
      }
    }

    return keptFiles
  }

  /**
   * Valide une sélection manuelle
   * @param {Set} selectedPaths - Chemins sélectionnés
   * @param {Array} allFiles - Tous les fichiers
   * @param {Array} duplicateGroups - Groupes de doublons
   * @returns {Object} { valid, errors }
   */
  validateSelection(selectedPaths, allFiles, duplicateGroups) {
    const errors = []

    if (selectedPaths.size === 0) {
      errors.push('Veuillez sélectionner au moins un fichier à garder')
    }

    // Vérifier qu'au moins un fichier de chaque groupe est sélectionné
    for (const group of duplicateGroups) {
      const hasSelected = group.files.some(f => selectedPaths.has(f.path))
      if (!hasSelected) {
        errors.push(`Aucun fichier sélectionné dans le groupe ${group.id}`)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Calcule les statistiques de résolution
   * @param {Set} keptFiles - Fichiers gardés
   * @param {number} totalFiles - Nombre total de fichiers
   * @returns {Object} Statistiques
   */
  calculateStats(keptFiles, totalFiles) {
    return {
      kept: keptFiles.size,
      removed: totalFiles - keptFiles.size,
      saved: totalFiles - keptFiles.size,
      savedPercentage: ((totalFiles - keptFiles.size) / totalFiles * 100).toFixed(1)
    }
  }
}

export const resolutionService = new ResolutionService()

