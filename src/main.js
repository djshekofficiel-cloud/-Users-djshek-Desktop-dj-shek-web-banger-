import './css/style.css'; // Importation du CSS pour que Vite le traite

import { audioTracks } from './data/tracks.js';

import { validateForm, prepareFormData, rateLimiter } from './js/form-security.js';

import { csrfProtection } from './js/csrf-protection.js';

import { 
    honeypot, 
    timingProtection, 
    submissionTracker,
    validateUrlStrict,
    detectSuspiciousPatterns,
    isSpamContent
} from './js/advanced-security.js';

import { initDeduplicate } from './js/deduplicate.js';



// --- CONFIGURATION ---

const DEBUG = import.meta.env.MODE === 'development';

const log = DEBUG ? console.log.bind(console) : () => {};



// --- GLOBAL VARIABLES ---

let currentTrackIndex = -1;

let isPlaying = false;



// --- DOM ELEMENTS ---

const elements = {

    player: document.getElementById('audioPlayerElement'),

    playBtn: document.getElementById('audioPlayPauseBtn'),

    prevBtn: document.getElementById('audioPrevBtn'),

    nextBtn: document.getElementById('audioNextBtn'),

    progressContainer: document.getElementById('audioProgressContainer'),

    progressBar: document.getElementById('audioProgressBar'),

    currentTime: document.getElementById('audioCurrentTime'),

    duration: document.getElementById('audioDuration'),

    trackTitle: document.getElementById('audioCurrentTrack'),

    artist: document.getElementById('audioCurrentArtist'),

    volumeContainer: document.getElementById('audioVolumeContainer'),

    volumeBar: document.getElementById('audioVolumeBar'),

    playlist: document.getElementById('audioPlaylist'),

    particlesBg: document.getElementById('particlesBg'),

    navBar: document.getElementById('navbar'),

    navMenu: document.getElementById('navMenu'),

    navToggle: document.getElementById('navMenuToggle'),

    loader: document.getElementById('pageLoader'),

    modalOverlay: document.getElementById('emailModalOverlay'),

    modalForm: document.getElementById('emailModalForm'),

    contactForm: document.getElementById('contactForm')

};



// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {

    initLoader();

    initParticles();

    initNavigation();

    initPlayer();

    initPartenaires();

    initForms();

    initVideo();

    initSectionGlow();

    initDeduplicate();

    log('System initialized');

});



function initLoader() {

    window.addEventListener('load', () => {

        if (elements.loader) {

            setTimeout(() => {

                elements.loader.classList.add('hidden');

                setTimeout(() => elements.loader.style.display = 'none', 500);

            }, 300);

        }

    });

}



// --- AUDIO PLAYER LOGIC ---

function initPlayer() {

    if (!elements.player) return;



    // Build Playlist

    elements.playlist.innerHTML = '';

    audioTracks.forEach((track, index) => {

        const item = document.createElement('div');

        item.className = 'audio-playlist-item';

        item.tabIndex = 0;

        // Sécurisé : utilisation de createElement au lieu de innerHTML
        const numberDiv = document.createElement('div');
        numberDiv.className = 'audio-playlist-number';
        numberDiv.textContent = String(index + 1).padStart(2, '0');

        const nameDiv = document.createElement('div');
        nameDiv.className = 'audio-playlist-name';
        nameDiv.textContent = track.name; // track.name est déjà dans les données statiques, sécurisé

        const durationDiv = document.createElement('div');
        durationDiv.className = 'audio-playlist-duration';
        durationDiv.textContent = '--:--';

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'audio-playlist-download';
        downloadBtn.setAttribute('aria-label', 'Télécharger');
        downloadBtn.textContent = '⬇';

        item.appendChild(numberDiv);
        item.appendChild(nameDiv);
        item.appendChild(durationDiv);
        item.appendChild(downloadBtn);

        

        // Click on track

        item.addEventListener('click', (e) => {

            if (e.target.classList.contains('audio-playlist-download')) {

                handleDownload(track);

            } else {

                loadTrack(index);

                playAudio();

            }

        });



        elements.playlist.appendChild(item);

    });



    // Event Listeners

    elements.playBtn.addEventListener('click', togglePlay);

    elements.prevBtn.addEventListener('click', playPrev);

    elements.nextBtn.addEventListener('click', playNext);

    

    elements.player.addEventListener('timeupdate', updateProgress);

    elements.player.addEventListener('loadedmetadata', () => {

        elements.duration.textContent = formatTime(elements.player.duration);

    });

    elements.player.addEventListener('ended', playNext);

    

    // Volume

    elements.volumeContainer.addEventListener('click', (e) => {

        const rect = elements.volumeContainer.getBoundingClientRect();

        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

        elements.player.volume = pct;

        elements.volumeBar.style.width = (pct * 100) + '%';

    });



    // Progress Click

    elements.progressContainer.addEventListener('click', (e) => {

        if (!elements.player.duration) return;

        const rect = elements.progressContainer.getBoundingClientRect();

        const pct = (e.clientX - rect.left) / rect.width;

        elements.player.currentTime = pct * elements.player.duration;

    });

}

