FROM node:16-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
ENTRYPOINT ["yarn", "start"]
