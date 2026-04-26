// --- Shared Mobile Hamburger Menu Toggle ---
(function () {
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    if (!hamburgerBtn || !mobileNavOverlay) return;

    function closeMobileNav() {
        hamburgerBtn.classList.remove('open');
        mobileNavOverlay.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    var mobileNavInner = mobileNavOverlay.querySelector('.mobile-nav-inner');
    var closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-nav-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close navigation menu');
    closeBtn.innerHTML = '<span></span><span></span>';

    if (mobileNavInner) {
        mobileNavInner.insertBefore(closeBtn, mobileNavInner.firstChild);
    }

    hamburgerBtn.addEventListener('click', function () {
        var isOpen = hamburgerBtn.classList.toggle('open');
        mobileNavOverlay.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    closeBtn.addEventListener('click', closeMobileNav);

    mobileNavOverlay.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMobileNav);
    });
})();
