@echo off
echo ===================================================
echo   Portfolio Website Deployment Script
echo   (c) 2025 Teega Narasimharao
echo ===================================================
echo.

:: Check if git is available
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not found in your system PATH.
    echo.
    echo Please try one of the following:
    echo 1. Run this script using "Git Bash" instead of double-clicking.
    echo 2. Open Git Bash, navigate here, and run: ./deploy_website.bat
    echo 3. Install Git for Windows and add it to your PATH.
    echo.
    pause
    exit /b
)

echo [INFO] Git found! Starting deployment...
echo.

echo [1/3] Adding changes...
git add .

echo [2/3] Committing changes...
git commit -m "Final Polish: Chatbot V4, Footer Revert, UI Fixes"

echo [3/3] Pushing to repository...
git push

echo.
echo ===================================================
if %ERRORLEVEL% EQU 0 (
    echo   DEPLOYMENT SUCCESSFUL! 🚀
) else (
    echo   DEPLOYMENT FAILED. Please check the errors above.
)
echo ===================================================
pause
