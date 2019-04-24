FROM node:10.12.0-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN yarn && yarn build

FROM sebp/lighttpd
COPY --from=builder /usr/src/app/dist /var/www/localhost/htdocs