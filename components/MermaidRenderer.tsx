'use client';

import { useEffect, useRef } from 'react';

interface MermaidRendererProps {
  chart: string;
}

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (ref.current && chart) {
        try {
          // Dynamically import mermaid to avoid SSR issues
          const mermaid = (await import('mermaid')).default;
          
          // Initialize mermaid with configuration
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          });

          // Clear the container
          ref.current.innerHTML = '';
          
          // Generate a unique ID for this diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // Render the diagram
          const { svg } = await mermaid.render(id, chart);
          ref.current.innerHTML = svg;
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error);
          ref.current.innerHTML = `<pre class="mermaid-error">Error rendering diagram: ${error}</pre>`;
        }
      }
    };

    renderMermaid();
  }, [chart]);

  return (
    <div 
      ref={ref} 
      className="mermaid-container my-6 flex justify-center"
      style={{ minHeight: '100px' }}
    />
  );
}
