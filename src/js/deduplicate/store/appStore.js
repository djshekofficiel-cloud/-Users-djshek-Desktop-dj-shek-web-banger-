/**
 * Store de gestion d'état de l'application
 * Centralise l'état et les actions
 */

export class AppStore {
  constructor() {
    this.state = {
      currentStep: 'upload', // upload, analyzing, results, download
      files: [],
      duplicateGroups: [],
      uniqueFiles: [],
      selectedFiles: new Set(),
      stats: null,
      error: null,
      progress: 0,
      isProcessing: false
    }

    this.listeners = []
  }

  /**
   * S'abonner aux changements d'état
   * @param {Function} callback - Fonction appelée à chaque changement
   * @returns {Function} Fonction de désabonnement
   */
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  /**
   * Notifie tous les listeners
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state))
  }

  /**
   * Met à jour l'état
   * @param {Object} updates - Nouvelles valeurs
   */
  setState(updates) {
    this.state = { ...this.state, ...updates }
    this.notify()
  }

  /**
   * Réinitialise l'état
   */
  reset() {
    this.setState({
      currentStep: 'upload',
      files: [],
      duplicateGroups: [],
      uniqueFiles: [],
      selectedFiles: new Set(),
      stats: null,
      error: null,
      progress: 0,
      isProcessing: false
    })
  }

  /**
   * Actions
   */
  setStep(step) {
    this.setState({ currentStep: step })
  }

  setFiles(files) {
    this.setState({ files })
  }

  setAnalysisResult(result) {
    this.setState({
      files: result.files,
      duplicateGroups: result.duplicateGroups,
      uniqueFiles: result.uniqueFiles,
      stats: result.stats,
      currentStep: 'results'
    })

    // Pré-sélectionner automatiquement
    this.autoSelectFiles()
  }

  autoSelectFiles() {
    const selected = new Set()
    
    // Ajouter les fichiers uniques
    this.state.uniqueFiles.forEach(file => selected.add(file.path))
    
    // Ajouter le premier fichier de chaque groupe
    this.state.duplicateGroups.forEach(group => {
      if (group.files.length > 0) {
        selected.add(group.files[0].path)
      }
    })

    this.setState({ selectedFiles: selected })
  }

  selectFile(filePath, groupId) {
    const selected = new Set(this.state.selectedFiles)
    
    // Si c'est dans un groupe, désélectionner les autres du groupe
    const group = this.state.duplicateGroups.find(g => g.id === groupId)
    if (group) {
      group.files.forEach(f => selected.delete(f.path))
    }
    
    selected.add(filePath)
    this.setState({ selectedFiles: selected })
  }

  applyAutoRule(rule, resolutionService) {
    const selected = resolutionService.applyAutoRule(
      this.state.duplicateGroups,
      rule,
      new Set(this.state.uniqueFiles)
    )
    this.setState({ selectedFiles: selected })
  }

  setProgress(progress) {
    this.setState({ progress })
  }

  setError(error) {
    this.setState({ error, currentStep: 'upload' })
  }

  setProcessing(isProcessing) {
    this.setState({ isProcessing })
  }
}

export const appStore = new AppStore()

