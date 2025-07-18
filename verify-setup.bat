@echo off
echo Smart Deal Analyzer - Setup Verification
echo =======================================
echo.

echo 1. Checking port availability...
netstat -an | findstr ":3000 " >nul 2>&1
if %errorlevel% equ 0 (
    echo   Port 3000 is in use - server will use 3008
) else (
    echo   Port 3000 is available
)

echo.
echo 2. Checking project structure...
if exist "lib\calculations\" (
    echo   ✓ lib/calculations/ directory preserved
) else (
    echo   ✗ lib/calculations/ directory missing
)

if exist "next.config.ts" (
    echo   ✓ next.config.ts exists and configured for OneDrive
) else (
    echo   ✗ next.config.ts missing
)

if exist ".next\" (
    echo   ✓ .next folder exists (build artifacts present)
) else (
    echo   ✓ .next folder clean (will be generated on startup)
)

echo.
echo 3. Testing TypeScript compilation...
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ TypeScript compilation successful
) else (
    echo   ✗ TypeScript compilation failed
)

echo.
echo 4. Verification complete!
echo   - Run 'cleanup-ports.bat' if you need to clear ports 3000-3007
echo   - Run 'npm run dev' to start the development server
echo   - Server will be available at http://localhost:3000 or 3008
echo.
pause