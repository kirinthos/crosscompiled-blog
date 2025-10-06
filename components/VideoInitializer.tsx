'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import VideoPlayer from './VideoPlayer';

export default function VideoInitializer() {
  useEffect(() => {
    // Find all video embed placeholders and replace them with React components
    const videoEmbeds = document.querySelectorAll('.video-embed');
    
    videoEmbeds.forEach((embed) => {
      const propsData = embed.getAttribute('data-video-props');
      if (propsData) {
        try {
          const props = JSON.parse(propsData);
          
          // Create a new div to render the React component
          const container = document.createElement('div');
          container.className = 'video-player-wrapper my-6';
          
          // Replace the placeholder with our container
          embed.parentNode?.replaceChild(container, embed);
          
          // Render the VideoPlayer component
          const root = createRoot(container);
          root.render(<VideoPlayer {...props} />);
        } catch (error) {
          console.error('Error parsing video props:', error);
        }
      }
    });
  }, []);

  return null; // This component doesn't render anything itself
}
