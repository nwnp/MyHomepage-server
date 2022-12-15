FROM node:14.20.1
WORKDIR /app
COPY ./package.json ./
RUN npm install
RUN npm i -g pm2
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]