// --- VIDEO INITIALIZATION ---

function initVideo() {

    const video = document.getElementById('djshekVideo');

    if (!video) return;

    // Configurer la vitesse de lecture (plus rapide)

    video.playbackRate = 1.5; // 1.5x la vitesse normale

    // S'assurer que la vidéo est muette

    video.muted = true;

    // Activer la boucle

    video.loop = true;

    // Forcer la lecture automatique

    const playVideo = async () => {

        try {

            await video.play();

            log('Vidéo démarrée automatiquement');

        } catch (error) {

            log('Erreur lecture automatique vidéo:', error);

            // Retenter après interaction utilisateur

            document.addEventListener('click', playVideo, { once: true });

            document.addEventListener('touchstart', playVideo, { once: true });

        }

    };

    // Démarrer la vidéo dès que possible

    if (video.readyState >= 3) { // HAVE_FUTURE_DATA

        playVideo();

    } else {

        video.addEventListener('loadeddata', playVideo, { once: true });

        video.addEventListener('canplay', playVideo, { once: true });

    }

    // S'assurer que la boucle fonctionne

    video.addEventListener('ended', () => {

        video.currentTime = 0;

        video.play().catch(() => {});

    });

    // Maintenir la vitesse même après chargement

    video.addEventListener('loadedmetadata', () => {

        video.playbackRate = 1.5;

    });

    // Empêcher l'affichage des contrôles

    video.controls = false;

    // Ajouter un style pour cacher complètement les contrôles

    video.style.pointerEvents = 'none'; // Empêche les interactions avec la vidéo

}



function loadTrack(index) {

    if (index < 0 || index >= audioTracks.length) return;

    currentTrackIndex = index;

    const track = audioTracks[index];

    

    // Correction des chemins pour l'architecture publique

    elements.player.src = `/audio/${track.file}`; 

    elements.trackTitle.textContent = track.name;

    

    // Update UI Active State

    const items = elements.playlist.querySelectorAll('.audio-playlist-item');

    items.forEach(i => i.classList.remove('active'));

    items[index].classList.add('active');

}



function togglePlay() {

    if (currentTrackIndex === -1) loadTrack(0);

    if (elements.player.paused) playAudio();

    else pauseAudio();

}



function playAudio() {

    elements.player.play()

        .then(() => {

            isPlaying = true;

            elements.playBtn.textContent = '⏸';

            elements.playBtn.classList.add('playing');

        })

        .catch(err => console.error("Audio playback failed", err));

}



function pauseAudio() {

    elements.player.pause();

    isPlaying = false;

    elements.playBtn.textContent = '▶';

    elements.playBtn.classList.remove('playing');

}



function playNext() {

    if (currentTrackIndex < audioTracks.length - 1) {

        loadTrack(currentTrackIndex + 1);

        playAudio();

    }

}



function playPrev() {

    if (currentTrackIndex > 0) {

        loadTrack(currentTrackIndex - 1);

        playAudio();

    }

}



function updateProgress() {

    if (!elements.player.duration) return;

    const pct = (elements.player.currentTime / elements.player.duration) * 100;

    elements.progressBar.style.width = `${pct}%`;

    elements.currentTime.textContent = formatTime(elements.player.currentTime);

}



function formatTime(s) {

    if (isNaN(s)) return '0:00';

    const m = Math.floor(s / 60);

    const sec = Math.floor(s % 60);

    return `${m}:${sec.toString().padStart(2, '0')}`;

}



// --- UI & UTILS ---

function initParticles() {

    if (!elements.particlesBg) return;

    const isMobile = window.innerWidth <= 768;

    const count = isMobile ? 40 : 80;

    

    for (let i = 0; i < count; i++) {

        const p = document.createElement('div');

        p.className = 'particle';

        p.style.left = Math.random() * 100 + '%';

        p.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');

        p.style.animationDelay = Math.random() * 15 + 's';

        p.style.animationDuration = (Math.random() * 10 + 10) + 's';

        elements.particlesBg.appendChild(p);

    }

}



