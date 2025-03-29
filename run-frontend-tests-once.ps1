# 프론트엔드 테스트를 한 번만 실행하는 스크립트
Write-Host "프론트엔드 테스트를 한 번만 실행합니다..."

# 먼저 Dockerfile 다시 빌드
Write-Host "Docker 이미지를 다시 빌드합니다..."
docker-compose -f docker-compose.local.yml build vite-test

# Docker Compose를 사용하여 테스트 한 번만 실행
Write-Host "모든 테스트를 실행합니다..."
docker-compose -f docker-compose.local.yml run --rm vite-test yarn test:run

# 실행 결과 확인
if ($LASTEXITCODE -eq 0) {
    Write-Host "테스트가 성공적으로 완료되었습니다." -ForegroundColor Green
} else {
    Write-Host "테스트 실행 중 오류가 발생했습니다." -ForegroundColor Red
}
