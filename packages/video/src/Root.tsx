import React from 'react';
import { Composition } from 'remotion';
import { HeroBackground } from './HeroBackground';

export const Root: React.FC = () => {
  return (
    <>
      {/* 
        Komposisi Latar Belakang Hero SiKucek Storytelling:
        - 1920x1080 Full HD
        - 30 fps
        - 300 frame = 10 detik durasi loop 3 babak (Cuci -> Kering -> Siap di Rak)
      */}
      <Composition
        id="HeroBackground"
        component={HeroBackground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
