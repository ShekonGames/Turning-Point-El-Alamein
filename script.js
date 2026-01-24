gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    function detectBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        const isChrome = /chrome/.test(ua) && !/edge/.test(ua) && !/opr/.test(ua);
        const isFirefox = /firefox/.test(ua);
        const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
        
        return {
            isChrome,
            isFirefox,
            isSafari,
            useSmoothScroll: isFirefox || isSafari
        };
    }
    
    const browser = detectBrowser();
    let lenis = null;
    
    if (browser.useSmoothScroll) {
        lenis = new Lenis({
            duration: 0.8,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2,
            infinite: false,
            autoResize: true,
            lerp: 0.1,
            syncTouch: false
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });
        
        gsap.ticker.lagSmoothing(0);
    }
    
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        limitCallbacks: true,
        syncInterval: browser.useSmoothScroll ? 150 : 50
    });
    
    const optimizeElements = document.querySelectorAll('.characters, .fog-overlay, .navbar, .left-side, .info-card');
    optimizeElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });
    
    gsap.set('.characters', { xPercent: -50, x: 0 });
    
    const scrubValue = browser.useSmoothScroll ? 1 : 0.5;
    
    gsap.to('.fog-overlay', {
        opacity: 1,
        bottom: '0vh',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '70% top',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });
    
    gsap.to('.characters', {
        scale: 1.8,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: scrubValue * 1.5,
            invalidateOnRefresh: true
        }
    });
    
    gsap.to('.left-side', {
        y: -300,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'center top',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });
    
    gsap.to('.info-card', {
        y: -250,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'center top',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });
    
    gsap.to('.navbar', {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '15% top',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });
    
    gsap.to('.hero-section', {
        backgroundPosition: '50% 80%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });
    
    function splitTextIntoWords(element) {
        const text = element.textContent;
        const words = text.split(' ');
        const fragment = document.createDocumentFragment();
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.style.cssText = 'display:inline-block;white-space:nowrap';
            
            const letters = word.split('');
            letters.forEach((letter, letterIndex) => {
                const letterSpan = document.createElement('span');
                letterSpan.textContent = letter;
                letterSpan.className = 'letter';
                letterSpan.style.cssText = 'display:inline-block';
                
                if (letterIndex > 0) {
                    letterSpan.style.opacity = '0';
                    letterSpan.style.transform = 'translateX(30px)';
                }
                
                wordSpan.appendChild(letterSpan);
            });
            
            fragment.appendChild(wordSpan);
            
            if (wordIndex < words.length - 1) {
                fragment.appendChild(document.createTextNode(' '));
            }
        });
        
        element.innerHTML = '';
        element.appendChild(fragment);
    }
    
    const galleryTitleElement = document.querySelector('.gallery-section .gallery-title');
    if (galleryTitleElement) {
        splitTextIntoWords(galleryTitleElement);
    }
    
    const descElement = document.querySelector('.gallery-description');
    if (descElement) {
        splitTextIntoWords(descElement);
    }
    
    const trailerTitleElement = document.querySelector('.trailer-section .gallery-title');
    if (trailerTitleElement) {
        splitTextIntoWords(trailerTitleElement);
    }
    
    const footerTextLeft = document.querySelector('.footer-text-left');
    const footerTextRight = document.querySelector('.footer-text-right');
    
    if (footerTextLeft) {
        splitTextIntoWords(footerTextLeft);
    }
    
    if (footerTextRight) {
        splitTextIntoWords(footerTextRight);
    }
    
    const titleWords = document.querySelectorAll('.gallery-section .gallery-title .word');
    const descWords = document.querySelectorAll('.gallery-description .word');
    const trailerTitleWords = document.querySelectorAll('.trailer-section .gallery-title .word');
    
    let galleryItems = gsap.utils.toArray('.gallery-item');
    
    galleryItems.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        return rectA.top - rectB.top;
    });
    
    gsap.set(galleryItems, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        visibility: 'hidden'
    });
    
    const titleTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 60%',
            end: 'top 30%',
            scrub: scrubValue * 1.5,
            invalidateOnRefresh: true
        }
    });
    
    titleWords.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.letter');
        
        titleTimeline.to(letters, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        }, wordIndex * 0.15);
    });
    
    const descTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 30%',
            end: 'top 10%',
            scrub: scrubValue * 1.5,
            invalidateOnRefresh: true
        }
    });
    
    descWords.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.letter');
        
        descTimeline.to(letters, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        }, wordIndex * 0.1);
    });
    
    const imagesTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 10%',
            end: 'center top',
            scrub: scrubValue * 2,
            invalidateOnRefresh: true
        }
    });
    
    imagesTimeline.set(galleryItems, {
        visibility: 'visible'
    });
    
    imagesTimeline.to(galleryItems, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 3,
        stagger: 0.2,
        ease: 'power4.out'
    });
    
    ScrollTrigger.create({
        trigger: '.gallery-text',
        start: 'center center',
        end: () => {
            const gallerySection = document.querySelector('.gallery-section');
            return `+=${gallerySection.offsetHeight - window.innerHeight}`;
        },
        pin: '.gallery-text',
        pinSpacing: false,
        invalidateOnRefresh: true
    });
    
    const trailerTitleTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.trailer-section',
            start: 'top 70%',
            end: 'top 40%',
            scrub: scrubValue * 1.5,
            invalidateOnRefresh: true
        }
    });
    
    trailerTitleWords.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.letter');
        
        trailerTitleTimeline.to(letters, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        }, wordIndex * 0.15);
    });
    
    gsap.fromTo('.video-wrapper',
        {
            opacity: 0,
            scale: 0.85,
            y: 80,
            rotateX: 15
        },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            duration: 2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.trailer-section',
                start: 'top 50%',
                end: 'top 20%',
                scrub: scrubValue * 1.5,
                invalidateOnRefresh: true
            }
        }
    );
    
    gsap.fromTo('.video-wrapper::before, .video-wrapper::after',
        {
            scale: 0,
            opacity: 0
        },
        {
            scale: 1,
            opacity: 0.6,
            duration: 1,
            ease: 'back.out(2)',
            scrollTrigger: {
                trigger: '.trailer-section',
                start: 'top 40%',
                end: 'top 25%',
                scrub: scrubValue,
                invalidateOnRefresh: true
            }
        }
    );
    
    gsap.fromTo('.video-frame',
        {
            opacity: 0,
            scale: 0.9,
            rotateX: 5
        },
        {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.trailer-section',
                start: 'top 60%',
                end: 'top 30%',
                scrub: scrubValue,
                invalidateOnRefresh: true
            }
        }
    );
    
    gsap.to('.trailer-bg-glow', {
        y: -100,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
            trigger: '.trailer-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: scrubValue * 1.5,
            invalidateOnRefresh: true
        }
    });
    
    const statItems = gsap.utils.toArray('.stat-item');
    
    gsap.fromTo(statItems,
        {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: '.video-info',
                start: 'top 85%',
                end: 'top 60%',
                scrub: scrubValue * 0.8,
                invalidateOnRefresh: true
            }
        }
    );
    
    gsap.fromTo('.trailer-decorative-line',
        {
            scaleX: 0,
            opacity: 0
        },
        {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.trailer-header',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    const videoFrame = document.querySelector('.video-frame');
    const frameCorners = document.querySelectorAll('.frame-corner');
    
    if (videoFrame) {
        videoFrame.addEventListener('mouseenter', () => {
            gsap.to(frameCorners, {
                scale: 1.15,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        videoFrame.addEventListener('mouseleave', () => {
            gsap.to(frameCorners, {
                scale: 1,
                opacity: 0.8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
    
    const frameGlows = gsap.utils.toArray('.frame-glow');
    
    frameGlows.forEach((glow, index) => {
        gsap.to(glow, {
            opacity: 0.8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.5
        });
    });
    
    gsap.set('.footer-green-line', {
        scaleX: 0,
        transformOrigin: 'left center'
    });
    
    gsap.to('.footer-green-line', {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top 90%',
            end: 'top 70%',
            scrub: scrubValue * 0.8,
            invalidateOnRefresh: true
        }
    });
    
    const footerTextLeftWords = document.querySelectorAll('.footer-text-left .word');
    const footerTextRightWords = document.querySelectorAll('.footer-text-right .word');
    
    const footerLeftTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer-content',
            start: 'top 90%',
            end: 'top 60%',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });
    
    footerTextLeftWords.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.letter');
        
        footerLeftTimeline.to(letters, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.04,
            ease: 'power2.out'
        }, wordIndex * 0.1);
    });
    
    const footerRightTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer-content',
            start: 'top 90%',
            end: 'top 60%',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });
    
    footerTextRightWords.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.letter');
        
        footerRightTimeline.to(letters, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.04,
            ease: 'power2.out'
        }, wordIndex * 0.1);
    });
    
    gsap.fromTo('.footer-logo',
        {
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: '.footer-content',
                start: 'top 90%',
                end: 'top 60%',
                scrub: scrubValue,
                invalidateOnRefresh: true
            }
        }
    );
    
    gsap.fromTo('.footer-bottom p',
        {
            opacity: 0,
            y: 20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.footer-bottom',
                start: 'top 95%',
                end: 'top 80%',
                scrub: scrubValue * 0.8,
                invalidateOnRefresh: true
            }
        }
    );
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (lenis) lenis.resize();
            ScrollTrigger.refresh();
        }, 300);
    });
    
    if (lenis) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });
    }
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            optimizeElements.forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 2000);
    });
});