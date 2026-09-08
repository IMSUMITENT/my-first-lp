// ==========================================================================
// CAFÉ MORI — script.js
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const toTopBtn = document.getElementById('toTop');
  const sections = document.querySelectorAll('main section[id]');

  /* ---------- Header shrink on scroll ---------- */
  const updateHeaderState = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    toTopBtn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openNav = () => {
    nav.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  /* ---------- Smooth scroll (nav links + scroll cue + back-to-top link) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      closeNav();

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (input, errorId, message) => {
      const errorEl = document.getElementById(errorId);
      const group = input.closest('.form-group');
      errorEl.textContent = message;
      group.classList.toggle('has-error', Boolean(message));
    };

    const validateField = (input, errorId) => {
      const value = input.value.trim();

      if (!value) {
        setError(input, errorId, 'この項目は必須です。');
        return false;
      }

      if (input === emailInput && !emailPattern.test(value)) {
        setError(input, errorId, 'メールアドレスの形式が正しくありません。');
        return false;
      }

      setError(input, errorId, '');
      return true;
    };

    [
      [nameInput, 'contactNameError'],
      [emailInput, 'contactEmailError'],
      [messageInput, 'contactMessageError'],
    ].forEach(([input, errorId]) => {
      input.addEventListener('blur', () => validateField(input, errorId));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, 'contactNameError');
      const isEmailValid = validateField(emailInput, 'contactEmailError');
      const isMessageValid = validateField(messageInput, 'contactMessageError');

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        return;
      }

      alert('送信しました');
      contactForm.reset();
      contactForm.querySelectorAll('.form-group.has-error').forEach((group) => {
        group.classList.remove('has-error');
      });
    });
  }
});
