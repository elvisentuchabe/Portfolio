/**
 * projects.js
 * Portfolio data — edit this file to update projects on the site.
 * Exposed as window.projectsData so Babel/React scripts can access it.
 */

window.projectsData = [
  {
    id: 1,
    name: "Total Fit Hub",
    description: "Aplicación web de seguimiento de fitness: entrenamiento de fuerza, peso corporal, hidratación y dieta. SPA React con persistencia local, gráficas en tiempo real y búsqueda de alimentos integrada.",
    technologies: ["React", "Laravel", "PHP", "Tailwind CSS", "Recharts", "SQLite"],
    url: "projects/total-fit-hub/",
    status: "live",
    year: "2026",
    category: "Web App",
  },
  {
    id: 2,
    name: "Restaurante Lumina",
    description:
      "Web experiencial de lujo para alta cocina. Incluye sistema interactivo de reservas en tiempo real, efectos de partículas doradas con HTML5 Canvas API, scroll parallax fluido y mapa interactivo con Leaflet.js.",
    technologies: ["HTML5", "CSS3", "JavaScript ES6+", "Canvas API", "Leaflet.js", "OpenStreetMap"],
    url: "projects/restaurante/",
    status: "live",
    year: "2026",
    category: "Sitio Web Experiencial",
  },
  {
    id: 3,
    name: "MAISON",
    description:
      "Tienda online SPA de objetos de diseño de alta gama. Incluye catálogo interactivo con filtros dinámicos, carrito lateral con cálculo de totales en tiempo real y simulación completa de pasarela de pago con validaciones.",
    technologies: ["HTML5", "CSS3", "JavaScript ES6+", "Intersection Observer", "Intl API"],
    url: "projects/tienda/",
    status: "live",
    year: "2026",
    category: "E-Commerce / SPA",
  },
  {
    id: 4,
    name: "Nexus AI",
    description:
      "Landing page de alto impacto para una startup B2B SaaS de Inteligencia Artificial. Cuenta con comparador antes/después con CSS clip-path, demo interactiva, calculadora de planes, animaciones y micro-interacciones orientadas a la conversión.",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript ES6+", "Intersection Observer", "CSS Animations", "Clip-Path"],
    url: "projects/nexus-ai/",
    status: "live",
    year: "2026",
    category: "SaaS / Landing Page",
  },
  {
    id: 5,
    name: "NexusOS",
    description:
      "Dashboard SaaS y portal de gestión empresarial B2B. Monitorización en tiempo real de métricas financieras (MRR, ARR), analíticas de clientes y transacciones mediante gráficas SVG generadas programáticamente en JavaScript y persistencia con localStorage.",
    technologies: ["HTML5", "CSS3 Grid/Flexbox", "JavaScript ES2022", "SVG Charts", "localStorage", "SPA"],
    url: "projects/nexus-os/",
    status: "live",
    year: "2026",
    category: "SaaS / Dashboard",
  },
  {
    id: 6,
    name: "AURA Clinic",
    description:
      "Web corporativa y landing de alta conversión con estética 'Quiet Luxury' para un centro médico de medicina estética avanzada y longevidad. Incluye comparador interactivo antes/después con soporte táctil, test de diagnóstico en 3 etapas y sistema de reserva con generación de justificantes descargables mediante Blob API.",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript ES6+", "Blob API", "Drag & Touch Events", "Quiet Luxury UX"],
    url: "projects/aura-clinic/",
    status: "live",
    year: "2026",
    category: "Web Corporativa / Salud & Lujo",
  },
];

/**
 * Personal info — used across components.
 */
window.ownerData = {
  firstName: "Vicente",
  lastName: "Romero",
  name: "Vicente Romero",
  shortName: "VR",
  tagline: "Diseño web.\u00A0Sin compromisos.",
  subTagline:
    "Creo experiencias digitales que convierten visitantes en clientes y marcas genéricas en referencias de sector.",
  email: "vromerosaiz@gmail.com",
  available: true,
  availableText: "Disponible para nuevos proyectos",
  location: "España · Remoto",
  socials: {
    twitter: "#",
    linkedin: "#",
    github: "#",
    dribbble: "#",
  },
};
