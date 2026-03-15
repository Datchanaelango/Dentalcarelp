/**
 * Lumina Dental - Main Script (Bootstrap & AOS Version)
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
    });

    // --- 2. Sticky Navbar ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Trigger scroll event on load to check initial position
    window.dispatchEvent(new Event('scroll'));

    // --- 3. Hero Slider & Parallax ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    const goToSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    };

    const prevSlide = () => {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    };

    const startSlider = () => {
        slideInterval = setInterval(nextSlide, 6000); // 6 seconds per slide for slower parallax feel
    };

    const stopSlider = () => {
        clearInterval(slideInterval);
    };

    // Event Listeners for Slider
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlider();
            startSlider();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlider();
            startSlider();
        });
    }

    // Initialize Slider
    startSlider();


    // --- 4. Form Submission Preview ---
    const form = document.getElementById('appointment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // --- Fallback Strategy ---
            // FormSubmit AJAX (background) submission fails on local files (file://) due to browser security.
            // If running locally, we skip the JS handler and allow a "Standard POST" which redirects the page but WORKS.
            if (window.location.protocol === 'file:') {
                console.info('Running on file:// - Using traditional form submission.');
                return; // Browser will now follow the form action/method automatically
            }

            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // Simulate sending with Bootstrap spinner
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            btn.classList.add('disabled');

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Helper to handle visual feedback
            const showFeedback = (success, message) => {
                if (success) {
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> ${message}`;
                    btn.classList.remove('btn-primary', 'btn-danger');
                    btn.classList.add('btn-success');
                    form.reset();
                } else {
                    btn.innerHTML = `<i class="fa-solid fa-xmark"></i> ${message}`;
                    btn.classList.remove('btn-primary', 'btn-success');
                    btn.classList.add('btn-danger');
                }

                // Revert after 4 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('btn-success', 'btn-danger', 'disabled');
                    btn.classList.add('btn-primary');
                }, 4000);
            };

            // Send to FormSubmit via AJAX
            fetch('https://formsubmit.co/ajax/datchanaelango@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text || 'Network response was not ok') });
                    }
                    return response.json();
                })
                .then(res => {
                    if (res.success === 'true' || res.success === true) {
                        showFeedback(true, 'Request Sent Successfully');
                    } else {
                        throw new Error(res.message || 'Submission failed');
                    }
                })
                .catch(error => {
                    console.error('Submission Error:', error);
                    showFeedback(false, 'Submission Failed');
                });
        });
    }

    // --- 5. Virtual Tour Video Modal Logic ---
    const videoModal = document.getElementById('videoModal');
    const tourVideo = document.getElementById('tourVideo');
    const videoUrl = "https://www.youtube.com/embed/i9pxPaNfYSM?autoplay=1";

    if (videoModal && tourVideo) {
        // When modal is shown, set the source to start playing
        videoModal.addEventListener('show.bs.modal', () => {
            tourVideo.setAttribute('src', videoUrl);
        });

        // When modal is hidden, clear the source to stop the video
        videoModal.addEventListener('hide.bs.modal', () => {
            tourVideo.setAttribute('src', '');
        });
    }

});