function initNavigation() {

    // Scroll effect

    window.addEventListener('scroll', () => {

        if (window.scrollY > 100) elements.navBar.classList.add('scrolled');

        else elements.navBar.classList.remove('scrolled');

        

        // Scroll progress

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        const scrolled = (winScroll / height) * 100;

        document.getElementById("scrollProgress").style.width = scrolled + "%";

    });



    // Mobile menu

    if (elements.navToggle) {

        elements.navToggle.addEventListener('click', () => {

            elements.navMenu.classList.toggle('active');

            elements.navToggle.classList.toggle('active');

        });

    }

}



function initPartenaires() {

    const grid = document.getElementById('partenairesGrid');

    if (!grid) return;

    // Images statiques pour l'instant - idéalement à déplacer dans data

    const images = ['images.png', 'IMG_1073.JPG', 'hjhjhj.png', 'ggggh.png', 'téléchargement.jpeg', 'téléchargement.png'];

    

    grid.innerHTML = '';

    images.forEach(imgName => {

        const div = document.createElement('div');

        div.className = 'partenaire-item';

        // Sécurisé : utilisation de createElement au lieu de innerHTML
        const img = document.createElement('img');
        // Sanitize le nom de fichier pour éviter directory traversal
        const sanitizedImgName = imgName.replace(/[^a-zA-Z0-9._-]/g, '');
        img.src = `/images/partenaire/${sanitizedImgName}`;
        img.alt = 'Partenaire';
        img.loading = 'lazy';

        div.appendChild(img);

        grid.appendChild(div);

    });

}



// Fonction utilitaire pour gérer le localStorage de manière sécurisée
function getStoredEmail() {
    try {
        const stored = localStorage.getItem('djshek_user_email');
        if (!stored) return null;

        const data = JSON.parse(stored);
        const now = Date.now();

        // Vérifier l'expiration (30 jours)
        if (data.expires && now > data.expires) {
            localStorage.removeItem('djshek_user_email');
            return null;
        }

        // Valider l'email stocké
        if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            return data.email;
        }

        return null;
    } catch (e) {
        console.error('Erreur lors de la récupération de l\'email:', e);
        localStorage.removeItem('djshek_user_email');
        return null;
    }
}

function setStoredEmail(email) {
    try {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return false;
        }

        const data = {
            email: email,
            expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 jours
        };

        localStorage.setItem('djshek_user_email', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Erreur lors du stockage de l\'email:', e);
        return false;
    }
}

function handleDownload(track) {

    const email = getStoredEmail();

    if (!email) {

        // Show modal logic

        elements.modalOverlay.classList.add('active');

        return;

    }

    // Trigger download

    const link = document.createElement('a');

    link.href = `/audio/${track.file}`;

    link.download = `${track.name}.mp3`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}



