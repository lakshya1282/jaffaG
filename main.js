// Data sets for the hero slider
// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5, // Floaty duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1, // Normal speed but floaty inertia
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

/* Old Hero Logic (Commented out)
const projectSets = [
    {
        mainBg: 'showcase 7.webp',
        card1: { img: 'showcase 3.webp', title: 'Project "Alpha"', desc: 'Premium Living Experience' },
        card2: { img: 'showcase6.webp', title: 'Project "Elite"', desc: 'Modern Architecture' }
    },
    ...
];
...
*/

// --- New Scroll Hero Implementation ---
const canvas = document.querySelector('#hero-canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 244;
const currentFrame = index => (
    `ezgif-2408ce3314ae05eb-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const heroData = {
    frame: 0
};

// Preload images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[heroData.frame];
    if (img && img.complete) {
        // Center-cover logic for canvas
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
}

// Ensure first frame renders
images[0].onload = render;

// Resize handling
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});

// Scroll Animation
gsap.registerPlugin(ScrollTrigger);

// Scroll Animation
gsap.registerPlugin(ScrollTrigger);

const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, 
    }
});

// Primary animation: Frames span the entire timeline duration (12)
heroTl.to(heroData, {
    frame: frameCount - 1,
    duration: 12,
    snap: "frame",
    ease: "none",
    onUpdate: render
});

// Phase 1: "It's called" shifts up and scales down to become eyebrow
heroTl.to(".hero-eyebrow", {
    fontSize: "clamp(0.8rem, 2vw, 1.2rem)",
    letterSpacing: "0.2rem",
    y: -20,
    duration: 3,
    ease: "power2.inOut"
}, 0.5);

// Phase 2: "JAFFA GROUPS" reveals and centers
heroTl.to(".hero-text-overlay .brand-title", {
    opacity: 1,
    y: 0,
    duration: 3,
    ease: "power3.out"
}, 1.5);

// Phase 3: Subtitle reveal
heroTl.to(".hero-text-overlay .brand-subtitle", {
    opacity: 1,
    y: 0,
    duration: 2,
    ease: "power3.out"
}, 3);

// Phase 4: Fade out text towards the end
heroTl.to(".hero-text-overlay", {
    opacity: 0,
    y: -100,
    duration: 3,
    ease: "power2.in"
}, 10);

// --- End New Scroll Hero Implementation ---

// Initial Kickoff
window.addEventListener('DOMContentLoaded', () => {
    // Initial reveal animation for navbar
    gsap.from(".navbar", { y: -50, opacity: 0, duration: 1, ease: "power3.out" });
    
    // The scroll-hero content is handled by ScrollTrigger now
});


// Mouse Parallax Effect for Canvas
window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 20; // Subtle movement
    const yPos = (clientY / window.innerHeight - 0.5) * 20;

    gsap.to("#hero-canvas", {
        x: xPos,
        y: yPos,
        duration: 2,
        ease: "power2.out"
    });
});

// Catalog Slider Logic
const catalogTrack = document.querySelector('#catalog-slider');
const catalogSlides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('#catalog-next');
const prevBtn = document.querySelector('#catalog-prev');

let catalogIndex = 0;
const catalogCount = catalogSlides.length;
const catalogAutoDelay = 5000;

function updateCatalogSlider() {
    const slideWidth = catalogSlides[0].offsetWidth + 32; // width + gap (2rem = 32px)
    gsap.to(catalogTrack, {
        x: -catalogIndex * slideWidth,
        duration: 0.8,
        ease: "power2.out"
    });

    // Update active slide state if needed
}

function nextCatalogSlide() {
    catalogIndex = (catalogIndex + 1) % (catalogCount - 1); // Showing 2 slides at a time
    if (window.innerWidth <= 1024) {
        catalogIndex = (catalogIndex + 1) % catalogCount;
    }
    updateCatalogSlider();
}

function prevCatalogSlide() {
    catalogIndex = (catalogIndex - 1 + catalogCount) % (catalogCount - 1);
    if (window.innerWidth <= 1024) {
        catalogIndex = (catalogIndex - 1 + catalogCount) % catalogCount;
    }
    updateCatalogSlider();
}

// Auto Slide
let catalogInterval = setInterval(nextCatalogSlide, catalogAutoDelay);

nextBtn.addEventListener('click', () => {
    clearInterval(catalogInterval);
    nextCatalogSlide();
    catalogInterval = setInterval(nextCatalogSlide, catalogAutoDelay);
});

prevBtn.addEventListener('click', () => {
    clearInterval(catalogInterval);
    prevCatalogSlide();
    catalogInterval = setInterval(nextCatalogSlide, catalogAutoDelay);
});

// Category Click
document.querySelectorAll('.category-list li').forEach(item => {
    item.addEventListener('click', (e) => {
        document.querySelector('.category-list li.active').classList.remove('active');
        e.target.classList.add('active');
        // Optionally switch image sets here
    });
});

// Handle resize to recalculate slider
window.addEventListener('resize', updateCatalogSlider);

// Steps Section Logic
const stepData = {
    Research: {
        text: "We begin by analyzing the site and client needs, ensuring every project is grounded in purpose and context.",
        img1: "step_research_1.png",
        img2: "step_research_2.png"
    },
    Concept: {
        text: "Developing the initial architectural vision, merging aesthetics with functional living requirements.",
        img1: "step_concept_1.png",
        img2: "step_concept_2.png"
    },
    Form: {
        text: "Refining the structural shape and volumes to achieve a perfect balance between art and utility.",
        img1: "step_form_1.png",
        img2: "step_form_2.png"
    },
    Visuals: {
        text: "Visualization translates ideas into clear, realistic visuals. It helps to understand space, proportions, and atmosphere before implementation.",
        img1: "step_visuals_1.png",
        img2: "step_visuals_2.png"
    },
    Completion: {
        text: "Bringing the vision to life with meticulous attention to detail and high-quality materials.",
        img1: "step_completion_1.png",
        img2: "step_completion_2.png"
    }
};

const stepButtons = document.querySelectorAll('.step-btn');
const stepDescription = document.querySelector('#step-description');
const stepImg1 = document.querySelector('#step-img-1');
const stepImg2 = document.querySelector('#step-img-2');

stepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active class
        stepButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content with GSAP fade
        const data = stepData[btn.dataset.step];
        
        // Timeline for synchronized transition
        const tl = gsap.timeline();

        tl.to([stepDescription, "#step-img-1", "#step-img-2"], {
            opacity: 0,
            y: 10,
            duration: 0.3,
            onComplete: () => {
                stepDescription.textContent = data.text;
                stepImg1.src = data.img1;
                stepImg2.src = data.img2;
                
                gsap.to([stepDescription, "#step-img-1", "#step-img-2"], {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: 0.1
                });
            }
        });
    });
});

// --- Project Showcase Animations ---
// 1. Entrance Staggered Slide
const showcaseCards = document.querySelectorAll('.showcase-card');

showcaseCards.forEach((card, index) => {
    const isLeft = card.classList.contains('slide-left');
    
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%", // Start animation when card is 85% from top
            toggleActions: "play none none none",
        },
        opacity: 1,
        x: 0,
        y: 0,
        startAt: { 
            x: isLeft ? -100 : 100, // Slide from left or right
            opacity: 0 
        },
        duration: 1.2,
        ease: "power3.out",
        delay: (index % 2) * 0.2 // Slight staggering between pairs
    });
});

// 2. Image Parallax
const parallaxImages = document.querySelectorAll('.card-parallax-container img');

parallaxImages.forEach(img => {
    gsap.to(img, {
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        yPercent: 20, // Move image down slightly (creates the "up" look when scrolling down)
        ease: "none"
    });
});

// 3. Filter Logic (Simple reveal)
const filterPills = document.querySelectorAll('.filter-pill');

filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        const category = pill.textContent;
        
        // Update pills
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        // Filter cards
        showcaseCards.forEach(card => {
            const cardCat = card.dataset.category;
            if (category === 'All' || cardCat === category) {
                gsap.to(card, { opacity: 1, scale: 1, display: 'flex', duration: 0.4 });
            } else {
                gsap.to(card, { opacity: 0, scale: 0.95, display: 'none', duration: 0.4 });
            }
        });
        
        ScrollTrigger.refresh();
    });
});

// --- Section 05: Park City Yellow Slide ---
gsap.from(".info-yellow-container", {
    scrollTrigger: {
        trigger: ".info-section-yellow",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    xPercent: 100,
    duration: 1.5,
    ease: "power4.out"
});

// --- Section 06: Project Form Feedback ---
const projectForm = document.querySelector('#projectForm');

if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = projectForm.querySelector('.btn-quote');
        const originalText = submitBtn.textContent;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = 'Project Request Sent!';
            submitBtn.style.backgroundColor = '#4CAF50'; // Success green
            submitBtn.style.color = '#ffffff';
            
            projectForm.reset();
            
            // Revert after 3 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
            }, 3000);
        }, 1500);
    });
}
