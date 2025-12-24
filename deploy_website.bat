@echo off
title Deploy to GitHub
color 0B
echo.
echo ==========================================================
echo   DEPLOY PORTFOLIO TO GITHUB
echo ==========================================================
echo.
echo This script will upload your website code to your GitHub Repository.
echo.
echo [1/4] Checking Git...
if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
) else (
    set "GIT_CMD=git"
)

echo [2/4] Staging files...
"%GIT_CMD%" add .

echo [3/4] Committing changes...
"%GIT_CMD%" commit -m "Deployment Update: Final Polish" >nul 2>&1

echo [4/4] Pushing to GitHub...
"%GIT_CMD%" push -u origin master
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ALERT] Push failed or Remote URL not set.
    echo.
    set /p REPO_URL="Enter your GitHub Repository URL now: "
    "%GIT_CMD%" remote add origin %REPO_URL%
    "%GIT_CMD%" push -u origin master
)

echo.
echo ==========================================================
echo   DONE! Your code is on GitHub.
echo   Now go to https://dashboard.render.com to finish hosting.
echo ==========================================================
pause
