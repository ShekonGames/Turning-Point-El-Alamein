gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Инициализация Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
    });
    
    lenis.on('scroll', ScrollTrigger.update);
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // 2. Настройки GSAP
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });
    
    gsap.set('.characters', { xPercent: -50, x: 0 });
    
    // ===== СЕКЦИЯ HERO - БЕЗ ИЗМЕНЕНИЙ =====
    
    // Туман
    gsap.to('.fog-overlay', {
        opacity: 1,
        bottom: '0vh',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '70% top',
            scrub: 0.8
        }
    });
    
    // Влет персонажей
    gsap.to('.characters', {
        scale: 1.8,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });
    
    // Левая часть
    gsap.to('.left-side', {
        y: -300,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'center top',
            scrub: 1.2
        }
    });
    
    // Карточка с танком
    gsap.to('.info-card', {
        y: -250,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'center top',
            scrub: 1.2
        }
    });
    
    // Навбар
    gsap.to('.navbar', {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '15% top',
            scrub: 0.5
        }
    });
    
    // Параллакс фона
    gsap.to('.hero-section', {
        backgroundPosition: '50% 80%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // ===== НОВАЯ ЛОГИКА GALLERY SECTION =====
    
    // Функция для разбивки текста на слова и буквы
    function splitTextIntoWords(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = '';
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            const letters = word.split('');
            letters.forEach((letter, letterIndex) => {
                const letterSpan = document.createElement('span');
                letterSpan.textContent = letter;
                letterSpan.classList.add('letter');
                letterSpan.style.display = 'inline-block';
                
                // Первая буква видна, остальные скрыты справа
                if (letterIndex === 0) {
                    gsap.set(letterSpan, { opacity: 1, x: 0 });
                } else {
                    gsap.set(letterSpan, { opacity: 0, x: 30 });
                }
                
                wordSpan.appendChild(letterSpan);
            });
            
            element.appendChild(wordSpan);
            
            // Добавляем пробел после слова (кроме последнего)
            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    }
    
    // Разбиваем заголовок на слова и буквы
    const titleElement = document.querySelector('.gallery-title');
    if (titleElement) {
        splitTextIntoWords(titleElement);
    }
    
    // Разбиваем описание на слова и буквы
    const descElement = document.querySelector('.gallery-description');
    if (descElement) {
        splitTextIntoWords(descElement);
    }
    
    const titleWords = document.querySelectorAll('.gallery-title .word');
    const descWords = document.querySelectorAll('.gallery-description .word');
    
    // Получаем все картинки и сортируем их по вертикальной позиции
    let galleryItems = gsap.utils.toArray('.gallery-item');
    
    // Сортируем картинки по их позиции на экране (сверху вниз)
    galleryItems.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        // Сравниваем по Y-координате (top)
        return rectA.top - rectB.top;
    });
    
    // Начальное состояние ВСЕХ картинок - ПРИНУДИТЕЛЬНО скрыты
    galleryItems.forEach((item) => {
        gsap.set(item, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            visibility: 'hidden'
        });
    });
    
    // ===== АНИМАЦИЯ 1: ЗАГОЛОВОК - слова выезжают справа налево =====
    const titleTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 60%',
            end: 'top 30%',
            scrub: 1.5,
        }
    });
    
    // Анимируем каждое слово по порядку
    titleWords.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.letter');
        
        // Анимируем буквы в слове (кроме первой, она уже видна)
        titleTimeline.to(letters, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        }, wordIndex * 0.15); // Каждое слово начинается с задержкой
    });
    
    // ===== АНИМАЦИЯ 2: ОПИСАНИЕ - слова выезжают справа налево =====
    const descTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 30%',
            end: 'top 10%',
            scrub: 1.5,
        }
    });
    
    // Анимируем каждое слово по порядку
    descWords.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.letter');
        
        // Анимируем буквы в слове (кроме первой, она уже видна)
        descTimeline.to(letters, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        }, wordIndex * 0.1); // Каждое слово начинается с задержкой
    });
    
    // ===== АНИМАЦИЯ 3: ВСЕ КАРТИНКИ ОДНОВРЕМЕННО (максимально плавно) =====
    const imagesTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 10%',
            end: 'center top',
            scrub: 3, // Еще больше увеличили для супер плавности
        }
    });
    
    // Сначала делаем все картинки видимыми
    imagesTimeline.set(galleryItems, {
        visibility: 'visible'
    });
    
    // Затем анимируем их появление по порядку с максимально плавными параметрами
    imagesTimeline.to(galleryItems, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 3, // Еще больше увеличили длительность
        stagger: 0.2, // Увеличили задержку между картинками
        ease: 'power4.out' // Самый плавный easing
    });
    
    // Пин текста (возвращаем рабочую версию)
    ScrollTrigger.create({
        trigger: '.gallery-text',
        start: 'center center',
        end: () => {
            const gallerySection = document.querySelector('.gallery-section');
            return `+=${gallerySection.offsetHeight - window.innerHeight}`;
        },
        pin: '.gallery-text',
        pinSpacing: false
    });
    
    // Управление событиями
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