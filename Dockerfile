FROM node:10.12.0-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN apk add git
RUN yarn && yarn build

FROM nginx:1.15
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html