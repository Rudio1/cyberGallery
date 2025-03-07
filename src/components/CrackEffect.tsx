import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CrackEffectProps {
  imageUrl: string;
  onAnimationComplete: () => void;
}

const CrackEffect: React.FC<CrackEffectProps> = ({ imageUrl, onAnimationComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const fragmentsContainer = fragmentsRef.current;
    if (!canvas || !fragmentsContainer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = imageUrl;
    
    interface Fragment {
      x: number;
      y: number;
      size: number;
      rotation: number;
      velocityY: number;
      velocityRotation: number;
      element: HTMLDivElement;
    }

    const fragments: Fragment[] = [];

    const createFragmentElement = (x: number, y: number, size: number, imageUrl: string) => {
      const fragment = document.createElement('div');
      fragment.style.position = 'absolute';
      fragment.style.left = `${x}px`;
      fragment.style.top = `${y}px`;
      fragment.style.width = `${size}px`;
      fragment.style.height = `${size}px`;
      fragment.style.backgroundImage = `url(${imageUrl})`;
      fragment.style.backgroundPosition = `-${x}px -${y}px`;
      fragment.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
      fragment.style.borderRadius = '2px';
      fragment.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';
      fragmentsContainer.appendChild(fragment);
      return fragment;
    };

    const createCrack = (x: number, y: number) => {
      const numCracks = Math.floor(Math.random() * 3) + 4;
      for (let i = 0; i < numCracks; i++) {
        const angle = (Math.PI * 2 * i) / numCracks + Math.random() * 0.5;
        const width = Math.random() * 2 + 1.5;
        
        // Cria fragmentos de vidro que cairão
        const numFragments = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < numFragments; j++) {
          const fragmentX = x + Math.cos(angle) * (Math.random() * 30 + 20);
          const fragmentY = y + Math.sin(angle) * (Math.random() * 30 + 20);
          const size = Math.random() * 15 + 10;
          
          const element = createFragmentElement(fragmentX, fragmentY, size, imageUrl);
          
          fragments.push({
            x: fragmentX,
            y: fragmentY,
            size,
            rotation: Math.random() * 360,
            velocityY: Math.random() * 2 + 3,
            velocityRotation: (Math.random() - 0.5) * 10,
            element
          });
        }

        cracks.push({
          x,
          y,
          angle,
          length: 0,
          width,
          opacity: 0.9 + Math.random() * 0.1,
          branches: Array(Math.floor(Math.random() * 3) + 2)
            .fill(null)
            .map(() => createBranch(x, y, angle)),
          fragments: []
        });
      }
    };

    interface Branch {
      x: number;
      y: number;
      angle: number;
      length: number;
      width: number;
      opacity: number;
      subBranches: Branch[];
    }

    interface Crack {
      x: number;
      y: number;
      angle: number;
      length: number;
      width: number;
      opacity: number;
      branches: Branch[];
      fragments: Array<{
        x: number;
        y: number;
        size: number;
        opacity: number;
      }>;
    }
    
    const cracks: Crack[] = [];
    
    const createSubBranch = (x: number, y: number, angle: number, depth: number): Branch => {
      const width = Math.random() * 1 + 0.5;
      return {
        x,
        y,
        angle: angle + (Math.random() - 0.5) * (Math.PI / (depth + 1)),
        length: 0,
        width,
        opacity: 0.7 + Math.random() * 0.3,
        subBranches: depth > 0 
          ? Array(Math.floor(Math.random() * 2) + 1)
              .fill(null)
              .map(() => createSubBranch(x, y, angle, depth - 1))
          : []
      };
    };

    const createBranch = (x: number, y: number, angle: number): Branch => {
      const width = Math.random() * 1.5 + 1;
      return {
        x,
        y,
        angle: angle + (Math.random() - 0.5) * Math.PI / 3,
        length: 0,
        width,
        opacity: 0.8 + Math.random() * 0.2,
        subBranches: Array(Math.floor(Math.random() * 2) + 2)
          .fill(null)
          .map(() => createSubBranch(x, y, angle, 2))
      };
    };

    const drawBranch = (branch: Branch, parentLength: number = 0) => {
      if (!ctx) return;

      const startX = branch.x + Math.cos(branch.angle) * (parentLength * 0.3);
      const startY = branch.y + Math.sin(branch.angle) * (parentLength * 0.3);
      const endX = branch.x + Math.cos(branch.angle) * branch.length;
      const endY = branch.y + Math.sin(branch.angle) * branch.length;

      // Desenha a linha principal com gradiente
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${branch.opacity})`);
      gradient.addColorStop(1, `rgba(200, 200, 255, ${branch.opacity * 0.5})`);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = branch.width;
      ctx.stroke();

      // Desenha reflexos
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `rgba(255, 255, 255, ${branch.opacity * 0.3})`;
      ctx.lineWidth = branch.width * 0.5;
      ctx.stroke();

      // Desenha sub-ramificações
      branch.subBranches.forEach(subBranch => {
        drawBranch(subBranch, branch.length);
      });
    };

    const drawCrack = (crack: Crack) => {
      if (!ctx) return;

      // Desenha a rachadura principal
      const gradient = ctx.createLinearGradient(
        crack.x,
        crack.y,
        crack.x + Math.cos(crack.angle) * crack.length,
        crack.y + Math.sin(crack.angle) * crack.length
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${crack.opacity})`);
      gradient.addColorStop(1, `rgba(200, 200, 255, ${crack.opacity * 0.6})`);

      ctx.beginPath();
      ctx.moveTo(crack.x, crack.y);
      ctx.lineTo(
        crack.x + Math.cos(crack.angle) * crack.length,
        crack.y + Math.sin(crack.angle) * crack.length
      );

      // Efeito de profundidade
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = crack.width;
      ctx.stroke();

      // Desenha fragmentos
      crack.fragments.forEach(fragment => {
        ctx.beginPath();
        ctx.arc(fragment.x, fragment.y, fragment.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fragment.opacity * 0.7})`;
        ctx.fill();
      });

      // Desenha ramificações
      crack.branches.forEach(branch => {
        drawBranch(branch, crack.length);
      });

      // Adiciona brilho nas intersecções
      ctx.beginPath();
      ctx.arc(crack.x, crack.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    };

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      
      fragmentsContainer.style.width = `${canvas.width}px`;
      fragmentsContainer.style.height = `${canvas.height}px`;
      
      ctx.drawImage(image, 0, 0);
      
      const numCrackPoints = Math.floor(Math.random() * 2) + 3;
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;
      
      createCrack(centerX, centerY);
      
      for (let i = 1; i < numCrackPoints; i++) {
        const angle = (Math.PI * 2 * i) / numCrackPoints;
        const distance = Math.random() * 50 + 30;
        createCrack(
          centerX + Math.cos(angle) * distance,
          centerY + Math.sin(angle) * distance
        );
      }

      // Animação das rachaduras
      gsap.to(cracks, {
        length: Math.max(canvas.width, canvas.height) * 0.35,
        duration: 0.5,
        ease: "power2.out",
        stagger: {
          amount: 0.2,
          from: "center"
        },
        onUpdate: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0);
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          cracks.forEach(crack => {
            drawCrack(crack);
            crack.branches.forEach(branch => {
              branch.length = crack.length * (0.3 + Math.random() * 0.3);
              branch.subBranches.forEach(subBranch => {
                subBranch.length = branch.length * (0.3 + Math.random() * 0.2);
              });
            });
          });
        },
        onComplete: () => {
          if (audioRef.current) {
            audioRef.current.play();
          }

          // Anima os fragmentos caindo
          fragments.forEach((fragment, index) => {
            gsap.to(fragment.element, {
              y: canvas.height + 100,
              rotation: fragment.rotation + fragment.velocityRotation * 20,
              duration: 1 + Math.random() * 0.5,
              delay: index * 0.1,
              ease: "power1.in",
              onComplete: () => {
                fragment.element.remove();
              }
            });
          });
          
          gsap.to({}, {
            duration: 0.15,
            onStart: () => {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            },
            onComplete: () => {
              gsap.to(canvas, {
                opacity: 0,
                duration: 0.2,
                onComplete: onAnimationComplete
              });
            }
          });
        }
      });
    };

    return () => {
      gsap.killTweensOf(cracks);
      fragments.forEach(fragment => {
        gsap.killTweensOf(fragment.element);
        fragment.element.remove();
      });
    };
  }, [imageUrl, onAnimationComplete]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain z-10"
      />
      <div
        ref={fragmentsRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-20"
      />
      <audio
        ref={audioRef}
        src="/sounds/glass-break.mp3"
        preload="auto"
      />
    </>
  );
};

export default CrackEffect; 