/* ============================================================
   TOP TIER CUSTOM FLOORS -- Main JavaScript
   Vanilla JS, no frameworks
   ============================================================ */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. MOBILE MENU TOGGLE
     ------------------------------------------------------- */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    var overlay = document.getElementById('navOverlay');

    if (!hamburger || !navLinks) return;

    function openMenu() {
      hamburger.classList.add('active');
      navLinks.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('no-scroll');
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* -------------------------------------------------------
     2. NAVBAR SCROLL EFFECT
     ------------------------------------------------------- */
  function initNavbarScroll() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var threshold = 80;
    var scrolled = false;

    function checkScroll() {
      var shouldBeScrolled = window.scrollY > threshold;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        if (scrolled) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* -------------------------------------------------------
     3. SCROLL FADE-UP ANIMATIONS
     ------------------------------------------------------- */
  function initFadeUp() {
    var elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------
     4. GALLERY FILTER
     ------------------------------------------------------- */
  function initGalleryFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter items
        galleryItems.forEach(function (item) {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.removeAttribute('data-hidden');
          } else {
            item.setAttribute('data-hidden', 'true');
          }
        });
      });
    });
  }

  /* -------------------------------------------------------
     5. LIGHTBOX
     ------------------------------------------------------- */
  function initLightbox() {
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    var lightboxImg = lightbox.querySelector('.lightbox__img');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    var nextBtn = lightbox.querySelector('.lightbox__nav--next');

    var triggers = document.querySelectorAll('.gallery-item');
    var images = [];
    var currentIndex = 0;

    // Collect lightbox-capable images from gallery items
    triggers.forEach(function (trigger) {
      var img = trigger.querySelector('img');
      if (img && img.src) {
        images.push(img.src);
      }
    });

    function openLightbox(index) {
      if (index < 0 || index >= images.length) return;
      currentIndex = index;
      lightboxImg.src = images[currentIndex];
      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
      lightboxImg.src = '';
    }

    function showPrev() {
      if (images.length <= 1) return;
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    }

    function showNext() {
      if (images.length <= 1) return;
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex];
    }

    // Click triggers
    triggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(i);
      });
    });

    // Close
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    // Click overlay to close (but not image)
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Nav buttons
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });
  }

  /* -------------------------------------------------------
     6. FAQ ACCORDION
     ------------------------------------------------------- */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('active');

        // Close all others (optional -- remove this loop for multi-open)
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('active');
            var otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* -------------------------------------------------------
     7. SMOOTH SCROLL FOR ANCHOR LINKS
     ------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (hash === '#' || hash.length < 2) return;

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      var navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without jumping
      if (history.pushState) {
        history.pushState(null, null, hash);
      }
    });
  }

  /* -------------------------------------------------------
     8. COUNTER ANIMATION
     ------------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;

      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease out quad
        var eased = 1 - (1 - progress) * (1 - progress);
        var current = Math.floor(eased * target);

        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------
     INIT -- Run on DOMContentLoaded
     ------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initNavbarScroll();
    initFadeUp();
    initGalleryFilter();
    initLightbox();
    initFaqAccordion();
    initSmoothScroll();
    initCounters();
  });
})();
