// src/components/AudioVisualizer.js
import React, { useRef, useEffect, useState } from 'react';

const AudioVisualizer = ({ audioElement }) => {
  const canvasRef = useRef(null);
  const [audioContext] = useState(() => new (window.AudioContext || window.webkitAudioContext)());
  const [analyser] = useState(() => audioContext.createAnalyser());

  useEffect(() => {
    if (!audioElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let source = null;

    const setupSource = () => {
      if (source) {
        source.disconnect();
      }
      source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    };

    setupSource();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(10, 10, 26)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;

        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 255)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (source) {
        source.disconnect();
      }
    };
  }, [audioElement, audioContext, analyser]);

  return <canvas ref={canvasRef} width="300" height="100" />;
};

export default AudioVisualizer;