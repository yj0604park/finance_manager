# 프론트엔드 테스트 실행을 위한 스크립트
Write-Host "프론트엔드 테스트를 실행합니다..."

# Docker Compose를 사용하여 테스트 실행
docker-compose -f docker-compose.local.yml up --build vite-test

# 실행 결과 확인
if ($LASTEXITCODE -eq 0) {
    Write-Host "테스트가 성공적으로 완료되었습니다." -ForegroundColor Green
} else {
    Write-Host "테스트 실행 중 오류가 발생했습니다." -ForegroundColor Red
}
