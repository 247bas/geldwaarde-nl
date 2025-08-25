'use client';

import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  src: string;
  alt: string;
  title: string;
}

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function PhotoModal({ isOpen, onClose, photos, currentIndex, onNavigate }: PhotoModalProps) {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < photos.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-full bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 text-gray-600 hover:text-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation buttons */}
        {hasPrevious && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Photo */}
        <div className="relative">
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {/* Photo info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h3 className="text-white text-lg font-semibold">{currentPhoto.title}</h3>
            {photos.length > 1 && (
              <p className="text-white text-sm opacity-75">
                {currentIndex + 1} van {photos.length}
              </p>
            )}
          </div>
        </div>

        {/* Thumbnails for multiple photos */}
        {photos.length > 1 && (
          <div className="bg-gray-100 p-4 flex gap-2 justify-center">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-16 h-16 rounded overflow-hidden border-2 transition ${
                  index === currentIndex 
                    ? 'border-yellow-500' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}