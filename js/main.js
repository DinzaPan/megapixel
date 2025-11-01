const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const scrollBtn = document.getElementById('scrollBtn');
const cards = document.querySelectorAll('.card');
const projectCards = document.querySelectorAll('.project-card');
const navLinks = document.querySelectorAll('.nav-link');
const projectLinks = document.querySelectorAll('.project-link');

function handleNavigation(e) {
  const href = this.getAttribute('href');
  
  if (href === '#') {
    e.preventDefault();
    window.location.href = './error/404.html';
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

function handleProjectCardClick(e) {
  const url = this.getAttribute('data-url');
  
  if (url === '#') {
    e.preventDefault();
    window.location.href = './error/404.html';
    return;
  }
  
  if (url && url !== '#' && url.startsWith('http')) {
    window.open(url, '_blank');
  }
}

function handleProjectLinkClick(e) {
  const href = this.getAttribute('href');
  
  if (href === '#') {
    e.preventDefault();
    window.location.href = './error/404.html';
    return;
  }
  
  if (href && href !== '#' && href.startsWith('http')) {
    return;
  }
  
  e.preventDefault();
}

function onScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  animateOnScroll();
}

function animateOnScroll() {
  const windowHeight = window.innerHeight;
  
  cards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    if (cardRect.top < windowHeight * 0.85) {
      card.classList.add('in-view');
    }
  });

  projectCards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    if (cardRect.top < windowHeight * 0.85) {
      card.classList.add('in-view');
    }
  });
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
  
  projectCards.forEach(card => {
    card.addEventListener('click', handleProjectCardClick);
  });
  
  projectLinks.forEach(link => {
    link.addEventListener('click', handleProjectLinkClick);
  });
  
  hamburger.addEventListener('click', toggleMobileMenu);
  closeMenu.addEventListener('click', toggleMobileMenu);
  
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#services').scrollIntoView({ 
      behavior: 'smooth' 
    });
  });

  animateOnScroll();
}

function init() {
  initEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
