// NEMI Admin Panel JavaScript

class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.setupDate();
        this.setupCharts();
        this.setupSidebar();
        this.setupNotifications();
        this.loadDashboardData();
    }

    setupDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('es-MX', options);
        }
    }

    setupSidebar() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.admin-sidebar');
        const mainContent = document.querySelector('.admin-main');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                mainContent.classList.toggle('sidebar-collapsed');
            });
        }

        // Menu navigation
        const menuItems = document.querySelectorAll('.sidebar-menu a');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                menuItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Show corresponding content
                const targetId = item.getAttribute('href').substring(1);
                this.showContent(targetId);
            });
        });
    }

    showContent(contentId) {
        // Hide all content sections
        document.querySelectorAll('.admin-content').forEach(section => {
            section.style.display = 'none';
        });

        // Show target content
        const targetSection = document.getElementById(contentId);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // Update page title
            const pageTitle = document.querySelector('.admin-header h1');
            if (pageTitle) {
                pageTitle.textContent = this.getPageTitle(contentId);
            }

            // Load section-specific data
            this.loadSectionData(contentId);
        }
    }

    getPageTitle(contentId) {
        const titles = {
            'dashboard': 'Dashboard',
            'proveedores': 'Proveedores',
            'reservas': 'Reservas',
            'finanzas': 'Finanzas',
            'contenido': 'Contenido',
            'configuracion': 'Configuración'
        };
        return titles[contentId] || 'Dashboard';
    }

    setupCharts() {
        this.renderRevenueChart();
        this.renderCategoryChart();
    }

    renderRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        // Sample data
        const data = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ingresos (MXN)',
                data: [28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000, 55000, 58000, 62000, 65820],
                borderColor: 'rgb(44, 85, 48)',
                backgroundColor: 'rgba(44, 85, 48, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toLocaleString('es-MX')} MXN`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return `$${value.toLocaleString('es-MX')}`;
                            }
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);
    }

    renderCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const data = {
            labels: ['Hoteles', 'Tours', 'Restaurantes', 'Transporte', 'Eventos'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    'rgb(44, 85, 48)',
                    'rgb(115, 158, 130)',
                    'rgb(211, 47, 47)',
                    'rgb(255, 123, 84)',
                    'rgb(87, 204, 153)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '70%'
            }
        };

        new Chart(ctx, config);
    }

    setupNotifications() {
        const notificationBtn = document.querySelector('.btn-notification');
        if (!notificationBtn) return;

        notificationBtn.addEventListener('click', () => {
            this.showNotifications();
        });
    }

    showNotifications() {
        // Create notifications modal
        const modal = document.createElement('div');
        modal.className = 'notifications-modal';
        modal.innerHTML = `
            <div class="notifications-content">
                <div class="notifications-header">
                    <h3>Notificaciones</h3>
                    <button class="close-notifications">&times;</button>
                </div>
                <div class="notifications-list">
                    <div class="notification-item unread">
                        <div class="notification-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Nuevo proveedor registrado</h4>
                            <p>Hotel Boutique Sierra se registró en el plan Premium</p>
                            <span class="notification-time">Hace 15 minutos</span>
                        </div>
                    </div>
                    <div class="notification-item unread">
                        <div class="notification-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Reserva pendiente de confirmación</h4>
                            <p>Reserva #1234 requiere atención inmediata</p>
                            <span class="notification-time">Hace 2 horas</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Proveedor con pagos atrasados</h4>
                            <p>Restaurante La Trucha tiene 2 pagos pendientes</p>
                            <span class="notification-time">Ayer</span>
                        </div>
                    </div>
                </div>
                <div class="notifications-footer">
                    <button class="btn-mark-all-read">Marcar todo como leído</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notifications-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: flex-end;
                align-items: flex-start;
                z-index: 2000;
            }
            .notifications-content {
                width: 400px;
                height: 100vh;
                background: white;
                box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                animation: slideInRight 0.3s ease;
            }
            .notifications-header {
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notifications-header h3 {
                margin: 0;
                color: var(--primary-color);
            }
            .close-notifications {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            .notifications-list {
                padding: 1rem;
                max-height: calc(100vh - 200px);
                overflow-y: auto;
            }
            .notification-item {
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                cursor: pointer;
                transition: background 0.3s;
            }
            .notification-item:hover {
                background: #f5f5f5;
            }
            .notification-item.unread {
                background: #e8f4fc;
            }
            .notification-icon {
                float: left;
                margin-right: 1rem;
                width: 40px;
                height: 40px;
                background: var(--primary-color);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .notification-content h4 {
                margin: 0 0 0.3rem;
                font-size: 1rem;
            }
            .notification-content p {
                margin: 0 0 0.5rem;
                color: #666;
                font-size: 0.9rem;
            }
            .notification-time {
                font-size: 0.8rem;
                color: #999;
            }
            .notifications-footer {
                padding: 1rem;
                border-top: 1px solid #eee;
            }
            .btn-mark-all-read {
                width: 100%;
                padding: 0.8rem;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);

        // Close modal
        const closeBtn = modal.querySelector('.close-notifications');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            style.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });

        // Mark all as read
        const markReadBtn = modal.querySelector('.btn-mark-all-read');
        markReadBtn.addEventListener('click', () => {
            modal.querySelectorAll('.notification-item').forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification count
            const notificationCount = document.querySelector('.notification-count');
            if (notificationCount) {
                notificationCount.style.display = 'none';
            }
        });
    }

    async loadDashboardData() {
        try {
            // Load recent activity
            await this.loadRecentActivity();
            
            // Load quick stats
            await this.loadQuickStats();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadRecentActivity() {
        // In a real app, this would be an API call
        const activities = [
            {
                type: 'new_provider',
                message: 'Nuevo Proveedor Registrado',
                details: 'Hotel Boutique Sierra se registró en el plan Premium',
                time: 'Hace 15 minutos',
                icon: 'user-plus'
            },
            {
                type: 'reservation',
                message: 'Reserva Confirmada',
                details: 'Ana García reservó 3 noches en Vista Zacatlán Hotel',
                time: 'Hace 2 horas',
                icon: 'calendar-check'
            },
            {
                type: 'review',
                message: 'Nueva Reseña',
                details: 'Carlos Martínez calificó con 5 estrellas el Tour Esferas',
                time: 'Hace 4 horas',
                icon: 'star'
            },
            {
                type: 'payment',
                message: 'Pago Procesado',
                details: 'Transferencia completada a Cabañas Ticomulco',
                time: 'Ayer, 14:30',
                icon: 'money-bill-wave'
            }
        ];

        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item ${activity.type === 'new_provider' ? 'new' : ''}">
                    <div class="activity-icon">
                        <i class="fas fa-${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${activity.message}</h4>
                        <p>${activity.details}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    async loadQuickStats() {
        // In a real app, this would be an API call
        const stats = {
            monthlyRevenue: 45820,
            activeProviders: 75,
            monthlyBookings: 342,
            averageRating: 4.8
        };

        // Update stat cards
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const parent = stat.closest('.stat-card');
            const title = parent.querySelector('h3').textContent;
            
            switch(title) {
                case 'Ingresos Mensuales':
                    stat.textContent = `$${stats.monthlyRevenue.toLocaleString('es-MX')}`;
                    break;
                case 'Proveedores Activos':
                    stat.textContent = stats.activeProviders;
                    break;
                case 'Reservas del Mes':
                    stat.textContent = stats.monthlyBookings;
                    break;
                case 'Rating Promedio':
                    stat.textContent = stats.averageRating;
                    break;
            }
        });
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'proveedores':
                this.loadProvidersData();
                break;
            case 'reservas':
                this.loadReservationsData();
                break;
            case 'finanzas':
                this.loadFinancesData();
                break;
            case 'contenido':
                this.loadContentData();
                break;
            case 'configuracion':
                this.loadSettingsData();
                break;
        }
    }

    async loadProvidersData() {
        const content = document.getElementById('proveedores');
        if (!content) return;

        // In a real app, this would be an API call
        const providers = [
            { id: 1, name: 'Vista Zacatlán Hotel', type: 'Hotel', plan: 'Premium', status: 'active', rating: 4.8 },
            { id: 2, name: 'Cabañas Ticomulco', type: 'Cabañas', plan: 'Básico', status: 'active', rating: 4.4 },
            { id: 3, name: 'Hotel Termales', type: 'Hotel', plan: 'Premium', status: 'pending', rating: 4.9 },
            { id: 4, name: 'Restaurante La Trucha', type: 'Restaurante', plan: 'Premium', status: 'active', rating: 4.7 },
            { id: 5, name: 'Tour Esferas Navideñas', type: 'Tour', plan: 'Básico', status: 'active', rating: 4.9 }
        ];

        content.innerHTML = `
            <div class="section-header">
                <h2>Gestión de Proveedores</h2>
                <button class="btn-primary" id="addProvider">
                    <i class="fas fa-plus"></i> Nuevo Proveedor
                </button>
            </div>
            
            <div class="providers-filters">
                <input type="text" placeholder="Buscar proveedores..." id="searchProviders">
                <select id="filterPlan">
                    <option value="">Todos los planes</option>
                    <option value="basico">Básico</option>
                    <option value="premium">Premium</option>
                </select>
                <select id="filterStatus">
                    <option value="">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="pending">Pendiente</option>
                    <option value="inactive">Inactivo</option>
                </select>
            </div>
            
            <div class="providers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Plan</th>
                            <th>Estado</th>
                            <th>Rating</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="providersList">
                        ${providers.map(provider => `
                            <tr>
                                <td>${provider.name}</td>
                                <td>${provider.type}</td>
                                <td><span class="plan-badge ${provider.plan.toLowerCase()}">${provider.plan}</span></td>
                                <td><span class="status-badge ${provider.status}">${provider.status === 'active' ? 'Activo' : provider.status === 'pending' ? 'Pendiente' : 'Inactivo'}</span></td>
                                <td>
                                    <div class="rating-stars">
                                        ${this.generateStarRating(provider.rating)}
                                        <span>${provider.rating}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-action view" data-id="${provider.id}">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-action edit" data-id="${provider.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-action delete" data-id="${provider.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="pagination">
                <span>Mostrando 1-5 de 75 proveedores</span>
                <div class="pagination-controls">
                    <button class="page-btn" disabled>‹</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">›</button>
                </div>
            </div>
        `;

        // Add styles for providers section
        const style = document.createElement('style');
        style.textContent = `
            .providers-filters {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }
            .providers-filters input,
            .providers-filters select {
                padding: 0.5rem 1rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                min-width: 200px;
            }
            .providers-table {
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin-bottom: 2rem;
            }
            .providers-table table {
                width: 100%;
                border-collapse: collapse;
            }
            .providers-table th,
            .providers-table td {
                padding: 1rem;
                text-align: left;
                border-bottom: 1px solid #eee;
            }
            .providers-table th {
                background: var(--primary-color);
                color: white;
                font-weight: 600;
            }
            .plan-badge {
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .plan-badge.premium {
                background: #ffd700;
                color: #333;
            }
            .plan-badge.básico {
                background: #95a5a6;
                color: white;
            }
            .status-badge {
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .status-badge.active {
                background: #2ecc71;
                color: white;
            }
            .status-badge.pending {
                background: #f39c12;
                color: white;
            }
            .status-badge.inactive {
                background: #e74c3c;
                color: white;
            }
            .rating-stars {
                display: flex;
                align-items: center;
                gap: 0.3rem;
                color: #f39c12;
            }
            .action-buttons {
                display: flex;
                gap: 0.5rem;
            }
            .btn-action {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            .btn-action.view {
                background: #3498db;
                color: white;
            }
            .btn-action.edit {
                background: #2ecc71;
                color: white;
            }
            .btn-action.delete {
                background: #e74c3c;
                color: white;
            }
            .btn-action:hover {
                transform: scale(1.1);
            }
            .pagination {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
            }
            .pagination-controls {
                display: flex;
                gap: 0.5rem;
            }
            .page-btn {
                width: 36px;
                height: 36px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s;
            }
            .page-btn:hover,
            .page-btn.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            .page-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        content.appendChild(style);

        // Add event listeners
        const addBtn = document.getElementById('addProvider');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddProviderModal());
        }

        const actionBtns = document.querySelectorAll('.btn-action');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.btn-action').classList[1];
                const id = e.target.closest('.btn-action').dataset.id;
                this.handleProviderAction(action, id);
            });
        });
    }

    generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    showAddProviderModal() {
        // Implementation for add provider modal
        console.log('Showing add provider modal');
    }

    handleProviderAction(action, id) {
        switch(action) {
            case 'view':
                this.viewProvider(id);
                break;
            case 'edit':
                this.editProvider(id);
                break;
            case 'delete':
                this.deleteProvider(id);
                break;
        }
    }

    viewProvider(id) {
        console.log('Viewing provider:', id);
    }

    editProvider(id) {
        console.log('Editing provider:', id);
    }

    deleteProvider(id) {
        if (confirm('¿Estás seguro de eliminar este proveedor?')) {
            console.log('Deleting provider:', id);
        }
    }

    async loadReservationsData() {
        const content = document.getElementById('reservas');
        if (!content) return;

        // Similar implementation for reservations
        content.innerHTML = `
            <div class="section-header">
                <h2>Gestión de Reservas</h2>
                <button class="btn-primary">
                    <i class="fas fa-plus"></i> Nueva Reserva
                </button>
            </div>
            <p>Sección de reservas en desarrollo...</p>
        `;
    }

    async loadFinancesData() {
        const content = document.getElementById('finanzas');
        if (!content) return;

        content.innerHTML = `
            <div class="section-header">
                <h2>Finanzas</h2>
                <button class="btn-primary">
                    <i class="fas fa-file-export"></i> Exportar Reporte
                </button>
            </div>
            <p>Sección de finanzas en desarrollo...</p>
        `;
    }

    async loadContentData() {
        const content = document.getElementById('contenido');
        if (!content) return;

        content.innerHTML = `
            <div class="section-header">
                <h2>Gestión de Contenido</h2>
                <button class="btn-primary">
                    <i class="fas fa-plus"></i> Nuevo Contenido
                </button>
            </div>
            <p>Sección de contenido en desarrollo...</p>
        `;
    }

    async loadSettingsData() {
        const content = document.getElementById('configuracion');
        if (!content) return;

        content.innerHTML = `
            <div class="section-header">
                <h2>Configuración del Sistema</h2>
                <button class="btn-primary">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
            <p>Sección de configuración en desarrollo...</p>
        `;
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = new AdminPanel();
});