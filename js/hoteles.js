// Funcionalidad específica para página de hoteles

document.addEventListener('DOMContentLoaded', () => {
    initHotelFilters();
    initSorting();
    initFavorites();
    initPromoButtons();
    initFAQ();
    initDatePicker();
});

function initHotelFilters() {
    const filterForm = document.getElementById('hotelFilters');
    const resetBtn = document.getElementById('resetFilters');
    const hotelCards = document.querySelectorAll('.hotel-card');
    
    if (!filterForm) return;
    
    // Date picker
    flatpickr("#filterDates", {
        mode: "range",
        dateFormat: "d/m/Y",
        locale: "es",
        minDate: "today",
        defaultDate: ["today", new Date().fp_incr(2)]
    });
    
    // Counter functionality
    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const counter = this.closest('.counter');
            const input = counter.querySelector('input');
            const action = this.classList.contains('plus') ? 'increase' : 'decrease';
            
            let value = parseInt(input.value);
            const max = parseInt(input.max);
            const min = parseInt(input.min);
            
            if (action === 'increase' && value < max) {
                input.value = value + 1;
            } else if (action === 'decrease' && value > min) {
                input.value = value - 1;
            }
        });
    });
    
    // Filter form submission
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });
    
    // Reset filters
    resetBtn.addEventListener('click', () => {
        filterForm.reset();
        applyFilters();
    });
    
    // Real-time filtering on input change
    const filterInputs = filterForm.querySelectorAll('input, select');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    function applyFilters() {
        const destino = document.getElementById('filterDestino').value;
        const priceRange = document.getElementById('filterPrice').value;
        const tipos = Array.from(document.querySelectorAll('input[name="tipo"]:checked'))
                          .map(cb => cb.value);
        const amenidades = Array.from(document.querySelectorAll('input[name="amenidad"]:checked'))
                              .map(cb => cb.value);
        
        hotelCards.forEach(card => {
            let show = true;
            
            // Filter by destino
            if (destino && card.dataset.destino !== destino) {
                show = false;
            }
            
            // Filter by price range
            if (priceRange) {
                const price = parseInt(card.dataset.price);
                if (priceRange === '0-1000' && price > 1000) show = false;
                if (priceRange === '1000-2000' && (price < 1000 || price > 2000)) show = false;
                if (priceRange === '2000+' && price < 2000) show = false;
            }
            
            // Filter by tipos (if any selected)
            if (tipos.length > 0) {
                // This would require adding data-tipo to hotel cards
                // For now, we'll implement basic type filtering
                const cardType = card.classList.contains('premium') ? 'premium' : 'regular';
                // Add more sophisticated type checking as needed
            }
            
            // Filter by amenities (simplified)
            // In a real implementation, each hotel card would have data-amenities attribute
            
            card.style.display = show ? 'block' : 'none';
        });
    }
}

function initSorting() {
    const sortSelect = document.querySelector('.sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        const container = document.getElementById('hotelesGrid');
        const cards = Array.from(container.querySelectorAll('.hotel-card'));
        
        cards.sort((a, b) => {
            switch(sortBy) {
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'name':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                default:
                    return 0;
            }
        });
        
        // Reorder cards in container
        cards.forEach(card => container.appendChild(card));
    });
}

function initFavorites() {
    // Favorites functionality is already in main.js
    // This is just for hotel-specific favorite handling
    document.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) {
            const button = e.target.closest('.favorite-btn');
            const hotelCard = button.closest('.hotel-card');
            const hotelName = hotelCard.querySelector('h3').textContent;
            
            // Show notification
            const isFavorited = button.querySelector('i').classList.contains('fas');
            showNotification(
                isFavorited ? `Añadido a favoritos: ${hotelName}` : `Eliminado de favoritos: ${hotelName}`,
                isFavorited ? 'success' : 'info'
            );
        }
    });
}

function initPromoButtons() {
    document.querySelectorAll('.btn-promo').forEach(button => {
        button.addEventListener('click', function() {
            const promo = this.dataset.promo;
            const promoDetails = {
                'luna-miel': {
                    title: 'Promoción Luna de Miel',
                    description: '2 noches en suite + cena romántica + masaje para pareja',
                    price: '$3,600 MXN',
                    includes: [
                        'Suite de lujo con jacuzzi',
                        'Cena romántica a la luz de velas',
                        'Masaje de pareja (60 min)',
                        'Botella de sidra premium',
                        'Desayuno en la habitación'
                    ]
                },
                'escapada-familiar': {
                    title: 'Promoción Escapada Familiar',
                    description: '3 noches en cabaña familiar + tour guiado + actividades niños',
                    price: '$5,100 MXN',
                    includes: [
                        'Cabaña familiar (hasta 6 personas)',
                        'Tour guiado Barranca de los Jilgueros',
                        'Taller de esferas para niños',
                        'Actividades recreativas',
                        'Seguro de viaje familiar'
                    ]
                }
            };
            
            if (promoDetails[promo]) {
                showPromoModal(promoDetails[promo]);
            }
        });
    });
}

function showPromoModal(details) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h3>${details.title}</h3>
                <p>${details.description}</p>
            </div>
            <div class="modal-body">
                <div class="promo-price">
                    <span class="price">${details.price}</span>
                    <span class="note">Precio final, impuestos incluidos</span>
                </div>
                <div class="promo-includes">
                    <h4>Incluye:</h4>
                    <ul>
                        ${details.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="promo-terms">
                    <h4>Términos y condiciones:</h4>
                    <ul>
                        <li>Válido para reservas hasta el 31 de diciembre 2024</li>
                        <li>Reserva mínima con 7 días de anticipación</li>
                        <li>No reembolsable, fecha sujeta a disponibilidad</li>
                        <li>No aplicable con otras promociones</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-reservar" data-provider="Promoción ${details.title}">
                    <i class="fas fa-calendar-check"></i> Reservar Promoción
                </button>
                <button class="btn-secondary close-promo">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Close modal handlers
    const closeModal = () => {
        modal.style.animation = 'modalSlideOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.close-promo').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-50px); }
        }
        
        .modal-body {
            max-height: 60vh;
            overflow-y: auto;
            padding: 1rem 0;
        }
        
        .promo-price {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--bg-light);
            border-radius: var(--radius-md);
        }
        
        .promo-price .price {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--accent-color);
            display: block;
        }
        
        .promo-price .note {
            font-size: 0.9rem;
            color: var(--gray-dark);
        }
        
        .promo-includes, .promo-terms {
            margin-bottom: 1.5rem;
        }
        
        .promo-includes h4, .promo-terms h4 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .promo-includes ul, .promo-terms ul {
            list-style: none;
        }
        
        .promo-includes li, .promo-terms li {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--gray-light);
        }
        
        .promo-includes li:last-child, .promo-terms li:last-child {
            border-bottom: none;
        }
        
        .promo-includes i {
            color: var(--accent-color);
            margin-right: 0.5rem;
        }
        
        .modal-footer {
            display: flex;
            gap: 1rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--gray-light);
        }
        
        .modal-footer button {
            flex: 1;
        }
    `;
    document.head.appendChild(style);
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

function initDatePicker() {
    // Flatpickr already initialized in initHotelFilters
    // Additional date picker setup if needed
}