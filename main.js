// main.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-up, .reveal-up');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Concierge Preloader Logic
    const preloader = document.getElementById('zen-preloader');
    const conciergeBtn = document.getElementById('concierge-btn');
    const conciergeInput = document.getElementById('concierge-name');
    
    function triggerHeroAnim() {
        const heroElements = document.querySelectorAll('.hero .slide-text.active .animate-up');
        heroElements.forEach((el, index) => {
            setTimeout(() => el.classList.add('is-visible'), index * 150);
        });
    }

    function enterSite() {
        let name = conciergeInput ? conciergeInput.value.trim() : '';
        if (name) {
            // Injeta o nome em todos os spans
            document.querySelectorAll('.user-name-display').forEach(el => {
                el.innerHTML = `${name}, `;
            });
            document.querySelectorAll('.user-name-cta').forEach(el => {
                el.innerHTML = `${name}, `;
            });
            
            const navGreeting = document.getElementById('nav-greeting');
            if(navGreeting) {
                navGreeting.innerHTML = `Olá, ${name}`;
                navGreeting.style.display = 'inline';
            }
            
            sessionStorage.setItem('patientName', name);
        }

        // Tenta tocar o áudio automaticamente após o usuário interagir (clicar ou dar enter)
        const zenAudio = document.getElementById('zen-audio');
        const soundToggle = document.getElementById('sound-toggle');
        if (zenAudio) {
            zenAudio.volume = 0.25;
            zenAudio.play().then(() => {
                if(soundToggle) soundToggle.classList.add('playing');
            }).catch(e => console.log('Áudio automático bloqueado pelo navegador.', e));
        }
        
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                document.body.classList.remove('is-loading');
                triggerHeroAnim();
            }, 1000); // Fade out transition
        } else {
            document.body.classList.remove('is-loading');
            setTimeout(triggerHeroAnim, 100);
        }
    }

    if (conciergeBtn) {
        conciergeBtn.addEventListener('click', enterSite);
        if(conciergeInput) {
            conciergeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') enterSite();
            });
        }
    }

    // Video Slider Logic
    const sliderBtns = document.querySelectorAll('.slider-btn');
    let currentSlide = 1;
    const totalSlides = sliderBtns.length;
    let slideInterval;

    function changeSlide(targetIndex) {
        document.querySelector('.slider-btn.active').classList.remove('active');
        document.querySelector('.hero-bg-video.active').classList.remove('active');
        document.querySelector('.slide-text.active').classList.remove('active');

        document.querySelectorAll('.hero .animate-up').forEach(el => el.classList.remove('is-visible'));

        document.querySelector(`.slider-btn[data-target="${targetIndex}"]`).classList.add('active');
        document.getElementById(`video-${targetIndex}`).classList.add('active');
        document.getElementById(`text-${targetIndex}`).classList.add('active');

        document.getElementById(`video-${targetIndex}`).play().catch(e => console.log('Autoplay prevented', e));

        setTimeout(() => {
            const newElements = document.querySelectorAll(`#text-${targetIndex} .animate-up`);
            newElements.forEach((el, index) => {
                setTimeout(() => el.classList.add('is-visible'), index * 150);
            });
        }, 50);

        currentSlide = parseInt(targetIndex);
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            let nextSlide = currentSlide < totalSlides ? currentSlide + 1 : 1;
            changeSlide(nextSlide);
        }, 5000);
    }

    if (sliderBtns.length > 0) {
        sliderBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                changeSlide(target);
            });
        });
        
        const firstVideo = document.getElementById('video-1');
        if(firstVideo) {
            firstVideo.play().catch(e => console.log('Autoplay prevented', e));
        }
        resetInterval();
    }

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const magnetics = document.querySelectorAll('.magnetic, a, button');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        magnetics.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                el.style.transform = '';
            });

            if (el.classList.contains('magnetic')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
            }
        });
    }

    // Smart WhatsApp Logic
    const waBtn = document.getElementById('wa-float-btn');
    const directWaBtn = document.querySelector('.wa-direct-btn');
    
    if (waBtn) {
        function checkBusinessHours() {
            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();
            
            // 08:00 - 17:00
            const isWorkingDay = day >= 1 && day <= 5;
            const isWorkingHour = hour >= 8 && hour < 17;
            
            if (isWorkingDay && isWorkingHour) {
                waBtn.classList.add('online');
                waBtn.classList.remove('offline');
                waBtn.style.pointerEvents = 'auto';
                if(directWaBtn) directWaBtn.style.pointerEvents = 'auto';
            } else {
                waBtn.classList.add('offline');
                waBtn.classList.remove('online');
                
                const showOfflineToast = (e) => {
                    e.preventDefault();
                    let toast = document.getElementById('wa-offline-toast');
                    if(!toast) {
                        toast = document.createElement('div');
                        toast.id = 'wa-offline-toast';
                        toast.className = 'glass-card magnetic';
                        toast.innerHTML = `
                            <h4 style="color: var(--color-peach); margin-bottom: 5px; font-family: var(--font-heading);">Atendimento VIP</h4>
                            <p style="font-size: 0.95rem; color: var(--color-text-main);">Nosso horário é de Seg a Sex, das 08h às 17h.<br><strong>Por favor, aguarde nosso retorno.</strong></p>
                        `;
                        Object.assign(toast.style, {
                            position: 'fixed', bottom: '100px', right: '30px', zIndex: '999999',
                            padding: '20px', borderRadius: '15px', transform: 'translateY(50px)',
                            opacity: '0', transition: 'all 0.3s ease', pointerEvents: 'none',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '300px'
                        });
                        document.body.appendChild(toast);
                    }
                    setTimeout(() => {
                        toast.style.opacity = '1';
                        toast.style.transform = 'translateY(0)';
                    }, 10);
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        toast.style.transform = 'translateY(50px)';
                    }, 4000);
                };

                waBtn.onclick = showOfflineToast;
                if(directWaBtn) directWaBtn.onclick = showOfflineToast;
            }
        }
        
        checkBusinessHours();
        setInterval(checkBusinessHours, 60000);
    }

    // Video Modal Logic
    const videoTrigger = document.getElementById('video-trigger');
    const videoModal = document.getElementById('video-modal');
    const closeVideo = document.getElementById('close-video');
    const nutritionistVideo = document.getElementById('nutritionist-video');

    if(videoTrigger && videoModal && closeVideo && nutritionistVideo) {
        videoTrigger.addEventListener('click', () => {
            videoModal.classList.add('active');
            nutritionistVideo.play().catch(e => console.log('Autoplay prevented', e));
        });

        function closeModal() {
            videoModal.classList.remove('active');
            nutritionistVideo.pause();
            nutritionistVideo.currentTime = 0;
        }

        closeVideo.addEventListener('click', closeModal);

        // Close on background click
        videoModal.addEventListener('click', (e) => {
            if(e.target === videoModal) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Smart WhatsApp Form Logic
    const waForm = document.getElementById('wa-form');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check Business Hours again on form submit
            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();
            
            const isWorkingDay = day >= 1 && day <= 5;
            const isWorkingHour = hour >= 8 && hour < 17;
            
            if (!isWorkingDay || !isWorkingHour) {
                alert('Nosso horário de atendimento VIP é de Segunda a Sexta, das 08h às 17h. Por favor, retorne neste horário para que possamos te dar atenção exclusiva!');
                return;
            }

            const nome = document.getElementById('wa-nome').value.trim();
            const plano = document.getElementById('wa-plano').value;
            const msg = document.getElementById('wa-msg').value.trim();

            if (nome && plano && msg) {
                const textMsg = `Olá! Meu nome é ${nome}.\nTenho interesse no plano: *${plano}*.\n\nMensagem: ${msg}`;
                const encodedMsg = encodeURIComponent(textMsg);
                const waUrl = `https://wa.me/5511999999999?text=${encodedMsg}`;
                
                window.open(waUrl, '_blank');
                waForm.reset();
            }
        });
    }

    // Lenis Smooth Scroll Initialization
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current FAQ
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Raio-X da Longevidade Logic
    const xrayDots = document.querySelectorAll('.xray-dot');
    const xrayInfoPanel = document.querySelector('.xray-info-panel');
    const xrayTitle = document.getElementById('xray-title');
    const xrayDesc = document.getElementById('xray-desc');

    if(xrayInfoPanel) {
        xrayDots.forEach(dot => {
            dot.addEventListener('mouseenter', () => {
                const info = dot.getAttribute('data-info');
                const [title, desc] = info.split(': ');
                xrayTitle.textContent = title;
                xrayDesc.textContent = desc;
                xrayInfoPanel.classList.remove('hidden');
            });
            dot.addEventListener('mouseleave', () => {
                // Keep it visible for a moment, or let it stay until they hover another
                // We'll just let it stay so they have time to read
            });
        });
    }

    // Spotlight Effect for Glass Cards
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Calculadora de Vitalidade (Immediate WA Redirect)
    const calcBtn = document.getElementById('calc-btn');
    const calcPeso = document.getElementById('calc-peso');
    const calcAltura = document.getElementById('calc-altura');
    const calcLoading = document.getElementById('calc-loading');
    const calcActionContainer = document.getElementById('calc-action-container');

    if(calcBtn && calcPeso && calcAltura) {
        calcBtn.addEventListener('click', () => {
            const peso = parseFloat(calcPeso.value);
            const alturaCm = parseFloat(calcAltura.value);
            
            if (peso > 0 && alturaCm > 0) {
                // Show loading state, hide button
                calcActionContainer.style.display = 'none';
                calcLoading.classList.remove('hidden');

                // Simulate processing for 1.5s to build anticipation
                setTimeout(() => {
                    const name = sessionStorage.getItem('patientName') || 'Paciente';
                    const msg = `Olá Beatriz, sou ${name}. Acabei de fazer o cálculo no site com Peso: ${peso}kg e Altura: ${alturaCm}cm. Gostaria da sua análise do meu IMC e hidratação!`;
                    const waUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
                    
                    window.open(waUrl, '_blank');

                    // Reset form after 2s
                    setTimeout(() => {
                        calcActionContainer.style.display = 'block';
                        calcLoading.classList.add('hidden');
                        calcPeso.value = '';
                        calcAltura.value = '';
                    }, 2000);
                }, 1500);

            } else {
                alert('Por favor, insira peso e altura válidos.');
            }
        });
    }

    // Pilar Modal Logic
    const pilarModalOverlay = document.getElementById('pilar-modal-overlay');
    const pilarModalClose = document.getElementById('pilar-modal-close');
    const pilarModalTitle = document.getElementById('pilar-modal-title');
    const pilarModalDesc = document.getElementById('pilar-modal-desc');
    const pilarModalBenefits = document.getElementById('pilar-modal-benefits');
    const pilarModalWa = document.getElementById('pilar-modal-wa');
    const bentoCardsAll = document.querySelectorAll('.bento-card[data-pilar-titulo]');

    function openPilarModal(card) {
        const titulo = card.getAttribute('data-pilar-titulo');
        const desc = card.getAttribute('data-pilar-desc');
        const benefits = card.getAttribute('data-pilar-benefits').split('|');
        
        pilarModalTitle.textContent = titulo;
        pilarModalDesc.textContent = desc;
        pilarModalBenefits.innerHTML = benefits.map(b => `<li>${b}</li>`).join('');
        
        pilarModalWa.onclick = () => {
            const name = sessionStorage.getItem('patientName') || 'Paciente';
            const msg = `Olá Beatriz, sou ${name}. Me interessei pelo plano de ${titulo} que vi no site. Gostaria de saber mais e agendar uma consulta!`;
            window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
        };
        
        pilarModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePilarModal() {
        pilarModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (pilarModalOverlay) {
        bentoCardsAll.forEach(card => {
            card.addEventListener('click', () => openPilarModal(card));
            card.style.cursor = 'pointer';
        });

        pilarModalClose.addEventListener('click', closePilarModal);
        pilarModalOverlay.addEventListener('click', (e) => {
            if (e.target === pilarModalOverlay) closePilarModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePilarModal();
        });
    }

    // Sound Ambient Toggle Logic
    const soundBtn = document.getElementById('sound-toggle');
    const bgAudio = document.getElementById('zen-audio');
    
    if (soundBtn && bgAudio) {
        soundBtn.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play().then(() => {
                    soundBtn.classList.add('playing');
                }).catch(err => console.log('Audio error:', err));
            } else {
                bgAudio.pause();
                soundBtn.classList.remove('playing');
            }
        });
    }


});
