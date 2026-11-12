@echo off
chcp 65001 > nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "Spine Portfolio Server" cmd /k "py -m http.server 8001"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "Spine Portfolio Server" cmd /k "python -m http.server 8001"
  ) else (
    echo Python이 설치되어 있지 않습니다. GitHub Pages로 배포하거나 Python을 설치해 주세요.
    pause
    exit /b 1
  )
)
timeout /t 2 >nul
start http://localhost:8001
