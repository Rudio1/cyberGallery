
import React, { useEffect, useRef } from 'react';

interface PixelTrailProps {
  gridSize?: number;
  color?: string;
  className?: string;
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  gridSize = 30,
  color = '#ff0080',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const pixels = useRef<{ x: number; y: number; alpha: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelSize = Math.max(canvas.width, canvas.height) / gridSize;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Adiciona novo pixel na posição do mouse
      const gridX = Math.floor(mousePos.current.x / pixelSize) * pixelSize;
      const gridY = Math.floor(mousePos.current.y / pixelSize) * pixelSize;
      
      pixels.current.push({
        x: gridX,
        y: gridY,
        alpha: 1
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualiza e renderiza pixels
      pixels.current = pixels.current.filter(pixel => {
        pixel.alpha *= 0.95;
        if (pixel.alpha < 0.01) return false;

        ctx.fillStyle = `${color}${Math.floor(pixel.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
        return true;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, gridSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

export default PixelTrail; 