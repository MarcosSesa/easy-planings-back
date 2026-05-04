FROM node:lts AS build

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:lts

WORKDIR /usr/local/app

COPY --from=build /usr/local/app ./

EXPOSE 8080

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/index.mjs"]
