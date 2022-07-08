# stage one - copy & build
FROM node:16-bullseye AS etsbuild
WORKDIR /opt/ets

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./src ./src

RUN npm install
RUN npm run build:nest


## stage two - run service
FROM node:16-bullseye
WORKDIR /opt/ets

COPY ./package.json ./
COPY --from=etsbuild /opt/ets ./

RUN npm install --only=production
RUN npm install pm2 -g

EXPOSE 80

CMD ["pm2-runtime", "app.js"]