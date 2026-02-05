# api/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar dependencias necesarias para compilación
RUN apk add --no-cache python3 make g++

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear directorio para uploads
RUN mkdir -p uploads logs

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]