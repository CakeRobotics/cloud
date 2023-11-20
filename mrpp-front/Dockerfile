FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY . ./
ENV NODE_ENV production
RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY server.conf /etc/nginx/conf.d/default.conf
