@echo off
setlocal enabledelayedexpansion

:: 1. Kunci direktori kerja ke folder tempat file .bat berada
cd /d "%~dp0"

:: 2. Gunakan UTF-8 untuk teks ramah Indonesia
chcp 65001 > nul 2>&1

title SiKucek - Launcher dan Command Center

:: 3. Pre-flight Check: Pastikan Node.js terpasang
where node >nul 2>nul
if %errorlevel% neq 0 (
    cls
    echo ==============================================================================
    echo [ERROR] Node.js tidak terdeteksi di komputer Anda!
    echo ==============================================================================
    echo SiKucek membutuhkan Node.js (v18 ke atas) untuk dapat berjalan.
    echo Silakan unduh dan pasang Node.js dari: https://nodejs.org
    echo ==============================================================================
    echo.
    pause
    exit /b 1
)

:: 4. Pre-flight Check: Pastikan dependensi monorepo sudah terpasang
if not exist "node_modules\.bin\turbo.cmd" (
    cls
    echo ==============================================================================
    echo [INFORMASI] Dependensi monorepo belum terpasang atau baru pertama kali dibuka.
    echo Memasang seluruh pustaka otomatis via 'npm install'... Mohon tunggu sejenak.
    echo ==============================================================================
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ==============================================================================
        echo [ERROR] Gagal memasang dependensi! Pastikan koneksi internet Anda aktif.
        echo ==============================================================================
        pause
        exit /b 1
    )
    echo.
    echo [SUKSES] Seluruh dependensi berhasil terpasang!
    timeout /t 2 > nul
)

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
set "choice="
set /p "choice=Pilih nomor menu [0-9] lalu tekan Enter: "

:: Hapus spasi jika ada
set "choice=%choice: =%"

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
echo Pilihan tidak valid. Silakan masukkan angka antara 0 sampai 9.
ping -n 2 127.0.0.1 > nul
goto menu

:run_all
cls
title SiKucek - Menjalankan Semua Aplikasi (Dev)
echo ==============================================================================
echo Menjalankan Web Pelanggan (3000), POS Kasir (3001), dan Worker...
echo Tekan Ctrl + C untuk menghentikan server.
echo ==============================================================================
echo.
call npm run dev
echo.
echo Server telah dihentikan.
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
call npm run dev:web
echo.
echo Server telah dihentikan.
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
call npm run dev:pos
echo.
echo Server telah dihentikan.
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
call npm run dev:worker
echo.
echo Worker telah dihentikan.
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
call node packages/database/scripts/test-connection.mjs
echo.
pause
goto menu

:session_status
cls
title SiKucek - Status Session State Multi-Agen
echo.
call node .agents/02-session-state/session-manager.js
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
call git pull --rebase origin dev
echo.
pause
goto menu

:install_deps
cls
title SiKucek - Install Dependencies
echo ==============================================================================
echo Memasang ulang / update dependensi monorepo...
echo ==============================================================================
echo.
call npm install
echo.
echo Selesai!
pause
goto menu

:exit_app
echo Sampai jumpa di SiKucek!
ping -n 2 127.0.0.1 > nul
exit /b 0
