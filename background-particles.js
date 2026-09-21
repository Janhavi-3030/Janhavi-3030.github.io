/* ==========================================================================
   Interactive Data Constellation & Neural Network Canvas Background Engine
   ========================================================================== */

(function () {
    'use strict';

    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let particles = [];
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    // Configuration
    const PARTICLE_COUNT_DESKTOP = 70;
    const PARTICLE_COUNT_MOBILE = 35;
    const CONNECT_DISTANCE = 135;
    const MOUSE_CONNECT_DISTANCE = 160;

    const COLORS = [
        { r: 6, g: 182, b: 212 },   // Cyan
        { r: 139, g: 92, b: 246 },  // Violet
        { r: 56, g: 189, b: 248 }   // Light Sky Blue
    ];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.scale(dpr, dpr);
    }

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.008;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off canvas edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Subtle size pulsing
            this.pulsePhase += this.pulseSpeed;
            this.currentRadius = this.radius + Math.sin(this.pulsePhase) * 0.5;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.alpha;

            // Soft radial glow around particle node
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.currentRadius * 3);
            gradient.addColorStop(0, `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, 0.9)`);
            gradient.addColorStop(1, `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.currentRadius * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core node
            ctx.fillStyle = `rgb(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b})`;
            ctx.beginPath();
            ctx.arc(0, 0, this.currentRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    function init() {
        resizeCanvas();

        const count = width < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            // Particle-to-Particle connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECT_DISTANCE) {
                    const alpha = (1 - dist / CONNECT_DISTANCE) * 0.22;
                    ctx.save();
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Mouse-to-Particle proximity connections
            const mdx = p1.x - mouse.x;
            const mdy = p1.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < MOUSE_CONNECT_DISTANCE) {
                const malpha = (1 - mdist / MOUSE_CONNECT_DISTANCE) * 0.45;
                ctx.save();
                ctx.strokeStyle = `rgba(139, 92, 246, ${malpha})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    function animate() {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;

        ctx.clearRect(0, 0, width, height);

        drawConnections();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    init();
    animate();

})();
