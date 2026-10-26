import React from 'react';
import { Composition } from 'remotion';
import { HeroBackground } from './HeroBackground';

export const Root: React.FC = () => {
  return (
    <>
      {/* 
        Komposisi Film Animasi Sinematik SiKucek (4 Babak):
        - 1920x1080 Full HD
        - 30 fps
        - 360 frame = 12 detik durasi film animasi utuh
      */}
      <Composition
        id="HeroBackground"
        component={HeroBackground}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
