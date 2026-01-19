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
    
    const titleElement = document.querySelector('.gallery-title');
    if (titleElement) {
        splitTextIntoWords(titleElement);
    }
    
    const descElement = document.querySelector('.gallery-description');
    if (descElement) {
        splitTextIntoWords(descElement);
    }
    
    const titleWords = document.querySelectorAll('.gallery-title .word');
    const descWords = document.querySelectorAll('.gallery-description .word');
    
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