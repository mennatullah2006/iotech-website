// ======================
// LANGUAGE SWITCHING
// ======================
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    const html = document.documentElement;
    
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
    }
    
    document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        const attribute = lang === 'ar' ? 'data-ar' : 'data-en';
        const text = element.getAttribute(attribute);
        
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text; //the grey contact inside the box
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;//(inside a <select> dropdown) → update its visible text.
            } else {
                element.textContent = text;
            }
        }
    });
    
    localStorage.setItem('preferred-lang', lang);//Saves the chosen language in the browser memory so next time the user opens the page, their language preference is remembered.
    updateLangToggle(lang);//button language
}

function updateLangToggle(lang) {
    const langToggle = document.getElementById('langToggle');
    if (lang === 'ar') {
        langToggle.style.background = 'linear-gradient(90deg, var(--primary-blue), var(--primary-green))';
        langToggle.style.color = 'white';
    } else {
        langToggle.style.background = 'var(--light-gray)';
        langToggle.style.color = 'var(--dark-gray)';
    }
}

// ======================
// NAVIGATION
// ======================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');// animates the button (☰ turns into ✕)
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';//overflow: hidden → locks the page so user can't scroll behind the menu
});
/*
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;//Gets the pixel position of this section from the top of the page
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});
*/
navLinks.forEach(link => {//Close menu when a link is clicked
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {//event object, it contains info about what was clicked
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ======================
// LANGUAGE TOGGLE
// ======================
const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    switchLanguage(newLang);
});

window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    if (savedLang !== 'en') {
        switchLanguage(savedLang);
    }
});

// ======================
// PROJECTS FILTER
// ======================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';// exist in the layout
                setTimeout(() => {
                    card.style.opacity = '1';//fades the card in
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {//doesnt match the filter 
                card.style.opacity = '0';//fades the card out
                card.style.transform = 'translateY(20px)';//moves down 20 pixels
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

// ======================
// CONTACT FORM
// ======================
const contactForm = document.getElementById('contactForm');

if (contactForm) {// makes sure the form actually exists
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);//automatically collects all field values from the form all gathered in one object Ready to be sent to the server

        fetch('save_contact.php', {                           
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(text => {
            if (text.startsWith('success')) {                  
                contactForm.reset();
                alert('✅ Message sent! Our team will reach out to you soon.');
            } else {
                alert('Something went wrong. Please try again or call us directly.');
            }
        })
        .catch(err => {
            alert('Fetch error: ' + err.message);
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ======================
// SCROLL ANIMATIONS
// ======================
function observeElements() { //It is not called immediately — it runs later when the page loads ,Contains all the scroll animation setup
    const observerOptions = { // an object containing settings for the observer
        threshold: 0.1,//trigger the animation when 10% of the element is visible in the screen
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {//creates a watcher that monitors elements It watches when elements enter or exit the visible area of the screen
        entries.forEach(entry => {//entery is a list of element that recently change the visibility
            if (entry.isIntersecting) {//true if the elements entering the screen and false if exiting the screen 
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card').forEach(card => {//setting before the animation 
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    document.querySelectorAll('.feature-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    document.querySelectorAll('.step-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    observeElements();
});

// ======================
// WHATSAPP BUTTON
// ======================
const whatsappFloat = document.querySelector('.whatsapp-float');

if (whatsappFloat) {
    window.addEventListener('scroll', () => {
        let whatsappMessage = 'مرحباً، أرغب في الاستفسار عن خدمات iotech';
      /*  const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;//the full height of the section in pixels, start and end position

            if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {//user has reached this section
                const sectionId = section.getAttribute('id');
                switch(sectionId) {
                    case 'services':
                        whatsappMessage = currentLang === 'ar' 
                            ? 'مرحباً، أرغب في معرفة المزيد عن خدماتكم'
                            : 'Hello, I would like to know more about your services';
                        break;
                    case 'projects':
                        whatsappMessage = currentLang === 'ar'
                            ? 'مرحباً، أرغب في مشاهدة أمثلة على أعمالكم'
                            : 'Hello, I would like to see examples of your work';
                        break;
                    case 'contact':
                        whatsappMessage = currentLang === 'ar'
                            ? 'مرحباً، أرغب في الحصول على استشارة مجانية'
                            : 'Hello, I would like to get a free consultation';
                        break;
                }
            }
        });*/
        whatsappFloat.setAttribute('href', `https://wa.me/201095666166?text=${encodeURIComponent(whatsappMessage)}`);
    });
}

// ======================
// FORM FIELD ANIMATIONS
// ======================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

formInputs.forEach(input => {
    input.addEventListener('focus', () => { input.parentElement.classList.add('focused'); });
    input.addEventListener('blur', () => { input.parentElement.classList.remove('focused'); });
});

// ======================
// PARALLAX EFFECT
// ======================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;//Gets how many pixels the user has scrolled from the top
    const hero = document.querySelector('.hero-bg');
    if (hero) hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// ======================
// ACCESSIBILITY
// ======================
document.addEventListener('keydown', (e) => {//Listens for any key being pressed anywhere on the page
    if (e.key === 'Escape') {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ======================
// PROJECT CARD ANIMATIONS
// ======================
const projectCardsArray = document.querySelectorAll('.project-card');

projectCardsArray.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;//Each card gets a slightly later start by 0.1
    card.addEventListener('mouseenter', () => { card.style.zIndex = '10'; });
    card.addEventListener('mouseleave', () => { card.style.zIndex = '1'; });
});

// ======================
// INITIALIZE
// ======================
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    switchLanguage(savedLang);
    observeElements();//Starts watching elements so scroll animations are ready
});

console.log('%c iotech ', 'background: linear-gradient(90deg, #0080C8, #7AC943); color: white; font-size: 16px; padding: 10px; font-weight: bold;');
