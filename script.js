// State tracking
let activeSections = [];
let draggedSection = null;
let siteScale = 1.0;
let isFullscreen = false;
let previousScale = 1.0;

// Scale limits
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.5;

// Nav ball drag state
let isDragging = false;
let startX = 0, startY = 0;
let offsetX = 0, offsetY = 0;

document.addEventListener('DOMContentLoaded', () => {
  setupColorWheel();
  setupDropdowns();
  setupNavBall();
  setupSectionSlider();
  
  // Open Latest by default
  setTimeout(() => addSection('Latest'), 100);
});

/* Nav Ball Setup */
function setupNavBall() {
  const navBall = document.getElementById('navBall');
  
  navBall.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  // Touch support
  navBall.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrag(e.touches[0]);
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      e.preventDefault();
      drag(e.touches[0]);
    }
  });
  
  document.addEventListener('touchend', endDrag);
  
  // Click to toggle fullscreen (only if not dragging)
  navBall.addEventListener('click', (e) => {
    if (!isDragging) {
      toggleFullscreen();
    }
  });
}

function startDrag(e) {
  if (isFullscreen) return;
  
  isDragging = true;
  const navBall = document.getElementById('navBall');
  navBall.style.cursor = 'grabbing';
  
  // Store initial position
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
}

function drag(e) {
  if (!isDragging || isFullscreen) return;
  
  // Calculate new position
  offsetX = e.clientX - startX;
  offsetY = e.clientY - startY;
  
  // Update nav ball position
  const navBall = document.getElementById('navBall');
  updateNavBallPosition(navBall, offsetX, offsetY);
  
  // Calculate scale based on distance from origin
  const baseX = 250; // sidebar width
  const baseY = 60;  // header height
  const deltaX = offsetX;
  const deltaY = offsetY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Scale based on distance, with limits
  const newScale = Math.max(MIN_SCALE, 
                          Math.min(MAX_SCALE, 
                                 1 + (distance / 500)));
  
  siteScale = newScale;
  applySiteScale(newScale);
}

function endDrag() {
  isDragging = false;
  const navBall = document.getElementById('navBall');
  navBall.style.cursor = 'grab';
}

// Position nav ball within bounds
function updateNavBallPosition(ball, x, y) {
  const header = document.querySelector('header');
  const sidebar = document.querySelector('.sidebar');
  
  // Base position (intersection of header and sidebar)
  const baseX = sidebar.offsetWidth;
  const baseY = header.offsetHeight;
  
  // Calculate new position with bounds
  const maxX = window.innerWidth - ball.offsetWidth;
  const maxY = window.innerHeight - ball.offsetHeight;
  
  const newX = Math.max(baseX, Math.min(baseX + x, maxX));
  const newY = Math.max(baseY, Math.min(baseY + y, maxY));
  
  // Update position relative to base point
  ball.style.transform = `translate(${newX - baseX}px, ${newY - baseY}px)`;
}

// Toggle fullscreen mode
function toggleFullscreen() {
  const navBall = document.getElementById('navBall');
  
  if (!isFullscreen) {
    // Enter fullscreen
    isFullscreen = true;
    previousScale = siteScale;
    navBall.classList.add('fullscreen');
    
    // Set a slightly larger scale for fullscreen
    applySiteScale(1.2);
    
    // Move nav ball to top-left corner
    navBall.style.transform = 'none';
    
  } else {
    // Exit fullscreen
    isFullscreen = false;
    navBall.classList.remove('fullscreen');
    
    // Restore previous scale
    applySiteScale(previousScale);
    
    // Restore previous position
    updateNavBallPosition(navBall, offsetX, offsetY);
  }
}

// Apply scale to main content areas
function applySiteScale(scale) {
  document.documentElement.style.setProperty('--site-scale', scale);
}