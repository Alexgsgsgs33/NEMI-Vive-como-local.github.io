// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // CONFIGURACIÓN INICIAL
    // ============================================
    console.log('NEMI Plataforma Turística - v1.0.0');
    
    // Estado de la aplicación
    const appState = {
        isDarkMode: false,
        isLoggedIn: false,
        currentUser: null,
        favorites: JSON.parse(localStorage.getItem('nemi_favorites')) || []
    };

    // ============================================
    // 1. NAVEGACIÓN Y MENÚ MÓVIL
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Cerrar menú al hacer clic en enlaces
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // ============================================
    // 2. BÚSQUEDA Y FILTROS
    // ============================================
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function() {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                searchInput.focus();
            }
        });
        
        // Cerrar búsqueda al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
                searchBar.classList.remove('active');
            }
        });
    }
    
    // Búsqueda en tiempo real
    if (searchInput) {
        const searchSuggestions = document.getElementById('searchSuggestions');
        const searchData = [
            { type: 'hotel', name: 'Vista Zacatlán Hotel', url: 'hoteles.html' },
            { type: 'hotel', name: 'Hotel Termales Chignahuapan', url: 'hoteles.html' },
            { type: 'tour', name: 'Tour Reloj Floral', url: 'lugares.html' },
            { type: 'tour', name: 'Fábricas de Esferas', url: 'lugares.html' },
            { type: 'restaurant', name: 'La Trucha Feliz', url: 'gastronomia.html' },
            { type: 'restaurant', name: 'El Jardín de la Sidra', url: 'gastronomia.html' },
            { type: 'event', name: 'Feria de la Manzana', url: 'eventos.html' },
            { type: 'event', name: 'Feria de la Esfera', url: 'eventos.html' }
        ];
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            searchSuggestions.innerHTML = '';
            
            if (query.length >= 2) {
                const results = searchData.filter(item => 
                    item.name.toLowerCase().includes(query)
                ).slice(0, 5);
                
                if (results.length > 0) {
                    results.forEach(result => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <a href="${result.url}">
                                <i class="fas fa-${getIconForType(result.type)}"></i>
                                ${result.name}
                            </a>
                        `;
                        searchSuggestions.appendChild(li);
                    });
                    searchSuggestions.style.display = 'block';
                } else {
                    searchSuggestions.innerHTML = '<li class="no-results">No se encontraron resultados</li>';
                    searchSuggestions.style.display = 'block';
                }
            } else {
                searchSuggestions.style.display = 'none';
            }
        });
        
        // Cerrar sugerencias al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!searchBar.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });
    }
    
    // ============================================
    // 3. MODO OSCURO / CLARO
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    if (themeToggle) {
        // Verificar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            appState.isDarkMode = true;
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
        
        // Verificar localStorage
        const savedTheme = localStorage.getItem('nemi_theme');
        if (savedTheme === 'dark') {
            appState.isDarkMode = true;
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
        
        themeToggle.addEventListener('click', function() {
            appState.isDarkMode = !appState.isDarkMode;
            
            if (appState.isDarkMode) {
                document.body.classList.add('dark-mode');
                if (themeIcon) themeIcon.className = 'fas fa-sun';
                localStorage.setItem('nemi_theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                if (themeIcon) themeIcon.className = 'fas fa-moon';
                localStorage.setItem('nemi_theme', 'light');
            }
        });
    }
    
    // ============================================
    // 4. SLIDER HERO
    // ============================================
    const heroSlider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.hero .slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slide-dots');
    
    if (heroSlider && slides.length > 0) {
        let currentSlide = 0;
        
        // Crear dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Auto slide cada 5 segundos
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pausar auto slide al interactuar
        heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // ============================================
    // 5. CONTADORES ANIMADOS
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseFloat(element.getAttribute('data-count'));
                    const duration = 2000; // 2 segundos
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            element.textContent = target.toFixed(target % 1 === 0 ? 0 : 1);
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.floor(current).toLocaleString();
                        }
                    }, 16);
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    // ============================================
    // 6. MAPA INTERACTIVO
    // ============================================
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // Coordenadas de Zacatlán y Chignahuapan
        const zacatlan = [19.9353, -97.9611];
        const chignahuapan = [19.8381, -98.0317];
        
        // Crear mapa centrado entre ambos
        const center = [
            (zacatlan[0] + chignahuapan[0]) / 2,
            (zacatlan[1] + chignahuapan[1]) / 2
        ];
        
        const map = L.map('map').setView(center, 10);
        
        // Agregar capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Marcadores personalizados
        const zacatlanIcon = L.divIcon({
            html: '<div class="map-marker zacatlan"><i class="fas fa-apple-alt"></i></div>',
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        const chignahuapanIcon = L.divIcon({
            html: '<div class="map-marker chignahuapan"><i class="fas fa-gift"></i></div>',
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        // Agregar marcadores
        L.marker(zacatlan, { icon: zacatlanIcon })
            .addTo(map)
            .bindPopup('<strong>Zacatlán de las Manzanas</strong><br>Pueblo Mágico');
        
        L.marker(chignahuapan, { icon: chignahuapanIcon })
            .addTo(map)
            .bindPopup('<strong>Chignahuapan</strong><br>Capital de las Esferas');
        
        // Agregar línea de conexión
        L.polyline([zacatlan, chignahuapan], {
            color: '#3498db',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(map);
    }
    
    // ============================================
    // 7. FAVORITOS
    // ============================================
    document.addEventListener('click', function(e) {
        // Botones de favoritos
        if (e.target.closest('.favorite-btn')) {
            const button = e.target.closest('.favorite-btn');
            const id = button.getAttribute('data-id');
            const type = button.getAttribute('data-type');
            const icon = button.querySelector('i');
            
            // Verificar si ya está en favoritos
            const index = appState.favorites.findIndex(fav => fav.id === id && fav.type === type);
            
            if (index === -1) {
                // Agregar a favoritos
                appState.favorites.push({ id, type });
                icon.className = 'fas fa-heart';
                showNotification('Agregado a favoritos', 'success');
            } else {
                // Quitar de favoritos
                appState.favorites.splice(index, 1);
                icon.className = 'far fa-heart';
                showNotification('Eliminado de favoritos', 'info');
            }
            
            // Guardar en localStorage
            localStorage.setItem('nemi_favorites', JSON.stringify(appState.favorites));
        }
        
        // Botones de reserva
        if (e.target.closest('.btn-reservar')) {
            const button = e.target.closest('.btn-reservar');
            const providerName = button.getAttribute('data-provider');
            
            if (providerName) {
                openContactModal(providerName);
            }
        }
    });
    
    // ============================================
    // 8. MODAL DE CONTACTO
    // ============================================
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.querySelector('.close-modal');
    
    function openContactModal(providerName) {
        if (contactModal) {
            document.getElementById('modalProviderName').textContent = providerName;
            contactModal.style.display = 'block';
            document.body.classList.add('modal-open');
        }
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            contactModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
    
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                dates: document.getElementById('dates').value,
                message: document.getElementById('message').value,
                provider: document.getElementById('modalProviderName').textContent
            };
            
            // Aquí iría la integración con el backend
            console.log('Datos de contacto:', formData);
            
            // Simulación de envío exitoso
            showNotification('Consulta enviada correctamente', 'success');
            contactModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            contactForm.reset();
        });
    }
    
    // ============================================
    // 9. NEWSLETTER
    // ============================================
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Validación simple
            if (!validateEmail(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Simulación de suscripción
            setTimeout(() => {
                showNotification('¡Gracias por suscribirte!', 'success');
                this.reset();
            }, 500);
        });
    });
    
    // ============================================
    // 10. FUNCIONES UTILITARIAS
    // ============================================
    function getIconForType(type) {
        const icons = {
            hotel: 'bed',
            tour: 'map-marked-alt',
            restaurant: 'utensils',
            event: 'calendar-alt'
        };
        return icons[type] || 'search';
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Agregar al cuerpo
        document.body.appendChild(notification);
        
        // Mostrar
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // 11. RESPONSIVE Y AJUSTES
    // ============================================
    function handleResize() {
        // Ajustar menú móvil
        if (window.innerWidth > 1024) {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // ============================================
    // 12. ESTILOS DINÁMICOS
    // ============================================
    // Agregar estilos para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #333;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            transform: translateX(100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification.success {
            border-left: 4px solid #2ecc71;
            background: #ecf9f2;
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
            background: #fdeaea;
        }
        
        .notification.warning {
            border-left: 4px solid #f39c12;
            background: #fef8e8;
        }
        
        .notification.info {
            border-left: 4px solid #3498db;
            background: #ebf5fb;
        }
        
        .map-marker {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        
        .map-marker.zacatlan {
            background: #e74c3c;
        }
        
        .map-marker.chignahuapan {
            background: #3498db;
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        body.modal-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});

// Funciones globales accesibles desde otros archivos
window.NEMI = window.NEMI || {};

NEMI.Utils = {
    formatPrice: function(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    },
    
    formatDate: function(date) {
        return new Intl.DateTimeFormat('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    getCookie: function(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    },
    
    setCookie: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
};