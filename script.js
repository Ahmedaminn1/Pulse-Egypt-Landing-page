/* ===================================================
   PLUS EGYPT — JavaScript Interactions
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // =====================
  // 0. THEME TOGGLE
  // =====================
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  // Check saved theme
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  });

  // =====================
  // 1. NAVBAR SCROLL EFFECT
  // =====================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // =====================
  // 2. HAMBURGER MENU
  // =====================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // =====================
  // 3. ACTIVE NAV LINK ON SCROLL
  // =====================
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  // =====================
  // 4. SCROLL REVEAL ANIMATIONS
  // =====================
  const revealElements = document.querySelectorAll(
    '.service-card, .project-card, .visual-card, .pillar, .contact-item, .client-badge, .section-header, .about-text, .about-visual'
  );

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    // stagger within parent
    const siblings = Array.from(el.parentElement.children);
    const idx = siblings.indexOf(el);
    if (idx <= 3) {
      el.classList.add(`reveal-delay-${idx + 1}`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // =====================
  // 5. HERO PARTICLE CANVAS
  // =====================
  const particlesContainer = document.getElementById('particles');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  particlesContainer.appendChild(canvas);

  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.6
          ? `rgba(34, 197, 94,`    // green
          : `rgba(245, 158, 11,`   // gold
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();

      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw faint connection lines between close particles
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    animFrameId = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  // Pause particles when hero is out of view
  const heroSection = document.getElementById('home');
  const heroObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) {
      cancelAnimationFrame(animFrameId);
    } else {
      drawParticles();
    }
  }, { threshold: 0 });
  heroObserver.observe(heroSection);

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // =====================
  // 6. SMOOTH SCROLL FOR ANCHOR LINKS
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  // =====================
  // 7. CONTACT FORM
  // =====================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Animate button
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate sending (replace with real form handler / mailto / EmailJS)
      setTimeout(() => {
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Message Sent!
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #166534, #22c55e)';
        submitBtn.style.color = '#f0fdf4';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send Message
          `;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3000);
      }, 1500);
    });
  }

  // =====================
  // 8. NEWSLETTER SUBSCRIPTION
  // =====================
  const subscribeBtn = document.getElementById('subscribe-btn');
  const footerEmail = document.getElementById('footer-email');

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      const email = footerEmail.value.trim();
      if (!email || !email.includes('@')) {
        footerEmail.style.borderColor = '#ef4444';
        footerEmail.focus();
        setTimeout(() => { footerEmail.style.borderColor = ''; }, 2000);
        return;
      }
      subscribeBtn.textContent = '✓ Done!';
      subscribeBtn.disabled = true;
      footerEmail.value = '';
      setTimeout(() => {
        subscribeBtn.textContent = 'Subscribe';
        subscribeBtn.disabled = false;
      }, 3000);
    });
  }

  // =====================
  // 9. COUNTER ANIMATION (stats)
  // =====================
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(el => {
        const text = el.textContent;
        const num = parseInt(text);
        const suffix = text.replace(num.toString(), '');
        animateCounter(el, num, suffix);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

});
