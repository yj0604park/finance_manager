FROM node:lts AS build
WORKDIR /app
COPY finance_frontend/package.json finance_frontend/yarn.lock ./
RUN yarn install
COPY finance_frontend .
RUN yarn build

FROM docker.io/nginx:1.17.8-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./compose/production/nginx/default.conf /etc/nginx/conf.d/default.conf
