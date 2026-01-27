document.addEventListener("DOMContentLoaded", () => {
    document.body.style.overflow = 'hidden';

    const percentText = document.getElementById('loader-percent');
    const loaderWrapper = document.getElementById('loader-wrapper');
    const logoParts = document.querySelectorAll('#animated-logo .part');
    let progress = 0;

    // Создаем последовательность появления элементов логотипа как трансформер
    const animationSequence = [
        // Сначала нижние элементы (индексы 2 и 3 - это белые нижние части)
        { index: 2, direction: { x: -50, y: 0 } },  // левый нижний
        { index: 3, direction: { x: 50, y: 0 } },   // правый нижний

        // Потом боковые элементы
        { index: 0, direction: { x: -80, y: 0 } },  // левый зеленый
        { index: 1, direction: { x: 80, y: 0 } },   // правый зеленый

        // Средние части
        { index: 4, direction: { x: -60, y: 0 } },  // левая белая
        { index: 5, direction: { x: 60, y: 0 } },   // правая белая

        // Верхние части
        { index: 6, direction: { x: -70, y: 0 } },  // левая верхняя
        { index: 7, direction: { x: 70, y: 0 } },   // правая верхняя

        // Центральный зеленый элемент
        { index: 8, direction: { x: 0, y: -60 } },

        // Текст (последние элементы)
        { index: 9, direction: { x: 0, y: 30 } },
        { index: 10, direction: { x: 0, y: 30 } }
    ];

    // Анимируем каждый элемент по очереди
    animationSequence.forEach((item, seqIndex) => {
        const part = logoParts[item.index];
        if (part) {
            gsap.fromTo(part,
                {
                    x: item.direction.x,
                    y: item.direction.y,
                    opacity: 0,
                    scale: 0.7,
                    rotation: item.direction.x !== 0 ? (item.direction.x > 0 ? 15 : -15) : 0
                },
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    delay: seqIndex * 0.08,
                    ease: "back.out(1.5)"
                }
            );
        }
    });

    // Отдельно обновляем только проценты
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 2) + 1;

        if (progress > 99) progress = 99;

        if (percentText) {
            percentText.textContent = progress + '%';
        }
    }, 80);

    window.addEventListener('load', () => {
        clearInterval(interval);

        if (percentText) percentText.textContent = '100%';

        // Финальная анимация перед исчезновением
        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => {
                    loaderWrapper.classList.add('loaded');
                    document.body.style.overflow = '';
                }, 600);
            }
        });

        // Небольшая пульсация логотипа при завершении загрузки
        tl.to(logoParts, {
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
        });

        tl.to(logoParts, {
            scale: 1,
            duration: 0.3,
            ease: "power2.in"
        });

        tl.to(".loader-text", {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, "-=0.4");
    });
});

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
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2,
            infinite: false,
            autoResize: true,
            syncTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        limitCallbacks: true,
        syncInterval: browser.useSmoothScroll ? 16 : 50,
        ignoreMobileResize: true
    });

    const optimizeElements = document.querySelectorAll('.characters, .fog-overlay, .navbar, .left-side, .info-card');
    optimizeElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });

    gsap.set('.characters', { xPercent: -50, x: 0 });

    const scrubValue = browser.useSmoothScroll ? 1.5 : 0.5;

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
            scrub: scrubValue,
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
    if (galleryTitleElement) splitTextIntoWords(galleryTitleElement);

    const descElement = document.querySelector('.gallery-description');
    if (descElement) splitTextIntoWords(descElement);

    const trailerTitleElement = document.querySelector('.trailer-section .gallery-title');
    if (trailerTitleElement) splitTextIntoWords(trailerTitleElement);

    const footerTextLeft = document.querySelector('.footer-text-left');
    const footerTextRight = document.querySelector('.footer-text-right');

    if (footerTextLeft) splitTextIntoWords(footerTextLeft);
    if (footerTextRight) splitTextIntoWords(footerTextRight);

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
            scrub: scrubValue,
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
            scrub: scrubValue,
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
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });

    imagesTimeline.set(galleryItems, { visibility: 'visible' });
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
            scrub: scrubValue,
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
        { opacity: 0, scale: 0.85, y: 80, rotateX: 15 },
        {
            opacity: 1, scale: 1, y: 0, rotateX: 0,
            duration: 2, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.trailer-section',
                start: 'top 50%',
                end: 'top 20%',
                scrub: scrubValue,
                invalidateOnRefresh: true
            }
        }
    );

    gsap.set('.footer-green-line', { scaleX: 0, transformOrigin: 'left center' });
    gsap.to('.footer-green-line', {
        scaleX: 1, duration: 1.5, ease: 'power2.out',
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top 90%',
            end: 'top 60%',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });

    const footerLeftTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer-content',
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });

    document.querySelectorAll('.footer-text-left .word').forEach((word, wordIndex) => {
        word.querySelectorAll('.letter').forEach((letter, letterIndex) => {
            footerLeftTimeline.to(letter, {
                opacity: 1, x: 0, duration: 0.2, ease: 'power2.out'
            }, wordIndex * 0.08 + letterIndex * 0.03);
        });
    });

    const footerRightTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer-content',
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: scrubValue,
            invalidateOnRefresh: true
        }
    });

    document.querySelectorAll('.footer-text-right .word').forEach((word, wordIndex) => {
        word.querySelectorAll('.letter').forEach((letter, letterIndex) => {
            footerRightTimeline.to(letter, {
                opacity: 1, x: 0, duration: 0.2, ease: 'power2.out'
            }, wordIndex * 0.08 + letterIndex * 0.03);
        });
    });

    gsap.fromTo('.footer-logo',
        { opacity: 0, scale: 0.8, y: 20 },
        {
            opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: '.footer-content',
                start: 'top 90%',
                end: 'bottom 60%',
                scrub: scrubValue,
                invalidateOnRefresh: true
            }
        }
    );

    gsap.fromTo('.footer-bottom p',
        { opacity: 0, y: 20 },
        {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.footer-bottom',
                start: 'top 95%',
                end: 'bottom 70%',
                scrub: scrubValue,
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
                ScrollTrigger.refresh();
            }
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => ScrollTrigger.refresh(), 100);
        setTimeout(() => {
            optimizeElements.forEach(el => el.style.willChange = 'auto');
        }, 2000);
    });
});