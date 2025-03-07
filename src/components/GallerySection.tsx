import React, { } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  const handleImageClick = (artwork: Artwork) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCrackingImage(artwork);
    
    setTimeout(() => {
      setCrackingImage(null);
      setTimeout(() => {
        setSelectedImage(artwork);
        setIsAnimating(false);
      }, 100);
    }, 700);
  };

  // Renderiza a visualização em grade
  const renderGridView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((artwork) => {
          const isBreaking = crackingImage?.id === artwork.id;
          
          return (
            <div
              key={artwork.id}
              className="relative group overflow-hidden rounded-lg bg-black/30 border border-cyan-500/20 backdrop-blur-sm"
            >
              <div 
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => !isAnimating && handleImageClick(artwork)}
              >
                {/* Efeito de glitch na borda */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
                {isBreaking && (
                  <div className="absolute inset-0">
                    <CrackEffect
                      imageUrl={artwork.image}
                      onAnimationComplete={() => {}}
                    />
                  </div>
                )}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm">
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
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  // Renderiza a visualização em tela cheia
  const renderFullscreenView = () => {
    const artwork = artworks[currentIndex];
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-screen bg-black overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h2 className="text-4xl font-bold text-cyan-400 mb-2">{artwork.title}</h2>
          <p className="text-gray-300 mb-2">by {artwork.artist}</p>
          <p className="text-gray-400">{artwork.description}</p>
        </div>
        <button
          onClick={previousImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400/70 hover:text-cyan-400 hover:scale-110 transition-all bg-black/20 backdrop-blur-sm p-2 rounded-full"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400/70 hover:text-cyan-400 hover:scale-110 transition-all bg-black/20 backdrop-blur-sm p-2 rounded-full"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        onClick={() => setSelectedImage(null)}
      >
        <motion.div
          className="relative max-w-7xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="absolute -top-4 -right-4 z-10 w-12 h-12 rounded-full bg-black/50 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors flex items-center justify-center backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          <div className="relative rounded-lg overflow-hidden border border-cyan-500/20">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain bg-black/50"
            />
            
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h2 
                className="text-4xl font-bold text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {selectedImage.title}
              </motion.h2>
              <motion.p 
                className="text-cyan-300/80 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                by {selectedImage.artist}
              </motion.p>
              <motion.p 
                className="text-cyan-300/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {selectedImage.description}
              </motion.p>
              {/* Linha decorativa */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-cyan-950/20">
      {/* Controles de visualização */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          viewMode === 'fullscreen' ? 'opacity-0 hover:opacity-100' : ''
        }`}
      >
        <div className="flex space-x-2">
          {(['grid', 'fullscreen'] as const).map((mode) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg transition-all uppercase tracking-wider backdrop-blur-sm border text-sm ${
                viewMode === mode
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-black/30 text-cyan-500/70 border-cyan-500/20 hover:border-cyan-500/40 hover:text-cyan-400'
              }`}
            >
              {mode}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Conteúdo da galeria baseado no modo de visualização */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'fullscreen' && renderFullscreenView()}
      </AnimatePresence>

      {/* Visualização detalhada da imagem */}
      <AnimatePresence>
        {selectedImage && renderDetailedView()}
      </AnimatePresence>
    </div>
  );
};

export default GallerySection; 