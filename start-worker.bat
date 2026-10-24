@echo off
chcp 65001 > nul
title SiKucek - WhatsApp Automation Worker
echo ==============================================================================
echo Menjalankan WhatsApp Automation Engine Worker...
echo Tekan Ctrl + C untuk menghentikan worker.
echo ==============================================================================
echo.
npm run dev:worker
pause
