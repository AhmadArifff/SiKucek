import React from 'react';
import { Composition } from 'remotion';
import { HeroBackground } from './HeroBackground';

export const Root: React.FC = () => {
  return (
    <>
      {/* 
        Komposisi Latar Belakang Hero SiKucek:
        - 1920x1080 Full HD
        - 30 fps
        - 180 frame = 6 detik durasi loop sempurna
      */}
      <Composition
        id="HeroBackground"
        component={HeroBackground}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
