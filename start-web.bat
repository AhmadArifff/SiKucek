@echo off
chcp 65001 > nul
title SiKucek - Web Pelanggan (Port 3000)
echo ==============================================================================
echo Menjalankan Web Pelanggan dan Public Tracking di http://localhost:3000
echo Tekan Ctrl + C untuk menghentikan server.
echo ==============================================================================
echo.
npm run dev:web
pause
