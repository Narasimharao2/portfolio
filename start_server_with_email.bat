@echo off
title Portfolio Server (With Email)
color 0A
echo.
echo ==========================================================
echo   STARTING PORTFOLIO SERVER WITH GMAIL INTEGRATION
echo ==========================================================
echo.
echo [IMPORTANT]
echo To send authentic emails, you must provide:
echo 1. Your Gmail Address
echo 2. Your Google App Password (NOT your login password)
echo    (Get it from Google Account > Security > App Passwords)
echo.
echo If you leave these blank, the system will use SIMULATION MODE.
echo.
echo ----------------------------------------------------------
set /p EMAIL_USER="Enter Gmail: "
set /p EMAIL_PASS="Enter App Password: "
echo.
echo Cleaning up old processes...
taskkill /f /im python.exe >nul 2>&1
echo.
echo Starting Flask Application...
echo Open http://localhost:5000 in your browser.
echo.
python app.py
pause
