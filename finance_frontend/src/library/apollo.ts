import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAuthToken } from '../utils/auth';

// GraphQL 서버 연결 설정
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/money/graphql', // GraphQL 서버 주소
});

// 인증 헤더 추가
const authLink = setContext((_, { headers }) => {
  // 로컬 스토리지에서 토큰 가져오기
  const token = getAuthToken();
  
  // 토큰이 있으면 헤더에 추가
  return {
    headers: {
      ...headers,
      authorization: token ? `Token ${token}` : '',
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
}); 