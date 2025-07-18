@echo off
echo Smart Deal Analyzer - Port Cleanup Script
echo ========================================
echo Checking for processes using ports 3000-3007...
echo.

REM Check each port and kill Node.js processes only
for %%p in (3000 3001 3002 3003 3004 3005 3006 3007) do (
    echo Checking port %%p...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p') do (
        for /f "tokens=1" %%b in ('tasklist /fi "pid eq %%a" /fo csv ^| findstr /i "node.exe\|npm.exe\|next.exe"') do (
            if not "%%b"=="" (
                echo Found Node.js process on port %%p (PID: %%a) - Terminating...
                taskkill /f /pid %%a >nul 2>&1
                if !errorlevel! equ 0 (
                    echo   Successfully terminated PID %%a
                ) else (
                    echo   Could not terminate PID %%a (may require admin rights)
                )
            )
        )
    )
)

echo.
echo Port cleanup complete!
echo You can now run 'npm run dev' safely.
echo.
pause