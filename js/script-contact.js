const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const navLinks = document.querySelectorAll('.nav-link');
const socialCards = document.querySelectorAll('.social-card');

function handleNavigation(e) {
  const href = this.getAttribute('href');
  
  if (href === '#') {
    e.preventDefault();
    window.location.href = '../error/404.html';
    return;
  }
  
  if (href.startsWith('#') && href !== '#') {
    e.preventDefault();
    const targetId = href;
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
    
    closeMobileMenu();
  }
}

function handleSocialCardClick(e) {
  const url = this.getAttribute('data-url');
  
  if (url === '#') {
    e.preventDefault();
    window.location.href = '../error/404.html';
    return;
  }
  
  if (url && url !== '#' && (url.startsWith('http') || url.startsWith('mailto'))) {
    window.open(url, '_blank');
  }
}

function onScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

function initEvents() {
  window.addEventListener('scroll', onScroll, { passive: true });
  
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  socialCards.forEach(card => {
    card.addEventListener('click', handleSocialCardClick);
  });
  
  hamburger.addEventListener('click', toggleMobileMenu);
  closeMenu.addEventListener('click', toggleMobileMenu);
}

function init() {
  initEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
