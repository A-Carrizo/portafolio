// Scripts del portafolio de Aldo Carrizo

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    root.classList.remove('no-js');

    // Tema claro / oscuro (el valor inicial se aplica en el <head> para evitar parpadeos)
    const themeToggle = document.getElementById('themeToggle');
    const syncThemeIcon = () => {
        if (!themeToggle) return;
        const dark = root.getAttribute('data-theme') === 'dark';
        themeToggle.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    };
    syncThemeIcon();
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) { /* almacenamiento no disponible */ }
            syncThemeIcon();
        });
    }

    // Barra de navegación compacta al hacer scroll
    const nav = document.getElementById('mainNav');
    const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Animación de aparición de elementos
    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach((el) => observer.observe(el));
    } else {
        revealItems.forEach((el) => el.classList.add('visible'));
    }

    // Texto con efecto de escritura en el hero
    const typed = document.getElementById('typed');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typed && !reduceMotion) {
        const words = JSON.parse(typed.dataset.words);
        let wordIndex = 0;
        let charIndex = words[0].length;
        let deleting = true;
        const tick = () => {
            const word = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            typed.textContent = word.slice(0, charIndex);
            let delay = deleting ? 45 : 85;
            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 2200;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 350;
            }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 2200);
    }

    // Año actual en el footer
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    // Formulario de contacto: arma el mensaje y lo abre por correo o WhatsApp
    const form = document.getElementById('contactForm');
    if (form) {
        const buildMessage = () => {
            const name = form.elements.name.value.trim();
            const email = form.elements.email.value.trim();
            const phone = form.elements.phone.value.trim();
            const message = form.elements.message.value.trim();
            return `Hola Aldo, soy ${name}.\n\n${message}\n\nCorreo: ${email}${phone ? `\nCelular: ${phone}` : ''}`;
        };
        const isValid = () => {
            form.classList.add('was-validated');
            return form.checkValidity();
        };
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!isValid()) return;
            const subject = encodeURIComponent(`Contacto desde el portafolio — ${form.elements.name.value.trim()}`);
            window.location.href = `mailto:aldocarrizo841@gmail.com?subject=${subject}&body=${encodeURIComponent(buildMessage())}`;
        });
        const whatsappButton = document.getElementById('whatsappButton');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', () => {
                if (!isValid()) return;
                window.open(`https://wa.me/595971469136?text=${encodeURIComponent(buildMessage())}`, '_blank', 'noopener');
            });
        }
    }
});
