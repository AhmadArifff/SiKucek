@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SiKucek - Launcher dan Command Center

:menu
cls
echo ==============================================================================
echo                 SIKUCEK - SMART HYBRID LAUNDRY OPERATING SYSTEM               
echo ==============================================================================
echo.
echo   [1] Jalankan SEMUA Aplikasi (Web Pelanggan + POS Kasir + Worker WA)
echo   [2] Jalankan Web Pelanggan (Customer PWA dan Tracking - Port 3000)
echo   [3] Jalankan Kasir POS (Kasir dan Operator Dashboard - Port 3001)
echo   [4] Jalankan WhatsApp Automation Worker
echo.
echo   --- UTILITAS DAN DIAGNOSTIK ---
echo   [5] Bersihkan Port Macet (Kill Port 3000, 3001, 4000)
echo   [6] Tes Koneksi Supabase Database (db:test)
echo   [7] Cek Status Session State Multi-Agen (active-session.json)
echo   [8] Git Pull Rebase (Sync Branch dev)
echo   [9] Install / Update Dependencies (npm install)
echo.
echo   [0] Keluar
echo.
echo ==============================================================================
set /p choice="Pilih nomor menu [0-9] lalu tekan Enter: "

if "%choice%"=="1" goto run_all
if "%choice%"=="2" goto run_web
if "%choice%"=="3" goto run_pos
if "%choice%"=="4" goto run_worker
if "%choice%"=="5" goto kill_ports
if "%choice%"=="6" goto test_db
if "%choice%"=="7" goto session_status
if "%choice%"=="8" goto git_sync
if "%choice%"=="9" goto install_deps
if "%choice%"=="0" goto exit_app

echo.
echo Pilihan tidak valid. Silakan coba lagi.
ping -n 2 127.0.0.1 > nul
goto menu

:run_all
cls
title SiKucek - Menjalankan Semua Aplikasi (Dev)
echo ==============================================================================
echo Menjalankan Web Pelanggan (3000), POS Kasir (3001), dan Worker...
echo Tekan Ctrl + C untuk menghentikan server kapan saja.
echo ==============================================================================
echo.
npm run dev
pause
goto menu

:run_web
cls
title SiKucek - Web Pelanggan (Port 3000)
echo ==============================================================================
echo Menjalankan Web Pelanggan dan Public Tracking di http://localhost:3000
echo Tekan Ctrl + C untuk menghentikan server.
echo ==============================================================================
echo.
npm run dev:web
pause
goto menu

:run_pos
cls
title SiKucek - POS Kasir dan Operator (Port 3001)
echo ==============================================================================
echo Menjalankan Aplikasi Kasir dan Operator POS di http://localhost:3001
echo Tekan Ctrl + C untuk menghentikan server.
echo ==============================================================================
echo.
npm run dev:pos
pause
goto menu

:run_worker
cls
title SiKucek - WhatsApp Automation Worker
echo ==============================================================================
echo Menjalankan WhatsApp Automation Engine Worker...
echo Tekan Ctrl + C untuk menghentikan worker.
echo ==============================================================================
echo.
npm run dev:worker
pause
goto menu

:kill_ports
cls
title SiKucek - Bersihkan Port Macet
echo ==============================================================================
echo Mematikan proses yang menggunakan port 3000, 3001, dan 4000...
echo ==============================================================================
echo.
call npm run kill:port
echo.
echo Port berhasil dibersihkan!
pause
goto menu

:test_db
cls
title SiKucek - Tes Koneksi Database Supabase
echo ==============================================================================
echo Menguji koneksi ke Supabase PostgreSQL...
echo ==============================================================================
echo.
node packages/database/scripts/test-connection.mjs
echo.
pause
goto menu

:session_status
cls
title SiKucek - Status Session State Multi-Agen
echo.
node .agents/02-session-state/session-manager.js
echo.
pause
goto menu

:git_sync
cls
title SiKucek - Git Pull Sync
echo ==============================================================================
echo Menarik pembaruan terbaru dari branch dev (Pre-Dev Sync)...
echo ==============================================================================
echo.
git pull --rebase origin dev
echo.
pause
goto menu

:install_deps
cls
title SiKucek - Install Dependencies
echo ==============================================================================
echo Memasang dependensi monorepo...
echo ==============================================================================
echo.
npm install
echo.
pause
goto menu

:exit_app
echo Sampai jumpa di SiKucek!
ping -n 2 127.0.0.1 > nul
exit /b 0
