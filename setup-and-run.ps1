# Microservices Setup and Run Script
# Run this script from the microservices root directory

Write-Host "🚀 Microservices Setup and Run Script" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow
$pgRunning = $false
try {
    $null = & psql -U postgres -c "SELECT 1" 2>&1
    $pgRunning = $true
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL is not running or not accessible" -ForegroundColor Red
    Write-Host "Please start PostgreSQL and make sure 'postgres' user has password 'postgres'" -ForegroundColor Yellow
    Write-Host "Or update the DATABASE_URL in .env files with your credentials" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after starting PostgreSQL to continue, or Ctrl+C to exit"
}

# Create databases
Write-Host ""
Write-Host "Creating databases..." -ForegroundColor Yellow
try {
    & psql -U postgres -c "CREATE DATABASE auth_db;" 2>&1 | Out-Null
    Write-Host "✅ Created auth_db" -ForegroundColor Green
} catch {
    Write-Host "⚠️  auth_db might already exist" -ForegroundColor Yellow
}

try {
    & psql -U postgres -c "CREATE DATABASE post_db;" 2>&1 | Out-Null
    Write-Host "✅ Created post_db" -ForegroundColor Green
} catch {
    Write-Host "⚠️  post_db might already exist" -ForegroundColor Yellow
}

# Run migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow

Write-Host "  Auth Service..." -ForegroundColor Cyan
Set-Location "backend\auth-service"
& npx prisma migrate dev --name init
Set-Location "..\..\"

Write-Host "  Post Service..." -ForegroundColor Cyan
Set-Location "backend\post-service"
& npx prisma migrate dev --name init
Set-Location "..\..\"

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting all services..." -ForegroundColor Yellow
Write-Host ""

# Start services in background
Write-Host "Starting Auth Service (Port 4001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\auth-service'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting Post Service (Port 4002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\post-service'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting Gateway (Port 4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\gateway'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev"

Write-Host ""
Write-Host "🎉 All services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  • Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "  • Gateway:      http://localhost:4000" -ForegroundColor White
Write-Host "  • Auth Service: http://localhost:4001" -ForegroundColor White
Write-Host "  • Post Service: http://localhost:4002" -ForegroundColor White
Write-Host ""
Write-Host "Wait about 30 seconds for all services to start, then open:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to open the application in your browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:3000"
