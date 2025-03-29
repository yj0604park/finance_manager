#!/usr/bin/env pwsh
# Script to fetch OpenAPI spec from finance_backend, copy it to the frontend resource directory, and regenerate API client code

$ErrorActionPreference = "Stop"

# Fetching the latest OpenAPI spec from the backend container
Write-Host "Fetching the latest OpenAPI spec from the backend container..." -ForegroundColor Cyan
docker compose -f docker-compose.local.yml exec django python -c "from finance_backend.utils.schemas import get_schema; print(get_schema())" > temp_schema.yaml

# Check if schema was successfully fetched
if (!(Test-Path -Path temp_schema.yaml) -or (Get-Content -Path temp_schema.yaml | Measure-Object).Count -eq 0) {
    Write-Host "Failed to fetch schema from the backend. Please verify that the backend server is running." -ForegroundColor Red
    exit 1
}

# Copy OpenAPI spec file to frontend resource directory
Write-Host "Copying OpenAPI spec to the frontend resource directory..." -ForegroundColor Cyan
$targetDir = "finance_frontend/src/resource"

# Create directory if it doesn't exist
if (!(Test-Path -Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

Move-Item -Path temp_schema.yaml -Destination "$targetDir/finance_backend_API.yaml" -Force

# Regenerate API client code
Write-Host "Regenerating API client code..." -ForegroundColor Cyan
Set-Location -Path finance_frontend
yarn generate-api
Set-Location -Path ..

Write-Host "OpenAPI spec synchronization and API client code generation completed!" -ForegroundColor Green
Write-Host "Warning: Do not directly modify the auto-generated API code! Instead, use the wrapper classes in the wrappers/ directory." -ForegroundColor Yellow
