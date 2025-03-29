import { Account } from "../api/models/Account";
import { Bank } from "../api/models/Bank";

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

// 일반적인 유효성 검사 함수들
export const isRequired = (value: unknown, fieldName: string): ValidationError | null => {
  if (value === undefined || value === null || value === '') {
    return { field: fieldName, message: `${fieldName}은(는) 필수 항목입니다.` };
  }
  return null;
};

export const minLength = (value: string, min: number, fieldName: string): ValidationError | null => {
  if (value && value.length < min) {
    return { field: fieldName, message: `${fieldName}은(는) 최소 ${min}자 이상이어야 합니다.` };
  }
  return null;
};

export const maxLength = (value: string, max: number, fieldName: string): ValidationError | null => {
  if (value && value.length > max) {
    return { field: fieldName, message: `${fieldName}은(는) 최대 ${max}자까지 입력 가능합니다.` };
  }
  return null;
};

export const isNumber = (value: string, fieldName: string): ValidationError | null => {
  if (value && isNaN(Number(value))) {
    return { field: fieldName, message: `${fieldName}은(는) 숫자여야 합니다.` };
  }
  return null;
};

export const isPositive = (value: string | number, fieldName: string): ValidationError | null => {
  const num = typeof value === 'string' ? Number(value) : value;
  if (num < 0) {
    return { field: fieldName, message: `${fieldName}은(는) 0 이상이어야 합니다.` };
  }
  return null;
};

// 특정 객체(모델)별 검증 함수
export const validateBankForm = (data: Partial<Bank>): ValidationResult => {
  const errors: ValidationError[] = [];

  // 필수 필드 검증
  const nameError = isRequired(data.name, '은행명');
  if (nameError) errors.push(nameError);

  // 길이 검증
  if (data.name) {
    const nameLengthError = maxLength(data.name, 50, '은행명');
    if (nameLengthError) errors.push(nameLengthError);
  }

  // 국가 검증
  const countryError = isRequired(data.country, '국가');
  if (countryError) errors.push(countryError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAccountForm = (data: Partial<Account>): ValidationResult => {
  const errors: ValidationError[] = [];

  // 필수 필드 검증
  const nameError = isRequired(data.name, '계좌명');
  if (nameError) errors.push(nameError);

  const bankError = isRequired(data.bank, '은행');
  if (bankError) errors.push(bankError);

  // 금액 검증
  const amountError = isRequired(data.amount, '잔액');
  if (amountError) errors.push(amountError);

  if (data.amount) {
    const numberError = isNumber(data.amount, '잔액');
    if (numberError) errors.push(numberError);
    else {
      const positiveError = isPositive(data.amount, '잔액');
      if (positiveError) errors.push(positiveError);
    }
  }

  // 계좌명 길이 검증
  if (data.name) {
    const nameLengthError = maxLength(data.name, 100, '계좌명');
    if (nameLengthError) errors.push(nameLengthError);
  }

  // 별칭 길이 검증
  if (data.nickname) {
    const nicknameLengthError = maxLength(data.nickname, 50, '별칭');
    if (nicknameLengthError) errors.push(nicknameLengthError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 특정 필드 여러 검증 규칙 적용
export const validateField = (
  value: unknown,
  fieldName: string,
  validations: ((value: unknown, fieldName: string) => ValidationError | null)[]
): ValidationError | null => {
  for (const validation of validations) {
    const error = validation(value, fieldName);
    if (error) return error;
  }
  return null;
};

// 폼 검증 결과를 MUI에 사용할 형식으로 변환
export const getFormHelperText = (result: ValidationResult, fieldName: string): string => {
  const error = result.errors.find(e => e.field === fieldName);
  return error ? error.message : '';
};

export const hasFieldError = (result: ValidationResult, fieldName: string): boolean => {
  return result.errors.some(e => e.field === fieldName);
};
