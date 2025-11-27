const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const navLinks = document.querySelectorAll('.nav-link');

const welcomeCard = document.getElementById('welcomeCard');
const creditsSystem = document.getElementById('creditsSystem');
const usernameInput = document.getElementById('usernameInput');
const confirmButton = document.getElementById('confirmButton');

const balanceAmount = document.getElementById('balanceAmount');
const invoicesList = document.getElementById('invoicesList');

const invoiceModal = document.getElementById('invoiceModal');
const invoiceId = document.getElementById('invoiceId');
const invoicePlan = document.getElementById('invoicePlan');
const invoiceCost = document.getElementById('invoiceCost');
const invoiceDate = document.getElementById('invoiceDate');
const invoiceTime = document.getElementById('invoiceTime');
const closeInvoice = document.getElementById('closeInvoice');

let userData = {
  username: '',
  balance: 200,
  lastCreditUpdate: Date.now(),
  invoices: []
};

const CREDITS_PER_INTERVAL = 7;
const GENERATION_INTERVAL = 2 * 60 * 60 * 1000;

function initUserData() {
  const savedData = localStorage.getItem('megapixelUserData');
  if (savedData) {
    const data = JSON.parse(savedData);
    userData = { ...userData, ...data };
    
    updateCreditsFromTime();
    
    if (userData.username) {
      welcomeCard.style.display = 'none';
      creditsSystem.style.display = 'block';
      updateUI();
    }
  }
}

function updateCreditsFromTime() {
  const now = Date.now();
  const timeDiff = now - userData.lastCreditUpdate;
  
  if (timeDiff >= GENERATION_INTERVAL) {
    const intervalsPassed = Math.floor(timeDiff / GENERATION_INTERVAL);
    const creditsToAdd = intervalsPassed * CREDITS_PER_INTERVAL;
    
    if (creditsToAdd > 0) {
      userData.balance += creditsToAdd;
      userData.lastCreditUpdate = now - (timeDiff % GENERATION_INTERVAL);
      saveUserData();
      updateUI();
    }
  }
}

function saveUserData() {
  localStorage.setItem('megapixelUserData', JSON.stringify(userData));
}

function updateUI() {
  balanceAmount.textContent = userData.balance;
  updateInvoicesList();
}

function updateInvoicesList() {
  if (userData.invoices.length === 0) {
    invoicesList.innerHTML = '<div class="no-invoices">No hay facturas registradas</div>';
    return;
  }
  
  const recentInvoices = userData.invoices.slice(-3).reverse();
  invoicesList.innerHTML = '';
  
  recentInvoices.forEach(invoice => {
    const invoiceItem = document.createElement('div');
    invoiceItem.className = 'invoice-item';
    invoiceItem.setAttribute('data-invoice-id', invoice.id);
    invoiceItem.innerHTML = `
      <div class="invoice-info">
        <div class="invoice-plan">${invoice.plan}</div>
        <div class="invoice-date">${invoice.date}</div>
      </div>
      <div class="invoice-amount">-${invoice.cost} créditos</div>
    `;
    
    invoiceItem.addEventListener('click', () => {
      showInvoiceDetails(invoice);
    });
    
    invoicesList.appendChild(invoiceItem);
  });
}

function showInvoiceDetails(invoice) {
  invoiceId.textContent = invoice.id;
  invoicePlan.textContent = invoice.plan;
  invoiceCost.textContent = `${invoice.cost} créditos`;
  invoiceDate.textContent = invoice.date;
  invoiceTime.textContent = invoice.time;
  
  invoiceModal.style.display = 'flex';
}

function generateInvoiceId() {
  return 'MPX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function formatDate(date) {
  return date.toLocaleDateString('es-ES');
}

function formatTime(date) {
  return date.toLocaleTimeString('es-ES');
}

function handleUserConfirmation() {
  const username = usernameInput.value.trim();
  
  if (username === '') {
    alert('Por favor, ingresa un nombre de usuario');
    return;
  }
  
  userData.username = username;
  saveUserData();
  
  welcomeCard.style.display = 'none';
  creditsSystem.style.display = 'block';
  updateUI();
}

function handleNavigation(e) {
  const href = this.getAttribute('href');
  
  if (href === '#') {
    e.preventDefault();
    window.location.href = '../error/404.html';
    return;
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

function closeInvoiceModal() {
  invoiceModal.style.display = 'none';
}

function handleModalClick(e) {
  if (e.target === invoiceModal) {
    closeInvoiceModal();
  }
}

function initEvents() {
  window.addEventListener('scroll', onScroll);
  
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  confirmButton.addEventListener('click', handleUserConfirmation);
  usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserConfirmation();
  });
  
  closeInvoice.addEventListener('click', closeInvoiceModal);
  invoiceModal.addEventListener('click', handleModalClick);
  
  hamburger.addEventListener('click', toggleMobileMenu);
  closeMenu.addEventListener('click', toggleMobileMenu);
}

function init() {
  initUserData();
  initEvents();
  
  window.showPurchaseModal = function(planName, planCost) {
    if (userData.balance < planCost) {
      alert('No tienes suficientes créditos para este plan');
      return;
    }
    
    userData.balance -= planCost;
    
    const now = new Date();
    const invoice = {
      id: generateInvoiceId(),
      plan: planName,
      cost: planCost,
      date: formatDate(now),
      time: formatTime(now)
    };
    
    userData.invoices.push(invoice);
    saveUserData();
    updateUI();
    
    showInvoiceDetails(invoice);
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
