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
            // Populate Tres Pinos Data if it's the right modal
            if (id === 'project-tres-pinos' && window.TRES_PINOS_DATA) {
                populateTresPinosData();
            }

            // Lazy load iframes (except technical ones like youtube that we handle on click)
            const iframes = m.querySelectorAll('iframe[data-src]:not(#project-youtube-iframe)');
            iframes.forEach(iframe => {
                iframe.src = iframe.getAttribute('data-src');
            });

            // Initialize carousel after data is populated
            if (id === 'project-tres-pinos') {
                setTimeout(() => initCarousel(), 100);
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
                // Stop iframes from playing in background
                const iframes = m.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    if (iframe.getAttribute('data-src')) {
                        iframe.src = 'about:blank';
                    }
                });
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

    // ---- Interaction: Tres Pinos card tap opens detail ----
    const tresPinosCard = document.getElementById('card-tres-pinos');
    if (tresPinosCard) {
        tresPinosCard.style.cursor = 'pointer';
        tresPinosCard.addEventListener('click', (e) => {
            // Check if clicking the button itself to prevent double trigger or conflict
            if (e.target.id === 'btn-tres-pinos') return;
            
            e.preventDefault();
            e.stopPropagation();
            openModal('project-tres-pinos');
        });
    }

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
    // initializeMediaSuite is no longer needed as we move to a scroll-based layout
    // for project details, but keeping the signature if needed for other modals in future.
    function initializeMediaSuite() {
        // Obsolete for current design
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

        // 2. Gallery — Carousel
        const carouselTrack = document.getElementById('carousel-track');
        const carouselDots = document.getElementById('carousel-dots');
        if (carouselTrack && data.gallery) {
            carouselTrack.innerHTML = data.gallery.map((img, i) => `
                <div class="carousel-slide ${i === 0 ? 'active' : ''}">
                    <img src="${img.url}" alt="${img.alt}" loading="lazy">
                    <div class="carousel-caption">${img.alt}</div>
                </div>
            `).join('');

            if (carouselDots) {
                carouselDots.innerHTML = data.gallery.map((_, i) => `
                    <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ir a foto ${i + 1}"></button>
                `).join('');
            }
        }

        // 3. Map
        const mapIframe = document.getElementById('tres-pinos-map');
        const mapBtnLink = document.getElementById('tres-pinos-map-link');
        if (mapIframe && data.mapUrl) mapIframe.src = data.mapUrl;
        if (mapBtnLink && data.mapLink) mapBtnLink.href = data.mapLink;

        // 4. Video
        const videoIframe = document.getElementById('project-youtube-iframe');
        const videoSection = document.getElementById('section-video');
        const videoCover = document.getElementById('video-cover');
        
        if (videoIframe && data.videoUrl) {
            // Extract Youtube ID for thumbnail
            const videoId = data.videoUrl.split('/').pop().split('?')[0];
            if (videoCover) {
                videoCover.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
                videoCover.style.display = 'flex';
                
                // Click to play
                videoCover.onclick = () => {
                    videoCover.style.display = 'none';
                    videoIframe.style.display = 'block';
                    // Load with autoplay
                    const autoplayUrl = data.videoUrl.includes('?') 
                        ? `${data.videoUrl}&autoplay=1` 
                        : `${data.videoUrl}?autoplay=1`;
                    videoIframe.src = autoplayUrl;
                };
            }
            
            videoIframe.setAttribute('data-src', data.videoUrl);
            videoIframe.style.display = 'none'; // Ensure hidden initially
            
            if (videoSection) videoSection.style.display = 'block';
        } else if (videoSection) {
            videoSection.style.display = 'none';
        }

        // 5. 360 Tour Interaction Logic
        const tourOverlay = document.getElementById('tour-overlay');
        const tourShell = document.querySelector('.media-shell-tour');
        if (tourOverlay && tourShell) {
            // Reset state
            tourOverlay.classList.remove('hidden');
            tourShell.classList.remove('tour-active');

            tourOverlay.onclick = (e) => {
                e.stopPropagation();
                tourOverlay.classList.add('hidden');
                tourShell.classList.add('tour-active');
            };
        }
    }

    // ---- Premium Carousel System ----
    let currentSlide = 0;
    let totalSlides = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoplayInterval = null;

    function initCarousel() {
        const track = document.getElementById('carousel-track');
        if (!track) return;

        const slides = track.querySelectorAll('.carousel-slide');
        totalSlides = slides.length;
        currentSlide = 0;

        if (totalSlides === 0) return;

        // Navigation buttons
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        if (prevBtn) {
            prevBtn.onclick = () => {
                goToSlide(currentSlide - 1);
                resetAutoplay();
            };
        }
        if (nextBtn) {
            nextBtn.onclick = () => {
                goToSlide(currentSlide + 1);
                resetAutoplay();
            };
        }

        // Dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach(dot => {
            dot.onclick = () => {
                goToSlide(parseInt(dot.getAttribute('data-index')));
                resetAutoplay();
            };
        });

        // Touch/Swipe support
        const wrapper = document.getElementById('tres-pinos-gallery');
        if (wrapper) {
            wrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            wrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('modal-project-tres-pinos');
            if (!modal || !modal.classList.contains('open')) return;
            // Only respond if photos panel is active
            const photosPanel = document.getElementById('panel-photos');
            if (!photosPanel || !photosPanel.classList.contains('active')) return;

            if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
        });

        // Autoplay
        startAutoplay();

        goToSlide(0);
    }

    function goToSlide(index) {
        const track = document.getElementById('carousel-track');
        if (!track) return;

        const slides = track.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;

        // Wrap around
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        // Remove active from all
        slides.forEach(s => s.classList.remove('active'));
        
        // Set new slide
        currentSlide = index;
        slides[currentSlide].classList.add('active');

        // Update transform (sliding animation)
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

        // Update counter
        const counter = document.getElementById('carousel-counter');
        if (counter) counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }

    function handleSwipe() {
        const threshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSlide(currentSlide + 1); // Swipe left → next
            } else {
                goToSlide(currentSlide - 1); // Swipe right → prev
            }
            resetAutoplay();
        }
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // ---- Search & Filter Logic ----
    const searchInput = document.getElementById('hero-search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const searchBtn = document.getElementById('hero-search-btn');
    
    // Sample property data for search
    const searchableItems = [
        { title: 'Proyecto Tres Pinos', location: 'Los Álamos', category: 'terrenos', id: 'project-tres-pinos', price: '$15.000.000' },
        { title: 'Parcela 5.000 m²', location: 'Cañete', category: 'terrenos', price: 'UF 1.200' },
        { title: 'Casa Moderna 220 m²', location: 'Lebu', category: 'casas', price: 'UF 4.800' },
        { title: 'Galpón Industrial', location: 'Horcones', category: 'industrial', price: 'A convenir' },
        { title: 'Local Comercial', location: 'Centro Lebu', category: 'comercial', price: 'UF 18/mes' },
        { title: 'Loteo Forestal', location: 'Los Álamos', category: 'terrenos', price: 'UF 450' }
    ];

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            if (val.length < 1) {
                searchSuggestions.style.display = 'none';
                return;
            }

            const matches = searchableItems.filter(item => 
                item.title.toLowerCase().includes(val) || 
                item.location.toLowerCase().includes(val)
            ).slice(0, 5);

            if (matches.length > 0) {
                searchSuggestions.innerHTML = matches.map(item => `
                    <div class="suggestion-item" data-id="${item.id || ''}" data-filter="${item.category}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
                        <span><strong>${item.title}</strong> - ${item.location}</span>
                    </div>
                `).join('');
                searchSuggestions.style.display = 'block';
            } else {
                searchSuggestions.style.display = 'none';
            }
        });

        // Click on suggestion
        searchSuggestions.addEventListener('click', (e) => {
            const item = e.target.closest('.suggestion-item');
            if (item) {
                const modalId = item.getAttribute('data-id');
                const filter = item.getAttribute('data-filter');
                
                if (modalId) {
                    openModal(modalId);
                } else {
                    // Scroll to properties and filter
                    const propsSection = document.getElementById('properties');
                    if (propsSection) {
                        const offset = navbar.offsetHeight + 20;
                        window.scrollTo({ top: propsSection.offsetTop - offset, behavior: 'smooth' });
                        // Trigger filter button
                        const filterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
                        if (filterBtn) filterBtn.click();
                    }
                }
                searchInput.value = item.querySelector('span').textContent.split(' - ')[0];
                searchSuggestions.style.display = 'none';
            }
        });

        // Hide suggestions on outside click
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });

        // Search button click
        searchBtn.addEventListener('click', () => {
            const val = searchInput.value;
            if (val) {
                const propsSection = document.getElementById('properties');
                if (propsSection) {
                    const offset = navbar.offsetHeight + 20;
                    window.scrollTo({ top: propsSection.offsetTop - offset, behavior: 'smooth' });
                }
            }
        });
    }

    // ---- Featured Properties Carousel Logic (Hero Integrated) ----
    const fcTrack = document.getElementById('fc-track');
    const fcPrev = document.getElementById('fc-prev');
    const fcNext = document.getElementById('fc-next');
    const fcDotsContainer = document.getElementById('fc-dots');
    const fcCards = document.querySelectorAll('.fc-card');
    
    if (fcTrack && fcCards.length > 0) {
        let fcIndex = 0;
        let autoplayActive = true;
        
        // Setup Dots
        fcCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('fc-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                fcIndex = i;
                updateFC();
                resetFCAutoplay();
            });
            fcDotsContainer.appendChild(dot);
        });
        
        const fcDots = document.querySelectorAll('.fc-dot');
        
        function updateFC() {
            const isMobile = window.innerWidth <= 768;
            const gap = 24;
            const cardWidth = fcCards[0].offsetWidth + gap;
            
            // On mobile, card width might vary, but centered logic helps
            const containerWidth = fcTrack.parentElement.offsetWidth;
            const maxScroll = fcTrack.scrollWidth - containerWidth;
            
            let offset = fcIndex * cardWidth;
            if (offset > maxScroll) offset = maxScroll;
            if (offset < 0) offset = 0;
            
            fcTrack.style.transform = `translateX(-${offset}px)`;
            
            // Update dots
            fcDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === fcIndex);
            });
        }
        
        fcNext.addEventListener('click', () => {
            fcIndex++;
            if (fcIndex >= fcCards.length) fcIndex = 0;
            updateFC();
            resetFCAutoplay();
        });
        
        fcPrev.addEventListener('click', () => {
            fcIndex--;
            if (fcIndex < 0) fcIndex = fcCards.length - 1;
            updateFC();
            resetFCAutoplay();
        });
        
        // Autoplay
        let fcAutoplay = setInterval(() => {
            if (autoplayActive) {
                fcIndex++;
                if (fcIndex >= fcCards.length) fcIndex = 0;
                updateFC();
            }
        }, 5000);
        
        function resetFCAutoplay() {
            clearInterval(fcAutoplay);
            fcAutoplay = setInterval(() => {
                if (autoplayActive) {
                    fcIndex++;
                    if (fcIndex >= fcCards.length) fcIndex = 0;
                    updateFC();
                }
            }, 5000);
        }
        
        // Pause on hover
        fcTrack.parentElement.addEventListener('mouseenter', () => autoplayActive = false);
        fcTrack.parentElement.addEventListener('mouseleave', () => autoplayActive = true);

        // Modal triggers for fc-cards (handles clicks on info or image)
        fcCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // If it's a specific link inside, let it bubble if needed, but here they both open details
                const modalId = card.getAttribute('data-modal');
                if (modalId) {
                    openModal(modalId);
                } else {
                    // Default behavior for other cards: scroll to properties
                    const propsSection = document.getElementById('properties');
                    if (propsSection) {
                        const offset = navbar.offsetHeight + 20;
                        window.scrollTo({ top: propsSection.offsetTop - offset, behavior: 'smooth' });
                    }
                }
            });
        });

        // Drag support simplified for hero carousel
        let isDown = false;
        let startX;
        let scrollLeft;

        fcTrack.parentElement.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - fcTrack.offsetLeft;
            fcTrack.style.transition = 'none';
        });
        fcTrack.parentElement.addEventListener('mouseleave', () => isDown = false);
        fcTrack.parentElement.addEventListener('mouseup', () => {
            isDown = false;
            fcTrack.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            const cardWidth = fcCards[0].offsetWidth + 24;
            const currentOffset = Math.abs(parseInt(fcTrack.style.transform.replace('translateX(-', '').replace('px)', '')) || 0);
            fcIndex = Math.round(currentOffset / cardWidth);
            updateFC();
        });
        
        window.addEventListener('resize', updateFC);
        setTimeout(updateFC, 200); // Wait for layout
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
