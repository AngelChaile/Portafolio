// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    initNavbar();
    initProjects();
    initAnimations();
    initScrollSpy();
    initContactForm();
    initThemeToggle();
    initEmailCopy();
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
                    top: targetSection.offsetTop - 80,
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
    const verMasBtn = document.getElementById('ver-mas-proyectos');
    const proyectosOcultos = document.querySelectorAll('.proyecto.ocultar-proyect');
    
    if (verMasBtn) {
        verMasBtn.addEventListener('click', function() {
            proyectosOcultos.forEach(proyecto => {
                proyecto.classList.toggle('visible');
            });
            
            // Cambiar texto del botón
            const proyectosVisibles = document.querySelectorAll('.proyecto.ocultar-proyect.visible');
            
            if (proyectosVisibles.length > 0) {
                verMasBtn.innerHTML = '<i class="bi bi-chevron-up me-2"></i>Ver menos proyectos';
                verMasBtn.classList.add('btn-primary');
                verMasBtn.classList.remove('btn-outline-primary');
            } else {
                verMasBtn.innerHTML = '<i class="bi bi-grid-3x3-gap me-2"></i>Ver todos los proyectos';
                verMasBtn.classList.remove('btn-primary');
                verMasBtn.classList.add('btn-outline-primary');
            }
            
            // Scroll suave a la sección de proyectos
            setTimeout(() => {
                document.querySelector('#proyectos').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    }
    
    // Efecto hover mejorado para proyectos (nueva estructura)
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
    
    // También manejar proyectos antiguos si existen
    const oldProjectCards = document.querySelectorAll('.proyecto');
    if (oldProjectCards.length > 0) {
        oldProjectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
}

// Sistema de animaciones
function initAnimations() {
    // Animación de entrada para elementos
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
    
    // Observar elementos que deben animarse
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// ScrollSpy personalizado
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Actualizar la función global
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
        
        // Actualizar enlaces activos
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActive}`) {
                link.classList.add('active');
            } else if (!currentActive && link.getAttribute('href') === '#inicio') {
                link.classList.add('active');
            }
        });
    }
    
    // Llamar inicialmente y en cada scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Formulario de contacto (si se agrega en el futuro)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Simular envío
            submitBtn.innerHTML = '<span class="loading"></span> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Mostrar mensaje de éxito
                showNotification('Mensaje enviado con éxito', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
}

// Tema claro/oscuro (opcional)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (themeToggle) {
        // Verificar preferencia guardada
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-bs-theme', savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Cambiar ícono
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'light' ? 'bi bi-sun' : 'bi bi-moon';
            }
            
            showNotification(`Tema ${newTheme === 'light' ? 'claro' : 'oscuro'} activado`);
        });
    }
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
    // Verificar si ya existe una notificación
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
    
    // Mostrar
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar y eliminar
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos CSS para notificaciones dinámicamente si no existen
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