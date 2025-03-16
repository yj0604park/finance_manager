FROM node:lts

WORKDIR /work
COPY /finance_dashboard/package.json .
RUN yarn install
COPY /finance_dashboard/src ./src
COPY /finance_dashboard/public ./public
COPY /finance_dashboard/tsconfig.json .

CMD [ "yarn", "dev" ]
