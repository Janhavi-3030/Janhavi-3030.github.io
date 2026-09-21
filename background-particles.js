/* ==========================================================================
   Rose Quartz Floating Petals & Sparkles Canvas Animation Engine
   ========================================================================== */

(function () {
    'use strict';

    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let petals = [];
    let sparkles = [];
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    // Configuration
    const PETAL_COUNT = 35;
    const SPARKLE_COUNT = 45;
    const PETAL_COLORS = ['#F7CAC9', '#F4B8C1', '#E89DA6', '#FDF2F4', '#F7D6E0'];

    // Resize Handler
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

    // Mouse Movement Tracking
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    // Petal Class
    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -30;
            this.size = Math.random() * 12 + 8; // Size between 8px and 20px
            this.speedY = Math.random() * 0.8 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayAmplitude = Math.random() * 2 + 1;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
            this.opacity = Math.random() * 0.5 + 0.35;
        }

        update() {
            this.swayAngle += this.swaySpeed;
            this.x += this.speedX + Math.sin(this.swayAngle) * this.swayAmplitude * 0.3;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            // Mouse Push / Drift Physics
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x -= (dx / dist) * force * 1.5;
                this.y -= (dy / dist) * force * 1.5;
            }

            // Reset when out of screen bounds
            if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            // Organic Petal Shape via Bézier Curves
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size);
            ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);
            ctx.closePath();
            ctx.fill();

            // Inner Accent Line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 4);
            ctx.lineTo(0, this.size / 2);
            ctx.stroke();

            ctx.restore();
        }
    }

    // Sparkle Particle Class
    class Sparkle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : Math.random() * height;
            this.size = Math.random() * 3 + 1.5;
            this.maxSize = this.size + Math.random() * 2;
            this.pulseSpeed = Math.random() * 0.04 + 0.015;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.alpha = Math.random() * 0.7 + 0.2;
            this.color = '#FFFFFF';
        }

        update() {
            this.pulsePhase += this.pulseSpeed;
            this.currentSize = this.size + Math.sin(this.pulsePhase) * (this.maxSize - this.size);
            this.currentAlpha = Math.max(0.1, Math.sin(this.pulsePhase) * 0.6 + 0.3);
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.currentAlpha;

            // Soft Radial Glow
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.currentSize * 2.5);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.4, 'rgba(247, 202, 201, 0.6)');
            gradient.addColorStop(1, 'rgba(244, 184, 193, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.currentSize * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // 4-Point Star Burst Shape
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.lineTo(0, this.currentSize * 1.8);
                ctx.lineTo(this.currentSize * 0.3, this.currentSize * 0.3);
            }
            ctx.fill();

            ctx.restore();
        }
    }

    // Initialization
    function init() {
        resizeCanvas();

        petals = [];
        for (let i = 0; i < PETAL_COUNT; i++) {
            petals.push(new Petal());
        }

        sparkles = [];
        for (let i = 0; i < SPARKLE_COUNT; i++) {
            sparkles.push(new Sparkle());
        }
    }

    // Main Animation Loop
    function animate() {
        // Smooth lerp for mouse position
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        ctx.clearRect(0, 0, width, height);

        // Render Sparkles
        sparkles.forEach(sparkle => {
            sparkle.update();
            sparkle.draw();
        });

        // Render Petals
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });

        requestAnimationFrame(animate);
    }

    // Listeners
    window.addEventListener('resize', resizeCanvas);
    init();
    animate();

})();
