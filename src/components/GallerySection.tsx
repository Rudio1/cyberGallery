import React, { } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Move } from 'lucide-react';
import CrackEffect from './CrackEffect';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  description: string;
}

interface GallerySectionProps {
  artworks: Artwork[];
  viewMode: 'grid' | 'fullscreen';
  setViewMode: (mode: 'grid' | 'fullscreen') => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ artworks, viewMode, setViewMode }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedImage, setSelectedImage] = React.useState<Artwork | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [crackingImage, setCrackingImage] = React.useState<Artwork | null>(null);
  const [isClosing, setIsClosing] = React.useState(false);
  const [showScanner, setShowScanner] = React.useState(true);
  const [showClosingScanner, setShowClosingScanner] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [isPanning, setIsPanning] = React.useState(false);

  // Estados para zoom e pan
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transformações suaves para zoom e pan
  const smoothScale = useSpring(scale, { damping: 20, stiffness: 300 });
  const smoothX = useSpring(x, { damping: 20, stiffness: 300 });
  const smoothY = useSpring(y, { damping: 20, stiffness: 300 });

  // Efeito parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useTransform(mouseX, [-100, 100], [-20, 20]);
  const parallaxY = useTransform(mouseY, [-100, 100], [-20, 20]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  const handleImageClick = (artwork: Artwork) => {
    if (isAnimating) return;
    
    setShowScanner(true);
    setShowClosingScanner(false);
    setIsClosing(false);
    setSelectedImage(artwork);
  };

  const handleClose = () => {
    setIsClosing(true);
    setShowClosingScanner(true);
    
    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
      setShowClosingScanner(false);
      setShowScanner(true);
      setIsAnimating(false);
    }, 1500);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleZoom = () => {
    if (!isZoomed) {
      scale.set(2);
      setIsZoomed(true);
    } else {
      scale.set(1);
      x.set(0);
      y.set(0);
      setIsZoomed(false);
    }
  };

  const handlePan = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  // Renderiza a visualização em grade
  const renderGridView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((artwork, index) => {
          const randomY = Math.random() * 200 - 100;
          const randomRotate = Math.random() * 360 - 180;
          const randomScale = 0.5 + Math.random() * 0.5;
          
          return (
            <motion.div
              key={artwork.id}
              layoutId={`image-container-${artwork.id}`}
              className="relative group overflow-hidden rounded-lg bg-black/30 border border-cyan-500/20"
              initial={{ 
                x: -200,
                y: randomY,
                rotate: randomRotate,
                scale: randomScale,
                opacity: 0
              }}
              animate={{ 
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
              }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.6
              }}
            >
              <div 
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => !isAnimating && handleImageClick(artwork)}
              >
                <motion.img
                  layoutId={`image-${artwork.id}`}
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  initial={{ 
                    scale: randomScale,
                    rotate: randomRotate,
                    x: -200
                  }}
                  animate={{ 
                    scale: 1,
                    rotate: 0,
                    x: 0
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    mass: 0.6
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="relative overflow-hidden">
                      <h3 className="text-xl font-bold text-cyan-400 mb-2 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        {artwork.title}
                      </h3>
                      <p className="text-cyan-300/80">
                        by {artwork.artist}
                      </p>
                      {/* Linha decorativa */}
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // Renderiza a visualização em tela cheia
  const renderFullscreenView = () => {
    const artwork = artworks[currentIndex];
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    const nextIndex = (currentIndex + 1) % artworks.length;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-screen bg-black overflow-hidden"
      >
        {/* Container principal com as três imagens */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Imagem anterior (pré-visualização) */}
          <motion.div
            className="absolute left-0 w-1/3 h-full flex items-center justify-center"
            initial={{ opacity: 0, x: -300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -300, scale: 0.8 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
          >
            <motion.div
              className="relative w-[80%] h-[60%] rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={artworks[prevIndex].image}
                alt={artworks[prevIndex].title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Container de slides */}
          <motion.div
            key={currentIndex}
            className="relative w-1/3 h-[80%] rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -300, scale: 0.8 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 20,
              mass: 0.8
            }}
          >
            <motion.img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain"
              style={{
                scale: smoothScale,
                x: smoothX,
                y: smoothY,
                rotateX: parallaxY,
                rotateY: parallaxX
              }}
              drag={isZoomed}
              dragConstraints={{
                top: -100,
                left: -100,
                right: 100,
                bottom: 100
              }}
              dragElastic={0.1}
              onDragEnd={() => {
                x.set(0);
                y.set(0);
              }}
            />
          </motion.div>

          {/* Próxima imagem (pré-visualização) */}
          <motion.div
            className="absolute right-0 w-1/3 h-full flex items-center justify-center"
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
          >
            <motion.div
              className="relative w-[80%] h-[60%] rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={artworks[nextIndex].image}
                alt={artworks[nextIndex].title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
            </motion.div>
          </motion.div>
        </div>

        {/* Controles de zoom e pan */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <motion.button
            className="p-2 rounded-full bg-black/50 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors"
            onClick={handleZoom}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
          </motion.button>
          {isZoomed && (
            <motion.button
              className="p-2 rounded-full bg-black/50 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Move className="w-6 h-6" />
            </motion.button>
          )}
        </div>

        {/* Navegação com slide */}
        <motion.div
          className="absolute inset-0 flex items-center justify-between px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="p-2 rounded-full bg-black/50 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors"
            onClick={previousImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>
          <motion.button
            className="p-2 rounded-full bg-black/50 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors"
            onClick={nextImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        </motion.div>

        {/* Informações da imagem */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            {artwork.title}
          </h2>
          <p className="text-cyan-300/80 mb-2">by {artwork.artist}</p>
          <p className="text-cyan-300/60">{artwork.description}</p>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </motion.div>
      </motion.div>
    );
  };

  // Renderiza a visualização detalhada da imagem
  const renderDetailedView = () => {
    if (!selectedImage) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      >
        <motion.div
          layoutId={`image-container-${selectedImage.id}`}
          className="relative max-w-7xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ 
            scale: isClosing ? 0.8 : 1, 
            opacity: isClosing ? 0 : 1,
            y: isClosing ? 20 : 0
          }}
          transition={{ duration: 1.5 }}
        >
          <motion.button
            className="absolute -top-4 -right-4 z-[60] w-12 h-12 rounded-full bg-black/50 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors flex items-center justify-center"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          <div className="relative rounded-lg overflow-hidden border border-cyan-500/20">
            {/* Scanner line effect */}
            <AnimatePresence mode="wait">
              {showScanner && (
                <motion.div
                  className="absolute inset-0 z-50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="absolute inset-x-0 h-[3px] bg-cyan-500 shadow-[0_0_30px_rgba(34,197,94,1)]"
                    initial={{ top: "100%" }}
                    animate={{ top: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    onAnimationComplete={() => setShowScanner(false)}
                  />
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-x-0 h-[6px] bg-cyan-500/40 blur-[2px]"
                    initial={{ top: "100%" }}
                    animate={{ top: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Closing scanner effect */}
            <AnimatePresence mode="wait">
              {showClosingScanner && (
                <motion.div
                  className="absolute inset-0 z-50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="absolute inset-x-0 h-[3px] bg-red-500 shadow-[0_0_30px_rgba(239,68,68,1)]"
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-x-0 h-[6px] bg-red-500/40 blur-[2px]"
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content container with reveal mask */}
            <div className="relative z-20">
              <div className="relative">
                {/* Hidden content */}
                <div className="absolute inset-0 bg-black" />

                {/* Content to reveal */}
                <motion.div
                  className="relative"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ 
                    clipPath: isClosing ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
                    transition: {
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                >
                  {/* Image */}
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full max-h-[80vh] object-contain bg-black"
                  />
                  
                  {/* Info container */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h2 className="text-4xl font-bold text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      {selectedImage.title}
                    </h2>
                    <p className="text-cyan-300/80 mb-4">
                      by {selectedImage.artist}
                    </p>
                    <p className="text-cyan-300/60">
                      {selectedImage.description}
                    </p>
                    {/* Linha decorativa */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black">
      <AnimatePresence>
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderGridView()}
          </motion.div>
        ) : (
          <motion.div
            key="fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderFullscreenView()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && renderDetailedView()}
      </AnimatePresence>

      {/* View Mode Controls */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <motion.button
          className={`px-4 py-2 rounded-lg border ${
            viewMode === 'grid'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
              : 'border-cyan-500/30 text-cyan-500/50 hover:text-cyan-400'
          } transition-colors`}
          onClick={() => setViewMode('grid')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          GRID
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-lg border ${
            viewMode === 'fullscreen'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
              : 'border-cyan-500/30 text-cyan-500/50 hover:text-cyan-400'
          } transition-colors`}
          onClick={() => setViewMode('fullscreen')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          FULLSCREEN
        </motion.button>
      </div>
    </div>
  );
};

export default GallerySection; 