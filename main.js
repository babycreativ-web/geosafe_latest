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

// ===== 2. CUSTOM CURSOR & MAGNETIC EFFECT =====
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0
        });
    });

    // Custom lag for follower
    function animateCursor() {
        let distX = mouseX - ballX;
        let distY = mouseY - ballY;
        ballX = ballX + distX * 0.45; // Much faster
        ballY = ballY + distY * 0.45;

        follower.style.left = ballX - 20 + 'px';
        follower.style.top = ballY - 20 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover interactions
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card, .faq-question');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                scale: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 1)',
                duration: 0.3
            });
            cursor.style.display = 'none';
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                duration: 0.3
            });
            cursor.style.display = 'block';
        });
    });
}

// Magnetic Buttons Utility
const magneticElements = document.querySelectorAll('.btn-primary, .btn-outline, .logo');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
            x: x * 0.4,
            y: y * 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// ===== 3. BACKGROUND BLOB INTERACTION =====
const blob1 = document.getElementById('blob-1');
const blob2 = document.getElementById('blob-2');

window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPct = clientX / window.innerWidth;
    const yPct = clientY / window.innerHeight;

    gsap.to(blob1, {
        x: (xPct - 0.5) * 100,
        y: (yPct - 0.5) * 100,
        duration: 2,
        ease: "power2.out"
    });

    gsap.to(blob2, {
        x: (xPct - 0.5) * -150,
        y: (yPct - 0.5) * -150,
        duration: 3,
        ease: "power2.out"
    });
});

// ===== 4. GLOBAL SCROLL REVEALS =====
const revealElements = document.querySelectorAll('[data-reveal]');

revealElements.forEach((el) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none"
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Special stagger for grids
const grids = [
    { parent: '.services-grid', children: '.service-card' },
    { parent: '.portfolio-grid', children: '.project-card' },
    { parent: '.stats-grid', children: '.stat-item' }
];

grids.forEach(grid => {
    const parentEl = document.querySelector(grid.parent);
    if (parentEl) {
        gsap.from(grid.children, {
            scrollTrigger: {
                trigger: grid.parent,
                start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        });
    }
});

// ===== 5. ANIMATED COUNTERS =====
const counters = document.querySelectorAll('.stat-number');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    
    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        onEnter: () => {
            let count = { val: 0 };
            gsap.to(count, {
                val: target,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: () => {
                    counter.innerText = Math.floor(count.val);
                }
            });
        }
    });
});

// ===== 6. FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('open');
                gsap.to(otherItem.querySelector('.faq-answer'), { height: 0, duration: 0.4 });
            }
        });
        
        item.classList.toggle('open');
        gsap.to(answer, {
            height: isOpen ? 0 : "auto",
            duration: 0.4,
            ease: "power2.inOut"
        });
    });
});

// ===== 7. HEADER BLUR ON SCROLL =====
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Hide loader with fallback
const hideLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => loader.style.display = 'none'
        });
    }
};

window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 3000); // Fallback after 3s
