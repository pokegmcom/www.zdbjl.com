// 战斗吧精灵 - 公共 JavaScript 模块
// 统一管理所有页面的交互功能

(function() {
    'use strict';

    // DOM 加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initMobileMenu();
        initBackToTop();
        initSmoothScroll();
        initCopyCodes();
        initScrollAnimations();
        initFAQ();
    });

    // 导航栏滚动效果
    function initNavigation() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > scrollThreshold) {
                header.classList.add('py-2', 'shadow-lg');
                header.classList.remove('py-3', 'shadow-md');
            } else {
                header.classList.add('py-3', 'shadow-md');
                header.classList.remove('py-2', 'shadow-lg');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // 移动端菜单切换
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!menuToggle || !mobileMenu) return;

        menuToggle.addEventListener('click', function() {
            const isOpen = !mobileMenu.classList.contains('opacity-0');

            if (isOpen) {
                mobileMenu.classList.add('opacity-0', 'invisible', '-translate-y-full', 'z-[-1]');
                mobileMenu.classList.remove('opacity-100', 'visible', 'translate-y-0', 'z-50');
            } else {
                mobileMenu.classList.remove('opacity-0', 'invisible', '-translate-y-full', 'z-[-1]');
                mobileMenu.classList.add('opacity-100', 'visible', 'translate-y-0', 'z-50');
            }
        });

        // 点击菜单外部关闭
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target) && isMobileMenuOpen()) {
                closeMobileMenu();
            }
        });

        // ESC 键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMobileMenuOpen()) {
                closeMobileMenu();
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

    // 返回顶部功能
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        const scrollThreshold = window.innerHeight * 0.5;

        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-10');
                backToTop.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                backToTop.classList.add('opacity-0', 'invisible', 'translate-y-10');
                backToTop.classList.remove('opacity-100', 'visible', 'translate-y-0');
            }
        }, { passive: true });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 平滑滚动
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

    // 复制兑换码功能
    function initCopyCodes() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        const toast = document.getElementById('toast');

        copyButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                const originalText = this.innerHTML;

                // 优先使用现代 Clipboard API
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
        // 显示提示
        if (toast) {
            toast.classList.remove('opacity-0', 'invisible', 'scale-90');
            toast.classList.add('opacity-100', 'visible', 'scale-100');
        }

        // 按钮状态变化
        btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        btn.classList.remove('bg-primary/5', 'text-primary');
        btn.classList.add('bg-green-100', 'text-green-600');

        // 移动端震动反馈
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // 2秒后恢复
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

    // 页面加载动画
    function initScrollAnimations() {
        const sections = document.querySelectorAll('section');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // FAQ 展开/收起功能
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', function() {
                    const isOpen = item.classList.contains('active');

                    // 关闭所有其他项
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

                    // 切换当前项
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

    // 图片懒加载增强
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
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    // 防抖函数
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

    // 节流函数
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

})();
