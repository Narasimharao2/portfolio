@echo off
title Push to GitHub
color 0E
echo.
echo ==========================================================
echo   PUSH PORTFOLIO TO GITHUB
echo ==========================================================
echo.
echo [Step 1] Go to github.com and create a NEW, EMPTY repository.
echo [Step 2] Copy the HTTPS URL (e.g., https://github.com/username/repo.git)
echo.
set /p REPO_URL="Paste Repository URL here: "
echo.
echo Linking to Remote...
"C:\Program Files\Git\cmd\git.exe" remote remove origin >nul 2>&1
"C:\Program Files\Git\cmd\git.exe" remote add origin %REPO_URL%
echo.
echo Pushing code...
echo (A browser window may open to sign in to GitHub)
"C:\Program Files\Git\cmd\git.exe" push -u origin master
echo.
echo Done! Your code is now on GitHub.
pause
