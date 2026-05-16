// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ===== 1. SMOOTH SCROLL (Lenis) =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical'
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ===== 2. CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate dot
        gsap.set(cursorDot, { x: mouseX, y: mouseY });
    });

    // Lagged ring
    function animateCursorRing() {
        let distX = mouseX - ringX;
        let distY = mouseY - ringY;
        ringX = ringX + distX * 0.2;
        ringY = ringY + distY * 0.2;

        gsap.set(cursorRing, { x: ringX, y: ringY });
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();
}

// ===== 3. GSAP ANIMATIONS =====

// Hide loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        gsap.to(loader, {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut",
            delay: 0.5,
            onComplete: () => {
                loader.style.display = 'none';
            }
        });
    }

    // Hero Reveal
    gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        delay: 1.5,
        ease: "power4.out"
    });
});

// Section Global Reveals
const revealUps = document.querySelectorAll('.reveal-up');
revealUps.forEach((el) => {
    gsap.fromTo(el, 
        { y: 80, opacity: 0 },
        {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
        }
    );
});

// Staggered Grids
const staggerContainers = document.querySelectorAll('.reveal-stagger');
staggerContainers.forEach(container => {
    const children = container.children;
    gsap.fromTo(children, 
        { y: 60, opacity: 0 },
        {
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        }
    );
});

// Hero Parallax
gsap.to('.hero-bg', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    yPercent: 30,
    ease: 'none'
});

// Header Scrolled State
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        header.classList.remove('hero-dark-context');
    } else {
        header.classList.remove('scrolled');
        header.classList.add('hero-dark-context');
    }
});
