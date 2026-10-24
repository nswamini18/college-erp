@echo off
title College ERP - Backend & Frontend Launcher
cls
echo =============================================================
echo        COLLEGE ERP SYSTEM - ALL-IN-ONE STARTUP
echo =============================================================
echo Starting Express Backend (Port 5000) and Vite Frontend (Port 3000)...
echo.
cd /d "%~dp0"
node scripts\start-all.cjs
pause
