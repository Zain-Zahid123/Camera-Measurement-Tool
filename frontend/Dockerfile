# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
RUN npm run build

# Stage 2: Run
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]