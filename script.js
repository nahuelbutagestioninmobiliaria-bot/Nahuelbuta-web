/* ============================================
   NAHUELBUTA GESTIÓN INMOBILIARIA
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---- Mobile Menu Toggle ----
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('open');
            document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Scroll Animations (Intersection Observer) ----
    const animatedElements = document.querySelectorAll('[data-animate]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    // ---- Counter Animation ----
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60;
        const duration = 1500;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, stepTime);
    }

    // ---- Property Filter ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            propertyCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });


    // ---- Modal System ----
    const modals = {
        about: {
            trigger: [document.getElementById('link-about'), document.getElementById('hero-about-link')],
            modal: document.getElementById('modal-about'),
            close: document.getElementById('close-about'),
            overlay: document.getElementById('overlay-about')
        },
        services: {
            trigger: [document.getElementById('link-services')],
            modal: document.getElementById('modal-services'),
            close: document.getElementById('close-services'),
            overlay: document.getElementById('overlay-services')
        },
        'project-tres-pinos': {
            trigger: [document.getElementById('btn-tres-pinos')],
            modal: document.getElementById('modal-project-tres-pinos'),
            close: document.getElementById('close-tres-pinos'),
            overlay: document.getElementById('overlay-tres-pinos')
        }
    };

    function openModal(id) {
        const m = document.getElementById(`modal-${id}`);
        if (m) {
            // Lazy load iframe if it's a project modal
            const iframe = m.querySelector('iframe[data-src]');
            if (iframe) {
                iframe.src = iframe.getAttribute('data-src');
            }

            // Populate Tres Pinos Data if it's the right modal
            if (id === 'project-tres-pinos' && window.TRES_PINOS_DATA) {
                populateTresPinosData();
                initializeMediaSuite();
            }

            m.style.display = 'flex';
            setTimeout(() => {
                m.classList.add('open');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(id) {
        const m = document.getElementById(`modal-${id}`);
        if (m) {
            m.classList.remove('open');
            setTimeout(() => {
                m.style.display = 'none';
                // Stop iframe from playing in background
                const iframe = m.querySelector('iframe');
                if (iframe && iframe.getAttribute('data-src')) {
                    iframe.src = 'about:blank';
                }
            }, 400);
            document.body.style.overflow = '';
        }
    }

    // Initialize Modal Events
    Object.keys(modals).forEach(key => {
        const item = modals[key];
        
        // Open
        if (item.trigger) {
            item.trigger.forEach(trigger => {
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        openModal(key);
                        // If mobile menu is open, close it
                        if (navLinksContainer.classList.contains('open')) {
                            navToggle.classList.remove('active');
                            navLinksContainer.classList.remove('open');
                        }
                    });
                }
            });
        }

        // Close via Button
        if (item.close) {
            item.close.addEventListener('click', () => closeModal(key));
        }

        // Close via Overlay
        if (item.overlay) {
            item.overlay.addEventListener('click', () => closeModal(key));
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Object.keys(modals).forEach(key => closeModal(key));
        }
    });

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            // Don't smooth scroll for modal triggers
            if (anchor.id === 'link-about' || anchor.id === 'link-services' || anchor.id === 'hero-about-link') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Contact Form Handler ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Enviando...
            `;
            submitBtn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    ¡Mensaje Enviado!
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ---- Parallax subtle effect on hero ----
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `scale(${1.05 + scrolled * 0.0001}) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }
    // ---- Tres Pinos Dynamic Population ----
    function initializeMediaSuite() {
        const mediaTabs = document.querySelectorAll('.media-tab');
        const mediaPanels = document.querySelectorAll('.media-panel');
        
        mediaTabs.forEach(tab => {
            tab.onclick = () => {
                const target = tab.getAttribute('data-target');
                mediaTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                mediaPanels.forEach(p => p.classList.remove('active'));
                document.getElementById(`panel-${target}`).classList.add('active');
            };
        });
    }

    function populateTresPinosData() {
        const data = window.TRES_PINOS_DATA;
        if (!data) return;

        // 1. Table
        const tableBody = document.getElementById('tres-pinos-inventory-body');
        if (tableBody) {
            tableBody.innerHTML = data.lots.map(lot => `
                <tr>
                    <td>${lot.id}</td>
                    <td>${lot.surface} m²</td>
                    <td class="status-${lot.status.toLowerCase()}">${lot.status}</td>
                </tr>
            `).join('');
        }

        // 2. Gallery
        const galleryGrid = document.getElementById('tres-pinos-gallery');
        if (galleryGrid && data.gallery) {
            galleryGrid.innerHTML = data.gallery.map(img => `
                <img src="${img.url}" alt="${img.alt}" class="gallery-photo" loading="lazy">
            `).join('');
        }

        // 3. Map
        const mapIframe = document.getElementById('tres-pinos-map');
        const mapBtnLink = document.getElementById('tres-pinos-map-link');
        if (mapIframe && data.mapUrl) mapIframe.src = data.mapUrl;
        if (mapBtnLink && data.mapLink) mapBtnLink.href = data.mapLink;
    }

});

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
