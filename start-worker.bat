@echo off
setlocal enabledelayedexpansion

:: 1. Kunci direktori kerja ke folder tempat file .bat berada
cd /d "%~dp0"

:: 2. Gunakan UTF-8 untuk teks ramah Indonesia
chcp 65001 > nul 2>&1

title SiKucek - WhatsApp Automation Worker

:: 3. Pre-flight Check: Pastikan Node.js terpasang
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ==============================================================================
    echo [ERROR] Node.js tidak terdeteksi di komputer Anda!
    echo Unduh dan pasang Node.js dari: https://nodejs.org
    echo ==============================================================================
    echo.
    pause
    exit /b 1
)

:: 4. Pre-flight Check: Pastikan dependensi sudah terpasang
if not exist "node_modules\.bin\turbo.cmd" (
    echo ==============================================================================
    echo [INFORMASI] Dependensi monorepo belum terpasang.
    echo Menjalankan 'npm install'... Mohon tunggu sejenak.
    echo ==============================================================================
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Gagal memasang dependensi!
        pause
        exit /b 1
    )
)

cls
echo ==============================================================================
echo SIKUCEK - WHATSAPP AUTOMATION ENGINE WORKER
echo ==============================================================================
echo Menyimak antrean notifikasi Supabase whatsapp_queue secara realtime...
echo.
echo Tekan Ctrl + C untuk menghentikan worker.
echo ==============================================================================
echo.

call npm run dev:worker

echo.
echo ==============================================================================
echo Worker telah dihentikan.
echo ==============================================================================
pause
