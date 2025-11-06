document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Observador de Intersección (para animar al deslizar) ---
    const animatedSections = document.querySelectorAll('.animated-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.3
    });

    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // --- 2. Reproducir Música (Intento de autoplay mejorado) ---
    const music = document.getElementById('background-music');

    // Intento de reproducir inmediatamente (puede ser bloqueado)
    music.volume = 0.4;
    music.play().catch(e => {
        console.warn("La reproducción automática de música fue bloqueada.");
        // Si fue bloqueada, activamos un listener para el primer clic/scroll
        const enableMusicOnInteraction = () => {
            music.play().catch(e => console.log("Reintento de música fallido:", e));
            document.removeEventListener('scroll', enableMusicOnInteraction);
            document.removeEventListener('click', enableMusicOnInteraction);
        };
        document.addEventListener('scroll', enableMusicOnInteraction, { once: true });
        document.addEventListener('click', enableMusicOnInteraction, { once: true });
    });


    // --- 3. Generar y Animar Globos ---
    const balloonsContainer = document.querySelector('.balloons-container');
    const balloonColors = ['#ffc3a0', '#ffafbd', '#ffffff', '#d6336c', '#ffec8b']; // Colores del tema

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        
        const randomColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.setProperty('--balloon-color', randomColor);
        
        balloon.style.left = Math.random() * 90 + 5 + 'vw'; 
        balloon.style.setProperty('--float-duration', Math.random() * 8 + 10 + 's');
        balloon.style.setProperty('--float-delay', Math.random() * 5 + 's');
        
        balloonsContainer.appendChild(balloon);

        setTimeout(() => {
            balloon.remove();
        }, parseFloat(balloon.style.getPropertyValue('--float-duration')) * 1000);
    }

    // Generar unos cuantos globos al inicio
    for (let i = 0; i < 15; i++) {
        createBalloon();
    }
    // Y luego seguir generando más globos continuamente
    setInterval(() => {
        createBalloon();
    }, 2000);


    // --- 4. ¡La Explosión de Confeti Impactante y Lluvia de Corazones 3D! ---
    const confettiButton = document.getElementById('confetti-button');
    const fallingHeartsContainer = document.getElementById('falling-hearts-container');
    const fallingHeartColors = ['#d6336c', '#ffafbd', '#ffc3a0', '#ffffff'];

    function createFallingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.textContent = '❤️';

        const randomColor = fallingHeartColors[Math.floor(Math.random() * fallingHeartColors.length)];
        heart.style.setProperty('--heart-color', randomColor);

        // Posiciones y animaciones aleatorias para el efecto 3D
        heart.style.setProperty('--start-x', Math.random() * 100 + 'vw');
        heart.style.setProperty('--end-x', (Math.random() * 100 - 50) + 'vw'); // Se dispersa más
        heart.style.setProperty('--z-depth', Math.random() * 500 - 250 + 'px'); // Profundidad
        heart.style.setProperty('--y-rotation', Math.random() * 720 + 'deg'); // Rotación Y
        heart.style.setProperty('--x-rotation', Math.random() * 360 + 'deg'); // Rotación X
        heart.style.setProperty('--initial-opacity', Math.random() * 0.5 + 0.5); // Opacidad inicial
        heart.style.setProperty('--fall-duration', Math.random() * 8 + 7 + 's'); // Duración
        heart.style.setProperty('--fall-delay', Math.random() * 5 + 's'); // Retraso

        heart.style.fontSize = (Math.random() * 2 + 1.5) + 'em'; // Tamaño variado

        fallingHeartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, parseFloat(heart.style.getPropertyValue('--fall-duration')) * 1000 + parseFloat(heart.style.getPropertyValue('--fall-delay')) * 1000);
    }

    let fallingHeartsInterval; // Para controlar la lluvia de corazones

    confettiButton.addEventListener('click', () => {
        // Detener animación de globos si sigue activa (aunque ya estarían fuera de vista)
        clearInterval(fallingHeartsInterval); 

        // 1. Explosión de confeti y corazones con `canvas-confetti`
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }; // Z-index alto para confeti

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const confettiInterval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(confettiInterval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: balloonColors
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: balloonColors
            }));
        }, 250);

        // Ráfaga de corazones del `canvas-confetti`
        const heartConfettiDefaults = {
            spread: 90,
            ticks: 200,
            gravity: 0.8,
            decay: 0.94,
            startVelocity: 40,
            shapes: ['heart'],
            scalar: 1.5,
            colors: ['#d6336c', '#ffafbd']
        };

        setTimeout(() => confetti(Object.assign({}, heartConfettiDefaults, { particleCount: 30, origin: { x: 0.5, y: 0.7 } })), 0);
        setTimeout(() => confetti(Object.assign({}, heartConfettiDefaults, { particleCount: 40, origin: { x: 0.5, y: 0.7 } })), 200);
        setTimeout(() => confetti(Object.assign({}, heartConfettiDefaults, { particleCount: 30, origin: { x: 0.5, y: 0.7 } })), 400);

        // 2. Iniciar la Lluvia de Corazones 3D después de la explosión inicial
        setTimeout(() => {
            // Generar un torrente inicial de corazones
            for (let i = 0; i < 30; i++) {
                createFallingHeart();
            }
            // Luego, continuar generando corazones de forma persistente
            fallingHeartsInterval = setInterval(() => {
                createFallingHeart();
            }, 1000); // Un corazón nuevo cada segundo
        }, duration); // Esperar a que la explosión de confeti termine
    });

});