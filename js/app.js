/**
 * Component Loader para desarrollo modular
 * Carga componentes HTML externos usando el atributo data-include
 */
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

function showFileProtocolWarning() {
    if (document.getElementById('cors-warning')) return;
    const banner = document.createElement('div');
    banner.id = 'cors-warning';
    banner.className = 'bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-4 m-4 rounded shadow text-sm';
    banner.innerHTML = `
        <strong>⚠️ Nota de Arquitectura (CORS):</strong> 
        Estás abriendo la página directamente con el protocolo <code>file://</code>. Los navegadores modernos bloquean la carga de componentes externos con <code>fetch</code> en archivos locales. 
        Para ver los componentes cargados, ejecuta un servidor local (por ejemplo con <em>Live Server</em> de VS Code o <code>npx serve .</code>).
    `;
    document.body.prepend(banner);
}

async function loadAllComponents() {
    const elements = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(elements).map(loadComponent));
}

document.addEventListener('DOMContentLoaded', loadAllComponents);
