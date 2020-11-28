FROM node:12-alpine as build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
EXPOSE 3002
CMD ["yarn", "start"]