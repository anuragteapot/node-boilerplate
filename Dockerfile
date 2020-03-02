FROM node:alpine

WORKDIR /usr/src

COPY package*.json ./

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

RUN npm install --production --silent

COPY . .

CMD ["npm", "run", "start"]
