// Efecto scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Función para menú de hamburguesa
document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Verificar si los elementos existen
    if (navbarToggle && navLinks) {
        navbarToggle.addEventListener('click', function () {
            // Toggle para mostrar/ocultar el menú
            navLinks.classList.toggle('active');
            navbarToggle.classList.toggle('active');

            // Cambiar el ícono de hamburguesa a "X" y viceversa
            const icon = navbarToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Cerrar el menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navbarToggle.classList.remove('active');
                
                const icon = navbarToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});

// Animación del carrusel en el footer
document.addEventListener('DOMContentLoaded', function() {
    // Duplica los elementos para una animación continua
    const carouselItems = document.querySelector('.carousel-items');
    if (carouselItems) {
        const clone = carouselItems.cloneNode(true);
        const carouselContent = document.querySelector('.carousel-content');
        if (carouselContent) {
            carouselContent.appendChild(clone);
            
            // Ajusta la animación basada en la cantidad de elementos
            const items = carouselItems.querySelectorAll('.carousel-item');
            const scrollWidth = carouselItems.scrollWidth;
            const duration = scrollWidth / 50; // Velocidad de desplazamiento
            
            // Aplica la duración de la animación dinámicamente
            const carouselElements = document.querySelectorAll('.carousel-items');
            carouselElements.forEach(element => {
                element.style.animation = `scroll ${duration}s linear infinite`;
            });
        }
    }
});

// Función para crear la animación de bienvenida
function createWelcomeAnimation() {
    // Crear el elemento principal
    const welcomeScreen = document.createElement('div');
    welcomeScreen.className = 'welcome-screen';
    
    // Crear el logo
    const welcomeLogo = document.createElement('div');
    welcomeLogo.className = 'welcome-logo';
    
    const logoText = document.createElement('div');
    logoText.className = 'welcome-logo-text';
    logoText.textContent = 'Spark Dev';
    
    welcomeLogo.appendChild(logoText);
    
    // Crear la barra de carga
    const loadingBar = document.createElement('div');
    loadingBar.className = 'welcome-loading';
    
    // Crear el contenedor de destellos
    const sparklesContainer = document.createElement('div');
    sparklesContainer.className = 'welcome-sparkles';
    
    // Crear destellos aleatorios
    for (let i = 0; i < 50; i++) {
        createSparkle(sparklesContainer);
    }
    
    // Agregar elementos al DOM
    welcomeScreen.appendChild(sparklesContainer);
    welcomeScreen.appendChild(welcomeLogo);
    welcomeScreen.appendChild(loadingBar);
    document.body.appendChild(welcomeScreen);
    
    // Bloquear el scroll mientras la animación está activa
    document.body.style.overflow = 'hidden';
    
    // Ocultar la pantalla de bienvenida después de la animación
    setTimeout(() => {
        welcomeScreen.classList.add('welcome-hidden');
        document.body.style.overflow = '';
        
        // Eliminar del DOM después de la transición
        setTimeout(() => {
            document.body.removeChild(welcomeScreen);
        }, 500);
    }, 3500);
}

// Función para crear un destello
function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Posición aleatoria
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    sparkle.style.left = `${x}%`;
    sparkle.style.top = `${y}%`;
    
    // Tamaño aleatorio
    const size = Math.random() * 4 + 1;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Retraso aleatorio para la animación
    const delay = Math.random() * 2;
    sparkle.style.animationDelay = `${delay}s`;
    
    // Color aleatorio (tonos de púrpura y blanco)
    const colors = ['#8A2BE2', '#A55FEA', '#ffffff', '#e2caff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.backgroundColor = color;
    
    // Añadir sombra
    sparkle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    container.appendChild(sparkle);
}

// Ejecutar animación de bienvenida cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    createWelcomeAnimation();
});



// Cargar proyectos dinámicamente
function loadDynamicProjects() {
    const projectsGrid = document.getElementById('dynamic-projects');
    const savedProjects = localStorage.getItem('sparkdev-projects');
    
    if (!projectsGrid) return;
    
    if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        projectsGrid.innerHTML = projects.map(project => `
            <div class="card">
                <img src="${project.imageName.startsWith('/') ? project.imageName : '/imagenes/' + project.imageName}" alt="Proyecto" class="project-img">
                <h3 class="card-title">${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `).join('');
    } else {
        // Mostrar proyectos por defecto
        projectsGrid.innerHTML = `
            <div class="card">
                <img src="/imagenes/menuadmin.png" alt="Proyecto 1" class="project-img">
                <h3 class="card-title">CREMOSO HELADERIA</h3>
                <p>Un sistema de gestión a medida que incluye procesamiento de ventas y pagos, gestión de inventario y un panel administrativo personalizado.</p>
            </div>
            <div class="card">
                <img src="/imagenes/stats.png" alt="Proyecto 2" class="project-img">
                <h3 class="card-title">App Financiera</h3>
                <p>Aplicación móvil para control de gastos con análisis de datos, visualizaciones y recomendaciones personalizadas.</p>
            </div>
            <div class="card">
                <img src="/imagenes/image.png" alt="Proyecto 3" class="project-img">
                <h3 class="card-title">App Control Taller</h3>
                <p>Aplicación para control de Clientes, vehiculos y Citas para el mismo, cuenta con opciones de Agregado, Borrado y Modificacion.</p>
            </div>
        `;
    }
}

// Cargar al iniciar la página
document.addEventListener('DOMContentLoaded', loadDynamicProjects);