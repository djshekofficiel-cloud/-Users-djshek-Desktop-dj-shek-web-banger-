import './css/style.css'; // Importation du CSS pour que Vite le traite

import { audioTracks } from './data/tracks.js';



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

        item.innerHTML = `

            <div class="audio-playlist-number">${String(index + 1).padStart(2, '0')}</div>

            <div class="audio-playlist-name">${track.name}</div>

            <div class="audio-playlist-duration">--:--</div>

            <button class="audio-playlist-download" aria-label="Télécharger">⬇</button>

        `;

        

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

        div.innerHTML = `<img src="/images/partenaire/${imgName}" alt="Partenaire" loading="lazy">`;

        grid.appendChild(div);

    });

}



function handleDownload(track) {

    const email = localStorage.getItem('djshek_user_email');

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

    // Gestion simple du formulaire contact vers mailto

    if (elements.contactForm) {

        elements.contactForm.addEventListener('submit', (e) => {

            e.preventDefault();

            // Logique mailto conservée mais améliorée visuellement

            alert("Votre client mail va s'ouvrir pour envoyer la demande.");

            elements.contactForm.submit(); // Fallback to standard submission behavior or implement Formspree later

        });

    }

    

    // Gestion Modal Email

    if (elements.modalForm) {

        elements.modalForm.addEventListener('submit', (e) => {

            e.preventDefault();

            const email = document.getElementById('emailInput').value;

            if (email.includes('@')) {

                localStorage.setItem('djshek_user_email', email);

                elements.modalOverlay.classList.remove('active');

                alert("Email enregistré ! Vous pouvez maintenant télécharger.");

            }

        });

    }

    

    // Close modal btn

    const closeBtn = elements.modalOverlay.querySelector('.email-modal-btn-secondary');

    if(closeBtn) closeBtn.addEventListener('click', () => elements.modalOverlay.classList.remove('active'));

}

