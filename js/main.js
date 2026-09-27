/**
 * Mindful Movers Chess Club - Main JavaScript
 * Interactive Features: Slider, Mobile Nav, Scroll Reveal, Puzzle Board, FAQ & Form Submission
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Slider
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval = null;

  function goToSlide(index) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5500);
  }

  function stopSlideTimer() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startSlideTimer();
    });
  });

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopSlideTimer);
    heroSection.addEventListener('mouseleave', startSlideTimer);
  }

  startSlideTimer();

  // Expose goToSlide globally for inline dot onclick if needed
  window.goSlide = (n) => {
    goToSlide(n);
    startSlideTimer();
  };

  // 2. Mobile Menu Toggle
  const mobMenu = document.getElementById('mob-menu');
  const hamburger = document.querySelector('.hbg');

  window.toggleMenu = () => {
    if (!mobMenu) return;
    const isOpen = mobMenu.classList.toggle('open');
    if (hamburger) {
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  };

  if (mobMenu) {
    mobMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobMenu.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
      });
    });
  }

  // 3. Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 4. Scroll Reveal with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // 5. Interactive Puzzle Board of the Week
  const puzzleBoard = document.getElementById('puzzle-board');
  if (puzzleBoard) {
    // 8x8 Board layout with puzzle pieces: White Queen & Rook vs Black Pawns
    // Layout representing White to Move: Checkmate in 2
    const layout = [
      '.', '.', '.', '.', '.', '.', '.', '.',
      '.', '.', '.', '.', '.', '.', 'p', 'p',
      '.', '.', '.', '.', '.', '.', '.', '.',
      '.', '.', '.', '.', '.', '.', '.', '.',
      '.', '.', '.', '.', 'Q', '.', '.', '.',
      '.', '.', '.', '.', '.', '.', '.', '.',
      '.', '.', '.', '.', '.', '.', '.', '.',
      '.', '.', '.', '.', '.', 'R', '.', '.'
    ];

    const pieceSymbols = {
      'p': '♟',
      'Q': '♕',
      'R': '♖',
      'k': '♚',
      'K': '♔'
    };

    layout.forEach((p, i) => {
      const sq = document.createElement('div');
      const r = Math.floor(i / 8);
      const c = i % 8;
      const isLight = (r + c) % 2 === 0;
      sq.className = `sq ${isLight ? 'l' : 'd'}`;
      
      if (p !== '.') {
        sq.className += ' piece';
        sq.textContent = pieceSymbols[p] || p;
        sq.style.color = p === p.toUpperCase() ? '#e8c97a' : '#579e75';
      }
      puzzleBoard.appendChild(sq);
    });
  }

  // 6. FAQ Accordion Toggle
  window.toggleFaq = (button) => {
    const answer = button.nextElementSibling;
    const isCurrentlyOpen = answer.classList.contains('open');

    // Close all other open FAQs
    document.querySelectorAll('.faq-a.open').forEach(a => {
      a.classList.remove('open');
      const prevBtn = a.previousElementSibling;
      if (prevBtn) {
        prevBtn.classList.remove('open');
        prevBtn.setAttribute('aria-expanded', 'false');
      }
    });

    if (!isCurrentlyOpen) {
      answer.classList.add('open');
      button.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  };

  // 7. WhatsApp Enrollment Form Submission
  window.submitViaWA = () => {
    const name = document.getElementById('f_name')?.value.trim();
    const phone = document.getElementById('f_phone')?.value.trim();
    const student = document.getElementById('f_student')?.value.trim();
    const country = document.getElementById('f_country')?.value.trim();
    const program = document.getElementById('f_program')?.value;
    const msg = document.getElementById('f_msg')?.value.trim();

    if (!name || !phone || !student) {
      alert('Please enter Parent Name, Phone / WhatsApp number, and Student details to book your free demo class.');
      return;
    }

    let waText = `Hi Coach Jaikishan! 👋%0A%0AI would like to book a *Free Demo Class* at Mindful Movers Chess Club.%0A%0A`;
    waText += `*Parent Name:* ${encodeURIComponent(name)}%0A`;
    waText += `*Phone / WhatsApp:* ${encodeURIComponent(phone)}%0A`;
    waText += `*Student Details:* ${encodeURIComponent(student)}%0A`;
    if (country) waText += `*Country / City:* ${encodeURIComponent(country)}%0A`;
    if (program) waText += `*Program of Interest:* ${encodeURIComponent(program)}%0A`;
    if (msg) waText += `*Note / Query:* ${encodeURIComponent(msg)}%0A`;
    waText += `%0APlease share available batch timings. Thank you!`;

    window.open(`https://wa.me/918838512840?text=${waText}`, '_blank');
  };
});
