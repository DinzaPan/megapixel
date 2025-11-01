const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const navLinks = document.querySelectorAll('.nav-link');
const planButtons = document.querySelectorAll('.plan-button');
const userBalance = document.getElementById('userBalance');
const currentUserBalance = document.getElementById('currentUserBalance');
const purchaseModal = document.getElementById('purchaseModal');
const purchasePlanName = document.getElementById('purchasePlanName');
const purchaseCost = document.getElementById('purchaseCost');
const currentBalance = document.getElementById('currentBalance');
const planCost = document.getElementById('planCost');
const remainingBalance = document.getElementById('remainingBalance');
const confirmPurchase = document.getElementById('confirmPurchase');
const cancelPurchase = document.getElementById('cancelPurchase');

let userData = {
  username: '',
  balance: 0,
  lastCreditUpdate: Date.now(),
  invoices: []
};

let currentPurchase = {
  planName: '',
  cost: 0
};

function initUserData() {
  const savedData = localStorage.getItem('megapixelUserData');
  if (savedData) {
    const data = JSON.parse(savedData);
    userData = { ...userData, ...data };
    
    updateCreditsFromTime();
    
    if (userData.username) {
      userBalance.style.display = 'block';
      updateBalanceDisplay();
      updateButtonStates();
    }
  }
}

function updateCreditsFromTime() {
  const now = Date.now();
  const timeDiff = now - userData.lastCreditUpdate;
  const minutesPassed = timeDiff / (1000 * 60);
  const creditIntervals = Math.floor(minutesPassed / 7);
  
  if (creditIntervals > 0) {
    const creditsToAdd = creditIntervals * 5;
    userData.balance += creditsToAdd;
    userData.lastCreditUpdate = now - (timeDiff % (7 * 60 * 1000));
    saveUserData();
    updateBalanceDisplay();
    updateButtonStates();
  }
}

function saveUserData() {
  localStorage.setItem('megapixelUserData', JSON.stringify(userData));
}

function updateBalanceDisplay() {
  currentUserBalance.textContent = userData.balance;
}

function updateButtonStates() {
  planButtons.forEach(button => {
    const cost = parseInt(button.getAttribute('data-cost'));
    if (userData.balance < cost) {
      button.disabled = true;
      button.textContent = 'Créditos Insuficientes';
    } else {
      button.disabled = false;
      if (button.getAttribute('data-plan') === 'Plan Mantenimiento') {
        button.textContent = 'Contratar';
      } else {
        button.textContent = 'Seleccionar Plan';
      }
    }
  });
}

function showPurchaseModal(planName, planCostValue) {
  if (!userData.username) {
    alert('Por favor, regístrate primero en la página de créditos');
    window.location.href = 'credits.html';
    return;
  }

  if (userData.balance < planCostValue) {
    alert('No tienes suficientes créditos para este plan');
    return;
  }

  currentPurchase.planName = planName;
  currentPurchase.cost = planCostValue;

  purchasePlanName.textContent = planName;
  purchaseCost.textContent = `${planCostValue} créditos`;
  currentBalance.textContent = `${userData.balance} créditos`;
  planCost.textContent = `${planCostValue} créditos`;
  remainingBalance.textContent = `${userData.balance - planCostValue} créditos`;

  purchaseModal.style.display = 'flex';
}

function confirmPurchaseAction() {
  userData.balance -= currentPurchase.cost;
  
  const now = new Date();
  const invoice = {
    id: 'MPX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    plan: currentPurchase.planName,
    cost: currentPurchase.cost,
    date: now.toLocaleDateString('es-ES'),
    time: now.toLocaleTimeString('es-ES')
  };
  
  userData.invoices.push(invoice);
  saveUserData();
  updateBalanceDisplay();
  updateButtonStates();
  
  purchaseModal.style.display = 'none';
  
  alert(`¡Compra exitosa!\n\nFactura ID: ${invoice.id}\nPlan: ${currentPurchase.planName}\nCosto: ${currentPurchase.cost} créditos\n\nTu nuevo saldo: ${userData.balance} créditos`);
}

function cancelPurchaseAction() {
  purchaseModal.style.display = 'none';
}

function handlePlanPurchase(e) {
  const button = e.target;
  const planName = button.getAttribute('data-plan');
  const planCostValue = parseInt(button.getAttribute('data-cost'));

  showPurchaseModal(planName, planCostValue);
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

function handleModalClick(e) {
  if (e.target === purchaseModal) {
    purchaseModal.style.display = 'none';
  }
}

function initEvents() {
  window.addEventListener('scroll', onScroll);
  
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  planButtons.forEach(button => {
    button.addEventListener('click', handlePlanPurchase);
  });
  
  confirmPurchase.addEventListener('click', confirmPurchaseAction);
  cancelPurchase.addEventListener('click', cancelPurchaseAction);
  purchaseModal.addEventListener('click', handleModalClick);
  
  hamburger.addEventListener('click', toggleMobileMenu);
  closeMenu.addEventListener('click', toggleMobileMenu);
}

function init() {
  initUserData();
  initEvents();
  
  setInterval(() => {
    if (userData.username) {
      userData.balance += 5;
      userData.lastCreditUpdate = Date.now();
      saveUserData();
      updateBalanceDisplay();
      updateButtonStates();
    }
  }, 7 * 60 * 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
