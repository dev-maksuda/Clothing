/* ==========================================================================
   LUXORA — Premium Fashion Landing Page Scripts
   ========================================================================== */

(function () {
    'use strict';

    // ===== DOM Ready =====
    document.addEventListener('DOMContentLoaded', function () {
        initPageLoader();
        initNavbarScroll();
        initSmoothScroll();
        initMobileMenu();
        initAddToBag();
        initWishlistToggle();
        initNewsletterForm();
        initScrollReveal();
        initBackToTop();
        initActiveNavLink();
    });

    // ===== 10. Page Loader =====
    function initPageLoader() {
        const loader = document.getElementById('page-loader');
        if (!loader) return;

        window.addEventListener('load', function () {
            setTimeout(function () {
                loader.classList.add('hidden');
                setTimeout(function () {
                    loader.style.display = 'none';
                }, 600);
            }, 500);
        });
    }

    // ===== 1 & 3. Sticky Navbar + Background Change on Scroll =====
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const backToTop = document.getElementById('back-to-top');

        function onScroll() {
            const scrollY = window.scrollY || window.pageYOffset;

            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (scrollY > 400 && backToTop) {
                backToTop.classList.add('visible');
            } else if (backToTop) {
                backToTop.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ===== 2. Smooth Scrolling =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const navbarHeight = document.getElementById('navbar')
                    ? document.getElementById('navbar').offsetHeight
                    : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight + 1;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ===== 4. Mobile Menu Behavior =====
    function initMobileMenu() {
        const navbarCollapse = document.getElementById('mainNavbar');
        if (!navbarCollapse) return;

        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    } else {
                        new bootstrap.Collapse(navbarCollapse, { toggle: true });
                    }
                }
            });
        });
    }

    // ===== Active Nav Link on Scroll =====
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        if (!sections.length || !navLinks.length) return;

        function updateActiveLink() {
            const scrollPosition = window.scrollY + 150;

            sections.forEach(function (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    // ===== 5. Add to Bag + Toast Notification =====
    let cartCount = 0;

    function initAddToBag() {
        const addToBagBtns = document.querySelectorAll('.add-to-bag');
        const cartBadge = document.getElementById('cart-badge');

        addToBagBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const productName = btn.getAttribute('data-product') || 'Product';

                cartCount++;
                if (cartBadge) {
                    cartBadge.textContent = cartCount;
                    cartBadge.style.animation = 'none';
                    setTimeout(function () {
                        cartBadge.style.animation = 'cartBounce 0.4s ease';
                    }, 10);
                }

                showToast(productName + ' added to bag!');
            });
        });

        const style = document.createElement('style');
        style.textContent = '@keyframes cartBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.4); } }';
        document.head.appendChild(style);
    }

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        const toastMessage = document.getElementById('toast-message');
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(function () {
            toast.classList.remove('show');
        }, 3000);
    }

    // ===== 6. Wishlist Heart Toggle =====
    function initWishlistToggle() {
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');

        wishlistBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const productName = btn.getAttribute('data-product') || 'Product';
                const isActive = btn.classList.toggle('active');

                if (isActive) {
                    showToast(productName + ' added to wishlist');
                }

                const icon = btn.querySelector('i');
                if (icon) {
                    if (isActive) {
                        icon.classList.remove('bi-heart');
                        icon.classList.add('bi-heart-fill');
                    } else {
                        icon.classList.remove('bi-heart-fill');
                        icon.classList.add('bi-heart');
                    }
                }
            });
        });
    }

    // ===== 7. Newsletter Form Validation =====
    function initNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        const emailInput = document.getElementById('newsletter-email');
        const message = document.getElementById('newsletter-message');
        if (!form || !emailInput || !message) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            message.className = 'newsletter-message';
            message.textContent = '';

            if (!email) {
                message.classList.add('error');
                message.textContent = 'Please enter your email address.';
                return;
            }

            if (!emailRegex.test(email)) {
                message.classList.add('error');
                message.textContent = 'Please enter a valid email address.';
                return;
            }

            message.classList.add('success');
            message.textContent = 'Thank you for subscribing! Check your inbox soon.';
            emailInput.value = '';

            setTimeout(function () {
                message.textContent = '';
                message.className = 'newsletter-message';
            }, 5000);
        });
    }

    // ===== 8. Scroll Reveal Animations =====
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry, index) {
                    if (entry.isIntersecting) {
                        setTimeout(function () {
                            entry.target.classList.add('visible');
                        }, (index % 4) * 120);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px'
            });

            reveals.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            reveals.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    // ===== 9. Back to Top Button =====
    function initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

})();
