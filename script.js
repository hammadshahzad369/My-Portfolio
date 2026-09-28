/**
 * ==============================================================================
 * Hammad Shahzad - Personal Portfolio Scripts
 * Modern, Lightweight, and Smooth Interactive JavaScript
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. DOM Elements
  // ----------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTop');
  const sections = document.querySelectorAll('header[id], section[id], footer[id]');

  // ----------------------------------------------------------------------------
  // 2. Mobile Navigation Menu Toggle & Accessibility
  // ----------------------------------------------------------------------------
  if (navToggle && navLinks) {
    const toggleIcon = navToggle.querySelector('i');

    const openMenu = () => {
      navLinks.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-xmark');
      }
    };

    const closeMenu = () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-xmark');
        toggleIcon.classList.add('fa-bars');
      }
    };

    // Toggle menu on button click
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.contains('active');
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking on any navigation link
    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside of navbar
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 3. Smooth Scrolling with Fixed Navbar Offset
  // ----------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset - (navbarHeight - 10);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Update URL hash smoothly without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 4. Navbar Scroll State & Back-to-Top Button Visibility
  // ----------------------------------------------------------------------------
  const handleScrollEffects = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar background blur/shadow when scrolled down
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  };

  // Run on initial load and on scroll
  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  // Back to Top click action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 5. ScrollSpy - Highlight Active Navbar Link
  // ----------------------------------------------------------------------------
  const updateActiveNavLink = () => {
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navItems.forEach((link) => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // ----------------------------------------------------------------------------
  // 6. Subtle Scroll Reveal Animations (Intersection Observer)
  // ----------------------------------------------------------------------------
  // Elements to animate smoothly on scroll
  const revealTargets = document.querySelectorAll(
    '.section-header, .glass-card, .skill-category-card, .timeline-item, .language-card, .contact-card, .hero-card'
  );

  // Progressive enhancement: add reveal class only if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    revealTargets.forEach((el) => {
      el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve after animating once to save system resources
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealTargets.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // ----------------------------------------------------------------------------
  // 7. Interactive Mouse Spotlight Effect on Cards (Desktop Only)
  // ----------------------------------------------------------------------------
  const isHoverSupported = window.matchMedia('(hover: hover)').matches;

  if (isHoverSupported) {
    const interactiveCards = document.querySelectorAll(
      '.glass-card, .skill-category-card, .hero-card, .language-card, .timeline-content'
    );

    interactiveCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 8. Skill Pills Interactive Micro-Click Effect
  // ----------------------------------------------------------------------------
  const skillPills = document.querySelectorAll('.skill-pill');

  skillPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pill.style.transform = 'scale(0.96)';
      setTimeout(() => {
        pill.style.transform = '';
      }, 150);
    });
  });
});
