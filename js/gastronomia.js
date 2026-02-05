// js/gastronomia.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('NEMI Gastronomía - v1.0.0');
    
    // ============================================
    // CONFIGURACIÓN
    // ============================================
    const gastronomyState = {
        currentCategory: 'platos-tipicos',
        filters: {
            location: 'all',
            type: 'all',
            price: 'all'
        },
        favorites: JSON.parse(localStorage.getItem('nemi_gastronomy_favorites')) || []
    };

    // ============================================
    // 1. NAVEGACIÓN POR CATEGORÍAS
    // ============================================
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            gastronomyState.currentCategory = targetId;
            
            // Actualizar UI
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll suave a la sección
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Efecto visual
                targetSection.style.animation = 'none';
                setTimeout(() => {
                    targetSection.style.animation = 'fadeIn 0.5s ease';
                }, 10);
            }
        });
    });

    // ============================================
    // 2. FILTRADO DE RESTAURANTES
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Actualizar botones
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            gastronomyState.filters.type = filter;
            filterRestaurants();
        });
    });
    
    function filterRestaurants() {
        const restaurantRows = document.querySelectorAll('.restaurants-table tbody tr');
        let visibleCount = 0;
        
        restaurantRows.forEach(row => {
            let showRow = true;
            const filter = gastronomyState.filters.type;
            
            if (filter === 'all') {
                showRow = true;
            } else if (filter === 'zacatlan') {
                const location = row.cells[2].textContent.toLowerCase();
                showRow = location.includes('zacatlán');
            } else if (filter === 'chignahuapan') {
                const location = row.cells[2].textContent.toLowerCase();
                showRow = location.includes('chignahuapan');
            } else if (filter === 'premium') {
                showRow = row.classList.contains('restaurant-premium');
            } else if (filter === 'economico') {
                const price = row.cells[3].querySelector('.price-tag').textContent;
                showRow = price === '$';
            }
            
            // Aplicar visibilidad
            if (showRow) {
                row.style.display = 'table-row';
                visibleCount++;
                
                // Animación
                row.style.animation = 'fadeIn 0.3s ease';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Mostrar conteo
        updateRestaurantCount(visibleCount);
    }
    
    function updateRestaurantCount(count) {
        const countElement = document.querySelector('.restaurant-count');
        if (!countElement) {
            const table = document.querySelector('.restaurants-table');
            const countDiv = document.createElement('div');
            countDiv.className = 'restaurant-count';
            table.parentNode.insertBefore(countDiv, table);
        }
        
        const countElementUpdated = document.querySelector('.restaurant-count');
        countElementUpdated.innerHTML = `
            <div class="count-badge">
                <i class="fas fa-utensils"></i>
                <span>${count} restaurantes encontrados</span>
            </div>
        `;
    }

    // ============================================
    // 3. RESERVA EN RESTAURANTES
    // ============================================
    document.addEventListener('click', function(e) {
        const reservarBtn = e.target.closest('.btn-reservar, .btn-reservar-small');
        if (reservarBtn) {
            const provider = reservarBtn.getAttribute('data-provider');
            const isDish = reservarBtn.closest('.dish-card');
            
            if (isDish) {
                const dishName = isDish.querySelector('h3').textContent;
                reserveDish(provider, dishName);
            } else {
                reserveRestaurant(provider);
            }
        }
        
        const recipeBtn = e.target.closest('.btn-recipe');
        if (recipeBtn) {
            const dishCard = recipeBtn.closest('.dish-card');
            const dishName = dishCard.querySelector('h3').textContent;
            showRecipe(dishName);
        }
        
        const drinkBtn = e.target.closest('.btn-drink');
        if (drinkBtn) {
            const drinkName = drinkBtn.closest('.drink-card').querySelector('h3').textContent;
            const drinkPrice = drinkBtn.closest('.drink-card').querySelector('.price').textContent;
            purchaseDrink(drinkName, drinkPrice);
        }
        
        const experienceBtn = e.target.closest('.btn-experience');
        if (experienceBtn) {
            const experienceName = experienceBtn.getAttribute('data-experience');
            bookExperience(experienceName);
        }
    });
    
    function reserveRestaurant(restaurantName) {
        const modal = document.createElement('div');
        modal.className = 'gastro-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-utensils"></i> Reservar Mesa</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="restaurant-info">
                        <h4>${restaurantName}</h4>
                        <p>Completa los datos para reservar tu mesa</p>
                    </div>
                    
                    <form class="reservation-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha</label>
                                <input type="date" class="form-control" min="${getTomorrowDate()}" required>
                            </div>
                            <div class="form-group">
                                <label>Hora</label>
                                <select class="form-control" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="13:00">13:00</option>
                                    <option value="13:30">13:30</option>
                                    <option value="14:00">14:00</option>
                                    <option value="14:30">14:30</option>
                                    <option value="19:00">19:00</option>
                                    <option value="19:30">19:30</option>
                                    <option value="20:00">20:00</option>
                                    <option value="20:30">20:30</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Personas</label>
                                <select class="form-control" required>
                                    <option value="1">1 persona</option>
                                    <option value="2" selected>2 personas</option>
                                    <option value="3">3 personas</option>
                                    <option value="4">4 personas</option>
                                    <option value="5">5 personas</option>
                                    <option value="6+">6+ personas</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Teléfono</label>
                                <input type="tel" class="form-control" placeholder="Tu teléfono" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Comentarios (opcional)</label>
                            <textarea class="form-control" placeholder="Alergias, preferencias, celebración especial, etc."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cancelar</button>
                    <button class="btn-primary confirm-reservation">
                        <i class="fas fa-check"></i> Confirmar Reserva
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
        modal.querySelector('.confirm-reservation').addEventListener('click', function() {
            const form = modal.querySelector('.reservation-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            // Obtener datos
            const formData = {
                restaurant: restaurantName,
                date: modal.querySelector('input[type="date"]').value,
                time: modal.querySelector('select').value,
                people: modal.querySelector('select:nth-of-type(2)').value,
                phone: modal.querySelector('input[type="tel"]').value,
                comments: modal.querySelector('textarea').value
            };
            
            // Guardar reserva
            saveReservation(formData);
            showGastroNotification(`Mesa reservada en ${restaurantName}`, 'success');
            modal.remove();
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function reserveDish(restaurantName, dishName) {
        const modal = document.createElement('div');
        modal.className = 'dish-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-concierge-bell"></i> Pedir Plato Especial</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="dish-highlight">
                        <h4>${dishName}</h4>
                        <p>En ${restaurantName}</p>
                        <p class="dish-tip"><i class="fas fa-lightbulb"></i> Recomendamos reservar con 24h de anticipación para platos especiales</p>
                    </div>
                    
                    <form class="dish-form">
                        <div class="form-group">
                            <label>Fecha para disfrutar el plato</label>
                            <input type="date" class="form-control" min="${getTomorrowDate()}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Cantidad de porciones</label>
                            <input type="number" class="form-control" min="1" max="10" value="1" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Instrucciones especiales</label>
                            <textarea class="form-control" placeholder="Ej: Sin picante, extra salsa, bien cocido, etc."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cancelar</button>
                    <button class="btn-primary confirm-dish">
                        <i class="fas fa-shopping-cart"></i> Pedir Plato
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Confirmar pedido
        modal.querySelector('.confirm-dish').addEventListener('click', function() {
            const form = modal.querySelector('.dish-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const dishData = {
                dish: dishName,
                restaurant: restaurantName,
                date: modal.querySelector('input[type="date"]').value,
                portions: modal.querySelector('input[type="number"]').value,
                instructions: modal.querySelector('textarea').value
            };
            
            saveDishOrder(dishData);
            showGastroNotification(`¡${dishName} pedido! Te esperamos en ${restaurantName}`, 'success');
            modal.remove();
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function showRecipe(dishName) {
        const recipes = {
            'Trucha al Mojo de Ajo': {
                ingredients: [
                    '2 truchas frescas',
                    '8 dientes de ajo',
                    '4 cucharadas de mantequilla',
                    'Aceite de oliva',
                    'Sal y pimienta',
                    'Limón',
                    'Perejil fresco'
                ],
                steps: [
                    'Limpiar las truchas y sazonar con sal y pimienta',
                    'Picar finamente el ajo',
                    'Derretir mantequilla con aceite en sartén',
                    'Dorar el ajo sin quemarlo',
                    'Cocinar las truchas 5 minutos por lado',
                    'Bañar con el mojo de ajo',
                    'Servir con limón y perejil'
                ],
                tips: 'Usar trucha fresca de río para mejor sabor'
            },
            'Mole Poblano Tradicional': {
                ingredients: [
                    'Pollo entero',
                    '6 chiles mulatos',
                    '4 chiles pasillas',
                    '2 chiles anchos',
                    '100g chocolate de metate',
                    '1 plátano macho',
                    '1/2 cebolla',
                    '2 dientes de ajo',
                    'Almendras, pasas, ajonjolí',
                    'Tortillas y arroz'
                ],
                steps: [
                    'Desvenar y tostar los chiles',
                    'Remojar en agua caliente',
                    'Licuar con especias y frutos secos',
                    'Colar la mezcla',
                    'Freír en manteca hasta espesar',
                    'Agregar chocolate y cocinar 2 horas',
                    'Servir con pollo, arroz y tortillas'
                ],
                tips: 'El secreto está en la paciencia al cocinar el mole'
            }
        };
        
        const recipe = recipes[dishName];
        if (!recipe) {
            showGastroNotification('Receta no disponible para este plato', 'info');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'recipe-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-book-open"></i> ${dishName}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="recipe-section">
                        <h4><i class="fas fa-carrot"></i> Ingredientes</h4>
                        <ul class="ingredients">
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="recipe-section">
                        <h4><i class="fas fa-mortar-pestle"></i> Preparación</h4>
                        <ol class="steps">
                            ${recipe.steps.map((step, i) => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    
                    <div class="recipe-tips">
                        <h4><i class="fas fa-lightbulb"></i> Consejo del Chef</h4>
                        <p>${recipe.tips}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary close-modal">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
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
    
    function purchaseDrink(drinkName, price) {
        const modal = document.createElement('div');
        modal.className = 'drink-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-shopping-cart"></i> Comprar ${drinkName}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="drink-info">
                        <p><strong>Producto:</strong> ${drinkName}</p>
                        <p><strong>Precio:</strong> ${price}</p>
                        <p><strong>Envío:</strong> Disponible en toda la república</p>
                    </div>
                    
                    <form class="purchase-form">
                        <div class="form-group">
                            <label>Cantidad</label>
                            <select class="form-control" id="drinkQuantity">
                                <option value="1">1 unidad</option>
                                <option value="2">2 unidades</option>
                                <option value="3">3 unidades</option>
                                <option value="6">6 unidades (pack)</option>
                                <option value="12">12 unidades (caja)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Dirección de envío</label>
                            <textarea class="form-control" placeholder="Calle, número, colonia, ciudad, CP" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Teléfono de contacto</label>
                            <input type="tel" class="form-control" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cancelar</button>
                    <button class="btn-primary confirm-purchase">
                        <i class="fas fa-credit-card"></i> Proceder al Pago
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Confirmar compra
        modal.querySelector('.confirm-purchase').addEventListener('click', function() {
            const form = modal.querySelector('.purchase-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const quantity = modal.querySelector('#drinkQuantity').value;
            showGastroNotification(`Compra de ${quantity} ${drinkName} procesada`, 'success');
            modal.remove();
            
            // Simular redirección a pasarela de pago
            setTimeout(() => {
                if (window.NEMI && window.NEMI.Payment) {
                    window.NEMI.Payment.process({
                        item: drinkName,
                        quantity: quantity,
                        price: price
                    });
                }
            }, 1000);
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function bookExperience(experienceName) {
        const experiences = {
            'taller-sidra': {
                title: 'Taller de Elaboración de Sidra',
                price: '$800',
                duration: '4 horas',
                includes: [
                    'Ingredientes y materiales',
                    'Guía experto en sidra',
                    'Botella de sidra artesanal',
                    'Certificado de participación',
                    'Degustación completa'
                ]
            },
            'clase-cocina': {
                title: 'Clase de Cocina Tradicional',
                price: '$600',
                duration: '3 horas',
                includes: [
                    'Todos los ingredientes',
                    'Chef instructor',
                    'Recetario impreso',
                    'Comida completa preparada',
                    'Delantal de chef'
                ]
            }
        };
        
        const experience = experiences[experienceName];
        if (!experience) return;
        
        const modal = document.createElement('div');
        modal.className = 'experience-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-check"></i> ${experience.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="experience-details">
                        <p><strong>Duración:</strong> ${experience.duration}</p>
                        <p><strong>Incluye:</strong></p>
                        <ul>
                            ${experience.includes.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <form class="experience-form">
                        <div class="form-group">
                            <label>Fecha deseada</label>
                            <input type="date" class="form-control" min="${getTomorrowDate()}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Número de participantes</label>
                            <select class="form-control" required>
                                <option value="1">1 persona</option>
                                <option value="2" selected>2 personas</option>
                                <option value="3">3 personas</option>
                                <option value="4">4 personas</option>
                                <option value="5">5 personas</option>
                                <option value="6+">6+ personas (contactar)</option>
                            </select>
                        </div>
                        
                        <div class="price-summary">
                            <h4>Resumen de precio</h4>
                            <p>${experience.price} por persona</p>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Cancelar</button>
                    <button class="btn-primary confirm-experience">
                        <i class="fas fa-check"></i> Reservar Experiencia
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Confirmar experiencia
        modal.querySelector('.confirm-experience').addEventListener('click', function() {
            showGastroNotification(`Experiencia "${experience.title}" reservada`, 'success');
            modal.remove();
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // ============================================
    // 4. FUNCIONES DE ALMACENAMIENTO
    // ============================================
    function saveReservation(data) {
        const reservations = JSON.parse(localStorage.getItem('nemi_gastro_reservations')) || [];
        reservations.push({
            ...data,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('nemi_gastro_reservations', JSON.stringify(reservations));
        
        // Enviar confirmación por email (simulación)
        sendReservationConfirmation(data);
    }
    
    function saveDishOrder(data) {
        const orders = JSON.parse(localStorage.getItem('nemi_dish_orders')) || [];
        orders.push({
            ...data,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('nemi_dish_orders', JSON.stringify(orders));
    }
    
    function sendReservationConfirmation(data) {
        console.log('Enviando confirmación de reserva:', data);
        // Simulación de envío de email
    }
    
    // ============================================
    // 5. FUNCIONES UTILITARIAS
    // ============================================
    function getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    
    function showGastroNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `gastro-notification ${type}`;
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
    // 6. ESTILOS ADICIONALES
    // ============================================
    const gastroStyles = document.createElement('style');
    gastroStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .count-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .gastro-modal,
        .dish-modal,
        .recipe-modal,
        .drink-modal,
        .experience-modal {
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
        
        .gastro-modal .modal-content,
        .dish-modal .modal-content,
        .recipe-modal .modal-content,
        .drink-modal .modal-content,
        .experience-modal .modal-content {
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
        
        .restaurant-info,
        .dish-highlight,
        .drink-info,
        .experience-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .dish-tip {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 14px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        
        .recipe-section {
            margin-bottom: 20px;
        }
        
        .recipe-section h4 {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        
        .ingredients, .steps {
            padding-left: 20px;
        }
        
        .ingredients li {
            margin-bottom: 5px;
            list-style-type: disc;
        }
        
        .steps li {
            margin-bottom: 10px;
        }
        
        .recipe-tips {
            background: #e8f4fc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        
        .price-summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .gastro-notification {
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
        
        .gastro-notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .gastro-notification.success {
            border-left: 4px solid #2ecc71;
        }
        
        .gastro-notification.info {
            border-left: 4px solid #3498db;
        }
    `;
    document.head.appendChild(gastroStyles);
    
    // ============================================
    // 7. INICIALIZACIÓN
    // ============================================
    filterRestaurants();
});