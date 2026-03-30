/* ============================================
   Portfolio JavaScript - Interactive Features
   ============================================ */

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const backToTopBtn = document.getElementById('back-to-top');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initScrollAnimations();
    initCounterAnimations();
    initActiveNavHighlight();
});

/* ============================================
   Navbar Scroll Effect
   ============================================ */
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const icon = mobileMenuBtn.querySelector('i');
            mobileMenu.classList.toggle('active');
            
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/* ============================================
   Smooth Scroll Navigation
   ============================================ */
function initSmoothScroll() {
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Back to Top Button
   ============================================ */
function initBackToTop() {
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* ============================================
   Scroll Reveal Animations
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;

    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay based on index for staggered animations
                const index = Array.from(animatedElements).indexOf(entry.target);
                const delay = index * 0.05;
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   Animated Counter for Stats
   ============================================ */
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1500; // 1.5 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

/* ============================================
   Active Navigation Highlight
   ============================================ */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                updateActiveNav(currentId);
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => observer.observe(section));

    // Also update on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        if (current) {
            updateActiveNav(current);
        }
    });
}

function updateActiveNav(currentId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for performance
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   Add hover effects to cards
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to gradient orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    
    if (orbs.length > 0) {
        window.addEventListener('mousemove', throttle((e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            orbs.forEach((orb, index) => {
                const factor = (index + 1) * 0.02;
                orb.style.transform = `translate(${x * 20 * factor}px, ${y * 20 * factor}px)`;
            });
        }, 50));
    }
});

/* ============================================
   Console welcome message
   ============================================ */
console.log('%c👋 Welcome to Kunal Prabhakar\'s Portfolio!', 'font-size: 16px; font-weight: bold; color: #3b82f6;');
console.log('%cFrontend Developer | React.js | JavaScript', 'font-size: 12px; color: #6b7280;');
console.log('%cFeel free to explore the code!', 'font-size: 12px; color: #14b8a6;');
