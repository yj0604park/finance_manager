# 프론트엔드 테스트 코드 커버리지를 확인하는 스크립트
Write-Host "프론트엔드 테스트 코드 커버리지를 확인합니다..."

# Docker Compose를 사용하여 테스트 코드 커버리지 확인
docker-compose -f docker-compose.local.yml run --rm vite-test yarn test:coverage

# 실행 결과 확인
if ($LASTEXITCODE -eq 0) {
    Write-Host "테스트 코드 커버리지 확인이 성공적으로 완료되었습니다." -ForegroundColor Green
} else {
    Write-Host "테스트 코드 커버리지 확인 중 오류가 발생했습니다." -ForegroundColor Red
}
