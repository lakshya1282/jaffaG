// Universal Navbar Hide-on-Scroll
// Works with or without GSAP — uses vanilla JS scroll detection
(function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const THRESHOLD = 80; // px scrolled before hiding kicks in

    function onScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > THRESHOLD && currentScrollY > lastScrollY) {
            // Scrolling DOWN past threshold → hide
            navbar.classList.add('navbar--hidden');
        } else {
            // Scrolling UP or near top → show
            navbar.classList.remove('navbar--hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
})();
