from django.db import models


class Country(models.TextChoices):
    KOREA = "KOREA", "한국"
    USA = "USA", "미국"


class CurrencyType(models.TextChoices):
    KRW = "KRW", "원화"
    USD = "USD", "달러"


class AccountType(models.TextChoices):
    CHECKING_ACCOUNT = "CHECKING_ACCOUNT", "입출금"
    SAVINGS_ACCOUNT = "SAVINGS_ACCOUNT", "저금"
    INSTALLMENT_SAVING = "INSTALLMENT_SAVING", "적금"
    TIME_DEPOSIT = "TIME_DEPOSIT", "예금"
    CREDIT_CARD = "CREDIT_CARD", "신용카드"
    STOCK = "STOCK", "주식"
    LOAN = "LOAN", "대출"


class TransactionCategory(models.TextChoices):
    # Income
    ETC_INCOME = "ETC_INCOME", "기타소득"
    SALARY = "SALARY", "월급"
    BONUS = "BONUS", "보너스"
    INTEREST_INCOME = "INTEREST_INCOME", "이자소득"
    STOCK = "STOCK_INCOME", "주식"
    RENT = "RENT_INCOME", "임대"
    DIVIDEND = "DIVIDEND", "배당"
    DEPOSIT = "DEPOSIT", "입금"

    # Expense
    ETC_EXPENSE = "ETC_EXPENSE", "기타지출"
    DAILY_NECESSITY = "DAILY_NECESSITY", "생필품"
    GROCERY = "GROCERY", "식료품"
    MEMBERSHIP = "MEMBERSHIP", "맴버십"
    SERVICE = "SERVICE", "서비스"
    EAT_OUT = "EAT_OUT", "외식"
    CLOTHING = "CLOTHING", "옷"
    PRESENT = "PRESENT", "선물"
    TRANSPORTATION = "CAR", "이동수단"
    HOUSING = "HOUSING", "월세"
    LEISURE = "LEISURE", "여가"
    MEDICAL = "MEDICAL", "의료"
    PARENTING = "PARENTING", "육아"
    INTEREST_EXPENSE = "INTEREST_EXPENSE", "이자지출"
    WITHDRAW = "WITHDRAW", "출금"

    # Transfer
    TRANSFER = "TRANSFER", "이체"

    # Unk
    UNKNOWN = "UNKNOWN", "알 수 없음"

    @classmethod
    def choices(cls):
        return cls._choices


class RetailerType(models.TextChoices):
    ETC = "ETC", "기타"
    STORE = "STORE", "상점"
    PERSON = "PERSON", "개인"
    BANK = "BANK", "은행"
    SERVICE = "SERVICE", "서비스"
    INCOME = "INCOME", "수입"
    RESTAURANT = "RESTAURANT", "식당"
    INTERNET = "INTERNET", "인터넷"


class DetailItemCategory(models.TextChoices):
    ETC = "ETC", "기타"
    FRUIT = "FRUIT", "과일"
    ALCOHOL = "ALCOHOL", "주류"
    DRINK = "DRINK", "음료"
    SAUCE = "SAUCE", "소스"
    MEAT = "MEAT", "육류"
    VEGETABLE = "VEGETABLE", "채소"
    DAIRY = "DAIRY", "유제품"
    WRAP = "WRAP", "포장지"
    SNACK = "SNACK", "스낵"
    NOODLE = "NOODLE", "면"
    BREAD = "BREAD", "빵"
    DRUG = "DRUG", "약"
    TAX = "TAX", "세금"
    SEAFOOD = "SEAFOOD", "해산물"
    INGREDIENT = "INGREDIENT", "식재료"
    APPLIANCE = "APPLIANCE", "가전"
    STATIONERY = "STATIONERY", "문구류"
    BATH = "BATH", "욕실용품"
    BABY = "BABY", "육아용품"
    COOKER = "COOKER", "주방용품"
    FOOD = "FOOD", "식품"
    CLOTHING = "CLOTHING", "의류"
    FURNITURE = "FURNITURE", "가구"
    SPORTING = "SPORTING", "운동용품"
    UNKNOWN = "UNKNOWN", "알 수 없음"


class ExchangeType(models.TextChoices):
    ETC = "ETC", "기타"
    BANK = "BANK", "은행"
    WIREBARLEY = "WIREBARLEY", "와이어바알리"
    CREDITCARD = "CREDITCARD", "신용카드"


class ItemType(models.TextChoices):
    ITEM = "ITEM", "아이템"
    STOCK = "STOCK", "주식"
