// Variables globales
let projects = [];
let deleteProjectId = null;

// Cargar proyectos desde localStorage al iniciar
function loadProjects() {
    const saved = localStorage.getItem('sparkdev-projects');
    if (saved) {
        try {
            projects = JSON.parse(saved);
        } catch (e) {
            console.error('Error al cargar proyectos:', e);
            projects = [];
        }
    }
    renderProjects();
    generateCode();
    updateProjectCount();
}

// Guardar proyectos en localStorage
function saveProjects() {
    try {
        localStorage.setItem('sparkdev-projects', JSON.stringify(projects));
        console.log('Proyectos guardados exitosamente');
    } catch (e) {
        console.error('Error al guardar proyectos:', e);
        showAlert('error', 'Error al guardar los proyectos');
    }
}

// Actualizar contador de proyectos
function updateProjectCount() {
    const count = document.getElementById('projectCount');
    if (count) {
        count.textContent = projects.length;
    }
}

// Vista previa de imagen
document.getElementById('projectImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    const label = document.querySelector('.file-input-label');
    
    if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            showAlert('error', 'Por favor selecciona un archivo de imagen válido');
            return;
        }
        
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showAlert('error', 'La imagen es demasiado grande. Máximo 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            label.innerHTML = '<i class="fas fa-check"></i> Imagen Seleccionada: ' + file.name;
            label.style.borderColor = 'var(--success)';
            label.style.color = 'var(--success)';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Seleccionar Imagen';
        label.style.borderColor = 'rgba(165, 95, 234, 0.5)';
        label.style.color = 'var(--white)';
    }
});

// Manejar envío del formulario
document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const imageFile = document.getElementById('projectImage').files[0];
    
    // Validaciones
    if (!title) {
        showAlert('error', 'El título es obligatorio');
        return;
    }
    
    if (!description) {
        showAlert('error', 'La descripción es obligatoria');
        return;
    }
    
    if (title.length > 100) {
        showAlert('error', 'El título no puede exceder 100 caracteres');
        return;
    }
    
    if (description.length > 500) {
        showAlert('error', 'La descripción no puede exceder 500 caracteres');
        return;
    }
    
    // Mostrar loading
    showLoading(true);
    
    // Procesar imagen
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createProject(title, description, e.target.result, imageFile.name);
        };
        reader.onerror = function() {
            showAlert('error', 'Error al procesar la imagen');
            showLoading(false);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Crear proyecto sin imagen personalizada
        createProject(title, description, '/imagenes/default-project.png', 'default-project.png');
    }
});

// Crear proyecto
function createProject(title, description, imageData, imageName) {
    const project = {
        id: Date.now(),
        title: title,
        description: description,
        image: imageData,
        imageName: imageName,
        createdAt: new Date().toISOString()
    };
    
    projects.push(project);
    saveProjects();
    renderProjects();
    generateCode();
    updateProjectCount();
    
    // Resetear formulario
    resetForm();
    
    showAlert('success', `Proyecto "${title}" agregado exitosamente`);
    showLoading(false);
}

