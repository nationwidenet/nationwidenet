// DOM Elements
const header = document.getElementById('header');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const checkerForm = document.getElementById('checker-form');
const checkerResults = document.getElementById('checker-results');
const wizardForm = document.querySelector('.wizard-form');
const planToggle = document.querySelector('.plan-toggle');
const calculatorForm = document.getElementById('calculator-form');
const savingsResult = document.getElementById('savings-result');
const testimonialsGrid = document.getElementById('testimonials-grid');
const bundleBuilderModal = document.getElementById('bundle-builder-modal');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollEffects();
    initializeImageErrorHandling();
    initializeMobileMenu();
    initializeAddressChecker();
    initializePlanWizard();
    initializePlanToggle();
    initializeSavingsCalculator();
    initializeTestimonials();
    initializeBundleBuilder();
    initializeRevealAnimations();
    initializeParallax();
});

// Scroll Effects
function initializeScrollEffects() {
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                handleParallaxEffect();
                handleRevealAnimations();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function handleParallaxEffect() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
        const speed = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${speed}px)`;
    }
}

// Mobile Menu
function initializeMobileMenu() {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    
    // Focus management
    if (mobileMenu.classList.contains('active')) {
        const firstLink = mobileMenu.querySelector('.mobile-nav-link');
        firstLink?.focus();
    }
}

function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Address Checker
function initializeAddressChecker() {
    checkerForm?.addEventListener('submit', handleAddressCheck);
}

function handleAddressCheck(e) {
    e.preventDefault();
    const addressInput = document.getElementById('address-input');
    const address = addressInput.value.trim();
    
    if (!address) {
        alert('Please enter a valid address or ZIP code');
        return;
    }
    
    // Simulate API call
    checkerForm.classList.add('loading');
    
    setTimeout(() => {
        checkerForm.classList.remove('loading');
        checkerResults.style.display = 'block';
        checkerResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
}

function openAddressChecker() {
    scrollToSection('address-checker');
    setTimeout(() => {
        document.getElementById('address-input')?.focus();
    }, 500);
}

// Plan Wizard
function initializePlanWizard() {
    const wizardOptions = document.querySelectorAll('.wizard-option');
    wizardOptions.forEach(option => {
        option.addEventListener('click', handleWizardOption);
    });
}

let wizardAnswers = {};

function handleWizardOption(e) {
    const option = e.currentTarget;
    const step = option.closest('.wizard-step').dataset.step;
    const value = option.dataset.value;
    
    // Remove previous selection
    option.parentElement.querySelectorAll('.wizard-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select current option
    option.classList.add('selected');
    wizardAnswers[step] = value;
    
    // Update illustration
    updateWizardIllustration(value);
    
    // Show results if all questions answered
    setTimeout(() => {
        if (Object.keys(wizardAnswers).length >= 3) {
            showWizardResults();
        }
    }, 500);
}

function updateWizardIllustration(value) {
    const images = document.querySelectorAll('.wizard-img');
    images.forEach(img => img.classList.remove('active'));
    
    if (value === 'gaming' || value === 'work') {
        const targetImg = document.querySelector(`[data-step="${value}"]`);
        targetImg?.classList.add('active');
    }
}

function showWizardResults() {
    const results = document.getElementById('wizard-results');
    const planName = document.getElementById('recommended-plan-name');
    const planDesc = document.getElementById('recommended-plan-desc');
    const planPrice = document.getElementById('recommended-price');
    const features = document.getElementById('recommended-features');
    
    // Determine recommendation based on answers
    let recommendation = getRecommendation(wizardAnswers);
    
    planName.textContent = recommendation.name;
    planDesc.textContent = recommendation.description;
    planPrice.textContent = recommendation.price;
    
    features.innerHTML = '';
    recommendation.features.forEach(feature => {
        const span = document.createElement('span');
        span.className = 'feature';
        span.textContent = feature;
        features.appendChild(span);
    });
    
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getRecommendation(answers) {
    const usage = answers['1'];
    const devices = answers['2'];
    const tv = answers['3'];
    
    if (usage === 'gaming' || devices === 'many') {
        return {
            name: 'Gig Plan',
            description: 'Ultimate performance for gaming and heavy usage',
            price: '$99.99/mo',
            features: ['Up to 1 Gig', 'Gaming optimized', 'Mesh system', 'Priority support']
        };
    } else if (usage === 'streaming' || devices === 'medium') {
        return {
            name: 'Turbo 500',
            description: 'Perfect for streaming and working from home',
            price: '$79.99/mo',
            features: ['Up to 500 Mbps', 'Wi-Fi 6E included', 'Unlimited data', '4K streaming']
        };
    } else if (usage === 'work' || devices === 'medium') {
        return {
            name: 'Plus 300',
            description: 'Great for video calls and productivity',
            price: '$59.99/mo',
            features: ['Up to 300 Mbps', 'Wi-Fi 6 included', 'Business reliability', 'Upload priority']
        };
    } else {
        return {
            name: 'Essential 100',
            description: 'Perfect for browsing and basic needs',
            price: '$39.99/mo',
            features: ['Up to 100 Mbps', 'Wi-Fi 6 included', 'Unlimited data', '24/7 support']
        };
    }
}

// Plan Toggle
function initializePlanToggle() {
    planToggle?.addEventListener('click', handlePlanToggle);
}

function handlePlanToggle(e) {
    if (!e.target.classList.contains('toggle-btn')) return;
    
    const buttons = planToggle.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const isAnnual = e.target.dataset.billing === 'annual';
    togglePlanPricing(isAnnual);
}

function togglePlanPricing(isAnnual) {
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    
    monthlyPrices.forEach(price => {
        price.style.display = isAnnual ? 'none' : 'inline';
    });
    
    annualPrices.forEach(price => {
        price.style.display = isAnnual ? 'inline' : 'none';
    });
}

// Savings Calculator
function initializeSavingsCalculator() {
    calculatorForm?.addEventListener('submit', handleSavingsCalculation);
}

function handleSavingsCalculation(e) {
    e.preventDefault();
    
    const currentBill = parseFloat(document.getElementById('current-bill').value) || 0;
    const currentSpeed = parseInt(document.getElementById('current-speed').value) || 100;
    
    if (currentBill === 0) {
        alert('Please enter your current monthly bill');
        return;
    }
    
    // Simulate calculation
    const recommendedPlan = getRecommendedPlanPrice(currentSpeed);
    const monthlySavings = Math.max(0, currentBill - recommendedPlan);
    const annualSavings = monthlySavings * 12;
    
    document.getElementById('savings-value').textContent = `$${annualSavings.toFixed(0)}`;
    savingsResult.style.display = 'block';
    savingsResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getRecommendedPlanPrice(currentSpeed) {
    if (currentSpeed >= 500) return 79.99;
    if (currentSpeed >= 200) return 59.99;
    if (currentSpeed >= 100) return 39.99;
    return 39.99;
}

// Testimonials
function initializeTestimonials() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto-advance testimonials
    setInterval(nextTestimonial, 5000);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    testimonialsGrid?.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    testimonialsGrid?.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
    }
}

let currentTestimonial = 0;
const totalTestimonials = document.querySelectorAll('.testimonial-card').length;

function showTestimonial(index) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    cards[index]?.classList.add('active');
    dots[index]?.classList.add('active');
    
    currentTestimonial = index;
}

function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(nextIndex);
}

function prevTestimonial() {
    const prevIndex = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(prevIndex);
}

// Bundle Builder Modal
function initializeBundleBuilder() {
    const bundleOptions = document.querySelectorAll('.bundle-option');
    bundleOptions.forEach(option => {
        option.addEventListener('click', handleBundleOption);
    });
}

let bundleSelections = {};
let currentBundleStep = 1;

function openBundleBuilder() {
    bundleBuilderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first option
    const firstOption = bundleBuilderModal.querySelector('.bundle-option');
    firstOption?.focus();
}

function closeBundleBuilder() {
    bundleBuilderModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset state
    bundleSelections = {};
    currentBundleStep = 1;
    showBundleStep(1);
    
    // Clear selections
    document.querySelectorAll('.bundle-option').forEach(option => {
        option.classList.remove('selected');
    });
}

function handleBundleOption(e) {
    const option = e.currentTarget;
    const step = option.closest('.bundle-step').dataset.step;
    const value = option.dataset.value;
    
    // Remove previous selection
    option.parentElement.querySelectorAll('.bundle-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select current option
    option.classList.add('selected');
    bundleSelections[step] = {
        value: value,
        text: option.querySelector('h4').textContent,
        price: option.querySelector('p').textContent
    };
    
    // Enable next button
    const nextBtn = document.getElementById('bundle-next');
    nextBtn.disabled = false;
}

function nextBundleStep() {
    if (currentBundleStep < 3) {
        currentBundleStep++;
        showBundleStep(currentBundleStep);
    }
}

function prevBundleStep() {
    if (currentBundleStep > 1) {
        currentBundleStep--;
        showBundleStep(currentBundleStep);
    }
}

function showBundleStep(step) {
    const steps = document.querySelectorAll('.bundle-step');
    steps.forEach(stepEl => stepEl.classList.remove('active'));
    
    const currentStep = document.querySelector(`[data-step="${step}"]`);
    currentStep?.classList.add('active');
    
    // Update navigation
    const prevBtn = document.getElementById('bundle-prev');
    const nextBtn = document.getElementById('bundle-next');
    
    prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    
    if (step === 3) {
        nextBtn.style.display = 'none';
        updateBundleSummary();
    } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = 'Next';
        nextBtn.disabled = true; // Disable until selection made
    }
    
    currentBundleStep = step;
}

function updateBundleSummary() {
    const summary = document.getElementById('bundle-summary');
    const internetSelection = bundleSelections['1'];
    const tvSelection = bundleSelections['2'];
    
    if (!internetSelection || !tvSelection) return;
    
    let html = '';
    let total = 0;
    
    // Internet service
    const internetPrice = parseFloat(internetSelection.price.replace(/[^0-9.]/g, ''));
    html += `
        <div class="summary-item">
            <span class="summary-service">Internet: ${internetSelection.text}</span>
            <span class="summary-price">${internetSelection.price}</span>
        </div>
    `;
    total += internetPrice;
    
    // TV service
    if (tvSelection.value !== 'none') {
        const tvPrice = parseFloat(tvSelection.price.replace(/[^0-9.]/g, ''));
        html += `
            <div class="summary-item">
                <span class="summary-service">TV: ${tvSelection.text}</span>
                <span class="summary-price">${tvSelection.price}</span>
            </div>
        `;
        total += tvPrice;
    }
    
    // Calculate bundle savings
    const bundleTotal = total * 0.9; // 10% bundle discount
    const savings = total - bundleTotal;
    
    html += `
        <div class="summary-total">
            <span class="total-label">Bundle Total:</span>
            <span class="total-price">$${bundleTotal.toFixed(2)}/mo</span>
            <span class="total-savings">Save $${savings.toFixed(2)}/mo</span>
        </div>
    `;
    
    summary.innerHTML = html;
}

// Reveal Animations
function initializeRevealAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Skip animations for users who prefer reduced motion
        document.querySelectorAll('.reveal-in').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.reveal-in').forEach(el => {
        observer.observe(el);
    });
}

function handleRevealAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const elements = document.querySelectorAll('.reveal-in:not(.revealed)');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible) {
            element.classList.add('revealed');
        }
    });
}

function initializeParallax() {
    // Initialize parallax effect
    handleParallaxEffect();
}

// Image Error Handling
function initializeImageErrorHandling() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
            this.setAttribute('data-missing', 'true');
        });
        
        img.addEventListener('load', function() {
            this.removeAttribute('data-missing');
        });
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Close mobile menu if open
    closeMobileMenu();
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateZip(zip) {
    const re = /^\d{5}(-\d{4})?$/;
    return re.test(zip);
}

// Performance Optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
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
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Enhanced scroll handler with throttling
const throttledScrollHandler = throttle(() => {
    handleHeaderScroll();
    handleParallaxEffect();
    handleRevealAnimations();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Escape key handlers
    if (e.key === 'Escape') {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        if (bundleBuilderModal.classList.contains('active')) {
            closeBundleBuilder();
        }
    }
    
    // Arrow key navigation for testimonials
    if (e.key === 'ArrowLeft' && testimonialsGrid) {
        e.preventDefault();
        prevTestimonial();
    }
    if (e.key === 'ArrowRight' && testimonialsGrid) {
        e.preventDefault();
        nextTestimonial();
    }
});

// Focus Management
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Apply focus trapping to modals
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('focusin', () => {
            if (modal.classList.contains('active')) {
                trapFocus(modal);
            }
        });
    });
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Intersection Observer for performance
const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Lazy loading enhancements
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger loading
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Error handling for fetch operations
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
}

// Analytics placeholder (would be replaced with real analytics)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // In production, this would send to analytics service
}

// Track user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn, .nav-link, .wizard-option')) {
        const element = e.target;
        trackEvent('button_click', {
            element: element.textContent.trim(),
            section: element.closest('section')?.id || 'header'
        });
    }
});

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            trackEvent('page_load', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
            });
        });
    }
}

measurePerformance();