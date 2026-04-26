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
    duration: 600,
    once: true,
    offset: 80,
    easing: 'ease-out',
    disable: window.innerWidth < 768 ? true : false
});

// --- New Scroll Hero Implementation ---
const canvas = document.querySelector('#hero-canvas');
const context = canvas.getContext('2d');

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 244;
    const currentFrame = index => (
        `ezgif-2408ce3314ae05eb-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    const heroData = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        let targetFrame = Math.round(heroData.frame);
        let img = images[targetFrame];
        if (!img || !img.complete) {
            for (let i = targetFrame - 1; i >= 0; i--) {
                if (images[i] && images[i].complete) { img = images[i]; break; }
            }
        }
        if (img && img.complete) {
            const imgRatio = img.width / img.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width; drawHeight = canvas.width / imgRatio;
                offsetX = 0; offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgRatio; drawHeight = canvas.height;
                offsetX = (canvas.width - drawWidth) / 2; offsetY = 0;
            }
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    }

    if (images[0]) images[0].onload = render;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        render(); ScrollTrigger.refresh();
    });

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);

    const heroScrollDistance = frameCount * 28;
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-hero", start: "top top", end: `+=${heroScrollDistance}`,
            pin: true, scrub: true, anticipatePin: 1,
        }
    });

    heroTl.to(heroData, { frame: frameCount - 1, duration: 11.5, snap: "frame", ease: "none", onUpdate: render });
    heroTl.to(".hero-eyebrow", { fontSize: "clamp(0.8rem, 2vw, 1.2rem)", letterSpacing: "0.2rem", y: -150, duration: 3, ease: "power2.inOut" }, 0.5);
    heroTl.to(".hero-text-overlay .brand-title", { opacity: 1, y: 0, duration: 3, ease: "power3.out" }, 1.5);
    heroTl.to(".hero-text-overlay .brand-subtitle", { opacity: 1, y: 0, duration: 2, ease: "power3.out" }, 3);
    heroTl.to(".hero-text-overlay", { opacity: 0, y: -100, duration: 3, ease: "power2.in" }, 10);
}

// Initial Kickoff
window.addEventListener('DOMContentLoaded', () => {
    gsap.from(".navbar", { y: -50, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform,opacity" });
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        ScrollTrigger.create({
            start: 'top top', end: 'max',
            onUpdate: (self) => {
                if (self.direction === 1 && self.scroll() > 100) navbar.classList.add('navbar--hidden');
                else if (self.direction === -1 || self.scroll() <= 100) navbar.classList.remove('navbar--hidden');
            }
        });
    }
});

// Mouse Parallax
window.addEventListener('mousemove', (e) => {
    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to("#hero-canvas", { x: xPos, y: yPos, duration: 2, ease: "power2.out" });
});

// Catalog Slider Logic
const catalogTrack = document.querySelector('#catalog-slider');
const catalogSlides = document.querySelectorAll('.slide');
if (catalogTrack && catalogSlides.length > 0) {
    let catalogIndex = 0;
    const catalogCount = catalogSlides.length;
    function updateCatalogSlider() {
        const slideWidth = catalogSlides[0].offsetWidth + 32;
        gsap.to(catalogTrack, { x: -catalogIndex * slideWidth, duration: 0.8, ease: "power2.out" });
    }
    const nextBtn = document.querySelector('#catalog-next');
    const prevBtn = document.querySelector('#catalog-prev');
    if (nextBtn) nextBtn.addEventListener('click', () => { catalogIndex = (catalogIndex + 1) % (catalogCount - 1); updateCatalogSlider(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { catalogIndex = (catalogIndex - 1 + catalogCount) % (catalogCount - 1); updateCatalogSlider(); });

    // Handle resize to recalculate slider
    window.addEventListener('resize', updateCatalogSlider);
}

// Steps Section Logic: Pinned Scroll Sequence + Annotations
const stepData = {
    Research: {
        text: "We begin by analyzing the site and client needs, ensuring every project is grounded in purpose and context.",
        img1: "png cutout for 3d/step_research_1.png",
        img2: "png cutout for 3d/step_research_2.png",
        ann1: [{ label: "Analyzing Topography", x: 25, y: 15, side: "left" }, { label: "Site Access", x: 45, y: 75, side: "left" }],
        ann2: [{ label: "Preserved Vegetation", x: 70, y: 25, side: "right" }, { label: "Sun Path Study", x: 55, y: 10, side: "right" }]
    },
    Concept: {
        text: "Developing the architecture vision, merging aesthetics with functional living requirements.",
        img1: "png cutout for 3d/step_concept_1.png",
        img2: "png cutout for 3d/step_concept_2.png",
        ann1: [{ label: "Initial Massing", x: 30, y: 30, side: "left" }],
        ann2: [{ label: "Visual Axis", x: 65, y: 40, side: "right" }]
    },
    Form: {
        text: "Refining the structural shape and volumes to achieve a perfect balance between art and utility.",
        img1: "png cutout for 3d/step_form_1.png",
        img2: "png cutout for 3d/step_form_2.png",
        ann1: [{ label: "Structural Skeleton", x: 35, y: 20, side: "left" }],
        ann2: [{ label: "Terraced Foundation", x: 60, y: 70, side: "right" }]
    },
    Visuals: {
        text: "Visualization translates ideas into realistic visuals, helping to understand space before implementation.",
        img1: "png cutout for 3d/step_visuals_1.png",
        img2: "png cutout for 3d/step_visuals_2.png",
        ann1: [{ label: "Lighting Calculation", x: 20, y: 15, side: "left" }],
        ann2: [{ label: "Material Texture", x: 75, y: 45, side: "right" }]
    },
    Completion: {
        text: "Bringing the vision to life with meticulous attention to detail and high-quality materials.",
        img1: "png cutout for 3d/step_completion_1.png",
        img2: "png cutout for 3d/step_completion_2.png",
        ann1: [{ label: "Premium Finishes", x: 40, y: 35, side: "left" }],
        ann2: [{ label: "Turnkey Ready", x: 60, y: 20, side: "right" }]
    }
};

const stepKeys = Object.keys(stepData);
const stepButtons = document.querySelectorAll('.step-btn');
const stepDescription = document.querySelector('#step-description');
const stepImg1 = document.querySelector('#step-img-1');
const stepImg2 = document.querySelector('#step-img-2');
const annContainer1 = document.querySelector('#annotations-1');
const annContainer2 = document.querySelector('#annotations-2');
let currentStepIndex = -1;

function clearAnnotations() {
    if (annContainer1) annContainer1.innerHTML = '';
    if (annContainer2) annContainer2.innerHTML = '';
}

function createAnnotation(container, data) {
    if (!container) return;
    const isRight = data.side === "right";
    const wrapper = document.createElement('div');
    wrapper.className = 'annotation-wrapper';
    
    // Label
    const label = document.createElement('div');
    label.className = 'annotation-label';
    label.textContent = data.label;
    label.style.left = isRight ? `${data.x + 10}%` : `${data.x - 20}%`;
    label.style.top = `${data.y - 5}%`;
    
    // SVG Line
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.className = "annotation-svg";
    svg.style.position = "absolute";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.top = "0";
    svg.style.left = "0";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const tipX = data.x;
    const tipY = data.y;
    const elbowX = isRight ? tipX + 8 : tipX - 8;
    const endX = isRight ? tipX + 15 : tipX - 15;
    
    path.setAttribute("d", `M ${endX} ${tipY} L ${elbowX} ${tipY} L ${tipX} ${tipY}`);
    path.className = "annotation-line";
    
    svg.appendChild(path);
    container.appendChild(label);
    container.appendChild(svg);

    // Animate
    gsap.to(path, { strokeDashoffset: 0, duration: 1, ease: "power2.out", delay: 0.5 });
    gsap.to(label, { opacity: 1, y: 0, duration: 0.8, delay: 0.7 });
}

function updateStepContent(index) {
    if (index === currentStepIndex) return;
    currentStepIndex = index;
    const data = stepData[stepKeys[index]];

    stepButtons.forEach((btn, i) => btn.classList.toggle('active', i === index));

    const tl = gsap.timeline();
    tl.to([stepDescription, stepImg1, stepImg2, annContainer1, annContainer2], {
        opacity: 0, y: 20, duration: 0.3,
        onComplete: () => {
            if (stepDescription) stepDescription.textContent = data.text;
            if (stepImg1) stepImg1.src = data.img1;
            if (stepImg2) stepImg2.src = data.img2;
            clearAnnotations();
            
            if (data.ann1) data.ann1.forEach(ann => createAnnotation(annContainer1, ann));
            if (data.ann2) data.ann2.forEach(ann => createAnnotation(annContainer2, ann));

            gsap.to([stepDescription, stepImg1, stepImg2, annContainer1, annContainer2], {
                opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out"
            });
        }
    });
}

if (window.innerWidth > 1024) {
    const stepsSection = document.querySelector('.steps-section');
    if (stepsSection) {
        ScrollTrigger.create({
            trigger: ".steps-section", start: "top top", end: "+=2500", pin: true, scrub: true, anticipatePin: 1,
            onUpdate: (self) => {
                const index = Math.min(Math.floor(self.progress * stepKeys.length), stepKeys.length - 1);
                updateStepContent(index);
            }
        });

        stepButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const st = ScrollTrigger.getAll().find(s => s.trigger && s.trigger.classList && s.trigger.classList.contains('steps-section'));
                if (st) {
                    const scrollPos = st.start + (index / (stepKeys.length - 1)) * (st.end - st.start);
                    window.scrollTo({ top: scrollPos + 5, behavior: 'smooth' });
                }
            });
        });
    }
}

// --- Showcase Slider & Parallax Logic ---
const showcaseTrack = document.querySelector('#showcase-track');
const showcaseCards = document.querySelectorAll('.showcase-card');
const showcasePrev = document.querySelector('#showcase-prev');
const showcaseNext = document.querySelector('#showcase-next');
let showcaseIndex = 0;

if (showcaseTrack && showcaseCards.length > 0) {
    const totalCards = showcaseCards.length;

    function getVisibleCards() {
        if (window.innerWidth <= 1024) return 1;
        return 3; // Show ~3 cards
    }

    function updateShowcaseSlider() {
        const cardWidth = showcaseCards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(showcaseTrack).gap) || 48;
        const moveAmount = showcaseIndex * (cardWidth + gap);

        gsap.to(showcaseTrack, {
            x: -moveAmount,
            duration: 1.2,
            ease: "power4.out",
            onUpdate: applyShowcaseParallax
        });
    }

    function applyShowcaseParallax() {
        showcaseCards.forEach((card) => {
            const img = card.querySelector('img');
            if (!img) return;

            // Get card's position relative to the track's parent (the wrapper)
            const rect = card.getBoundingClientRect();
            const wrapperRect = showcaseTrack.parentElement.getBoundingClientRect();
            
            // Calculate how far the card is across the viewport (0 to 1)
            const centerX = rect.left + rect.width / 2;
            const viewportWidth = window.innerWidth;
            const progress = (centerX / viewportWidth) - 0.5; // -0.5 (left) to 0.5 (right)

            // Parallax: Opposite direction
            const parallaxRange = 30; // Increased from 15 for more intense shift
            gsap.set(img, { xPercent: progress * parallaxRange * 2 });
        });
    }

    if (showcaseNext) {
        showcaseNext.addEventListener('click', () => {
            const visible = getVisibleCards();
            if (showcaseIndex < totalCards - visible) {
                showcaseIndex++;
                updateShowcaseSlider();
            } else {
                // Loop back to start or bounce
                gsap.to(showcaseTrack, { x: "+=20", duration: 0.2, yoyo: true, repeat: 1 });
            }
        });
    }

    if (showcasePrev) {
        showcasePrev.addEventListener('click', () => {
            if (showcaseIndex > 0) {
                showcaseIndex--;
                updateShowcaseSlider();
            } else {
                gsap.to(showcaseTrack, { x: "-=20", duration: 0.2, yoyo: true, repeat: 1 });
            }
        });
    }

    // Initial parallax call
    applyShowcaseParallax();
    
    // Add ScrollTrigger to trigger parallax even when just scrolling the page
    ScrollTrigger.create({
        trigger: ".showcase-section",
        start: "top bottom",
        end: "bottom top",
        onUpdate: applyShowcaseParallax
    });

    window.addEventListener('resize', () => {
        showcaseIndex = 0;
        updateShowcaseSlider();
    });
}

// Filter Logic for Showcase (Updated for Carousel)
const filterPills = document.querySelectorAll('.filter-pill');
filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        const category = pill.textContent;
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        showcaseIndex = 0; // Reset slider position on filter

        showcaseCards.forEach(card => {
            const cardCat = card.dataset.category;
            if (category === 'All' || cardCat === category || category === 'Villas' && cardCat === 'Villas') {
                // For simplicity in this demo, I'll just adjust opacity/scale
                // A full filtered carousel usually requires rebuilding the track
                gsap.to(card, { opacity: 1, scale: 1, display: 'block', duration: 0.4 });
            } else {
                gsap.to(card, { opacity: 0.2, scale: 0.9, duration: 0.4 });
            }
        });
        
        updateShowcaseSlider();
    });
});


const testimonialData = [
    { quote: "JAFFA GROUPS transformed our vision into a breathtaking reality. Their attention to detail and commitment to 'Quiet Luxury' is unparalleled.", name: "Sarah Jenkins", designation: "Homeowner, Park City", src: "Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 7.webp" },
    { quote: "The seamless integration of modern architecture with the natural landscape is what truly sets them apart. A masterpiece in every sense.", name: "Michael Chen", designation: "Real Estate Investor", src: "Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 2.webp" },
    { quote: "From the initial research to completion, the process was professional and inspiring. They don't just build houses; they create environments.", name: "Elena Rodriguez", designation: "Architectural Critic", src: "Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 3.webp" },
    { quote: "The best architectural firm I've worked with. Their ability to balance function and visual calm is truly world-class.", name: "David Thompson", designation: "Developer", src: "Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 4 .webp" }
];

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CircularTestimonials !== 'undefined') {
        new CircularTestimonials('circular-testimonials', testimonialData);
    }
});
