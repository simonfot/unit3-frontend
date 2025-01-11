// Previous code remains...

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach(dc => 
      dc.classList.remove('active')
    );
  });
}

/* Utility Functions */
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* Window Events */
window.addEventListener('resize', debounce(() => {
  // Ensure nav ball stays within bounds
  const navBall = document.getElementById('navBall');
  if (!isFullscreen) {
    updateNavBallPosition(navBall, offsetX, offsetY);
  }
  
  // Update slider position
  const slider = document.getElementById('sectionSlider');
  const pos = slider.style.transform.match(/translate3d\((.*?)px, (.*?)px/);
  if (pos) {
    const [_, x, y] = pos;
    updateSliderPosition(parseFloat(x), parseFloat(y));
  }
}, 100));

// Save state before unload
window.addEventListener('beforeunload', () => {
  // Save current nav ball position
  localStorage.setItem('navBallPosition', JSON.stringify({
    x: offsetX,
    y: offsetY,
    scale: siteScale
  }));
  
  // Save active sections
  localStorage.setItem('activeSections', JSON.stringify(activeSections));
});

// Restore state on load
window.addEventListener('load', () => {
  // Restore nav ball position
  const savedNavPos = localStorage.getItem('navBallPosition');
  if (savedNavPos) {
    const pos = JSON.parse(savedNavPos);
    offsetX = pos.x;
    offsetY = pos.y;
    siteScale = pos.scale;
    
    const navBall = document.getElementById('navBall');
    updateNavBallPosition(navBall, pos.x, pos.y);
    applySiteScale(pos.scale);
  }
  
  // Restore active sections
  const savedSections = localStorage.getItem('activeSections');
  if (savedSections) {
    JSON.parse(savedSections).forEach(name => addSection(name));
  }
});
