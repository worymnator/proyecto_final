/**
 * main.js - Sistema de carga de componentes y funcionalidad principal
 * Arquitectura modular para tienda deportiva online
 * Vanilla JavaScript sin dependencias externas
 */

// Configuración global
const CONFIG = {
    componentsPath: 'components/',
    assetsPath: 'assets/',
    api: {
        products: 'data/products.json'
    }
};

// Sistema principal de carga de componentes
class ComponentLoader {
    /**
     * Carga todos los componentes necesarios para la página
     */
    static async loadAllComponents() {
        try {
            // 1. Primero cargar el head dinámicamente
            await this.loadHead();
            
            // 2. Luego cargar header y footer
            await Promise.all([
                this.loadComponent('header', 'header-container'),
                this.loadComponent('footer', 'footer-container')
            ]);
            
            console.log('✅ Todos los componentes cargados correctamente');
        } catch (error) {
            console.error('❌ Error cargando componentes:', error);
            this.showFallbackUI();
        }
    }
    
    /**
     * Carga dinámicamente el contenido del head
     * Método especial porque no podemos usar innerHTML en <head>
     */
    static async loadHead() {
        try {
            const response = await fetch(`${CONFIG.componentsPath}head.html`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status} cargando head`);
            }
            
            const headContent = await response.text();
            
            // Parsear el contenido y agregar cada elemento al head
            const parser = new DOMParser();
            const doc = parser.parseFromString(headContent, 'text/html');
            const headElements = doc.head.children;
            
            // Agregar cada elemento al head real
            for (const element of headElements) {
                document.head.appendChild(element.cloneNode(true));
            }
            
            console.log('✅ Head cargado correctamente');
        } catch (error) {
            console.error('❌ Error cargando head:', error);
            this.loadDefaultHead();
        }
    }
    
    /**
     * Head por defecto si falla la carga
     */
    static loadDefaultHead() {
        const defaultHead = `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SportPro | Tienda Deportiva Online</title>
            <meta name="description" content="Tienda online de artículos deportivos profesionales">
            <link rel="stylesheet" href="${CONFIG.assetsPath}css/main.css">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .fallback-message { padding: 20px; background: #f0f0f0; text-align: center; }
            </style>
        `;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(defaultHead, 'text/html');
        const headElements = doc.head.children;
        
        for (const element of headElements) {
            document.head.appendChild(element.cloneNode(true));
        }
    }
    
    /**
     * Carga un componente HTML regular
     */
    static async loadComponent(componentName, targetId) {
        try {
            const response = await fetch(`${CONFIG.componentsPath}${componentName}.html`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status} cargando ${componentName}`);
            }
            
            const html = await response.text();
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.outerHTML = html;
                console.log(`✅ Componente ${componentName} cargado correctamente`);
                
                // Inicializar funcionalidades específicas del componente
                this.initComponent(componentName);
            } else {
                console.warn(`⚠️ Elemento #${targetId} no encontrado`);
            }
        } catch (error) {
            console.error(`❌ Error cargando ${componentName}:`, error);
            this.showComponentFallback(componentName, targetId);
        }
    }
    
    /**
     * Inicializa funcionalidades específicas de cada componente
     */
    static initComponent(componentName) {
        switch(componentName) {
            case 'header':
                this.initHeader();
                break;
            case 'footer':
                this.initFooter();
                break;
        }
    }
    
    /**
     * Muestra contenido de respaldo para componentes
     */
    static showComponentFallback(componentName, targetId) {
        const fallbacks = {
            'header': `<header class="fallback-header" style="background: #1e40af; color: white; padding: 1rem;">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                    <h1 style="margin: 0;">SPORTPRO</h1>
                    <nav>
                        <a href="index.html" style="color: white; margin-left: 1rem;">Inicio</a>
                        <a href="pages/productos.html" style="color: white; margin-left: 1rem;">Productos</a>
                        <a href="pages/ofertas.html" style="color: white; margin-left: 1rem;">Ofertas</a>
                    </nav>
                </div>
            </header>`,
            'footer': `<footer class="fallback-footer" style="background: #333; color: white; padding: 2rem; text-align: center;">
                <p>&copy; 2024 SportPro Store - Tienda de artículos deportivos</p>
                <p style="font-size: 0.9rem; color: #aaa;">Cargando contenido completo...</p>
            </footer>`
        };
        
        const target = document.getElementById(targetId);
        if (target && fallbacks[componentName]) {
            target.innerHTML = fallbacks[componentName];
        }
    }
    
    /**
     * Muestra UI de respaldo general
     */
    static showFallbackUI() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="fallback-message">
                    <h2>SportPro Store</h2>
                    <p>Estamos cargando la tienda. Si el contenido no aparece, por favor recarga la página.</p>
                    <button onclick="location.reload()">Recargar Página</button>
                </div>
            `;
        }
    }
    
    /**
     * Inicializa funcionalidades del header
     */
    static initHeader() {
        console.log('🚀 Inicializando funcionalidades del header...');
        
        // Menu toggle para móviles
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navList.classList.toggle('nav-list--active');
                menuToggle.classList.toggle('menu-toggle--active');
            });
            
            // Cerrar menú al hacer click en un enlace
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('nav-list--active');
                    menuToggle.classList.remove('menu-toggle--active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
        
        // Carrito modal
        this.initCartModal();
        
        // Actualizar contador del carrito
        if (window.cartManager) {
            window.cartManager.updateCartUI();
        }
    }
    
    /**
     * Inicializa el modal del carrito
     */
    static initCartModal() {
        const cartButton = document.getElementById('cartButton');
        const cartModal = document.getElementById('cartModal');
        const modalClose = document.querySelector('.modal-close');
        
        if (cartButton && cartModal) {
            cartButton.addEventListener('click', () => {
                cartModal.setAttribute('aria-hidden', 'false');
                cartModal.style.display = 'flex';
                setTimeout(() => {
                    cartModal.classList.add('modal--active');
                }, 10);
                
                // Actualizar items del carrito al abrir
                if (window.cartManager) {
                    window.cartManager.updateCartUI();
                }
            });
            
            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    cartModal.setAttribute('aria-hidden', 'true');
                    cartModal.classList.remove('modal--active');
                    setTimeout(() => {
                        cartModal.style.display = 'none';
                    }, 300);
                });
            }
            
            // Cerrar al hacer click fuera del modal
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.setAttribute('aria-hidden', 'true');
                    cartModal.classList.remove('modal--active');
                    setTimeout(() => {
                        cartModal.style.display = 'none';
                    }, 300);
                }
            });
        }
    }
    
    /**
     * Inicializa funcionalidades del footer
     */
    static initFooter() {
        console.log('🚀 Inicializando funcionalidades del footer...');
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                
                if (emailInput && emailInput.value) {
                    this.handleNewsletterSubscription(emailInput.value);
                    emailInput.value = '';
                    
                    // Feedback visual
                    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = '¡Gracias!';
                    submitBtn.style.background = '#059669';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                    }, 2000);
                }
            });
        }
    }
    
    /**
     * Maneja la suscripción al newsletter
     */
    static handleNewsletterSubscription(email) {
        console.log('📧 Suscripción al newsletter:', email);
        // En un proyecto real, aquí haríamos una petición a la API
        alert(`¡Gracias por suscribirte con ${email}! Pronto recibirás nuestras ofertas exclusivas.`);
    }
}

// Gestor del carrito
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sportpro-cart')) || [];
        console.log('🛒 Carrito inicializado con', this.cart.length, 'productos');
    }
    
    /**
     * Agrega un producto al carrito
     */
    addProduct(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showAddToCartFeedback(product);
    }
    
    /**
     * Elimina un producto del carrito
     */
    removeProduct(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }
    
    /**
     * Actualiza la cantidad de un producto
     */
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeProduct(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }
    
    /**
     * Guarda el carrito en localStorage
     */
    saveCart() {
        localStorage.setItem('sportpro-cart', JSON.stringify(this.cart));
    }
    
    /**
     * Actualiza la UI del carrito
     */
    updateCartUI() {
        const countElement = document.getElementById('cartCount');
        const totalElement = document.getElementById('cartTotal');
        const itemsContainer = document.getElementById('cartItems');
        
        if (countElement) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            countElement.textContent = totalItems;
            countElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (totalElement) {
            const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalElement.textContent = totalPrice.toFixed(2);
        }
        
        if (itemsContainer) {
            this.renderCartItems(itemsContainer);
        }
    }
    
    /**
     * Renderiza los items del carrito en el modal
     */
    renderCartItems(container) {
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <p>Tu carrito está vacío</p>
                    <a href="pages/productos.html" class="btn btn-outline">Ver Productos</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${item.price.toFixed(2)}€</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" aria-label="Reducir cantidad">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn plus" aria-label="Aumentar cantidad">+</button>
                    <button class="remove-btn" aria-label="Eliminar producto">&times;</button>
                </div>
            </div>
        `).join('');
        
        // Añadir event listeners a los botones
        container.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.cart-item');
                const productId = itemElement.dataset.id;
                const isPlus = e.target.classList.contains('plus');
                
                const item = this.cart.find(i => i.id == productId);
                if (item) {
                    this.updateQuantity(item.id, isPlus ? item.quantity + 1 : item.quantity - 1);
                }
            });
        });
        
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.cart-item');
                const productId = itemElement.dataset.id;
                this.removeProduct(productId);
            });
        });
    }
    
    /**
     * Muestra feedback visual al agregar al carrito
     */
    showAddToCartFeedback(product) {
        // Crear elemento de feedback
        let feedback = document.querySelector('.cart-feedback');
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'cart-feedback';
            document.body.appendChild(feedback);
        }
        
        feedback.innerHTML = `
            <span>✅ ${product.name} agregado al carrito</span>
        `;
        
        feedback.classList.remove('cart-feedback--show');
        
        // Forzar reflow
        void feedback.offsetWidth;
        
        feedback.classList.add('cart-feedback--show');
        
        setTimeout(() => {
            feedback.classList.remove('cart-feedback--show');
        }, 3000);
    }
}

