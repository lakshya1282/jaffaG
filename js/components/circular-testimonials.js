/**
 * CircularTestimonials - A premium vanilla JS component for rotating testimonials
 */
class CircularTestimonials {
    constructor(containerId, testimonials) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.testimonials = testimonials;
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.isInteracting = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.updateClasses();
        this.startAutoplay();
    }

    render() {
        this.container.innerHTML = `
            <div class="ct-wrapper">
                <div class="ct-cards-container">
                    ${this.testimonials.map((t, i) => `
                        <div class="ct-card" data-index="${i}">
                            <div class="ct-card-glass">
                                <img src="${t.src}" alt="${t.name}" class="ct-avatar" loading="lazy">
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="ct-content-area">
                    <div class="ct-quote-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>
                    </div>
                    <div class="ct-text-container">
                        <p class="ct-quote" id="ct-quote"></p>
                        <h4 class="ct-name" id="ct-name"></h4>
                        <span class="ct-designation" id="ct-designation"></span>
                    </div>
                </div>

                <div class="ct-nav">
                    <button class="ct-nav-btn ct-prev" aria-label="Previous testimonial">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div class="ct-dots">
                        ${this.testimonials.map((_, i) => `<span class="ct-dot" data-index="${i}"></span>`).join('')}
                    </div>
                    <button class="ct-nav-btn ct-next" aria-label="Next testimonial">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
            </div>
        `;

        this.cards = this.container.querySelectorAll('.ct-card');
        this.dots = this.container.querySelectorAll('.ct-dot');
        this.quoteEl = this.container.querySelector('#ct-quote');
        this.nameEl = this.container.querySelector('#ct-name');
        this.designationEl = this.container.querySelector('#ct-designation');
    }

    updateClasses() {
        const total = this.testimonials.length;
        
        this.cards.forEach((card, i) => {
            card.className = 'ct-card';
            
            if (i === this.currentIndex) {
                card.classList.add('active');
            } else if (i === (this.currentIndex - 1 + total) % total) {
                card.classList.add('left');
            } else if (i === (this.currentIndex + 1) % total) {
                card.classList.add('right');
            } else {
                card.classList.add('hidden');
            }
        });

        // Update content with fade effect
        const activeData = this.testimonials[this.currentIndex];
        
        // Simple fade out/in
        const contentArea = this.container.querySelector('.ct-text-container');
        contentArea.style.opacity = 0;
        contentArea.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            this.quoteEl.textContent = activeData.quote;
            this.nameEl.textContent = activeData.name;
            this.designationEl.textContent = activeData.designation;
            
            contentArea.style.opacity = 1;
            contentArea.style.transform = 'translateY(0)';
            
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }, 300);
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.updateClasses();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.updateClasses();
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            if (!this.isInteracting) {
                this.next();
            }
        }, 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    bindEvents() {
        const nextBtn = this.container.querySelector('.ct-next');
        const prevBtn = this.container.querySelector('.ct-prev');

        nextBtn.addEventListener('click', () => {
            this.isInteracting = true;
            this.next();
            this.startAutoplay(); // Reset timer
        });

        prevBtn.addEventListener('click', () => {
            this.isInteracting = true;
            this.prev();
            this.startAutoplay(); // Reset timer
        });

        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                this.isInteracting = true;
                this.currentIndex = parseInt(dot.dataset.index);
                this.updateClasses();
                this.startAutoplay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });

        // Swipe support
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const threshold = 50;
        if (this.touchStartX - this.touchEndX > threshold) {
            this.next(); // Swipe left -> Next
        } else if (this.touchEndX - this.touchStartX > threshold) {
            this.prev(); // Swipe right -> Prev
        }
    }
}
