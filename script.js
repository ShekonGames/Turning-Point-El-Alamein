gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    let currentScroll = window.pageYOffset;
    let targetScroll = window.pageYOffset;
    let ease = 0.075;
    
    function smoothScroll() {
        currentScroll += (targetScroll - currentScroll) * ease;
        
        if (Math.abs(targetScroll - currentScroll) < 0.5) {
            currentScroll = targetScroll;
        }
        
        window.scrollTo(0, currentScroll);
        requestAnimationFrame(smoothScroll);
    }
    
    window.addEventListener('wheel', (e) => {
        targetScroll += e.deltaY * 0.5;
        targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
    }, { passive: true });
    
    window.addEventListener('scroll', () => {
        if (Math.abs(window.pageYOffset - targetScroll) > 1) {
            targetScroll = window.pageYOffset;
            currentScroll = window.pageYOffset;
        }
    }, { passive: true });
    
    smoothScroll();
    
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        limitCallbacks: true
    });
    
    gsap.set('.characters', { xPercent: -50, x: 0 });
    
    gsap.to('.fog-overlay', {
        opacity: 1,
        bottom: '0vh',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '70% top',
            scrub: 2,
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
            scrub: 2.5,
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
            scrub: 2,
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
            scrub: 2,
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
            scrub: 1.5,
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
            scrub: 2,
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
            scrub: 2,
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
            scrub: 2,
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
            scrub: 2.5,
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
            scrub: 2,
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
                scrub: 1.5,
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
            scrub: 2,
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
                scrub: 1,
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
    
    ScrollTrigger.refresh();
    
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
});