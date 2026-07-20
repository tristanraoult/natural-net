/* ==========================================================================
   INTERACTIONS & ANIMATIONS - NATURAL-NET REDESIGN 2026
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMobileMenu();
  initSplitText();
  initScrollReveal();
  initMagneticButtons();
  initCounters();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. CUSTOM CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  // Only enable custom cursor on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  const cursorDot = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp animation for cursor follower
  function animateCursor() {
    // Lerp cursor follower (slower speed)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Lerp dot (faster speed)
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .project-card, .menu-trigger');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.backgroundColor = 'rgba(88, 39, 228, 0.1)';
      cursor.style.borderColor = 'var(--success)';
      cursorDot.style.backgroundColor = 'var(--primary-light)';
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.borderColor = 'var(--primary-light)';
      cursorDot.style.backgroundColor = 'var(--success)';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  
  if (!hamburger || !menuOverlay) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Toggle body scroll to prevent background scrolling when menu is open
    if (menuOverlay.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking links
  const mobileLinks = menuOverlay.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. SPLIT TEXT FOR HERO TITLES
   -------------------------------------------------------------------------- */
function initSplitText() {
  const splitElements = document.querySelectorAll('.split-words');
  
  splitElements.forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = '';
    
    words.forEach((word, idx) => {
      const container = document.createElement('span');
      container.className = 'word-reveal';
      
      const span = document.createElement('span');
      span.textContent = word + (idx < words.length - 1 ? ' ' : '');
      // Add animation delay based on word index
      span.style.animationDelay = `${idx * 0.1}s`;
      
      container.appendChild(span);
      el.appendChild(container);
    });
  });
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   5. MAGNETIC BUTTONS
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');
  if (buttons.length === 0 || window.matchMedia('(pointer: coarse)').matches) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      // Calculate coordinates relative to button center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull button slightly towards mouse (max 15px)
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      
      // If there is an inner text/arrow, we can pull it even more
      const inner = btn.querySelector('.btn-arrow');
      if (inner) {
        inner.style.transform = `translateX(${x * 0.15}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      // Reset position smoothly
      btn.style.transform = 'translate(0px, 0px)';
      const inner = btn.querySelector('.btn-arrow');
      if (inner) {
        inner.style.transform = 'translateX(0px)';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. COUNT-UP COUNTERS
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const limit = parseInt(target.getAttribute('data-target'), 10);
        const duration = 1500; // 1.5s
        let start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function outQuad
          const value = Math.floor(progress * limit);
          target.textContent = value;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = limit;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/* --------------------------------------------------------------------------
   7. APPOINTMENT BOOKING / CONTACT FORM
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('nn-booking-form');
  if (!form) return;

  const successMessage = document.getElementById('booking-success-message');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform validation checks for all required fields
    const name = document.getElementById('name').value.trim();
    const company = document.getElementById('company').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const projectType = document.getElementById('project-type').value;
    const budget = document.getElementById('budget').value;
    const desiredDate = document.getElementById('desired-date').value;
    const message = document.getElementById('message').value.trim();
    
    if (!name || !company || !email || !phone || !projectType || !budget || !desiredDate || !message) {
      alert("Veuillez remplir tous les champs obligatoires marqués d'un astérisque (*).");
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Veuillez saisir une adresse e-mail professionnelle valide.");
      return;
    }

    // Basic phone validation (check length of digits)
    const digitCount = phone.replace(/\D/g, '').length;
    if (digitCount < 10) {
      alert("Veuillez saisir un numéro de téléphone valide (au moins 10 chiffres).");
      return;
    }

    // Simulate sending data asynchronously
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Envoi en cours... <span class="spinner"></span>';

    setTimeout(() => {
      // Hide form with transition
      form.style.opacity = '0';
      setTimeout(() => {
        form.style.display = 'none';
        
        // Show success block
        if (successMessage) {
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.classList.add('visible');
          }, 50);
        }
      }, 500);
    }, 2000);
  });
}
