'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createRoot } from 'react-dom/client';
import VideoPlayer from './VideoPlayer';

function decodeAttr(str: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

export default function VideoInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      const videoEmbeds = document.querySelectorAll('.video-embed');
      videoEmbeds.forEach((embed) => {
        const propsData = embed.getAttribute('data-video-props');
        if (propsData) {
          try {
            const decoded = decodeAttr(propsData);
            const props = JSON.parse(decoded);
            const container = document.createElement('div');
            container.className = 'video-player-wrapper my-6';
            embed.parentNode?.replaceChild(container, embed);
            const root = createRoot(container);
            root.render(<VideoPlayer {...props} />);
          } catch (error) {
            console.error('Error parsing video props:', error);
          }
        }
      });
    };
    const id = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null; // This component doesn't render anything itself
}
