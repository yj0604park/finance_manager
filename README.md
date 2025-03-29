# 금융 내역 관리 시스템 요구사항

## 1. 사전 정의된 거래 유형 (Predefined Transaction Types)

### ✅ 소득 (Income)

- `월급`, `보너스`, `이자`, `주식`, `임대`, `배당`, `입금`

### ✅ 지출 (Expense)

- `생필품`, `식료품`, `멤버십`, `서비스`, `외식`, `옷`, `선물`, `이동수단`, `월세`, `여가`, `의료`, `육아`, `이자`, `보험료`, `출금`

### ✅ 계좌 간 이체 (Transfer)

- 계좌 간 이동 기록 (내부 이체)

## 2. 국가, 통화

### 국가

- `한국`, `미국`

### 통화

- `원화`, `달러`

## 3. 계좌 종류

- `입출금`, `적금`, `저금`, `예금`, `신용카드`, `주식거래`, `대출`

## 4. 은행 (Bank)

- 은행 정보를 추가, 수정, 삭제, 조회할 수 있어야 함.
- 필드:
  - `id`: 고유 식별자
  - `name`: 은행 명
  - `country`: 계좌 생성 국가

## 5. 계좌 (Account)

- 계좌 정보를 추가, 수정, 삭제, 조회할 수 있어야 함.
- 기본 모델: BaseAmountModel, BaseCurrencyModel
- 필드:
  - `id`: 고유 식별자
  - `bank`: 소속 은행 (Foreign Key)
  - `name`: 계좌 명
  - `nickname`: 계좌 별명 (선택 사항)
  - `account_type`: 계좌 종류
  - `last_update`: 마지막 업데이트 된 시각
  - `last_transaction`: 해당 계좌의 마지막 transaction의 날짜/시간
  - `first_transaction`: 해당 계좌의 맨 처음 transaction의 날짜/시간
  - `first_added`: 해당 계좌의 첫 transaction이 기록됐는지 여부
  - `is_active`: 계좌의 존재/해지 여부
  - `amount`: 잔액
  - `currency`: 통화

## 6. 리테일러 (Retailer)

- 리테일러 정보를 추가, 수정, 삭제, 조회할 수 있어야 함.
- 필드:
  - `id`: 고유 식별자
  - `name`: 리테일러 명
  - `retailer_type`: 리테일러 타입 (`상점`, `개인`, `은행`, `서비스`, `수입`, `식당`, `인터넷`)
  - `default_new_transaction_type`: 신규 거래 생성 시 선택될 기본 거래 유형

## 7. 거래 (Transaction)

- 거래 정보를 추가, 수정, 삭제, 조회할 수 있어야 함.
- 필드:
  - `id`: 고유 식별자
  - `account`: 해당 계좌 ID (Foreign Key)
  - `retailer`: 해당 리테일러 ID (Foreign Key)
  - `transaction_type`: 거래 유형 (리테일러 선택 시 자동 지정되나 수정 가능)
  - `amount`: 거래 금액
  - `balance`: 거래 후 계좌 잔액
  - `date`: 거래 날짜
  - `time`: 거래 시간 (기본값 - 12:00)
  - `notes`: 거래 메모
  - `linked_transaction`: 내부 이체 시 연결된 거래 (Foreign Key)
  - `is_reviewed`: 사용자가 명시적으로 리뷰했는지를 체크

> 📌 **내부 이체 처리 방식**
>
> - 내부 이체는 자동으로 연결되지 않음.
> - 사용자가 추후 내부 이체 거래만 모아 금액과 날짜를 비교하여 수동으로 링크할 계획.

## 8. 계좌 스냅샷 (Account Snapshot)

- 계좌의 특정 시점 잔액을 저장하여 과거 데이터를 비교 가능하도록 함. (차트 생성 시 활용)
- 필드:
  - `id`: 고유 식별자
  - `date`: 잔액 기준준 날짜
  - `account`: 해당 계좌 ID (Foreign Key, Optional)
  - `bank`: 해당 은행 ID (Foreign Key, Optional)
  - `item`: 아이템 ID (ForeignKey, Optional)
  - `currency`: 통화 (Optional)
  - `balance`: 잔액

