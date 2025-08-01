// Component preloader utility for better performance
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>();

  // Preload form components when user hovers over form tabs
  static preloadFormComponent(formType: 'assignments' | 'changes' | 'worker') {
    if (this.preloadedComponents.has(formType)) {
      return;
    }

    this.preloadedComponents.add(formType);

    switch (formType) {
      case 'assignments':
        import('../components/AssignmentForm').catch(() => {
          this.preloadedComponents.delete(formType);
        });
        break;
      case 'changes':
        import('../components/ChangesForm').catch(() => {
          this.preloadedComponents.delete(formType);
        });
        break;
      case 'worker':
        import('../components/WorkerForm').catch(() => {
          this.preloadedComponents.delete(formType);
        });
        break;
    }
  }

  // Preload heavy components when they might be needed
  static preloadHeavyComponents() {
    if (!this.preloadedComponents.has('fileUpload')) {
      this.preloadedComponents.add('fileUpload');
      import('../components/FileUpload').catch(() => {
        this.preloadedComponents.delete('fileUpload');
      });
    }

    if (!this.preloadedComponents.has('successModal')) {
      this.preloadedComponents.add('successModal');
      import('../components/SuccessModal').catch(() => {
        this.preloadedComponents.delete('successModal');
      });
    }
  }

  // Preload page components
  static preloadPage(page: 'landing' | 'forms') {
    if (this.preloadedComponents.has(page)) {
      return;
    }

    this.preloadedComponents.add(page);

    switch (page) {
      case 'landing':
        import('../pages/LandingPage').catch(() => {
          this.preloadedComponents.delete(page);
        });
        break;
      case 'forms':
        import('../pages/FormsPage').catch(() => {
          this.preloadedComponents.delete(page);
        });
        break;
    }
  }

  // Preload all form components at once (for when user reaches forms page)
  static preloadAllFormComponents() {
    this.preloadFormComponent('assignments');
    this.preloadFormComponent('changes');
    this.preloadFormComponent('worker');
    this.preloadHeavyComponents();
  }

  // Preload images
  static preloadImages(imagePaths: string[]) {
    imagePaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    });
  }

  // Preload critical images on page load
  static preloadCriticalImages() {
    const criticalImages = [
      '/landing.png',
      '/forms-type.png',
    ];
    this.preloadImages(criticalImages);
  }
}

// Hook for component preloading
export const useComponentPreloader = () => {
  return {
    preloadFormComponent: ComponentPreloader.preloadFormComponent.bind(ComponentPreloader),
    preloadHeavyComponents: ComponentPreloader.preloadHeavyComponents.bind(ComponentPreloader),
    preloadPage: ComponentPreloader.preloadPage.bind(ComponentPreloader),
    preloadAllFormComponents: ComponentPreloader.preloadAllFormComponents.bind(ComponentPreloader),
    preloadImages: ComponentPreloader.preloadImages.bind(ComponentPreloader),
    preloadCriticalImages: ComponentPreloader.preloadCriticalImages.bind(ComponentPreloader),
  };
};