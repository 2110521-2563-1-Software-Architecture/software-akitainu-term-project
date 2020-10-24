# base image
FROM node:12-alpine

# set working directory
RUN mkdir /app
WORKDIR /app

# install and cache app dependencies
COPY . /app
RUN yarn

# start app
CMD ["yarn", "start"]