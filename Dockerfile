FROM node:alpine

COPY . /opt
WORKDIR /opt
RUN npm install --production --silent

CMD ["npm", "run", "start"]
