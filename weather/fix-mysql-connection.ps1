# PowerShell script to fix MySQL connection issues
# This script helps diagnose and fix MySQL connection problems

Write-Host "=== MySQL Connection Diagnostic Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if MySQL is running
Write-Host "1. Checking if MySQL is running..." -ForegroundColor Yellow
$mysqlProcess = Get-Process | Where-Object {$_.ProcessName -like "*mysql*" -or $_.ProcessName -like "*mysqld*"}
if ($mysqlProcess) {
    Write-Host "   [OK] MySQL process found: $($mysqlProcess.ProcessName)" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] MySQL process not found!" -ForegroundColor Red
    Write-Host "   Please start MySQL service first." -ForegroundColor Red
    exit 1
}

# Step 2: Check if port 3306 is listening
Write-Host "2. Checking if port 3306 is listening..." -ForegroundColor Yellow
$port3306 = netstat -an | Select-String ":3306"
if ($port3306) {
    Write-Host "   [OK] Port 3306 is listening" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Port 3306 is not listening!" -ForegroundColor Red
    exit 1
}

# Step 3: Try to find MySQL installation path
Write-Host "3. Looking for MySQL installation..." -ForegroundColor Yellow
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe",
    "C:\Program Files\MariaDB\*\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql*\bin\mysql.exe"
)

$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $mysqlExe = $found.FullName
        Write-Host "   [OK] Found MySQL at: $mysqlExe" -ForegroundColor Green
        break
    }
}

if (-not $mysqlExe) {
    Write-Host "   [WARN] MySQL command-line client not found in common locations" -ForegroundColor Yellow
    Write-Host "   You may need to add MySQL bin directory to PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Manual steps:" -ForegroundColor Cyan
    Write-Host "   1. Open MySQL Workbench, phpMyAdmin, or any MySQL client" -ForegroundColor White
    Write-Host "   2. Connect as root user (password may be empty)" -ForegroundColor White
    Write-Host "   3. Run: CREATE DATABASE IF NOT EXISTS weather_db;" -ForegroundColor White
    Write-Host "   4. Run: CREATE DATABASE IF NOT EXISTS weather_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
    exit 0
}

# Step 4: Test connection and create database
Write-Host "4. Testing MySQL connection..." -ForegroundColor Yellow
try {
    # Test connection with empty password (as per application.properties)
    $testConnection = & $mysqlExe -u root -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] MySQL connection successful" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] MySQL connection failed!" -ForegroundColor Red
        Write-Host "   Error: $testConnection" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Try connecting with password:" -ForegroundColor Yellow
        Write-Host "   $mysqlExe -u root -p" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "   [FAIL] Error: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Check if database exists
Write-Host "5. Checking if weather_db database exists..." -ForegroundColor Yellow
$dbCheck = & $mysqlExe -u root -e "SHOW DATABASES LIKE 'weather_db';" 2>&1
if ($dbCheck -match "weather_db") {
    Write-Host "   [OK] Database 'weather_db' exists" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Database 'weather_db' does not exist" -ForegroundColor Red
    Write-Host "   Creating database..." -ForegroundColor Yellow
    
    $createDb = & $mysqlExe -u root -e "CREATE DATABASE IF NOT EXISTS weather_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Database 'weather_db' created successfully" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] Failed to create database!" -ForegroundColor Red
        Write-Host "   Error: $createDb" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== All checks passed! ===" -ForegroundColor Green
Write-Host "You can now try running your Spring Boot application again." -ForegroundColor Cyan
Write-Host ""