## 9. 아이템 (Item)

- 아이템 정보를 추가, 수정, 삭제, 조회할 수 있어야 함.
- 필드:
  - `id`: 고유 식별자
  - `name`: 아이템 명
  - `code`: 주식(티커) 또는 물건(모델명)
  - `item_type`: 아이템 타입 (`주식`, `물건`)

## 10. 아이템 구매 내역 (Item Purchase History)

- 특정 아이템(주식, 물건)의 구매 기록을 저장.
- 필드:
  - `transaction_id`: 해당 거래 ID
  - `item_id`: 해당 아이템 ID
  - `purchase_price`: 구매 단가
  - `quantity`: 구매 개수
  - `tax`: 세금 (선택 사항)
  - `fee`: 수수료 (선택 사항)
  - `subsidy`: 지원금 (선택 사항)

## 11. 주식 가격 (Item Price)

- 주식 가격을 기록
- 필드:
  - `date`: 날짜
  - `item`: 아이템 (Foreign Key)
  - `price`: 단가

## 12. 월급 상세 정보 (Salary Details)

- 월급 내역을 보다 상세히 기록.
- 필드:
  - `gross_pay`: 총 급여
  - `adjustment`: 조정 금액
  - `tax_withheld`: 원천징수 세금
  - `deduction`: 공제 항목
  - `net_pay`: 실수령액
  - `gross_pay_detail`, `adjustment_detail`, `tax_withheld_detail`, `deduction_detail`: 상세 내역
  - `transaction`: 연계된 거래 (Foreign Key)

## 13. 환전 내역 (Currency Exchange)

- 환전 내역을 기록.
- 필드:
  - `transaction_from`: 환전 전 거래 ID
  - `transaction_to`: 환전 후 거래 ID
  - `amount_from`: 원래 금액
  - `amount_to`: 환전된 금액
  - `currency_from`: 원래 통화
  - `currency_to`: 환전된 통화
  - `exchange_ratio`: 환율
  - `exchange_broker`: 환전 제공자 (`은행`, `와이어바알리`, `신용카드`, `기타`)
  - `date`: 환전일

## 14. 태그 (Labels) 기능 추가 (추후 추가 예정)

- 거래에 태그를 추가하여 더 세부적인 분류가 가능하도록 함.

## 15. 예산 (Budget) 기능 (추후 추가 예정)

- 예산 설정 및 모니터링 기능 추가 예정.

## 16. 자동 카테고리 매핑 (Auto-Categorization) (추후 추가 예정)

- AI/규칙 기반으로 거래 내역의 자동 분류 가능성 검토.

## 17. 레퍼런스 파일 업로드

## 18. 검증 기능 (Validation)

- **잔액 검증:** 계좌의 잔액이 마지막 거래 내역 잔액과 같아야 함.
- **거래 내역 연속성:** 거래 내역의 계좌 잔액은 거래 금액과 이전 거래 잔액의 합이어야 함.
- **월급 검증:** 모든 월급 정보는 해당하는 입금 내역이 존재해야 하며, 해당 입금 내역의 거래 유형은 `소득 > 월급`이어야 함.
- **내부 이체 검증:**
  - 모든 내부 이체 내역에는 대응하는 반대 거래가 있어야 함.
  - 같은 통화일 경우, 금액이 정확히 같고 부호는 반대여야 함. (수수료가 있는 경우, 별도 수수료 거래 추가)
  - 다른 통화일 경우, 환율 테이블에 해당 내역이 존재해야 함.
- **환율 검증:** 환율 테이블에는 변환된 통화와 원본 통화가 달라야 하며, 환율은 1보다 큰 값으로 기록.
- **거래 내역 타입 검증:** UNKNOWN 타입, INCOME인데 음수, EXPENSE인데 양수 인 경우 찾아서 수정
