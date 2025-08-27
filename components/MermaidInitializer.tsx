'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import MermaidRenderer from './MermaidRenderer';

export default function MermaidInitializer() {
  useEffect(() => {
    const initializeMermaidDiagrams = () => {
      // Find all mermaid diagram placeholders
      const mermaidElements = document.querySelectorAll('.mermaid-diagram');
      
      mermaidElements.forEach((element) => {
        const mermaidData = element.getAttribute('data-mermaid');
        if (mermaidData && !element.hasAttribute('data-initialized')) {
          try {
            const chart = decodeURIComponent(mermaidData);
            
            // Mark as initialized to prevent double rendering
            element.setAttribute('data-initialized', 'true');
            
            // Create a React root and render the MermaidRenderer component
            const root = createRoot(element);
            root.render(<MermaidRenderer chart={chart} />);
          } catch (error) {
            console.error('Error initializing Mermaid diagram:', error);
            element.innerHTML = '<div class="text-red-500">Error loading diagram</div>';
          }
        }
      });
    };

    // Initialize on mount
    initializeMermaidDiagrams();
    
    // Also initialize when the DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      initializeMermaidDiagrams();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything visible
}
