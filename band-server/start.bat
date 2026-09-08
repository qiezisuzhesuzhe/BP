@echo off
chcp 65001 >nul
REM ======================================================================
REM   安康智慧平台 - 一键启动脚本（Windows）
REM   双击运行即可。服务在后台运行，关闭本窗口不会停止服务。
REM   如需停止服务，双击同目录下的「停止服务.bat」
REM ======================================================================
setlocal enabledelayedexpansion
title 安康智慧健康平台
cd /d "%~dp0"

echo.
echo ============================================
echo    安康智慧健康平台 (手环 + 雷达)
echo ============================================
echo.

REM 1. 检查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo [X]  未检测到 Node.js
    echo.
    echo 请先安装 Node.js LTS（推荐 v18 或更高版本）
    echo   下载地址: https://nodejs.org/zh-cn/download
    echo   安装时勾选 "Add to PATH"，安装完成后重新双击本脚本
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo [OK]  Node.js 版本: !NODE_VER!

REM 2. 检查依赖（首次自动安装）
if not exist "node_modules\express\index.js" (
    echo.
    echo [..] 首次运行，正在安装依赖（约 1~3 分钟，需联网）...
    call npm install --no-audit --no-fund --loglevel=error
    if errorlevel 1 (
        echo [X]  依赖安装失败，请检查网络后重试
        echo.
        pause
        exit /b 1
    )
    echo [OK]  依赖安装完成
)

REM 3. 关闭占用 8091 端口的旧进程（防止重复启动端口冲突）
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8091 " ^| findstr "LISTENING"') do (
    echo [..] 端口 8091 已被占用 (PID %%a)，正在关闭旧服务...
    taskkill /F /PID %%a >nul 2>nul
    timeout /t 1 /nobreak >nul
)

REM 4. 用 PowerShell 在后台启动服务（关闭本窗口不会停止，日志写入 server.log）
echo.
echo [..] 启动服务中...
set SVC_ROOT=%~dp0
powershell -NoProfile -Command ^
  "$root = Start-Sleep -Milliseconds 100; ^
   $sp = New-Object System.Diagnostics.ProcessStartInfo; ^
   $sp.FileName = 'node.exe'; ^
   $sp.Arguments = 'server.js'; ^
   $sp.WorkingDirectory = $env:SVC_ROOT; ^
   $sp.UseShellExecute = $false; ^
   $sp.RedirectStandardOutput = $true; ^
   $sp.RedirectStandardError = $true; ^
   $p = [System.Diagnostics.Process]::Start($sp); ^
   $p.StandardOutput.ReadToEndAsync() | Out-Null; ^
   $p.StandardError.ReadToEndAsync() | Out-Null; ^
   Set-Content -Path (Join-Path $env:SVC_ROOT 'server.pid') -Value $p.Id"

REM 5. 等待服务就绪（最多 20 秒）
set MAX_WAIT=20
set WAIT=0
set READY=0
:WAIT_LOOP
timeout /t 1 /nobreak >nul
curl -sf http://127.0.0.1:8091/api/health >nul 2>nul
if not errorlevel 1 (
    set READY=1
    goto WAIT_DONE
)
set /a WAIT+=1
if !WAIT! lss %MAX_WAIT% goto WAIT_LOOP
:WAIT_DONE

if !READY!==0 (
    echo [X]  服务启动超时，请检查日志：%~dp0server.log
    echo.
    type server.log 2>nul
    echo.
    pause
    exit /b 1
)

REM 6. 获取本机 IP（供同局域网设备访问，可选）
set LOCAL_IP=
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    for /f "tokens=*" %%b in ("%%a") do (
        if "!LOCAL_IP!"=="" set LOCAL_IP=%%b
    )
)

REM 7. 显示结果
echo.
echo ============================================
echo    [OK]  服务已启动成功！
echo ============================================
echo.
echo  本机访问（推荐）:  http://localhost:8091/
if not "!LOCAL_IP!"=="" (
echo  同局域网访问:    http://!LOCAL_IP!:8091/
)
echo.
echo  手环回调 URL:  https://ankangbp.serveousercontent.com/pb/upload
echo  雷达回调 URL:  https://ankangbp.serveousercontent.com/api/radar/push
echo.
echo  提示：服务已在后台运行，可关闭本窗口。
echo        如需停止，双击同目录「停止服务.bat」。
echo.

REM 8. 自动打开浏览器
start "" "http://localhost:8091/"

echo.
echo  已尝试打开浏览器。关闭本窗口不会停止服务。
echo.
pause
exit /b 0
