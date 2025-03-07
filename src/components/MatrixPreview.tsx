import React from 'react';
import { Maximize2 } from 'lucide-react';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  description: string;
}

interface MatrixPreviewProps {
  artwork: Artwork;
  index: number;
  isVisible: boolean;
  onOpenModal: (artwork: Artwork) => void;
}

const MatrixPreview: React.FC<MatrixPreviewProps> = ({ artwork, index, isVisible, onOpenModal }) => {
  const delay = index * 0.3;

  return (
    <div
      className="matrix-preview relative rounded-lg overflow-hidden mb-24 z-0"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? '0' : '20px'})`,
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        transitionDelay: `${delay}s`
      }}
    >
      <img
        src={artwork.image}
        alt={artwork.title}
        className="w-full h-[70vh] object-cover relative z-0"
      />
      <div className="matrix-scanline absolute inset-0 z-[1]"></div>
      <div className="data-stream absolute inset-0 z-[1]"></div>
      <div className="code-overlay absolute inset-0 z-[1]"></div>
      <button
        className="preview-button group absolute top-4 right-4 z-[2]"
        onClick={() => onOpenModal(artwork)}
        aria-label="Preview artwork"
      >
        <Maximize2 className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-[2]">
        <h3 className="text-2xl font-bold text-[#00fff9] mb-2">{artwork.title}</h3>
        <p className="text-gray-300 mb-2">by {artwork.artist}</p>
        <p className="text-gray-400">{artwork.description}</p>
      </div>
    </div>
  );
};

export default MatrixPreview; 