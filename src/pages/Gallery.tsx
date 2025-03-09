import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Image } from 'lucide-react';
import GallerySection from '../components/GallerySection';
import DecryptedText from '../components/DecryptedText';
import Dock from '../components/Dock';
import { artworks } from '../data/artworks';

type ViewMode = 'grid' | 'fullscreen';
type BootPhase = 'initializing' | 'systems-check' | 'security' | 'complete' | 'ready' | 'warning';

const Gallery = () => {
  const navigate = useNavigate();
  const [bootPhase, setBootPhase] = useState<BootPhase>('initializing');
  const [loading, setLoading] = useState(true);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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

  useEffect(() => {
    const bootSequence = async () => {
      const hasSeenBoot = false;
      if (hasSeenBoot) {
        setLoading(false);
        return;
      }

      const addLine = (text: string) => {
        setTerminalLines(prev => [...prev, text]);
      };

      // Initial boot sequence
      setBootPhase('initializing');
      addLine('> INICIALIZANDO CYBER GALLERY OS v2.25.1');
      await new Promise(r => setTimeout(r, 1000));
      addLine('> CARREGANDO SISTEMAS PRINCIPAIS...');
      await new Promise(r => setTimeout(r, 800));
      
      setBootPhase('warning');
      addLine('> ⚠️ AVISO ⚠️');
      addLine('> ⚠️ AVISO ⚠️');
      await new Promise(r => setTimeout(r, 800));
      addLine('> PROJETO PESSOAL - GALERIA PARTICULAR');
      await new Promise(r => setTimeout(r, 1000));
      addLine('> ESTA É UMA GALERIA PESSOAL ONDE GUARDO IMAGENS QUE CONSIDEREI INTERESSANTES.');
      await new Promise(r => setTimeout(r, 1000));
      addLine('> TODAS AS IMAGENS SÃO PARTE DA MINHA COLEÇÃO PARTICULAR.');
      await new Promise(r => setTimeout(r, 1000));
      addLine('> ESTE É UM PROJETO INDIVIDUAL SEM FINS COMERCIAIS.');
      await new Promise(r => setTimeout(r, 2000));

      // Systems check
      setBootPhase('systems-check');
      addLine('> VERIFICANDO INTERFACE NEURAL... OK');
      await new Promise(r => setTimeout(r, 600));
      addLine('> CALIBRANDO DISPLAYS HOLOGRÁFICOS... OK');
      await new Promise(r => setTimeout(r, 600));
      addLine('> SINCRONIZANDO PROCESSADORES QUÂNTICOS... OK');
      await new Promise(r => setTimeout(r, 800));

      setBootPhase('security');
      addLine('> INICIALIZANDO PROTOCOLOS DE SEGURANÇA');
      await new Promise(r => setTimeout(r, 1000));
      addLine('> ESTABELECENDO CONEXÃO SEGURA... OK');
      await new Promise(r => setTimeout(r, 800));

      setBootPhase('complete');
      addLine('> TODOS OS SISTEMAS OPERACIONAIS CARREGADOS');
      await new Promise(r => setTimeout(r, 2000));
      addLine('> INICIANDO JORNADA NA GALERIA CIBERNÉTICA...');
      await new Promise(r => setTimeout(r, 1500));
      addLine('> BEM-VINDO AO FUTURO DA ARTE DIGITAL :)!');
      await new Promise(r => setTimeout(r, 2000));
      
      setBootPhase('ready');
      setLoading(false);
      
      // Marca que o usuário já viu a sequência de boot
      localStorage.setItem('hasSeenBoot', 'true');
    };

    bootSequence();
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-500">
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <div className="max-w-2xl w-full space-y-2 p-4 font-audiowide text-sm">
              <div className="text-xs mb-4">
                <DecryptedText
                  text={`Status: ${bootPhase === 'complete' ? 'COMPLETO' : bootPhase.toUpperCase()}`}
                  speed={30}
                  sequential={true}
                  animateOn="view"
                  className={bootPhase === 'warning' ? 'text-yellow-500' : bootPhase === 'complete' ? 'text-green-500' : 'text-cyan-500'}
                  encryptedClassName={bootPhase === 'warning' ? 'text-yellow-500/30' : bootPhase === 'complete' ? 'text-green-500/30' : 'text-cyan-500/30'}
                />
              </div>
              {terminalLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <DecryptedText
                    text={line}
                    speed={30}
                    sequential={true}
                    animateOn="view"
                    className={line.includes('AVISO') ? 'text-yellow-500 font-bold' : 
                             line.includes('OK') ? 'text-green-500' : 
                             line.includes('PROJETO PESSOAL') ? 'text-yellow-500' :
                             'text-cyan-500'}
                    encryptedClassName={line.includes('AVISO') ? 'text-yellow-500/30' : 
                                      line.includes('OK') ? 'text-green-500/30' : 
                                      line.includes('PROJETO PESSOAL') ? 'text-yellow-500/30' :
                                      'text-cyan-500/30'}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <GallerySection
              artworks={artworks}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Menu */}
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

export default Gallery; 