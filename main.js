/* ==========================================================================
   Janhavi Vikas Thakare Portfolio - Interactive Micro-Interactions Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* --------------------------------------------------------------------------
       1. Downsized Fluid Cursor with Magnetic Aura
       -------------------------------------------------------------------------- */
    const cursorDot = document.getElementById('cursorDot');
    const cursorAura = document.getElementById('cursorAura');

    let mouseX = -100, mouseY = -100;
    let auraX = -100, auraY = -100;

    if (cursorDot && cursorAura) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate inner dot tracking
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth Lerp loop for aura
        const animateCursor = () => {
            auraX += (mouseX - auraX) * 0.18;
            auraY += (mouseY - auraY) * 0.18;
            
            cursorAura.style.left = `${auraX}px`;
            cursorAura.style.top = `${auraY}px`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Subtle hover state
        const hoverables = document.querySelectorAll('a, button, .tilt-card, .filter-btn, .topic-pill, .social-btn');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* --------------------------------------------------------------------------
       2. Vanilla 3D Tilt Card Interaction
       -------------------------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    /* --------------------------------------------------------------------------
       3. Mobile Navigation Menu Toggle
       -------------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            mobileMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    /* --------------------------------------------------------------------------
       4. Scroll Reveal Animations & Nav Link Active Highlighter
       -------------------------------------------------------------------------- */
    const fadeElements = document.querySelectorAll('.fade-in');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => revealObserver.observe(el));

    // Active Section Link Detection
    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Back to top button visibility
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'all';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        }
    });

    /* --------------------------------------------------------------------------
       5. Interactive Skill Category Filtering
       -------------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
       6. Form Submission Simulation & Toast Notification
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                showToast('Message Sent Successfully!', 'Thank you for reaching out. Janhavi will reply shortly.');
            }, 1200);
        });
    }

    /* --------------------------------------------------------------------------
       7. Back to Top Button
       -------------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* --------------------------------------------------------------------------
       8. Footer Current Year Auto-Update
       -------------------------------------------------------------------------- */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

/* Global Helpers */
function selectTopic(pillBtn, topicValue) {
    document.querySelectorAll('.topic-pill').forEach(btn => btn.classList.remove('active'));
    pillBtn.classList.add('active');
    
    const selectedInput = document.getElementById('selectedTopic');
    if (selectedInput) {
        selectedInput.value = topicValue;
    }
}

function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = btnElement.querySelector('i');
        const originalClass = icon.className;

        icon.className = 'fa-solid fa-check text-accent-cyan';

        showToast('Copied to Clipboard!', text);

        setTimeout(() => {
            icon.className = originalClass;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed: ', err);
    });
}

function showToast(title, message) {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    if (toast && toastTitle && toastMessage) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }
}
