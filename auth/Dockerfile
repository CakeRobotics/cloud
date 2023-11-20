FROM node:16-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
ENV TERM xterm-256color
ENTRYPOINT ["yarn", "start"]
