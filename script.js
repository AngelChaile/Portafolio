// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    initNavbar();
    initProjects();
    initAnimations();
    initScrollSpy();
    initEmailCopy(); // Función de copiar email
});

// Variable global para almacenar la función updateActiveNavLink
let updateActiveNavLink = () => {};

// Navbar dinámico al hacer scroll
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Actualizar enlaces activos
        updateActiveNavLink();
    });
    
    // Smooth scroll para enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 76, // Ajustado
                    behavior: 'smooth'
                });
                
                // Cerrar navbar en móvil
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// Sistema de proyectos
function initProjects() {
    // Inicializar Swiper solo en móvil
    if (window.innerWidth < 768) {
        initProjectSwiper();
    }
    
    // Re-inicializar si cambia el tamaño de pantalla
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            if (!document.querySelector('.swiper-initialized')) {
                initProjectSwiper();
            }
        } else {
            const swiperContainer = document.querySelector('.swiper');
            if (swiperContainer && swiperContainer.swiper) {
                swiperContainer.swiper.destroy(true, true);
                swiperContainer.classList.remove('swiper-initialized');
            }
        }
    });
    
    // Manejar "Ver más proyectos" en desktop
    const verMasBtn = document.getElementById('ver-mas-proyectos-desktop');
    const proyectosAdicionales = document.getElementById('proyectos-adicionales');
    
    if (verMasBtn && proyectosAdicionales) {
        verMasBtn.addEventListener('click', function() {
            proyectosAdicionales.classList.toggle('d-none');
            
            if (proyectosAdicionales.classList.contains('d-none')) {
                verMasBtn.innerHTML = '<i class="bi bi-chevron-down me-2"></i>Ver más proyectos';
                verMasBtn.classList.remove('btn-primary');
                verMasBtn.classList.add('btn-outline-primary');
            } else {
                verMasBtn.innerHTML = '<i class="bi bi-chevron-up me-2"></i>Ver menos proyectos';
                verMasBtn.classList.remove('btn-outline-primary');
                verMasBtn.classList.add('btn-primary');
                
                setTimeout(() => {
                    proyectosAdicionales.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    }
    
    // Efecto hover para proyectos
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    }
}

// Función para inicializar Swiper
function initProjectSwiper() {
    const oldSwiper = document.querySelector('.swiper');
    if (oldSwiper && oldSwiper.swiper) {
        oldSwiper.swiper.destroy(true, true);
    }
    
    const swiper = new Swiper('.proyectos-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
        },
        on: {
            init: function() {
                document.querySelector('.swiper').classList.add('swiper-initialized');
            }
        }
    });
}

// Sistema de animaciones
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// ScrollSpy personalizado
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    updateActiveNavLink = function() {
        let scrollY = window.pageYOffset;
        let currentActive = null;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentActive = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActive}`) {
                link.classList.add('active');
            } else if (!currentActive && link.getAttribute('href') === '#inicio') {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Copiar email al portapapeles
function initEmailCopy() {
    const emailElements = document.querySelectorAll('[data-copy-email]');
    
    emailElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const email = 'angelchaile90@gmail.com';
            
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copiado al portapapeles', 'success');
            }).catch(err => {
                showNotification('Error al copiar el email', 'error');
            });
        });
    });
}

// Notificaciones
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos CSS para notificaciones
function injectNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                transform: translateX(150%);
                transition: transform 0.3s ease;
                z-index: 9999;
                max-width: 350px;
                border-left: 4px solid #4361ee;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #4cc9f0;
            }
            
            .notification-error {
                border-left-color: #f72585;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success .notification-content i {
                color: #4cc9f0;
            }
            
            .notification-error .notification-content i {
                color: #f72585;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inyectar estilos de notificación al cargar
injectNotificationStyles();