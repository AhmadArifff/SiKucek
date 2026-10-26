import React from 'react';
import { Composition } from 'remotion';
import { HeroBackground } from './HeroBackground';

export const Root: React.FC = () => {
  return (
    <>
      {/* 
        Komposisi Film Animasi Sinematik SiKucek (Satu Cucian, Satu Perjalanan Transparan):
        - 1920x1080 Full HD
        - 30 fps
        - 1500 frame = 50 detik durasi film sinematik utuh (S1 s.d S9)
        - Safe Zone: Sisi Kiri (0-42%) tenang, Aksi Utama di Sisi Kanan (45-95%)
      */}
      <Composition
        id="HeroBackground"
        component={HeroBackground}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
