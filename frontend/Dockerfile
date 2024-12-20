# Etap 1: Budowa aplikacji
FROM node:18 AS build

# Ustawienie katalogu roboczego
WORKDIR /app

# Skopiowanie plików package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Skopiowanie całego projektu
COPY . .

# Budowa aplikacji Vite
RUN npm run build

# Etap 2: Serwowanie aplikacji na Nginx
FROM nginx:alpine

# Skopiowanie zbudowanych plików do katalogu Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Ekspozycja portu 80
EXPOSE 80

# Uruchomienie serwera Nginx
CMD ["nginx", "-g", "daemon off;"]
