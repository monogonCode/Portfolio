import React, { useRef, useEffect } from 'react';

interface MatrixRainCanvasProps {
  isAmber?: boolean;
}

export const MatrixRainCanvas: React.FC<MatrixRainCanvasProps> = ({ isAmber = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();

    window.addEventListener('resize', resize);

    // Iconic Matrix characters: Katakana, digits, binary, uppercase latin, math symbols
    const chars = '0123456789ABCDEFﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ$+-*/=%';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array.from({ length: Math.max(columns, 1) }, () =>
      Math.floor(Math.random() * -40)
    );

    const updateColumns = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: Math.max(columns, 1) }, (_, i) =>
        drops[i] !== undefined ? drops[i] : Math.floor(Math.random() * -40)
      );
    };

    let lastTime = 0;
    const fps = 32; // Cinematic Matrix speed
    const interval = 1000 / fps;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      // Semi-transparent fade to produce smooth falling trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y > 0 && y < canvas.height + fontSize * 2) {
          // Bright white leading head character
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x, y);

          // Glowing body trail character
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = isAmber ? '#ffb000' : '#22c55e';
          ctx.fillText(trailChar, x, y - fontSize);
        }

        // Reset drop to the top randomly once it hits the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const observer = new ResizeObserver(() => {
      resize();
      updateColumns();
    });

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [isAmber]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.38
      }}
    />
  );
};
