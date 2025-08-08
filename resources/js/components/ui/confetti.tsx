import { useEffect, useState } from 'react';

interface ConfettiProps {
    isActive: boolean;
    onComplete?: () => void;
}

export function Confetti({ isActive, onComplete }: ConfettiProps) {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        vx: number;
        vy: number;
        rotation: number;
        rotationSpeed: number;
        color: string;
        size: number;
    }>>([]);

    useEffect(() => {
        if (!isActive) return;

        // Create confetti particles
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight * 0.7, // Start from middle of screen
            vx: (Math.random() - 0.5) * 8,
            vy: -Math.random() * 5 - 3, // Shoot upward
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'][Math.floor(Math.random() * 8)],
            size: Math.random() * 8 + 4,
        }));

        setParticles(newParticles);

        // Animation loop
        const animate = () => {
            setParticles(prev => 
                prev.map(particle => ({
                    ...particle,
                    x: particle.x + particle.vx,
                    y: particle.y + particle.vy,
                    rotation: particle.rotation + particle.rotationSpeed,
                    vy: particle.vy + 0.1, // gravity
                })).filter(particle => particle.y < window.innerHeight + 50)
            );
        };

        const interval = setInterval(animate, 16); // ~60fps

        // Stop animation after 3 seconds
        const timeout = setTimeout(() => {
            clearInterval(interval);
            setParticles([]);
            onComplete?.();
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        transform: `rotate(${particle.rotation}deg)`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        borderRadius: '2px',
                    }}
                />
            ))}
        </div>
    );
}
