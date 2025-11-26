/**
 * Module de sécurité pour le formulaire de contact
 * Protection contre XSS, injections, spam, et validation stricte
 */

/**
 * Sanitize une chaîne de caractères (supprime les caractères dangereux)
 */
export function sanitizeString(str, maxLength = 1000) {
    if (!str || typeof str !== 'string') return '';
    
    return str
        .trim()
        // Supprimer les balises HTML et scripts
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        // Supprimer les caractères de contrôle
        .replace(/[\x00-\x1F\x7F]/g, '')
        // Limiter la longueur
        .substring(0, maxLength);
}

/**
 * Sanitize un nom/prénom (lettres, espaces, tirets, apostrophes uniquement)
 */
export function sanitizeName(name, maxLength = 100) {
    if (!name || typeof name !== 'string') return '';
    
    return name
        .trim()
        // Garder seulement lettres, espaces, tirets, apostrophes
        .replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '')
        // Supprimer les espaces multiples
        .replace(/\s+/g, ' ')
        .substring(0, maxLength);
}

/**
 * Validation stricte d'email
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    
    // Regex stricte RFC 5322 simplifiée
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) return false;
    
    // Vérifier la longueur (RFC 5321: max 254 caractères)
    if (email.length > 254) return false;
    
    // Vérifier qu'il n'y a pas de caractères dangereux
    if (/[<>\"']/.test(email)) return false;
    
    // Vérifier qu'il n'y a pas de domaines suspects
    const suspiciousDomains = ['test.com', 'example.com', 'mailinator.com', '10minutemail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && suspiciousDomains.some(sd => domain.includes(sd))) {
        return false;
    }
    
    return true;
}

/**
 * Sanitize un message (supprime HTML, limite longueur)
 */
export function sanitizeMessage(message, maxLength = 5000) {
    if (!message || typeof message !== 'string') return '';
    
    return sanitizeString(message, maxLength)
        // Supprimer les URLs suspectes (optionnel, peut être trop restrictif)
        .replace(/https?:\/\/[^\s]+/g, '[URL supprimée]');
}

/**
 * Sanitize un numéro de téléphone
 */
export function sanitizePhone(phone, maxLength = 20) {
    if (!phone || typeof phone !== 'string') return '';
    
    return phone
        .trim()
        // Garder seulement chiffres, espaces, +, -, (, )
        .replace(/[^0-9\s\+\-\(\)]/g, '')
        .substring(0, maxLength);
}

/**
 * Validation d'un numéro de téléphone (format international)
 */
export function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    
    // Supprimer les espaces et caractères spéciaux pour la validation
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Doit contenir entre 8 et 15 chiffres (format international)
    if (cleaned.length < 8 || cleaned.length > 15) return false;
    
    // Doit commencer par + ou un chiffre
    if (!/^[\+]?[0-9]/.test(cleaned)) return false;
    
    return true;
}

/**
 * Validation d'une date (doit être dans le futur pour les événements)
 */
export function isValidEventDate(dateString) {
    if (!dateString) return true; // Optionnel
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // La date doit être valide et dans le futur
    return !isNaN(date.getTime()) && date >= today;
}

/**
 * Rate limiting côté client (basique)
 */
class RateLimiter {
    constructor(maxSubmissions = 3, timeWindow = 60000) { // 3 soumissions par minute
        this.submissions = [];
        this.maxSubmissions = maxSubmissions;
        this.timeWindow = timeWindow;
    }
    
    canSubmit() {
        const now = Date.now();
        // Nettoyer les soumissions anciennes
        this.submissions = this.submissions.filter(time => now - time < this.timeWindow);
        
        if (this.submissions.length >= this.maxSubmissions) {
            return false;
        }
        
        this.submissions.push(now);
        return true;
    }
    
    reset() {
        this.submissions = [];
    }
}

export const rateLimiter = new RateLimiter(3, 60000); // 3 par minute

/**
 * Validation complète du formulaire (version simplifiée)
 */
export function validateForm(formData) {
    const errors = {};
    
    // Validation nom / pseudo
    if (!formData.nom || formData.nom.trim().length < 2) {
        errors.nom = 'Le nom / pseudo doit contenir au moins 2 caractères';
    } else if (formData.nom.length > 100) {
        errors.nom = 'Le nom / pseudo est trop long (max 100 caractères)';
    }
    
    // Validation email
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.email = 'Veuillez entrer une adresse email valide';
    }
    
    // Validation type de prestation
    if (!formData.type_prestation || formData.type_prestation.trim().length === 0) {
        errors.type_prestation = 'Veuillez sélectionner un type de prestation';
    }
    
    // Validation instructions (minimum 30 caractères)
    if (!formData.instructions || formData.instructions.trim().length < 30) {
        errors.instructions = 'Les instructions doivent contenir au moins 30 caractères pour nous donner plus de détails';
    } else if (formData.instructions.length > 5000) {
        errors.instructions = 'Les instructions sont trop longues (max 5000 caractères)';
    }
    
    // Validation BPM (si renseigné)
    if (formData.bpm) {
        const bpm = parseInt(formData.bpm);
        if (isNaN(bpm) || bpm < 50 || bpm > 200) {
            errors.bpm = 'Le BPM doit être entre 50 et 200';
        }
    }
    
    // Validation GDPR (requis)
    if (!formData.gdpr) {
        errors.gdpr = 'Vous devez accepter l\'utilisation de vos données pour traiter votre demande';
    }
    
    // Vérifier le rate limiting
    if (!rateLimiter.canSubmit()) {
        errors.rateLimit = 'Trop de tentatives. Veuillez patienter avant de réessayer.';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Sanitize une URL
 */
export function sanitizeUrl(url, maxLength = 500) {
    if (!url || typeof url !== 'string') return '';
    return url.trim().substring(0, maxLength);
}

/**
 * Préparer les données du formulaire pour l'envoi (sanitization complète - version simplifiée)
 */
export function prepareFormData(rawData) {
    return {
        nom: sanitizeName(rawData.nom || '', 100),
        email: rawData.email?.trim().toLowerCase() || '',
        type_prestation: sanitizeString(rawData.type_prestation || '', 50),
        style: sanitizeString(rawData.style || '', 200),
        instructions: sanitizeMessage(rawData.instructions || ''),
        fichiers: sanitizeUrl(rawData.fichiers || ''),
        bpm: rawData.bpm ? parseInt(rawData.bpm) || 0 : 0,
        delai: sanitizeString(rawData.delai || '', 20),
        gdpr: rawData.gdpr || false
    };
}

