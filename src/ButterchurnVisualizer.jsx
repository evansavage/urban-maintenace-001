import { useEffect, useRef, useState } from 'react';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

const ButterchurnVisualizer = ({ audioContext, audioElement, activePreset }) => {
  const canvasRef = useRef(null);
  const visualizerRef = useRef(null);
  const animationRef = useRef(null);
  const presetIntervalRef = useRef(null);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // ✅ Resize visualizer canvas only
  useEffect(() => {
    const handleResize = () => {
      const newSize = { width: window.innerWidth, height: window.innerHeight };
      setSize(newSize);
      if (visualizerRef.current) {
        visualizerRef.current.setRendererSize(newSize.width, newSize.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Create visualizer once per audioElement
  useEffect(() => {
    if (!audioContext || !audioElement || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // Clean up animation and presets from previous instance
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (presetIntervalRef.current) clearInterval(presetIntervalRef.current);

    // Create new source node (only once per audioElement)
    const sourceNode = audioContext.createMediaElementSource(audioElement);
    sourceNode.connect(audioContext.destination);

    // Initialize Butterchurn
    const visualizer = butterchurn.createVisualizer(audioContext, canvas, {
      width: size.width,
      height: size.height,
    });

    visualizer.connectAudio(sourceNode);
    visualizer.setRendererSize(size.width, size.height);
    visualizerRef.current = visualizer;

    // Presets
    const allPresets = butterchurnPresets.getPresets();
    const presetNames = Object.keys(allPresets);
    const firstPreset = allPresets[presetNames[Math.floor(Math.random() * presetNames.length)]];
    visualizer.loadPreset(firstPreset, 0.0);

    presetIntervalRef.current = setInterval(() => {
      const nextPreset = allPresets[presetNames[Math.floor(Math.random() * presetNames.length)]];
      visualizer.loadPreset(nextPreset, 2.0);
    }, 5000);

    // Render loop
    const render = () => {
      visualizer.render();
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearInterval(presetIntervalRef.current);
    };
  }, [audioContext, audioElement]); // ✅ Removed size from deps

  return (
    <canvas
      ref={canvasRef}
      width={size.width}
      height={size.height}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        zIndex: 0,
      }}
    />
  );
};

export default ButterchurnVisualizer;
