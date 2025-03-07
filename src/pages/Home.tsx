import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Image } from 'lucide-react';
import GridDistortion from '../components/GridDistortion';
import Dock from '../components/Dock';

const Home = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkMobile();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const dockItems = [
    { 
      icon: <HomeIcon size={24} className="text-cyan-400" />, 
      label: 'Home', 
      onClick: () => navigate('/') 
    },
    { 
      icon: <Image size={24} className="text-cyan-400" />, 
      label: 'Galeria', 
      onClick: () => navigate('/gallery') 
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {isMobile ? (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <img 
            src="/images/img1.jpg" 
            alt="Background" 
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <GridDistortion
          imageSrc="/images/img1.jpg"
          grid={20}
          mouse={0.3}
          strength={0.4}
          relaxation={0.8}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          className="bg-black/30 backdrop-blur-md"
        />
      </div>
    </div>
  );
};

export default Home; 
