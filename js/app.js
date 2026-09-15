/**
 * IESTP Huanta - Script Principal y Cargador Modular de Componentes
 */

// Función para cambiar de pestaña en la sección Nosotros (Misión, Visión, Valores)
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white', 'shadow-purple-200');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });

    const activeBtn = document.getElementById('tab-btn-' + tabId);
    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-100', 'text-slate-700');
        activeBtn.classList.add('bg-purple-600', 'text-white', 'shadow-purple-200');
    }
};

// Carga individual de componentes por data-include
async function loadComponent(element) {
    const file = element.getAttribute('data-include');
    if (!file) return;

    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} al cargar ${file}`);
        }
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(`[ComponentLoader] Error cargando ${file}:`, error);
        if (window.location.protocol === 'file:') {
            showFileProtocolWarning();
        }
    }
}

// Advertencia amigable si se abre mediante file:// (CORS restrictivo de navegadores)
function showFileProtocolWarning() {
    if (document.getElementById('cors-warning')) return;
    const banner = document.createElement('div');
    banner.id = 'cors-warning';
    banner.className = 'bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-4 m-4 rounded-xl shadow-md text-sm';
    banner.innerHTML = `
        <strong>Aviso de Arquitectura (CORS):</strong> 
        Estás abriendo la página directamente con el protocolo <code>file://</code>. Los navegadores bloquean la carga de componentes externos con <code>fetch</code> en archivos locales. 
        Para visualizar todos los componentes cargados, ejecuta un servidor local (por ejemplo con <em>Live Server</em> de VS Code o <code>npx serve .</code>).
    `;
    document.body.prepend(banner);
}

// Inicializar interacciones delegadas (menú móvil, pestañas, scroll)
function initInteractions() {
    // Toggle Menú Móvil usando delegación de eventos
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#mobile-menu-btn');
        if (toggleBtn) {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        }

        // Cerrar menú móvil al hacer clic en un enlace interno
        const mobileLink = e.target.closest('#mobile-menu a');
        if (mobileLink) {
            const menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.add('hidden');
        }
    });
}

// Carga de todos los componentes y luego inicialización
async function loadAllComponents() {
    const elements = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(elements).map(loadComponent));
    initInteractions();
}

document.addEventListener('DOMContentLoaded', loadAllComponents);
