@echo off
title Stop Holy Spirit Rectorate Server
echo Stopping parish server on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /f /pid %%a 2>nul
)
echo Parish server has been stopped.
pause
