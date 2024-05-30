FROM node:22.2.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install mysql2 --save

#ENV MYSQL_HOST=db
#ENV MYSQL_USER=root
#ENV MYSQL_PASSWORD=root
#ENV MYSQL_DATABASE=nodedb

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]