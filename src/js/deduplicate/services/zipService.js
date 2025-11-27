/**
 * Service de gestion des fichiers ZIP
 * Gère l'extraction, la lecture et la création de fichiers ZIP
 */

import JSZip from 'jszip'

export class ZipService {
  /**
   * Charge et extrait un fichier ZIP
   * @param {File} file - Fichier ZIP à traiter
   * @returns {Promise<Array>} Liste des fichiers extraits
   */
  async extractZip(file) {
    try {
      const zip = await JSZip.loadAsync(file)
      const files = []

      for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const content = await zipEntry.async('arraybuffer')
          const size = zipEntry._data?.uncompressedSize || 0

          files.push({
            path,
            content,
            size,
            entry: zipEntry
          })
        }
      }

      return files
    } catch (error) {
      throw new Error(`Erreur lors de l'extraction du ZIP: ${error.message}`)
    }
  }

  /**
   * Crée un nouveau ZIP avec les fichiers sélectionnés
   * @param {Array} files - Liste des fichiers à inclure
   * @param {Set} selectedPaths - Chemins des fichiers à garder
   * @returns {Promise<ArrayBuffer>} Buffer du ZIP généré
   */
  async createZip(files, selectedPaths) {
    try {
      const zip = new JSZip()

      for (const file of files) {
        if (selectedPaths.has(file.path)) {
          // Si le contenu est déjà un ArrayBuffer, l'utiliser directement
          // Sinon, le lire depuis le fichier
          let content = file.content
          if (!content && file.file) {
            content = await this.readFileAsArrayBuffer(file.file)
          }
          zip.file(file.path, content)
        }
      }

      return await zip.generateAsync({ 
        type: 'arraybuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      })
    } catch (error) {
      throw new Error(`Erreur lors de la création du ZIP: ${error.message}`)
    }
  }

  /**
   * Télécharge un fichier
   * @param {ArrayBuffer} buffer - Contenu du fichier
   * @param {string} filename - Nom du fichier
   */
  downloadFile(buffer, filename) {
    const blob = new Blob([buffer], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Valide qu'un fichier est un ZIP
   * @param {File} file - Fichier à valider
   * @returns {boolean}
   */
  isValidZip(file) {
    return file && file.name.toLowerCase().endsWith('.zip')
  }

  /**
   * Traite des fichiers individuels (non-ZIP)
   * @param {Array<File>} files - Liste de fichiers à traiter
   * @returns {Promise<Array>} Liste des fichiers avec leur contenu
   */
  async processFiles(files) {
    try {
      const processedFiles = []
      
      for (const file of files) {
        // Ignorer les fichiers ZIP dans le traitement des fichiers individuels
        if (this.isValidZip(file)) {
          continue
        }

        const content = await this.readFileAsArrayBuffer(file)
        processedFiles.push({
          path: file.name,
          content,
          size: file.size,
          file: file
        })
      }

      return processedFiles
    } catch (error) {
      throw new Error(`Erreur lors du traitement des fichiers: ${error.message}`)
    }
  }

  /**
   * Lit un fichier en ArrayBuffer
   * @param {File} file - Fichier à lire
   * @returns {Promise<ArrayBuffer>}
   */
  readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(new Error('Erreur lors de la lecture du fichier'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Formate la taille d'un fichier
   * @param {number} bytes - Taille en octets
   * @returns {string} Taille formatée
   */
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

export const zipService = new ZipService()

