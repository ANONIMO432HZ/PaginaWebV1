/**
 * IESTP Huanta - Script Principal y Cargador Modular de Componentes
 * Replica fiel, interactiva y modular de https://iesphuanta.edu.pe/
 */

// ==========================================
// 1. CARGADOR MODULAR DE COMPONENTES
// ==========================================
async function loadComponent(element) {
    const file = element.getAttribute('data-include');
    if (!file) return;

    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} al cargar ${file}`);
        }
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(`[ComponentLoader] Error cargando ${file}:`, error);
        if (window.location.protocol === 'file:') {
            showFileProtocolWarning();
        }
    }
}

function showFileProtocolWarning() {
    if (document.getElementById('cors-warning')) return;
    const banner = document.createElement('div');
    banner.id = 'cors-warning';
    banner.className = 'bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-4 m-4 rounded-xl shadow-md text-sm sticky top-0 z-50';
    banner.innerHTML = `
        <strong>Aviso de Arquitectura (CORS):</strong> 
        Estás abriendo la página directamente con el protocolo <code>file://</code>. Los navegadores bloquean la carga de componentes externos con <code>fetch</code> en archivos locales. 
        Para visualizar todos los componentes cargados, ejecuta un servidor local (por ejemplo con <em>Live Server</em> de VS Code o <code>npx serve .</code>).
    `;
    document.body.prepend(banner);
}

// ==========================================
// 2. CONTROL DE PESTAÑAS (MISIÓN, VISIÓN, VALORES)
// ==========================================
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('tab-' + tabId);
    if (target) {
        target.classList.remove('hidden');
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('shadow-brand', 'bg-gradient-brand', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });

    const activeBtn = document.getElementById('tab-btn-' + tabId);
    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-100', 'text-slate-700');
        activeBtn.classList.add('shadow-brand', 'bg-gradient-brand', 'text-white');
    }
};

// ==========================================
// 3. SLIDER HERO INTERACTIVO (SLIDER REVOLUTION STYLE)
// ==========================================
let currentSlide = 1;
let sliderInterval = null;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const sliderContainer = document.getElementById('hero-slider');

    if (!slides.length) return;

    function goToSlide(n) {
        slides.forEach(s => {
            s.classList.remove('opacity-100', 'active', 'pointer-events-auto');
            s.classList.add('opacity-0', 'pointer-events-none');
        });

        dots.forEach(d => {
            d.classList.remove('w-8', 'bg-purple-500');
            d.classList.add('w-2.5', 'bg-white/40');
        });

        const activeSlide = document.querySelector(`.hero-slide[data-slide="${n}"]`);
        const activeDot = document.querySelector(`.slider-dot[data-index="${n}"]`);

        if (activeSlide) {
            activeSlide.classList.remove('opacity-0', 'pointer-events-none');
            activeSlide.classList.add('opacity-100', 'active', 'pointer-events-auto');
        }

        if (activeDot) {
            activeDot.classList.remove('w-2.5', 'bg-white/40');
            activeDot.classList.add('w-8', 'bg-purple-500');
        }

        currentSlide = n;
    }

    function nextSlide() {
        const next = currentSlide >= slides.length ? 1 : currentSlide + 1;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = currentSlide <= 1 ? slides.length : currentSlide - 1;
        goToSlide(prev);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            goToSlide(idx);
            resetTimer();
        });
    });

    function startTimer() {
        sliderInterval = setInterval(nextSlide, 7000);
    }

    function resetTimer() {
        clearInterval(sliderInterval);
        startTimer();
    }

    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(sliderInterval));
        sliderContainer.addEventListener('mouseleave', startTimer);
    }

    startTimer();
}

// ==========================================
// 4. MODAL DE VIDEO INSTITUCIONAL
// ==========================================
function initVideoModal() {
    const openBtn = document.getElementById('open-video-modal');
    const closeBtn = document.getElementById('close-video-modal');
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('institution-video');

    if (!modal) return;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            if (video) video.play().catch(() => {});
        });
    }

    function closeModal() {
        modal.classList.add('hidden');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// ==========================================
// 5. LIGHTBOX DE GALERÍA
// ==========================================
window.openLightbox = function(src, caption) {
    const lightbox = document.getElementById('gallery-lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    if (!lightbox || !img) return;

    img.src = src;
    if (cap) cap.textContent = caption || '';
    lightbox.classList.remove('hidden');
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) lightbox.classList.add('hidden');
};

function initLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) window.closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                window.closeLightbox();
            }
        });
    }
}

// ==========================================
// 6. CONTADORES NUMÉRICOS ANIMADOS
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.counter-val');
    if (!counters.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    if (isNaN(target)) return;

                    let current = 0;
                    const duration = 2000;
                    const stepTime = Math.max(Math.floor(duration / target), 10);
                    const increment = Math.max(Math.ceil(target / (duration / stepTime)), 1);

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = current;
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('estadisticas');
    if (statsSection) observer.observe(statsSection);
}

// ==========================================
// 7. FORMULARIO DE CONTACTO
// ==========================================
window.handleContactSubmit = function(form) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';
    }

    setTimeout(() => {
        alert('¡Gracias por comunicarte con el IESTP Huanta! Hemos recibido tu solicitud y un asesor académico se pondrá en contacto contigo.');
        form.reset();
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }, 800);
};

// ==========================================
// 8. INTERACCIONES GENERALES (NAVBAR, SCROLL)
// ==========================================
function initInteractions() {
    // Menú Móvil
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#mobile-menu-btn');
        if (toggleBtn) {
            const menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.toggle('hidden');
        }

        const mobileLink = e.target.closest('#mobile-menu a');
        if (mobileLink) {
            const menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.add('hidden');
        }
    });

    // Scroll to Top
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Efecto de Navbar Sticky con Sombra Dinámica
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        }
    });
}

// ==========================================
// 9. CARGA Y ARRANQUE DE LA APLICACIÓN
// ==========================================
async function loadAllComponents() {
    const elements = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(elements).map(loadComponent));
    
    // Inicializar todos los módulos una vez inyectado el HTML
    initInteractions();
    initHeroSlider();
    initVideoModal();
    initLightbox();
    initCounters();
}

document.addEventListener('DOMContentLoaded', loadAllComponents);
