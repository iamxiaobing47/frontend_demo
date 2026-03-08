# PowerShell script to automatically generate API client
param(
    [string]$BackendUrl = "http://localhost:8080",
    [string]$OpenApiPath = "/v3/api-docs",
    [string]$OutputFile = "openapi.json"
)

Write-Host "正在检查后端服务是否运行..." -ForegroundColor Green

# 检查后端服务是否可用
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl$OpenApiPath" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "后端服务已就绪，正在下载OpenAPI规范..." -ForegroundColor Green
}
catch {
    Write-Host "错误: 无法连接到后端服务 ($BackendUrl)" -ForegroundColor Red
    Write-Host "请确保后端服务正在运行在端口 8080" -ForegroundColor Yellow
    Write-Host "您可以运行以下命令来启动后端:" -ForegroundColor Yellow
    Write-Host "cd ..\backend_demo && .\gradlew bootRun" -ForegroundColor Cyan
    exit 1
}

# 下载OpenAPI规范
try {
    Invoke-WebRequest -Uri "$BackendUrl$OpenApiPath" -OutFile $OutputFile -ErrorAction Stop
    Write-Host "OpenAPI规范已下载到 $OutputFile" -ForegroundColor Green
}
catch {
    Write-Host "错误: 无法下载OpenAPI规范" -ForegroundColor Red
    exit 1
}

# 生成API客户端
Write-Host "正在生成API客户端..." -ForegroundColor Green
try {
    npm run api:generate
    if ($LASTEXITCODE -ne 0) {
        throw "API生成失败"
    }
    Write-Host "" -ForegroundColor White
    Write-Host "API客户端生成成功！" -ForegroundColor Green
    Write-Host "生成的文件位于: src/services/generated/" -ForegroundColor Cyan
}
catch {
    Write-Host "错误: API生成失败" -ForegroundColor Red
    exit 1
}