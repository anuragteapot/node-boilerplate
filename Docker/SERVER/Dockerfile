FROM node

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "prod:server"]
