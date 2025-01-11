// Previous code remains the same...

/* Color Wheel Setup */
function setupColorWheel() {
  const wheel = document.querySelector('.color-wheel');
  let isSelecting = false;
  
  wheel.addEventListener('mousedown', startColorSelect);
  document.addEventListener('mousemove', updateColor);
  document.addEventListener('mouseup', endColorSelect);
  
  // Touch support
  wheel.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startColorSelect(e.touches[0]);
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isSelecting) {
      e.preventDefault();
      updateColor(e.touches[0]);
    }
  });
  
  document.addEventListener('touchend', endColorSelect);
  
  function startColorSelect(e) {
    isSelecting = true;
    updateColor(e);
  }
  
  function updateColor(e) {
    if (!isSelecting) return;
    
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to cursor
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    
    // Convert angle to hue (0-360)
    const hue = ((angle * 180 / Math.PI) + 360) % 360;
    
    // Calculate distance from center (for saturation)
    const distance = Math.min(1, Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + 
      Math.pow(e.clientY - centerY, 2)
    ) / (rect.width / 2));
    
    // Create color
    const color = `hsl(${hue}, ${distance * 100}%, 50%)`;
    document.documentElement.style.setProperty('--theme-color', color);
    localStorage.setItem('lastThemeColor', color);
  }
  
  function endColorSelect() {
    isSelecting = false;
  }
}

/* Section Management */
function addSection(name) {
  if (activeSections.includes(name)) {
    const existing = document.getElementById(`section-${name}`);
    if (existing) existing.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  
  activeSections.push(name);
  
  const section = document.createElement('div');
  section.className = 'section';
  section.id = `section-${name}`;
  
  section.innerHTML = `
    <div class="section-header">
      <div class="drag-handle">⋮⋮</div>
      <h2>${name}</h2>
      <div class="section-controls">
        <button onclick="minimizeSection('${name}')">−</button>
        <button onclick="closeSection('${name}')">×</button>
      </div>
    </div>
    <div class="section-content">
      ${generateSectionContent(name)}
    </div>
  `;
  
  // Make section draggable
  section.draggable = true;
  section.addEventListener('dragstart', handleDragStart);
  section.addEventListener('dragend', handleDragEnd);
  section.addEventListener('dragover', handleDragOver);
  section.addEventListener('drop', handleDrop);
  
  document.getElementById('mainContent').appendChild(section);
  
  // Update nav
  updateSectionOrder();
  updateSlider();
  
  section.scrollIntoView({ behavior: 'smooth' });
}

function generateSectionContent(name) {
  const placeholders = {
    'Menu': `
      <h3>Daily Menu</h3>
      <div class="menu-section">
        <h4>Coffee</h4>
        <p>Espresso • Americano • Latte • Cappuccino</p>
      </div>
      <div class="menu-section">
        <h4>Food</h4>
        <p>Fresh Sandwiches • Daily Specials • Local Pastries</p>
      </div>
    `,
    'By Day': `
      <h3>Daytime at UNIT3</h3>
      <p>A creative space for work, meetings, and community (9am - 4pm)</p>
      <div class="day-features">
        <h4>Workspace</h4>
        <p>Free WiFi • Power Outlets • Natural Light</p>
      </div>
    `,
    'By Night': `
      <h3>Evening at UNIT3</h3>
      <p>Events, exhibitions, and entertainment (6pm - 10pm)</p>
      <div class="night-events">
        <h4>Regular Events</h4>
        <p>DJ Nights • Art Shows • Pop-up Dinners</p>
      </div>
    `,
    'The Fungi Room': `
      <h3>The Fungi Room</h3>
      <p>Exploring the fascinating world of mushrooms</p>
      <div class="fungi-content">
        <h4>Current Grows</h4>
        <p>Lions Mane • Oyster • Reishi</p>
      </div>
    `,
    'Latest': `
      <h3>Latest Updates</h3>
      <div class="updates-grid">
        <div class="update-item">
          <h4>Recent News</h4>
          <p>Latest events, workshops, and community updates</p>
        </div>
        <div class="update-item">
          <h4>Upcoming</h4>
          <p>New exhibitions • Pop-up events • Special collaborations</p>
        </div>
      </div>
    `
  };
  
  return placeholders[name] || `
    <div class="placeholder-content">
      <h3>${name}</h3>
      <p>Content for ${name} section is being developed...</p>
    </div>
  `;
}