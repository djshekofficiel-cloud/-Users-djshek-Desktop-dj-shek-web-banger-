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
 * Validation complète du formulaire
 */
export function validateForm(formData) {
    const errors = {};
    
    // Validation prénom
    if (!formData.firstName || formData.firstName.trim().length < 2) {
        errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    } else if (formData.firstName.length > 100) {
        errors.firstName = 'Le prénom est trop long (max 100 caractères)';
    }
    
    // Validation email
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.email = 'Veuillez entrer une adresse email valide';
    }
    
    // Validation message
    if (!formData.message || formData.message.trim().length < 10) {
        errors.message = 'Le message doit contenir au moins 10 caractères';
    } else if (formData.message.length > 5000) {
        errors.message = 'Le message est trop long (max 5000 caractères)';
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
 * Préparer les données du formulaire pour l'envoi (sanitization complète)
 */
export function prepareFormData(rawData) {
    return {
        firstName: sanitizeName(rawData.firstName || ''),
        email: rawData.email?.trim().toLowerCase() || '',
        message: sanitizeMessage(rawData.message || '')
    };
}

