/**
 * LUMINA — Map Module
 * Real OpenStreetMap integration via Leaflet with Classic Red Pin SVG
 */

(function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  // Real coordinates: Calle Serrano 42, Madrid
  const RESTAURANT_POSITION = [40.42685, -3.68756];

  // Initialize Leaflet Map
  const map = L.map('map', {
    center: RESTAURANT_POSITION,
    zoom: 16,
    scrollWheelZoom: false,
    zoomControl: false
  });

  // OpenStreetMap TileLayer with attribution
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(map);

  // Reposition zoom control to bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Classic Red Pin Icon (SVG)
  const redPinIcon = L.divIcon({
    className: '',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" fill="none">
        <!-- Soft shadow -->
        <ellipse cx="16" cy="40" rx="6" ry="2" fill="rgba(0,0,0,0.18)"/>
        <!-- Pin body -->
        <path d="M16 0C9.37 0 4 5.37 4 12c0 9 12 28 12 28S28 21 28 12C28 5.37 22.63 0 16 0z"
              fill="#E03535"/>
        <!-- Darker contour -->
        <path d="M16 1C9.92 1 5 5.92 5 12c0 8.6 11 27 11 27S27 20.6 27 12C27 5.92 22.08 1 16 1z"
              fill="none" stroke="#B91C1C" stroke-width="1"/>
        <!-- Center white dot -->
        <circle cx="16" cy="12" r="4.5" fill="white" opacity="0.92"/>
      </svg>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42], // bottom tip of the pin
    popupAnchor: [0, -44]
  });

  // Add marker with popup
  const marker = L.marker(RESTAURANT_POSITION, { icon: redPinIcon }).addTo(map);

  marker.bindPopup(`
    <strong>Lumina</strong>
    Calle Serrano, 42<br />
    28001 Madrid, España
  `);
})();
