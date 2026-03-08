@echo off
setlocal

REM 设置变量
set BACKEND_URL=http://localhost:8080
set OPENAPI_PATH=/v3/api-docs
set OUTPUT_FILE=openapi.json
set FRONTEND_DIR=%~dp0..

echo 正在检查后端服务是否运行...

REM 检查后端服务是否可用
curl -s --connect-timeout 5 %BACKEND_URL%%OPENAPI_PATH% > nul
if %errorlevel% neq 0 (
    echo 错误: 无法连接到后端服务 (%BACKEND_URL%)
    echo 请确保后端服务正在运行在端口 8080
    echo 您可以运行以下命令来启动后端:
    echo cd ..\backend_demo && .\gradlew bootRun
    exit /b 1
)

echo 后端服务已就绪，正在下载OpenAPI规范...

REM 下载OpenAPI规范
curl -X GET "%BACKEND_URL%%OPENAPI_PATH%" -o "%FRONTEND_DIR%\%OUTPUT_FILE%"
if %errorlevel% neq 0 (
    echo 错误: 无法下载OpenAPI规范
    exit /b 1
)

echo OpenAPI规范已下载到 %OUTPUT_FILE%

echo 正在生成API客户端...

REM 生成API客户端
cd "%FRONTEND_DIR%"
npm run api:generate

if %errorlevel% neq 0 (
    echo 错误: API生成失败
    exit /b 1
)

echo.
echo API客户端生成成功！
echo 生成的文件位于: src/services/generated/
pause