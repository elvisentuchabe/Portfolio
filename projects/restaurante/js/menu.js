/**
 * LUMINA — Kinetic Menu Module
 * Clean text list + floating dish preview image following cursor
 */

(function initMenu() {
  const MENU_DATA = {
    starters: [
      {
        name: 'Ostras Gillardeau en Escabeche Cítrico',
        price: '38',
        desc: 'Con espuma de yuzu y caviar de trucha',
        img: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&q=80&auto=format&fit=crop'
      },
      {
        name: 'Vieira a la Plancha',
        price: '44',
        desc: 'Puré de coliflor ahumada, mantequilla de algas',
        img: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80&auto=format&fit=crop'
      },
      {
        name: 'Foie Gras Brûlé',
        price: '52',
        desc: 'Pan brioche artesanal, compota de higo y flor de sal',
        img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&q=80&auto=format&fit=crop'
      }
    ],
    mains: [
      {
        name: 'Lenguado Menier con Alcaparras',
        price: '68',
        desc: 'Mantequilla noisette, limón confitado, verduritas de temporada',
        img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&auto=format&fit=crop'
      },
      {
        name: 'Pichón de Bresse Asado',
        price: '74',
        desc: 'Con salsa de oporto y trufa negra de temporada',
        img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format&fit=crop'
      },
      {
        name: 'Costilla de Wagyu A5 Lacada',
        price: '96',
        desc: 'Miso blanco, espárrago verde, demi-glace reducida 48 horas',
        img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format&fit=crop'
      },
      {
        name: 'Risotto de Parmesano 36 meses',
        price: '54',
        desc: 'Con trufa blanca de Alba y aceite de primera prensada en frío',
        img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80&auto=format&fit=crop'
      }
    ],
    desserts: [
      {
        name: 'Esfera de Chocolate Guanaja 70%',
        price: '22',
        desc: 'Tierra de cacao, helado de vainilla Tahití y láminas de oro comestible',
        img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format&fit=crop'
      },
      {
        name: 'Sorbete de Bergamota y Rosa',
        price: '18',
        desc: 'Con merengue italiano ligero y pétalos cristalizados',
        img: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80&auto=format&fit=crop'
      }
    ]
  };

  const listEl = document.getElementById('menu-list');
  const floatingImg = document.getElementById('floating-img');
  const floatingImgTag = document.getElementById('floating-img-tag');
  const tabBtns = document.querySelectorAll('.tab-btn');

  if (!listEl || !floatingImg || !floatingImgTag) return;

  function renderCategory(category) {
    const items = MENU_DATA[category] || [];
    listEl.innerHTML = items.map((item, index) => {
      const formattedNum = String(index + 1).padStart(2, '0');
      return `
        <li class="menu-item" data-img="${item.img}">
          <div class="item-left">
            <span class="item-index" aria-hidden="true">${formattedNum}</span>
            <div>
              <span class="item-name">${item.name}</span>
              <span class="item-desc">${item.desc}</span>
            </div>
          </div>
          <span class="item-price" aria-label="Precio: ${item.price} euros">
            ${item.price}&thinsp;<span class="currency">€</span>
          </span>
        </li>
      `;
    }).join('');

    attachHoverEvents();
  }

  function attachHoverEvents() {
    const menuItems = listEl.querySelectorAll('.menu-item');
    const wrapper = document.querySelector('.menu-list-wrapper');

    menuItems.forEach((item) => {
      const imgSrc = item.getAttribute('data-img');

      item.addEventListener('mouseenter', (e) => {
        floatingImgTag.src = imgSrc;
        floatingImg.classList.add('visible');
        updateFloatingPosition(e, wrapper);
      });

      item.addEventListener('mousemove', (e) => {
        updateFloatingPosition(e, wrapper);
      });

      item.addEventListener('mouseleave', () => {
        floatingImg.classList.remove('visible');
      });
    });
  }

  function updateFloatingPosition(e, wrapper) {
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left + 24;
    const y = e.clientY - rect.top - 120;
    floatingImg.style.left = `${x}px`;
    floatingImg.style.top = `${y}px`;
  }

  // Tab switching
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const cat = btn.getAttribute('data-category');
      renderCategory(cat);
    });
  });

  // Initial render
  renderCategory('starters');
})();
