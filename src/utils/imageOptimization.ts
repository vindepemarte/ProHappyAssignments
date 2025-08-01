// Image optimization utilities
export interface ImageSizes {
  small: string;
  medium: string;
  large: string;
  original: string;
}

export const getOptimizedImageSrc = (
  basePath: string,
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string => {
  // In a real app, you might have different sized versions of images
  // For now, we'll use the original but add query parameters for optimization hints
  const optimizationParams = {
    small: '?w=400&q=75',
    medium: '?w=800&q=80',
    large: '?w=1200&q=85',
    original: '',
  };

  return `${basePath}${optimizationParams[size]}`;
};

export const generateSrcSet = (basePath: string): string => {
  return [
    `${getOptimizedImageSrc(basePath, 'small')} 400w`,
    `${getOptimizedImageSrc(basePath, 'medium')} 800w`,
    `${getOptimizedImageSrc(basePath, 'large')} 1200w`,
  ].join(', ');
};

export const generateSizes = (breakpoints?: string[]): string => {
  const defaultBreakpoints = [
    '(max-width: 640px) 400px',
    '(max-width: 1024px) 800px',
    '1200px',
  ];

  return (breakpoints || defaultBreakpoints).join(', ');
};

// WebP support detection
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// AVIF support detection
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

// Get the best supported image format
export const getBestImageFormat = async (basePath: string): Promise<string> => {
  const [webpSupported, avifSupported] = await Promise.all([
    supportsWebP(),
    supportsAVIF(),
  ]);

  if (avifSupported) {
    return basePath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
  }
  if (webpSupported) {
    return basePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  return basePath;
};