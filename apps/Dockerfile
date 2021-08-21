FROM node:16-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
ENV USER_CODE_PATH /user-code
ENTRYPOINT ["yarn", "start"]
