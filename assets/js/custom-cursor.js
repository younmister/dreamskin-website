/**
 * CURSOR PERSONNALISÉ DREAM SKIN
 * Système de curseur personnalisé avec détection de contraste automatique
 * et animations fluides pour une expérience utilisateur premium
 */

class DreamSkinCursor {
    constructor() {
        this.cursor = null;
        this.body = document.body;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.isGrayMode = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        // Ne pas initialiser sur mobile
        if (this.isMobile) {
            return;
        }

        this.createCursor();
        this.bindEvents();
        this.animateCursor();
    }

    createCursor() {
        // Créer l'élément curseur
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
    }

    bindEvents() {
        // Suivi de la souris
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.checkBackgroundContrast(e.clientX, e.clientY);
        });

        // Gestion des éléments interactifs
        this.bindInteractiveElements();
        
        // Gestion du texte
        this.bindTextElements();
        
        // Effet de clic
        document.addEventListener('click', (e) => {
            this.createClickRipple(e.clientX, e.clientY);
        });

        // Gestion du redimensionnement
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            if (this.isMobile && this.cursor) {
                this.cursor.style.display = 'none';
                this.body.style.cursor = 'auto';
            }
        });
    }

    bindInteractiveElements() {
        const interactiveSelectors = [
            'a', 'button', '.cta-button', '.experience-cta-button', 
            '.service-link', '.portal-link', '.floating-menu-trigger',
            '.butterfly-menu', '.trigger-butterfly', '.close-portal-btn',
            '.faq-item', '.testimonial', '.service-card', '.reservation-button'
        ];

        interactiveSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                this.bindElementEvents(el);
            });
        });

        // Observer pour les nouveaux éléments ajoutés dynamiquement
        this.observeNewElements(interactiveSelectors);
    }

    bindTextElements() {
        const textSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', '.section-title', '.experience-text', 
            '.testimonial-text', '.faq-question'
        ];

        textSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                this.bindTextEvents(el);
            });
        });
    }

    bindElementEvents(element) {
        element.addEventListener('mouseenter', () => {
            if (this.isMobile) return;
            
            // Vérifier si c'est un élément papillon
            if (element.classList.contains('floating-menu-trigger') || 
                element.classList.contains('trigger-butterfly') ||
                element.classList.contains('butterfly-menu')) {
                this.setButterflyMode();
            } else {
                this.setHoverMode();
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (this.isMobile) return;
            this.setNormalMode();
        });
    }

    bindTextEvents(element) {
        element.addEventListener('mouseenter', () => {
            if (this.isMobile) return;
            this.setTextMode();
        });
        
        element.addEventListener('mouseleave', () => {
            if (this.isMobile) return;
            this.setNormalMode();
        });
    }

    observeNewElements(selectors) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        selectors.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                this.bindElementEvents(node);
                            }
                            const children = node.querySelectorAll ? node.querySelectorAll(selector) : [];
                            children.forEach(child => this.bindElementEvents(child));
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    checkBackgroundContrast(x, y) {
        const element = document.elementFromPoint(x, y);
        if (!element) return;
        
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        const bgImage = computedStyle.backgroundImage;
        
        // Vérifier si on est sur un fond vert/similaire
        const shouldUseGray = this.isGreenish(bgColor, bgImage) || 
                             element.closest('.hero') ||
                             element.closest('.experience') ||
                             element.closest('.services') ||
                             element.closest('.testimonials');
        
        if (shouldUseGray !== this.isGrayMode) {
            this.isGrayMode = shouldUseGray;
            this.updateCursorColor();
        }
    }

    isGreenish(bgColor, bgImage) {
        // Si c'est un gradient ou une image qui contient du vert
        if (bgImage && (bgImage.includes('rgb') || bgImage.includes('linear-gradient'))) {
            return true;
        }
        
        // Si c'est une couleur RGB/RGBA verte
        if (bgColor && bgColor.startsWith('rgb')) {
            const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
                const [, r, g, b] = rgbMatch.map(Number);
                
                // Détection des tons verts (principalement les couleurs Dream Skin)
                // Vert sauge: rgba(175, 207, 186) et vert foncé: rgba(45, 63, 46)
                if ((r > 150 && g > 180 && b > 150) && (g > r && g > b)) {
                    return true;
                }
                // Détection du vert foncé spécifique #2D3F2E (45, 63, 46)
                if (r >= 40 && r <= 50 && g >= 60 && g <= 70 && b >= 40 && b <= 50) {
                    return true;
                }
            }
        }
        
        return false;
    }

    updateCursorColor() {
        if (!this.cursor) return;
        
        if (this.isGrayMode) {
            this.cursor.classList.add('gray-mode');
        } else {
            this.cursor.classList.remove('gray-mode');
        }
    }

    setNormalMode() {
        if (!this.cursor) return;
        this.cursor.className = `custom-cursor${this.isGrayMode ? ' gray-mode' : ''}`;
    }

    setHoverMode() {
        if (!this.cursor) return;
        this.cursor.className = `custom-cursor hover${this.isGrayMode ? ' gray-mode' : ''}`;
    }

    setTextMode() {
        if (!this.cursor) return;
        this.cursor.className = `custom-cursor text${this.isGrayMode ? ' gray-mode' : ''}`;
    }

    setButterflyMode() {
        if (!this.cursor) return;
        this.cursor.className = `custom-cursor butterfly${this.isGrayMode ? ' gray-mode' : ''}`;
        setTimeout(() => this.cursor.classList.add('flap'), 100);
    }

    createClickRipple(x, y) {
        if (this.isMobile) return;
        
        const ripple = document.createElement('div');
        ripple.className = `click-ripple${this.isGrayMode ? ' gray-mode' : ''}`;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        if (this.isGrayMode) {
            ripple.style.animation = 'ripple-gray 0.6s ease-out';
        }
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateCursor() {
        if (this.isMobile || !this.cursor) return;
        
        // Augmentation de la vitesse de suivi (0.1 -> 0.2 pour plus de réactivité)
        this.cursorX += (this.mouseX - this.cursorX) * 0.2;
        this.cursorY += (this.mouseY - this.cursorY) * 0.2;
        
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';
        
        requestAnimationFrame(() => this.animateCursor());
    }

    // Méthode pour détruire le curseur (utile pour le nettoyage)
    destroy() {
        if (this.cursor) {
            this.cursor.remove();
        }
    }
}

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.dreamSkinCursor = new DreamSkinCursor();
});

// Export pour utilisation en module si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DreamSkinCursor;
}
