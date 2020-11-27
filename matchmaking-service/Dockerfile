# base image
FROM node:14-slim

RUN apt update && apt install -y procps

USER node

ARG PORT=3030

ENV PORT=${PORT}
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /home/node

COPY --chown=node package.json yarn.lock ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "start" ]