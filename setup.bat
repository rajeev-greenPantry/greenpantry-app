@echo off
REM GreenPantry Setup Script for Windows
REM This script sets up the development environment for GreenPantry

echo 🚀 Setting up GreenPantry Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .NET is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] .NET 8 SDK is not installed. Please install from https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

echo [SUCCESS] All requirements satisfied!

REM Setup backend
echo [INFO] Setting up backend...
cd backend
dotnet restore
if %errorlevel% neq 0 (
    echo [ERROR] Failed to restore .NET packages
    pause
    exit /b 1
)

dotnet build --configuration Release
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build solution
    pause
    exit /b 1
)

dotnet test --configuration Release --no-build --verbosity normal
echo [SUCCESS] Backend setup completed!
cd ..

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install npm packages
    pause
    exit /b 1
)

npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)

echo [SUCCESS] Frontend setup completed!
cd ..

REM Create environment files
echo [INFO] Setting up environment files...

REM Backend environment
if not exist "backend\GreenPantry.API\appsettings.Development.json" (
    echo Creating backend appsettings.Development.json...
    (
        echo {
        echo   "Logging": {
        echo     "LogLevel": {
        echo       "Default": "Information",
        echo       "Microsoft.AspNetCore": "Warning"
        echo     }
        echo   },
        echo   "CosmosDb": {
        echo     "ConnectionString": "YOUR_COSMOS_DB_CONNECTION_STRING_HERE",
        echo     "DatabaseName": "GreenPantryDB"
        echo   },
        echo   "JwtSettings": {
        echo     "SecretKey": "YOUR_SUPER_SECRET_KEY_THAT_IS_AT_LEAST_32_CHARACTERS_LONG",
        echo     "Issuer": "GreenPantry",
        echo     "Audience": "GreenPantryUsers",
        echo     "ExpiryMinutes": 60,
        echo     "RefreshTokenExpiryDays": 7
        echo   }
        echo }
    ) > backend\GreenPantry.API\appsettings.Development.json
    echo [WARNING] Created backend appsettings.Development.json - Please update with your Cosmos DB connection string!
)

REM Frontend environment
if not exist "frontend\.env" (
    copy frontend\env.example frontend\.env
    echo [WARNING] Created frontend .env - Please update with your API URL!
)

echo [SUCCESS] Environment files created!

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Update your Cosmos DB connection string in backend\GreenPantry.API\appsettings.Development.json
echo 2. Update your API URL in frontend\.env
echo 3. Start the backend: cd backend ^&^& dotnet run
echo 4. Start the frontend: cd frontend ^&^& npm run dev
echo.
echo Happy coding! 🚀
pause
