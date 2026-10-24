@echo off
chcp 65001 > nul
title SiKucek - Monorepo Dev (Semua Aplikasi)
echo ==============================================================================
echo Menjalankan Web Pelanggan (3000), POS Kasir (3001), dan Worker...
echo Tekan Ctrl + C untuk menghentikan server kapan saja.
echo ==============================================================================
echo.
npm run dev
pause