// Resetear formulario
function resetForm() {
    document.getElementById('projectForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    const label = document.querySelector('.file-input-label');
    label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Seleccionar Imagen';
    label.style.borderColor = 'rgba(165, 95, 234, 0.5)';
    label.style.color = 'var(--white)';
}

// Mostrar/ocultar loading en el botón
function showLoading(show) {
    const submitText = document.getElementById('submitText');
    const submitLoading = document.getElementById('submitLoading');
    const submitIcon = document.getElementById('submitIcon');
    const submitBtn = document.querySelector('.btn-primary');
    
    if (show) {
        submitText.style.display = 'none';
        submitIcon.style.display = 'none';
        submitLoading.style.display = 'inline-block';
        submitBtn.disabled = true;
    } else {
        submitText.style.display = 'inline';
        submitIcon.style.display = 'inline';
        submitLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Renderizar proyectos
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    
    if (!grid) return;
    
    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No hay proyectos agregados aún</h3>
                <p>Agrega tu primer proyecto usando el formulario de arriba</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = projects.map((project, index) => `
        <div class="project-card" style="animation-delay: ${index * 0.1}s">
            <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='/imagenes/default-project.png'">
            <div class="project-content">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <div class="project-actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})" title="Eliminar proyecto">
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Eliminar proyecto
function deleteProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        deleteProjectId = id;
        document.getElementById('deleteModal').classList.add('show');
        
        // Actualizar el modal con el nombre del proyecto
        const modalTitle = document.querySelector('.modal-title');
        modalTitle.innerHTML = `Eliminar "${project.title}"`;
    }
}

// Cerrar modal de eliminación
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteProjectId = null;
}

// Confirmar eliminación
function confirmDelete() {
    if (deleteProjectId) {
        const project = projects.find(p => p.id === deleteProjectId);
        projects = projects.filter(p => p.id !== deleteProjectId);
        saveProjects();
        renderProjects();
        generateCode();
        updateProjectCount();
        
        if (project) {
            showAlert('success', `Proyecto "${project.title}" eliminado exitosamente`);
        }
    }
    closeDeleteModal();
}

// Generar código HTML
function generateCode() {
    const codeBlock = document.getElementById('generatedCode');
    if (!codeBlock) return;
    
    if (projects.length === 0) {
        codeBlock.textContent = `    <!-- Sección Proyectos -->
    <section class="section" id="proyectos">
        <h2 class="section-title">Proyectos Destacados</h2>
        <div class="grid">
            <div class="card">
                <img src="/imagenes/default-project.png" alt="Proyecto" class="project-img">
                <h3 class="card-title">Tu Primer Proyecto</h3>
                <p>Agrega proyectos usando el panel de administración para que aparezcan aquí.</p>
            </div>
        </div>
    </section>`;
        return;
    }
    
    const projectCards = projects.map(project => {
        const imagePath = project.imageName.startsWith('/') ? project.imageName : '/imagenes/' + project.imageName;
        return `            <div class="card">
                <img src="${imagePath}" alt="Proyecto" class="project-img">
                <h3 class="card-title">${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description)}</p>
            </div>`;
    }).join('\n');
    
    const fullCode = `    <!-- Sección Proyectos -->
    <section class="section" id="proyectos">
        <h2 class="section-title">Proyectos Destacados</h2>
        <div class="grid">
${projectCards}
        </div>
    </section>`;
    
    codeBlock.textContent = fullCode;
}

// Copiar código al portapapeles
function copyCode() {
    const code = document.getElementById('generatedCode').textContent;
    
    if (!navigator.clipboard) {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess();
        } catch (err) {
            showAlert('error', 'No se pudo copiar el código');
        }
        
        document.body.removeChild(textArea);
        return;
    }
    
    navigator.clipboard.writeText(code).then(() => {
        showCopySuccess();
    }).catch(() => {
        showAlert('error', 'No se pudo copiar el código');
    });
}

// Mostrar éxito al copiar
function showCopySuccess() {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
    btn.style.background = 'var(--success)';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'rgba(165, 95, 234, 0.8)';
    }, 2000);
}

// Mostrar alertas
function showAlert(type, message) {
    const alert = document.getElementById(type + 'Alert');
    const messageSpan = document.getElementById(type + 'Message');
    
    if (!alert || !messageSpan) return;
    
    messageSpan.textContent = message;
    alert.classList.add('show');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
    
    // Scroll hacia arriba para mostrar la alerta
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Exportar proyectos (backup)
function exportProjects() {
    if (projects.length === 0) {
        showAlert('error', 'No hay proyectos para exportar');
        return;
    }
    
    const dataStr = JSON.stringify({
        version: '1.0',
        exportDate: new Date().toISOString(),
        projects: projects
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sparkdev-projects-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showAlert('success', 'Backup descargado exitosamente');
}

// Importar proyectos (restaurar)
document.getElementById('importFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
        showAlert('error', 'Por favor selecciona un archivo JSON válido');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validar estructura del archivo
            if (!data.projects || !Array.isArray(data.projects)) {
                throw new Error('Formato de archivo inválido');
            }
            
            // Validar cada proyecto
            const validProjects = data.projects.filter(project => {
                return project.id && project.title && project.description && 
                       typeof project.title === 'string' && typeof project.description === 'string';
            });
            
            if (validProjects.length === 0) {
                showAlert('error', 'No se encontraron proyectos válidos en el archivo');
                return;
            }
            
            // Confirmar importación si hay proyectos existentes
            if (projects.length > 0) {
                const confirmImport = confirm(`¿Deseas reemplazar los ${projects.length} proyectos existentes con los ${validProjects.length} proyectos del backup?`);
                if (!confirmImport) return;
            }
            
            // Importar proyectos
            projects = validProjects;
            saveProjects();
            renderProjects();
            generateCode();
            updateProjectCount();
            
            showAlert('success', `${validProjects.length} proyectos importados exitosamente`);
            
        } catch (error) {
            console.error('Error al importar:', error);
            showAlert('error', 'Error al importar el archivo: ' + error.message);
        }
    };
    
    reader.onerror = function() {
        showAlert('error', 'Error al leer el archivo');
    };
    
    reader.readAsText(file);
});

// Cerrar modal al hacer clic fuera
document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDeleteModal();
    }
});

// Cerrar alertas manualmente
document.addEventListener('click', function(e) {
    if (e.target.closest('.alert')) {
        e.target.closest('.alert').classList.remove('show');
    }
});

// Atajos de teclado
document.addEventListener('keydown', function(e) {
    // Escape para cerrar modales
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
    
    // Ctrl/Cmd + S para exportar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportProjects();
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando panel de administración...');
    loadProjects();
    
    // Mensaje de bienvenida si es la primera vez
    if (projects.length === 0) {
        setTimeout(() => {
            showAlert('success', '¡Bienvenido al panel de administración de Spark Dev! Agrega tu primer proyecto para comenzar.');
        }, 1000);
    }
});

// Guardar automáticamente cada 30 segundos (por seguridad)
setInterval(() => {
    if (projects.length > 0) {
        saveProjects();
    }
}, 30000);

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    showAlert('error', 'Ha ocurrido un error inesperado. Por favor, recarga la página.');
});

// Funciones de utilidad adicionales
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}