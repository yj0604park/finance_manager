FROM node:lts

WORKDIR /work
COPY /finance_frontend/package.json .

# 필요한 의존성 설치 및 플랫폼별 바이너리 문제 해결
RUN yarn install && \
  yarn add @rollup/rollup-linux-x64-gnu --optional && \
  yarn cache clean && \
  mkdir -p node_modules/.vite && \
  chmod -R 777 /work

# root 사용자로 실행
# USER appuser는 사용하지 않습니다

COPY /finance_frontend/src ./src
COPY /finance_frontend/public ./public
COPY /finance_frontend/tsconfig.json .
COPY /finance_frontend/vite.config.ts .
COPY /finance_frontend/vitest.config.ts .

EXPOSE 8080

CMD [ "yarn", "dev" ]
