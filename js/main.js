(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initMobileMenu();
        initBackToTop();
        initSmoothScroll();
        initCopyCodes();
        initScrollAnimations();
        initFAQ();
        initLazyImages();
        initParallaxEffects();
        initHoverEffects();
        initFormValidation();
        initMagneticButtons();
        initScrollIndicator();
        initImageZoom();
        initCounterAnimations();
        initTooltip();
        initSkeletonLoading();
        initKeyboardNavigation();
        initPerformanceOptimizations();
    });

    function initNavigation() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', throttle(function() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > scrollThreshold) {
                header.classList.add('py-2', 'shadow-lg');
                header.classList.remove('py-3', 'shadow-md');
            } else {
                header.classList.add('py-3', 'shadow-md');
                header.classList.remove('py-2', 'shadow-lg');
            }

            lastScrollY = currentScrollY;
        }, 15), { passive: true });
    }

    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!menuToggle || !mobileMenu) return;

        menuToggle.addEventListener('click', function() {
            const isOpen = !mobileMenu.classList.contains('opacity-0');

            if (isOpen) {
                mobileMenu.classList.add('opacity-0', 'invisible', '-translate-y-full', 'z-[-1]');
                mobileMenu.classList.remove('opacity-100', 'visible', 'translate-y-0', 'z-50');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                mobileMenu.classList.remove('opacity-0', 'invisible', '-translate-y-full', 'z-[-1]');
                mobileMenu.classList.add('opacity-100', 'visible', 'translate-y-0', 'z-50');
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        });

        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target) && isMobileMenuOpen()) {
                closeMobileMenu();
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMobileMenuOpen()) {
                closeMobileMenu();
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    function isMobileMenuOpen() {
        const mobileMenu = document.getElementById('mobile-menu');
        return mobileMenu && !mobileMenu.classList.contains('opacity-0');
    }

    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('opacity-0', 'invisible', '-translate-y-full', 'z-[-1]');
            mobileMenu.classList.remove('opacity-100', 'visible', 'translate-y-0', 'z-50');
        }
    }

    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        const scrollThreshold = window.innerHeight * 0.5;

        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > scrollThreshold) {
                backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-10');
                backToTop.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                backToTop.classList.add('opacity-0', 'invisible', 'translate-y-10');
                backToTop.classList.remove('opacity-100', 'visible', 'translate-y-0');
            }
        }, 15), { passive: true });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    closeMobileMenu();

                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function initCopyCodes() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        const toast = document.getElementById('toast');

        copyButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                const originalText = this.innerHTML;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(function() {
                        showCopySuccess(btn, originalText, toast);
                    }).catch(function(err) {
                        fallbackCopyText(code);
                        showCopySuccess(btn, originalText, toast);
                    });
                } else {
                    fallbackCopyText(code);
                    showCopySuccess(btn, originalText, toast);
                }
            });
        });
    }

    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    function showCopySuccess(btn, originalText, toast) {
        if (toast) {
            toast.classList.remove('opacity-0', 'invisible', 'scale-90');
            toast.classList.add('opacity-100', 'visible', 'scale-100');
        }

        btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        btn.classList.remove('bg-primary/5', 'text-primary');
        btn.classList.add('bg-green-100', 'text-green-600');

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        setTimeout(function() {
            if (toast) {
                toast.classList.add('opacity-0', 'invisible', 'scale-90');
                toast.classList.remove('opacity-100', 'visible', 'scale-100');
            }

            btn.innerHTML = originalText;
            btn.classList.add('bg-primary/5', 'text-primary');
            btn.classList.remove('bg-green-100', 'text-green-600');
        }, 2000);
    }

    function initScrollAnimations() {
        const sections = document.querySelectorAll('section');
        if (sections.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', function() {
                    const isOpen = item.classList.contains('active');

                    faqItems.forEach(function(otherItem) {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherAnswer) {
                                otherAnswer.style.maxHeight = '0';
                                otherAnswer.style.opacity = '0';
                            }
                        }
                    });

                    if (isOpen) {
                        item.classList.remove('active');
                        answer.style.maxHeight = '0';
                        answer.style.opacity = '0';
                    } else {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        answer.style.opacity = '1';
                    }
                });
            }
        });
    }

    function initLazyImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        if (images.length === 0) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px'
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    function initParallaxEffects() {
        const heroSection = document.querySelector('section#home, section.hero-section');
        if (!heroSection) return;

        const backgroundImage = heroSection.querySelector('img');
        if (!backgroundImage) return;

        window.addEventListener('scroll', throttle(function() {
            const scrollY = window.scrollY;
            const parallaxSpeed = 0.5;
            backgroundImage.style.transform = `scale(1.05) translateY(${scrollY * parallaxSpeed}px)`;
        }, 10), { passive: true });
    }

    function initHoverEffects() {
        const cards = document.querySelectorAll('.card-hover');
        
        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        const buttons = document.querySelectorAll('.btn-hover');
        
        buttons.forEach(function(btn) {
            btn.addEventListener('mouseenter', function(e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                btn.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                
                inputs.forEach(function(input) {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('border-red-500', 'bg-red-50');
                        input.addEventListener('input', function() {
                            input.classList.remove('border-red-500', 'bg-red-50');
                        });
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    showToast('请填写所有必填字段', 'error');
                }
            });
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl z-50 transition-all duration-300 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`;
        toast.innerHTML = `<div class="flex items-center gap-3"><i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i><span>${message}</span></div>`;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-[-20px]');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const later = function() {
                clearTimeout(timeout);
                func();
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn-magnetic');
        
        magneticButtons.forEach(function(btn) {
            btn.addEventListener('mousemove', function(e) {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                
                btn.style.transform = `translate(${deltaX * 0.3}px, ${deltaY * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', function() {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    function initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    scrollIndicator.classList.add('opacity-100');
                    scrollIndicator.classList.remove('opacity-0');
                } else {
                    scrollIndicator.classList.add('opacity-0');
                    scrollIndicator.classList.remove('opacity-100');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('section#home, section.hero-section');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    function initImageZoom() {
        const zoomContainers = document.querySelectorAll('.img-zoom');
        
        zoomContainers.forEach(function(container) {
            const img = container.querySelector('img');
            if (!img) return;

            container.addEventListener('mousemove', function(e) {
                const rect = container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            });
        });
    }

    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
            const step = target / (duration / 16);
            let current = 0;

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const timer = setInterval(function() {
                            current += step;
                            if (current >= target) {
                                counter.textContent = target.toLocaleString();
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.floor(current).toLocaleString();
                            }
                        }, 16);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(counter);
        });
    }

    function initTooltip() {
        const tooltips = document.querySelectorAll('.tooltip');
        
        tooltips.forEach(function(tooltip) {
            tooltip.addEventListener('mouseenter', function() {
                this.classList.add('active');
            });
            
            tooltip.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
        });
    }

    function initSkeletonLoading() {
        const skeletons = document.querySelectorAll('.skeleton');
        
        skeletons.forEach(function(skeleton) {
            const img = skeleton.querySelector('img');
            if (!img) return;

            img.addEventListener('load', function() {
                skeleton.classList.add('opacity-0');
                setTimeout(function() {
                    skeleton.style.display = 'none';
                }, 300);
            });
        });
    }

    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
                
                const modals = document.querySelectorAll('.modal');
                modals.forEach(function(modal) {
                    modal.classList.remove('active');
                });
            }

            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    function initPerformanceOptimizations() {
        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('[data-lazy]');
            
            const lazyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const src = element.getAttribute('data-lazy');
                        if (src) {
                            element.src = src;
                            element.removeAttribute('data-lazy');
                        }
                        lazyObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '100px',
                threshold: 0.1
            });

            lazyElements.forEach(function(element) {
                lazyObserver.observe(element);
            });
        }

        if ('requestIdleCallback' in window) {
            requestIdleCallback(function() {
                const preloadLinks = document.querySelectorAll('link[rel="preload"]');
                preloadLinks.forEach(function(link) {
                    link.rel = 'stylesheet';
                });
            });
        }

        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            if (!img.src) {
                img.src = img.getAttribute('data-src') || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3C/svg%3E';
            }
        });
    }

    function initModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const openButtons = document.querySelectorAll(`[data-modal="${modalId}"]`);
        const closeButton = modal.querySelector('.modal-close');

        openButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function initTabs(tabsContainerId) {
        const tabsContainer = document.getElementById(tabsContainerId);
        if (!tabsContainer) return;

        const tabs = tabsContainer.querySelectorAll('.tab');
        const panels = tabsContainer.querySelectorAll('.tab-panel');

        tabs.forEach(function(tab, index) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                panels.forEach(function(p) {
                    p.classList.remove('active');
                });

                tab.classList.add('active');
                panels[index].classList.add('active');
            });
        });
    }

    function initAccordion(accordionId) {
        const accordion = document.getElementById(accordionId);
        if (!accordion) return;

        const items = accordion.querySelectorAll('.accordion-item');

        items.forEach(function(item) {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            header.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');

                items.forEach(function(i) {
                    i.classList.remove('active');
                    i.querySelector('.accordion-content').style.maxHeight = '0';
                });

                if (!isOpen) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .ripple-effect {
                position: absolute;
                width: 10px;
                height: 10px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out forwards;
                pointer-events: none;
            }

            @keyframes ripple {
                from {
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                }
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }

            .modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 100;
            }

            .modal.active {
                opacity: 1;
                visibility: visible;
            }

            .modal-content {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .modal.active .modal-content {
                transform: scale(1);
            }

            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
            }

            .tab {
                cursor: pointer;
                padding: 0.75rem 1.5rem;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .tab.active {
                border-bottom-color: var(--primary);
                color: var(--primary);
            }

            .tab-panel {
                display: none;
            }

            .tab-panel.active {
                display: block;
            }

            .accordion-header {
                cursor: pointer;
                padding: 1rem;
                background: var(--gray-50);
                border-radius: 0.5rem;
                margin-bottom: 0.5rem;
                transition: background 0.2s ease;
            }

            .accordion-header:hover {
                background: var(--gray-100);
            }

            .accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                padding: 0 1rem;
            }

            .accordion-item.active .accordion-content {
                padding: 1rem;
            }

            .keyboard-navigation :focus-visible {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-fade-in-up {
                animation: fadeInUp 0.5s ease-out forwards;
            }
        </style>
    `);

})();