@echo off
chcp 65001 > nul
title SiKucek - POS Kasir dan Operator (Port 3001)
echo ==============================================================================
echo Menjalankan Aplikasi Kasir dan Operator POS di http://localhost:3001
echo Tekan Ctrl + C untuk menghentikan server.
echo ==============================================================================
echo.
npm run dev:pos
pause
