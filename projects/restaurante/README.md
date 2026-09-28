# Lumina — Alta Cocina (Awwwards Style Landing Page)

Landing page estática y moderna para el restaurante de alta cocina **Lumina**, desarrollada con arquitectura limpia en **HTML5, CSS3 y JavaScript Vanilla (ES6)** sin dependencias de compilación ni frameworks. Lista para abrir con doble clic, subir a cualquier hosting o integrar directamente en un portfolio.

---

## 📁 Estructura del Proyecto

```
Restaurante/
├── index.html          # Estructura semántica completa y metadata SEO
├── favicon.svg         # Isotipo minimalista en SVG
├── css/
│   └── style.css       # Design tokens, tipografías, transiciones y responsive design
└── js/
    ├── cursor.js       # Cursor cinético con anillo + punto y estados hover/click
    ├── menu.js         # Lista de platos + imagen flotante interactiva que sigue el cursor
    ├── reservations.js # Carrusel gestual de fechas, burbujas de tiempo, resumen en vivo y partículas doradas en Canvas
    ├── map.js          # Integración OpenStreetMap (Leaflet CDN) con chincheta roja clásica en Calle Serrano 42
    └── main.js         # Scroll reveal (IntersectionObserver), parallax en Hero y menú móvil
```

---

## 🌟 Características y Experiencia de Usuario (Wow Factor)

1. **Cursor Personalizado Cinético:** Anillo y punto minimalista que se adaptan con transformaciones suaves sobre elementos interactivos.
2. **Hero con Parallax & Geometría Sutil:** Fondo sutil con efecto parallax y tipografía *Cormorant Garamond*.
3. **Carta Cinética:** Al pasar el cursor sobre cualquier plato, una imagen flotante en alta resolución sigue suavemente el movimiento del puntero con inclinación y escala orgánica.
4. **Sistema de Reservas "Instant Flow":**
   - Selector de comensales.
   - Carrusel de fechas horizontal interactivo (arrastrar o hacer clic).
   - "Tiempo de burbujas" con micro-animaciones de entrada escalonadas según disponibilidad.
   - Resumen dinámico en tiempo real (`2 Pers. · Mié 20 Oct · 20:30h`).
   - Botón de confirmación con explosión de partículas doradas en Canvas HTML5 y transición a estado confirmado sin recarga.
5. **Mapa Real con OpenStreetMap & Chincheta Roja:** Ubicación precisa en Calle Serrano 42, Madrid, con marcador personalizado en forma de chincheta roja clásica y popup estilizado.
6. **Animaciones Reveal on Scroll:** Entrada fluida de secciones con desvanecimiento hacia arriba mediante `IntersectionObserver`.
7. **100% Responsive:** Adaptado a pantallas móviles, tablets y monitores de escritorio.