function initForms() {

    // Gestion sécurisée du formulaire contact

    if (elements.contactForm) {

        // Ajouter le token CSRF au formulaire
        csrfProtection.addTokenToForm(elements.contactForm);

        // Ajouter le champ honeypot (protection anti-bots)
        honeypot.createHoneypotField(elements.contactForm);

        // Démarrer le chronomètre de timing (protection contre soumissions trop rapides)
        timingProtection.startTiming('contactForm');

        // Compteur de caractères pour les instructions
        const instructionsTextarea = document.getElementById('instructions');
        const charCount = document.getElementById('charCount');

        if (instructionsTextarea && charCount) {
            instructionsTextarea.addEventListener('input', () => {
                const length = instructionsTextarea.value.length;
                charCount.textContent = length;
                if (length > 4500) {
                    charCount.style.color = 'var(--orange)';
                } else {
                    charCount.style.color = 'rgba(255, 255, 255, 0.7)';
                }
            });
        }

        elements.contactForm.addEventListener('submit', (e) => {

            e.preventDefault();

            // Réinitialiser les erreurs

            clearFormErrors();

            // Valider le token CSRF
            if (!csrfProtection.validateFormToken(elements.contactForm)) {
                showFormMessage('Erreur de sécurité. Veuillez rafraîchir la page et réessayer.', 'error');
                // Régénérer le token
                csrfProtection.addTokenToForm(elements.contactForm);
                return;
            }

            // Vérifier le honeypot (détection de bots)
            if (honeypot.isBot(elements.contactForm)) {
                showFormMessage('Spam détecté. Si vous êtes humain, réessayez.', 'error');
                return;
            }

            // Vérifier le timing (protection contre soumissions trop rapides)
            if (!timingProtection.isValidTiming('contactForm')) {
                showFormMessage('Le formulaire doit être rempli en au moins 3 secondes. Veuillez réessayer.', 'error');
                return;
            }

            // Vérifier le nombre de soumissions
            if (!submissionTracker.canSubmit()) {
                const remaining = submissionTracker.getRemainingSubmissions();
                showFormMessage(`Trop de soumissions. Vous pouvez envoyer ${remaining} demande(s) par heure maximum.`, 'error');
                return;
            }

            // Récupérer les valeurs (formulaire simplifié)
            const rawData = {
                nom: document.getElementById('nom')?.value || '',
                email: document.getElementById('email')?.value || '',
                type_prestation: document.getElementById('type_prestation')?.value || '',
                style: document.getElementById('style')?.value || '',
                instructions: document.getElementById('instructions')?.value || '',
                fichiers: document.getElementById('fichiers')?.value || '',
                bpm: document.getElementById('bpm')?.value || '',
                delai: document.getElementById('delai')?.value || '',
                gdpr: document.getElementById('gdpr')?.checked || false
            };

            // Sanitization et validation

            const sanitizedData = prepareFormData(rawData);

            const validation = validateForm(sanitizedData);

            if (!validation.isValid) {

                // Afficher les erreurs

                displayFormErrors(validation.errors);

                return;

            }

            // Désactiver le bouton pour éviter les doubles soumissions

            const submitBtn = document.getElementById('submitBtn');

            const btnText = submitBtn?.querySelector('.btn-text');

            const btnLoader = submitBtn?.querySelector('.btn-loader');

            if (submitBtn) {

                submitBtn.disabled = true;

                if (btnText) btnText.style.opacity = '0';

                if (btnLoader) btnLoader.classList.remove('hidden');

            }

            // Préparer l'email mailto sécurisé
            const subject = encodeURIComponent(`[${sanitizedData.type_prestation || 'Prestation'}] Nouvelle demande depuis djshekofficiel.com`);

            let body = `═══════════════════════════════════════\n`;
            body += `NOUVELLE DEMANDE DE PRESTATION - DJ SHEK\n`;
            body += `═══════════════════════════════════════\n\n`;

            body += `📋 INFORMATIONS\n`;
            body += `───────────────────────────────────────\n`;
            body += `Nom / Pseudo: ${sanitizedData.nom}\n`;
            body += `Email: ${sanitizedData.email}\n`;
            body += `\n`;

            body += `🎯 TYPE DE PRESTATION\n`;
            body += `───────────────────────────────────────\n`;
            body += `${sanitizedData.type_prestation || 'Non spécifié'}\n`;
            body += `\n`;

            if (sanitizedData.style) {
                body += `🎵 STYLE / RÉFÉRENCE\n`;
                body += `───────────────────────────────────────\n`;
                body += `${sanitizedData.style}\n`;
                body += `\n`;
            }

            body += `💬 INSTRUCTIONS DÉTAILLÉES\n`;
            body += `───────────────────────────────────────\n`;
            body += `${sanitizedData.instructions}\n`;
            body += `\n`;

            if (sanitizedData.fichiers) {
                body += `📎 LIENS VERS FICHIERS\n`;
                body += `───────────────────────────────────────\n`;
                body += `${sanitizedData.fichiers}\n`;
                body += `\n`;
            }

            if (sanitizedData.bpm) {
                body += `🎚️ BPM SOUHAITÉ\n`;
                body += `───────────────────────────────────────\n`;
                body += `${sanitizedData.bpm} BPM\n`;
                body += `\n`;
            }

            if (sanitizedData.delai) {
                body += `⏰ DÉLAI DÉSIRÉ\n`;
                body += `───────────────────────────────────────\n`;
                body += `${sanitizedData.delai}\n`;
                body += `\n`;
            }

            body += `═══════════════════════════════════════\n`;
            if (rawData.gdpr) body += `✓ Consentement RGPD donné\n`;
            body += `═══════════════════════════════════════\n`;

            // Vérifications de sécurité supplémentaires avant l'envoi
            // Vérifier les patterns suspects dans les instructions
            if (detectSuspiciousPatterns(sanitizedData.instructions)) {
                showFormMessage('Le contenu contient des éléments suspects. Veuillez corriger votre message.', 'error');
                return;
            }

            // Vérifier le spam dans les instructions
            if (isSpamContent(sanitizedData.instructions)) {
                showFormMessage('Le contenu semble être du spam. Veuillez corriger votre message.', 'error');
                return;
            }

            // Valider l'URL des fichiers si présente
            if (sanitizedData.fichiers && sanitizedData.fichiers.trim().length > 0) {
                if (!validateUrlStrict(sanitizedData.fichiers)) {
                    showFormMessage('Le lien fourni n\'est pas valide. Veuillez vérifier l\'URL (doit commencer par https://).', 'error');
                    return;
                }
            }

            // Enregistrer la soumission (rate limiting avancé)
            submissionTracker.recordSubmission();

            const mailtoLink = `mailto:djshekofficiel@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;

            // Ouvrir le client mail

            window.location.href = mailtoLink;

            // Afficher un message de confirmation

            showFormMessage('✅ Votre client mail va s\'ouvrir pour envoyer la demande à djshekofficiel@gmail.com', 'success');

            // Réinitialiser le formulaire après un court délai

            setTimeout(() => {

                elements.contactForm.reset();

                if (charCount) charCount.textContent = '0';

                // Régénérer le token CSRF
                csrfProtection.addTokenToForm(elements.contactForm);

                if (submitBtn) {

                    submitBtn.disabled = false;

                    if (btnText) btnText.style.opacity = '1';

                    if (btnLoader) btnLoader.classList.add('hidden');

                }

            }, 2000);

        });

    }

    

    // Gestion Modal Email

    if (elements.modalForm) {

        // Ajouter le token CSRF au formulaire modal
        csrfProtection.addTokenToForm(elements.modalForm);

        elements.modalForm.addEventListener('submit', (e) => {

            e.preventDefault();

            // Valider le token CSRF
            if (!csrfProtection.validateFormToken(elements.modalForm)) {
                alert('Erreur de sécurité. Veuillez rafraîchir la page et réessayer.');
                csrfProtection.addTokenToForm(elements.modalForm);
                return;
            }

            const email = document.getElementById('emailInput').value;

            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

                if (setStoredEmail(email)) {
                elements.modalOverlay.classList.remove('active');
                alert("Email enregistré ! Vous pouvez maintenant télécharger.");
                } else {
                    alert("Erreur lors de l'enregistrement de l'email. Veuillez réessayer.");
                }

            } else {

                alert("Veuillez entrer une adresse email valide.");

            }

        });

    }

    

    // Close modal btn

    const closeBtn = elements.modalOverlay.querySelector('.email-modal-btn-secondary');

    if(closeBtn) closeBtn.addEventListener('click', () => elements.modalOverlay.classList.remove('active'));

}

// Fonctions utilitaires pour le formulaire

function clearFormErrors() {

    document.querySelectorAll('.error-message').forEach(el => {

        el.textContent = '';

        el.style.display = 'none';

    });

    document.querySelectorAll('.form-group').forEach(group => {

        group.classList.remove('error');

    });

    const formMessage = document.getElementById('formMessage');

    if (formMessage) {

        formMessage.style.display = 'none';

        formMessage.className = 'form-message';

    }

}

function displayFormErrors(errors) {

    Object.keys(errors).forEach(field => {

        if (field === 'rateLimit') {

            showFormMessage(errors[field], 'error');

            return;

        }

        const errorEl = document.getElementById(`${field}Error`);

        const inputEl = document.getElementById(field);

        const formGroup = inputEl?.closest('.form-group');

        if (errorEl) {

            errorEl.textContent = errors[field];

            errorEl.style.display = 'block';

        }

        if (formGroup) {

            formGroup.classList.add('error');

        }

        if (inputEl) {

            inputEl.focus();

        }

    });

}

function showFormMessage(message, type = 'success') {

    const formMessage = document.getElementById('formMessage');

    if (formMessage) {

        formMessage.textContent = message;

        formMessage.className = `form-message ${type}`;

        formMessage.style.display = 'block';

        // Auto-hide après 5 secondes

        setTimeout(() => {

            formMessage.style.display = 'none';

        }, 5000);

    }

}

// --- Section Glow Effect ---

function initSectionGlow() {

    const sections = document.querySelectorAll('.section-glow');

    if (sections.length === 0) return;

    // Configuration de l'Intersection Observer

    const observerOptions = {

        root: null, // viewport

        rootMargin: '-10% 0px -10% 0px', // Déclenche quand 10% de la section est visible

        threshold: 0.1 // Déclenche quand 10% de la section est visible

    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                // Ajouter la classe active pour activer l'animation

                entry.target.classList.add('section-glow--active');

            } else {

                // Optionnel : retirer la classe pour réactiver l'animation au prochain scroll

                // entry.target.classList.remove('section-glow--active');

            }

        });

    }, observerOptions);

    // Observer chaque section

    sections.forEach(section => {

        observer.observe(section);

    });

    log('Section glow effect initialized');

}