// Gestor de productos
class ProductManager {
    /**
     * Carga y muestra productos destacados
     */
    static async loadFeaturedProducts() {
        try {
            const container = document.getElementById('featuredProducts');
            if (!container) return;
            
            // Mostrar estado de carga
            container.innerHTML = `
                <div class="loading-products">
                    <div class="loading-spinner"></div>
                    <p>Cargando productos destacados...</p>
                </div>
            `;
            
            // Obtener productos (en un proyecto real sería una API)
            const products = await this.getMockProducts();
            
            // Renderizar productos
            container.innerHTML = products.map(product => `
                <article class="product-card" role="article" data-id="${product.id}">
                    <div class="product-image" role="img" aria-label="${product.name}">
                        <span class="product-badge">${product.badge || ''}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">${product.price.toFixed(2)}€</span>
                            <button class="btn btn-add-cart" data-id="${product.id}" 
                                    aria-label="Agregar ${product.name} al carrito">
                                Agregar
                            </button>
                        </div>
                    </div>
                </article>
            `).join('');
            
            // Añadir event listeners a los botones
            container.querySelectorAll('.btn-add-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const product = products.find(p => p.id == productId);
                    if (product && window.cartManager) {
                        window.cartManager.addProduct(product);
                    }
                });
            });
            
            console.log('✅ Productos destacados cargados:', products.length);
            
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            this.showProductsError();
        }
    }
    
    /**
     * Datos de ejemplo
     */
    static async getMockProducts() {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return [
            {
                id: 1,
                name: 'Zapatillas Running Pro',
                description: 'Tecnología de amortiguación avanzada para máxima comodidad',
                price: 89.99,
                badge: '🔥 Más vendido'
            },
            {
                id: 2,
                name: 'Set Pesas Ajustables',
                description: 'De 5kg a 25kg con barra olímpica incluida',
                price: 149.99,
                badge: '✨ Nuevo'
            },
            {
                id: 3,
                name: 'Bicicleta de Montaña',
                description: 'Suspensión delantera, 21 velocidades, marco de aluminio',
                price: 299.99,
                badge: '⚡ Oferta'
            },
            {
                id: 4,
                name: 'Balón Fútbol Profesional',
                description: 'Tamaño 5, material de alta durabilidad, diseño oficial',
                price: 34.99,
                badge: '🏆 Top'
            }
        ];
    }
    
    /**
     * Muestra mensaje de error
     */
    static showProductsError() {
        const container = document.getElementById('featuredProducts');
        if (container) {
            container.innerHTML = `
                <div class="products-error">
                    <p>😕 No pudimos cargar los productos en este momento.</p>
                    <button onclick="ProductManager.loadFeaturedProducts()" class="btn btn-outline">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
}

// Inicialización de la aplicación
class App {
    static async init() {
        console.log('🚀 Inicializando SportPro Store...');
        
        // Mostrar indicador de carga
        this.showLoadingIndicator();
        
        try {
            // 1. Inicializar gestor del carrito (lo necesitamos pronto)
            window.cartManager = new CartManager();
            
            // 2. Cargar todos los componentes
            await ComponentLoader.loadAllComponents();
            
            // 3. Cargar productos destacados (si estamos en la página de inicio)
            if (document.getElementById('featuredProducts')) {
                await ProductManager.loadFeaturedProducts();
            }
            
            // 4. Inicializar funcionalidades adicionales
            this.initCheckout();
            this.initScrollEffects();
            
            console.log('✅ Aplicación inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            this.showErrorUI();
        } finally {
            // Ocultar indicador de carga
            this.hideLoadingIndicator();
        }
    }
    
    /**
     * Muestra indicador de carga
     */
    static showLoadingIndicator() {
        // Podríamos agregar un spinner aquí si queremos
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s';
    }
    
    /**
     * Oculta indicador de carga
     */
    static hideLoadingIndicator() {
        document.body.style.opacity = '1';
    }
    
    /**
     * Inicializa el proceso de checkout
     */
    static initCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (!window.cartManager || window.cartManager.cart.length === 0) {
                    alert('Tu carrito está vacío');
                    return;
                }
                
                const total = window.cartManager.cart.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0
                ).toFixed(2);
                
                alert(`Procesando compra de ${window.cartManager.cart.length} productos...\nTotal: ${total}€`);
                
                // Simular proceso de pago
                setTimeout(() => {
                    alert('¡Compra realizada con éxito! Gracias por tu pedido.');
                    window.cartManager.cart = [];
                    window.cartManager.saveCart();
                    window.cartManager.updateCartUI();
                    
                    // Cerrar modal
                    const cartModal = document.getElementById('cartModal');
                    if (cartModal) {
                        cartModal.setAttribute('aria-hidden', 'true');
                        cartModal.classList.remove('modal--active');
                        setTimeout(() => {
                            cartModal.style.display = 'none';
                        }, 300);
                    }
                }, 1500);
            });
        }
    }
    
    /**
     * Efectos de scroll para mejor UX
     */
    static initScrollEffects() {
        let lastScroll = 0;
        const header = document.querySelector('.main-header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
                
                // Ocultar/mostrar header al hacer scroll
                if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scrolling down
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    header.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
            });
        }
    }
    
    /**
     * Muestra UI de error
     */
    static showErrorUI() {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <section class="error-section">
                    <div class="container">
                        <h2>Algo salió mal</h2>
                        <p>No pudimos cargar la tienda en este momento. Por favor, intenta de nuevo.</p>
                        <button onclick="location.reload()" class="btn btn-primary">Recargar Página</button>
                    </div>
                </section>
            `;
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

// Exportar para uso global (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.App = App;
    window.ComponentLoader = ComponentLoader;
    window.CartManager = CartManager;
    window.ProductManager = ProductManager;
}
/**
 * PathFixer - Soluciona problemas de rutas en desarrollo local
 */
class PathFixer {
    static init() {
        // Solo corregir si estamos en file:// (desarrollo local)
        if (window.location.protocol === 'file:') {
            this.fixFileProtocolPaths();
        }
    }
    
    static fixFileProtocolPaths() {
        console.log('🔧 Corrigiendo rutas para file:// protocol');
        
        // Obtener la ruta base actual
        const currentPath = window.location.pathname;
        const isInPages = currentPath.includes('/pages/');
        
        // Corregir todos los enlaces
        document.querySelectorAll('a').forEach(link => {
            const originalHref = link.getAttribute('href');
            
            if (!originalHref) return;
            
            // Ignorar enlaces externos, mailto, tel, etc.
            if (originalHref.startsWith('http') || 
                originalHref.startsWith('#') ||
                originalHref.startsWith('mailto:') ||
                originalHref.startsWith('tel:')) {
                return;
            }
            
            let newHref = originalHref;
            
            // Si el enlace es absoluto (/ o /pages/...)
            if (originalHref.startsWith('/')) {
                // Convertir a relativo
                if (originalHref === '/') {
                    newHref = isInPages ? '../index.html' : 'index.html';
                } else if (originalHref.startsWith('/pages/')) {
                    newHref = isInPages ? 
                        originalHref.substring(6) :  // ej: "productos.html"
                        'pages' + originalHref.substring(5); // ej: "pages/productos.html"
                }
            }
            // Si el enlace es ./ y estamos en pages
            else if (originalHref.startsWith('./') && isInPages) {
                if (originalHref === './') {
                    newHref = '../index.html';
                } else if (originalHref === './index.html') {
                    newHref = '../index.html';
                }
            }
            
            if (newHref !== originalHref) {
                console.log(`🔗 Corrigiendo ruta: ${originalHref} → ${newHref}`);
                link.setAttribute('href', newHref);
            }
        });
        
        // También corregir recursos (CSS, JS)
        document.querySelectorAll('link[href], script[src]').forEach(resource => {
            const attr = resource.hasAttribute('href') ? 'href' : 'src';
            const originalUrl = resource.getAttribute(attr);
            
            if (originalUrl && originalUrl.startsWith('/')) {
                const newUrl = isInPages ? 
                    '..' + originalUrl : 
                    '.' + originalUrl;
                resource.setAttribute(attr, newUrl);
            }
        });
    }
}