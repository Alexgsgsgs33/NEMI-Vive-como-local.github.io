// js/eventos.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('NEMI Eventos - v1.0.0');
    
    // ============================================
    // CONFIGURACIÓN
    // ============================================
    const eventosState = {
        currentYear: new Date().getFullYear(),
        selectedCity: 'zacatlan',
        calendarEvents: [],
        upcomingEvents: [],
        selectedEvent: null
    };

    // ============================================
    // 1. INICIALIZAR CALENDARIO FULLCALENDAR
    // ============================================
    const calendarEl = document.getElementById('calendar');
    
    if (calendarEl) {
        // Datos de eventos de ejemplo
        eventosState.calendarEvents = [
            {
                id: 1,
                title: 'Feria de la Manzana',
                start: `${eventosState.currentYear}-08-15`,
                end: `${eventosState.currentYear}-08-25`,
                color: '#e74c3c',
                description: 'La feria más importante de Zacatlán',
                location: 'Zacatlán',
                type: 'major'
            },
            {
                id: 2,
                title: 'Festival del Reloj',
                start: `${eventosState.currentYear}-05-03`,
                end: `${eventosState.currentYear}-05-05`,
                color: '#3498db',
                description: 'Exposición de relojería artesanal',
                location: 'Zacatlán',
                type: 'cultural'
            },
            {
                id: 3,
                title: 'Feria de la Esfera',
                start: `${eventosState.currentYear}-10-15`,
                end: `${eventosState.currentYear}-12-24`,
                color: '#2ecc71',
                description: 'Mercado navideño de esferas artesanales',
                location: 'Chignahuapan',
                type: 'major'
            },
            {
                id: 4,
                title: 'Semana Santa',
                start: `${eventosState.currentYear}-03-24`,
                end: `${eventosState.currentYear}-03-30`,
                color: '#9b59b6',
                description: 'Procesiones y viacrucis viviente',
                location: 'Ambos',
                type: 'religious'
            }
        ];
        
        // Inicializar calendario
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,listMonth'
            },
            events: eventosState.calendarEvents,
            eventClick: function(info) {
                showEventDetails(info.event);
            },
            eventMouseEnter: function(info) {
                showEventTooltip(info.event);
            },
            datesSet: function(info) {
                updateUpcomingEvents(info.start, info.end);
            }
        });
        
        calendar.render();
        
        // Guardar referencia global
        window.nemiCalendar = calendar;
        
        // Actualizar eventos próximos
        updateUpcomingEvents();
    }

    // ============================================
    // 2. EVENTOS PRÓXIMOS
    // ============================================
    function updateUpcomingEvents(startDate = new Date(), endDate = null) {
        if (!endDate) {
            endDate = new Date();
            endDate.setDate(endDate.getDate() + 30); // Próximos 30 días
        }
        
        eventosState.upcomingEvents = eventosState.calendarEvents.filter(event => {
            const eventStart = new Date(event.start);
            return eventStart >= startDate && eventStart <= endDate;
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
        
        // Actualizar UI
        const upcomingEventsEl = document.getElementById('upcomingEvents');
        if (upcomingEventsEl) {
            upcomingEventsEl.innerHTML = eventosState.upcomingEvents.map(event => `
                <div class="upcoming-event" data-id="${event.id}">
                    <div class="event-date">
                        ${formatEventDate(event.start)}
                    </div>
                    <div class="event-info">
                        <h5>${event.title}</h5>
                        <span class="event-location ${event.location.toLowerCase()}">${event.location}</span>
                    </div>
                </div>
            `).join('');
            
            // Agregar event listeners
            document.querySelectorAll('.upcoming-event').forEach(eventEl => {
                eventEl.addEventListener('click', function() {
                    const eventId = parseInt(this.getAttribute('data-id'));
                    const event = eventosState.calendarEvents.find(e => e.id === eventId);
                    if (event) {
                        showEventModal(event);
                    }
                });
            });
        }
    }
    
    function formatEventDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-MX', { 
            day: 'numeric',
            month: 'short'
        }).toUpperCase();
    }

    // ============================================
    // 3. TABS POR CIUDAD
    // ============================================
    const cityTabs = document.querySelectorAll('.tab-btn');
    
    cityTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            eventosState.selectedCity = city;
            
            // Actualizar UI
            cityTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar eventos de la ciudad
            document.querySelectorAll('.tab-content').forEach(content => {
                if (content.id === `${city}-events`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            
            // Scroll suave al contenido
            const targetSection = document.querySelector(`#${city}-events`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // 4. DETALLES DE EVENTO
    // ============================================
    function showEventDetails(eventObj) {
        const event = eventosState.calendarEvents.find(e => e.id === parseInt(eventObj.id));
        if (event) {
            showEventModal(event);
        }
    }
    
    function showEventTooltip(eventObj) {
        // Puedes implementar tooltips personalizados aquí
        // Por simplicidad, usaremos el modal
    }
    
    function showEventModal(event) {
        eventosState.selectedEvent = event;
        
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header" style="border-left: 5px solid ${event.color}">
                    <h3><i class="fas fa-calendar-star"></i> ${event.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="event-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${formatEventDateRange(event.start, event.end)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span class="event-type">${event.type === 'major' ? 'Evento Mayor' : 
                                                       event.type === 'cultural' ? 'Cultural' : 
                                                       event.type === 'religious' ? 'Religioso' : 'Especial'}</span>
                        </div>
                    </div>
                    
                    <div class="event-description">
                        <h4>Descripción</h4>
                        <p>${event.description}</p>
                    </div>
                    
                    <div class="event-highlights">
                        <h4>Actividades Destacadas</h4>
                        <ul>
                            ${getEventHighlights(event.id).map(highlight => `
                                <li><i class="fas fa-check"></i> ${highlight}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="event-tips">
                        <h4><i class="fas fa-lightbulb"></i> Recomendaciones</h4>
                        <p>${getEventTips(event.location)}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cerrar</button>
                    <button class="btn-primary book-event">
                        <i class="fas fa-calendar-check"></i> Reservar para este Evento
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Reservar evento
        modal.querySelector('.book-event').addEventListener('click', function() {
            bookEvent(event);
            modal.remove();
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function formatEventDateRange(startStr, endStr) {
        const start = new Date(startStr);
        const end = new Date(endStr);
        
        if (start.getTime() === end.getTime()) {
            return start.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        return `${start.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} - 
                ${end.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    
    function getEventHighlights(eventId) {
        const highlights = {
            1: ['Conciertos nocturnos', 'Exposición agrícola', 'Feria de la sidra', 'Charreadas y jaripeos'],
            2: ['Talleres de relojería', 'Demostraciones en vivo', 'Concurso de relojes', 'Exposición histórica'],
            3: ['Mercado navideño', 'Talleres de esferas', 'Espectáculos de luces', 'Comida tradicional'],
            4: ['Procesiones', 'Viacrucis viviente', 'Misas especiales', 'Eventos culturales']
        };
        return highlights[eventId] || ['Actividades culturales', 'Gastronomía local', 'Eventos familiares'];
    }
    
    function getEventTips(location) {
        const tips = {
            'Zacatlán': 'Llevar abrigo para las noches frescas, reservar hotel con anticipación, probar la sidra artesanal.',
            'Chignahuapan': 'Usar calzado cómodo para caminar, llevar cámara para fotos, visitar las aguas termales.',
            'Ambos': 'Planificar transporte entre ciudades, reservar con anticipación en temporada alta, llevar efectivo para mercados.'
        };
        return tips[location] || 'Reservar con anticipación, verificar horarios, llevar ropa adecuada.';
    }

    // ============================================
    // 5. RESERVA DE EVENTOS
    // ============================================
    document.addEventListener('click', function(e) {
        const detailsBtn = e.target.closest('.btn-event-details');
        if (detailsBtn) {
            const eventName = detailsBtn.getAttribute('data-event');
            showEventByName(eventName);
        }
        
        const reservarBtn = e.target.closest('.btn-reservar');
        if (reservarBtn) {
            const provider = reservarBtn.getAttribute('data-provider');
            const eventCard = reservarBtn.closest('.event-card');
            const eventName = eventCard.querySelector('h3').textContent;
            bookEventPackage(eventName, provider);
        }
        
        const packageBtn = e.target.closest('.btn-package');
        if (packageBtn) {
            const packageName = packageBtn.getAttribute('data-package');
            showPackageDetails(packageName);
        }
    });
    
    function showEventByName(eventName) {
        const event = eventosState.calendarEvents.find(e => 
            e.title.toLowerCase().includes(eventName.toLowerCase())
        );
        
        if (event) {
            showEventModal(event);
        } else {
            showEventoNotification('Información detallada no disponible', 'info');
        }
    }
    
    function bookEvent(event) {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-ticket-alt"></i> Reservar para ${event.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="event-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Las reservas para eventos especiales requieren confirmación previa</p>
                    </div>
                    
                    <form class="event-booking-form">
                        <div class="form-group">
                            <label>Fecha de asistencia</label>
                            <select class="form-control" required>
                                ${getEventDates(event.start, event.end).map(date => `
                                    <option value="${date}">${date}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Adultos</label>
                                <input type="number" class="form-control" min="1" max="10" value="2" required>
                            </div>
                            <div class="form-group">
                                <label>Niños</label>
                                <input type="number" class="form-control" min="0" max="10" value="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Paquete deseado</label>
                            <select class="form-control">
                                <option value="general">Entrada General</option>
                                <option value="vip">Entrada VIP</option>
                                <option value="family">Paquete Familiar</option>
                                <option value="premium">Experiencia Premium</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Comentarios adicionales</label>
                            <textarea class="form-control" placeholder="Requerimientos especiales, preferencias, etc."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cancelar</button>
                    <button class="btn-primary confirm-event-booking">
                        <i class="fas fa-paper-plane"></i> Enviar Solicitud
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Confirmar reserva
        modal.querySelector('.confirm-event-booking').addEventListener('click', function() {
            const form = modal.querySelector('.event-booking-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const bookingData = {
                event: event.title,
                date: modal.querySelector('select').value,
                adults: modal.querySelector('input[type="number"]').value,
                children: modal.querySelectorAll('input[type="number"]')[1].value,
                package: modal.querySelectorAll('select')[1].value,
                comments: modal.querySelector('textarea').value
            };
            
            saveEventBooking(bookingData);
            showEventoNotification(`Solicitud enviada para ${event.title}`, 'success');
            modal.remove();
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function bookEventPackage(eventName, provider) {
        const modal = document.createElement('div');
        modal.className = 'package-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-box"></i> Paquetes para ${eventName}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Contáctanos para información detallada sobre paquetes especiales para ${eventName}</p>
                    
                    <div class="contact-options">
                        <a href="tel:7979751045" class="contact-option">
                            <i class="fas fa-phone"></i> Llamar
                        </a>
                        <a href="https://wa.me/527979751045" target="_blank" class="contact-option">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="mailto:eventos@nemi.mx" class="contact-option">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary close-modal">Entendido</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function showPackageDetails(packageName) {
        const packages = {
            'feria-manzana': {
                title: 'Paquete "Feria de la Manzana"',
                dates: 'Agosto 15-25',
                includes: [
                    '2 noches en hotel céntrico',
                    'Entradas VIP a conciertos',
                    'Tour degustación de sidra',
                    'Transporte local incluido',
                    'Guía de eventos diario',
                    'Seguro de viaje'
                ],
                price: 3780,
                originalPrice: 4200
            },
            'navidad-magica': {
                title: 'Paquete "Navidad Mágica"',
                dates: 'Diciembre 20-26',
                includes: [
                    '3 noches en hotel temático',
                    'Tour fábricas de esferas',
                    'Cena de Navidad tradicional',
                    'Taller de esferas personalizadas',
                    'Visita a mercados navideños',
                    'Guía bilingüe incluido'
                ],
                price: 4675,
                originalPrice: 5500
            }
        };
        
        const pkg = packages[packageName];
        if (!pkg) return;
        
        const modal = document.createElement('div');
        modal.className = 'package-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-gift"></i> ${pkg.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="package-dates">
                        <i class="fas fa-calendar"></i>
                        <span>${pkg.dates}</span>
                    </div>
                    
                    <div class="package-includes">
                        <h4>Incluye:</h4>
                        <ul>
                            ${pkg.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="package-price-details">
                        <div class="original-price">
                            <span>Precio regular:</span>
                            <span>$${pkg.originalPrice.toLocaleString()}</span>
                        </div>
                        <div class="discounted-price">
                            <span>Precio especial:</span>
                            <span>$${pkg.price.toLocaleString()}</span>
                        </div>
                        <div class="savings">
                            <span>Ahorras:</span>
                            <span>$${(pkg.originalPrice - pkg.price).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cerrar</button>
                    <button class="btn-primary book-package-btn">
                        <i class="fas fa-shopping-cart"></i> Reservar Paquete
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Reservar paquete
        modal.querySelector('.book-package-btn').addEventListener('click', function() {
            bookPackage(packageName);
            modal.remove();
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function bookPackage(packageName) {
        showEventoNotification(`Redirigiendo a reserva de ${packageName}...`, 'info');
        
        setTimeout(() => {
            // Simular redirección
            if (window.openContactModal) {
                window.openContactModal(`Paquete ${packageName}`);
            }
        }, 1000);
    }

    // ============================================
    // 6. FUNCIONES UTILITARIAS
    // ============================================
    function getEventDates(startStr, endStr) {
        const dates = [];
        const start = new Date(startStr);
        const end = new Date(endStr);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(d.toLocaleDateString('es-MX'));
        }
        
        return dates;
    }
    
    function saveEventBooking(data) {
        const bookings = JSON.parse(localStorage.getItem('nemi_event_bookings')) || [];
        bookings.push({
            ...data,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('nemi_event_bookings', JSON.stringify(bookings));
        
        // Enviar confirmación (simulación)
        sendBookingConfirmation(data);
    }
    
    function sendBookingConfirmation(data) {
        console.log('Enviando confirmación de reserva de evento:', data);
    }
    
    function showEventoNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `evento-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ============================================
    // 7. ESTILOS ADICIONALES
    // ============================================
    const eventoStyles = document.createElement('style');
    eventoStyles.textContent = `
        .upcoming-event {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .upcoming-event:hover {
            background: #f5f5f5;
        }
        
        .event-date {
            background: #3498db;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            min-width: 60px;
            text-align: center;
        }
        
        .event-info h5 {
            margin: 0 0 5px 0;
            font-size: 14px;
        }
        
        .event-location {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 10px;
            background: #eee;
        }
        
        .event-location.zacatlan {
            background: #e74c3c;
            color: white;
        }
        
        .event-location.chignahuapan {
            background: #2ecc71;
            color: white;
        }
        
        .event-modal,
        .booking-modal,
        .package-modal,
        .package-details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .event-modal .modal-content,
        .booking-modal .modal-content,
        .package-modal .modal-content,
        .package-details-modal .modal-content {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .event-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        
        .event-type {
            background: #3498db;
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
        }
        
        .event-description,
        .event-highlights,
        .event-tips {
            margin-bottom: 20px;
        }
        
        .event-description h4,
        .event-highlights h4,
        .event-tips h4 {
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .event-highlights ul {
            padding-left: 20px;
        }
        
        .event-highlights li {
            margin-bottom: 5px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .event-highlights li i {
            color: #2ecc71;
            margin-top: 3px;
        }
        
        .event-tips {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
        }
        
        .event-warning {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 10px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .contact-options {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .contact-option {
            flex: 1;
            padding: 10px;
            background: #3498db;
            color: white;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        .contact-option:hover {
            background: #2980b9;
        }
        
        .package-dates {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            color: #666;
        }
        
        .package-price-details {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .original-price,
        .discounted-price,
        .savings {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .original-price span:last-child {
            text-decoration: line-through;
            color: #999;
        }
        
        .discounted-price span:last-child {
            font-size: 24px;
            font-weight: bold;
            color: #e74c3c;
        }
        
        .savings span:last-child {
            color: #2ecc71;
            font-weight: bold;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .evento-notification {
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
        
        .evento-notification.show {
            transform: translateX(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(eventoStyles);
});