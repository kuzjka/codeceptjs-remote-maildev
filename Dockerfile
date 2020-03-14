FROM node:alpine

EXPOSE 25 8080

COPY package*.json .
COPY index.js .

RUN npm install

CMD ["node", "index.js"]
