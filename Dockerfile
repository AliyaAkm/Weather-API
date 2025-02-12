FROM node:latest

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]