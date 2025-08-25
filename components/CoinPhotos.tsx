'use client';

import { useState } from 'react';
import { PhotoModal } from './PhotoModal';

interface CoinVariant {
  id: string;
  years: string;
  name: string;
  weight: number;
}

interface VariantImage {
  id: string;
  images?: {
    front?: string;
    back?: string;
  };
  image?: string; // Old format
}

interface CoinPhotosProps {
  coinName: string;
  images: {
    main?: string;
    variants?: VariantImage[];
  };
  variants: CoinVariant[];
}

export function CoinPhotos({ coinName, images, variants }: CoinPhotosProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhotos, setModalPhotos] = useState<Array<{src: string, alt: string, title: string}>>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openPhotoModal = (photos: Array<{src: string, alt: string, title: string}>, startIndex = 0) => {
    setModalPhotos(photos);
    setCurrentPhotoIndex(startIndex);
    setModalOpen(true);
  };

  if (!images?.variants || images.variants.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Varianten van {coinName}</h2>
        
        {/* Variant Images */}
        <div>
          <div className="grid lg:grid-cols-2 gap-8">
            {images.variants.map((variantImg) => {
              const variant = variants.find((v) => v.id === variantImg.id);
              
              // Check if this variant has new format (front/back) or old format (single image)
              const hasMultipleImages = variantImg.images && (variantImg.images.front || variantImg.images.back);
              const hasSingleImage = variantImg.image;
              
              return (
                <div key={variantImg.id} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 text-center mb-4">{variant?.name}</h4>
                  <p className="text-sm text-gray-600 text-center mb-4">{variant?.years}</p>
                  
                  {hasMultipleImages ? (
                    // New format: front and back images
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Front Image */}
                      {variantImg.images!.front && (
                        <div className="text-center">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Voorkant</h5>
                          <div 
                            className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                            onClick={() => {
                              const photos = [];
                              if (variantImg.images!.front) {
                                photos.push({
                                  src: variantImg.images!.front,
                                  alt: `${variant?.name} voorkant`,
                                  title: `${variant?.name} - Voorkant (${variant?.years})`
                                });
                              }
                              if (variantImg.images!.back) {
                                photos.push({
                                  src: variantImg.images!.back,
                                  alt: `${variant?.name} achterkant`,
                                  title: `${variant?.name} - Achterkant (${variant?.years})`
                                });
                              }
                              openPhotoModal(photos, 0);
                            }}
                          >
                            <img 
                              src={variantImg.images!.front} 
                              alt={`${variant?.name} voorkant`}
                              className="w-full h-auto object-cover min-h-32 group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Back Image */}
                      {variantImg.images!.back && (
                        <div className="text-center">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Achterkant</h5>
                          <div 
                            className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                            onClick={() => {
                              const photos = [];
                              if (variantImg.images!.front) {
                                photos.push({
                                  src: variantImg.images!.front,
                                  alt: `${variant?.name} voorkant`,
                                  title: `${variant?.name} - Voorkant (${variant?.years})`
                                });
                              }
                              if (variantImg.images!.back) {
                                photos.push({
                                  src: variantImg.images!.back,
                                  alt: `${variant?.name} achterkant`,
                                  title: `${variant?.name} - Achterkant (${variant?.years})`
                                });
                              }
                              openPhotoModal(photos, 1);
                            }}
                          >
                            <img 
                              src={variantImg.images!.back} 
                              alt={`${variant?.name} achterkant`}
                              className="w-full h-auto object-cover min-h-32 group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : hasSingleImage ? (
                    // Old format: single image (backwards compatibility)
                    <div className="text-center">
                      <div 
                        className="bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto cursor-pointer hover:shadow-lg transition-shadow group"
                        onClick={() => openPhotoModal([{
                          src: variantImg.image!,
                          alt: variant?.name || '',
                          title: `${variant?.name} (${variant?.years})`
                        }])}
                      >
                        <img 
                          src={variantImg.image} 
                          alt={variant?.name}
                          className="w-full h-auto object-cover min-h-32 group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </div>
                  ) : (
                    // No images defined
                    <div className="text-center">
                      <div className="bg-gray-200 rounded-lg p-6 min-h-32 flex items-center justify-center max-w-md mx-auto">
                        <div>
                          <p className="text-gray-500 text-sm mb-1">📸 {variant?.name}</p>
                          <p className="text-xs text-gray-400">Geen foto's gedefinieerd</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(hasMultipleImages || hasSingleImage) && (
                    <p className="text-center text-xs text-gray-400 mt-2">Klik om te vergroten</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        photos={modalPhotos}
        currentIndex={currentPhotoIndex}
        onNavigate={setCurrentPhotoIndex}
      />
    </>
  );
}