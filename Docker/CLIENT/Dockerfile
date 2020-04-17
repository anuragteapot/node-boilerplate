FROM node

WORKDIR /usr/src

COPY package*.json ./

RUN npm install serve

RUN npm install 

COPY . .

CMD ["npm", "run", "prod:client"]
