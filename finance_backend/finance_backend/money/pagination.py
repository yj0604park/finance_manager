from rest_framework.pagination import PageNumberPagination


class TransactionPagination(PageNumberPagination):
    page_size = (
        20  # 기본 페이지 크기 (전역 설정과 동일하게 유지하거나 다르게 설정 가능)
    )
    page_size_query_param = (
        "page_size"  # 클라이언트가 페이지 크기를 지정할 파라미터 이름
    )
    max_page_size = 100  # 클라이언트가 요청할 수 있는 최대 페이지 크기
