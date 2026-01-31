const typingText = document.querySelector('.typing-text');
const roles = ["AI Student", "Web Developer", "Portfolio Designer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex--);
    } else {
        typingText.textContent = currentRole.substring(0, charIndex++);
    }
    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1000); // Pause shorter at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 200);
    } else {
        setTimeout(typeEffect, isDeleting ? 40 : 80); // Much faster typing
    }
}
/* Particle Network Animation */
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    // Configuration
    const particleCount = 90; // Slightly more particles
    const connectionDistance = 150;
    const mouseDistance = 200;
    // Resize handling
    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    // Mouse tracking
    let mouse = { x: null, y: null };
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Faster base velocity
            this.vx = (Math.random() - 0.5) * 2.5;
            this.vy = (Math.random() - 0.5) * 2.5;
            this.size = Math.random() * 2 + 1;
            // Dynamic color based on theme
            const isLight = document.body.getAttribute('data-theme') === 'light';
            if (isLight) {
                this.color = Math.random() > 0.5 ? '#007bff' : '#8e44ad'; // Darker Blue or Purple for light mode
            } else {
                this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; // Neon Blue or Purple for dark mode
            }
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            // Mouse interaction
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    const directionX = forceDirectionX * force * 0.6;
                    const directionY = forceDirectionY * force * 0.6;
                    this.vx += directionX;
                    this.vy += directionY;
                    // Friction/Speed limit check could go here, but omitted for simplicity
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            // Draw connections
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    const isLight = document.body.getAttribute('data-theme') === 'light';
                    const strokeColor = isLight ? "142, 68, 173" : "188, 19, 254"; // Purple RGB values
                    ctx.strokeStyle = `rgba(${strokeColor}, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    revealOnScroll();
    initParticles();
});
/* Scroll Reveal */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
/* Contact Form Placeholder */
const buttons = document.querySelectorAll('.btn-primary');
buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
        // Simple feedback
    });
});
/* Theme Toggle */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle ? themeToggle.querySelector('i') : null;
// Check Local Storage or System Preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.setAttribute('data-theme', 'light');
    if (icon) icon.className = 'fas fa-sun';
}
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = body.getAttribute('data-theme') === 'light';
        if (isLight) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            if (icon) icon.className = 'fas fa-moon';
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (icon) icon.className = 'fas fa-sun';
        }
        // Restart particles to update colors (optional but nice)
        // We'll clear the canvas context to force a redraw with new colors if we wanted to be substantial
        // But for now, let's just let the particles animate. 
        // A full re-init might be jarring, but we can update the color generation in the loop if we wanted.
    });
}