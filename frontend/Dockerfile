# Stage 1: Build - Uses Node.js to install dependencies and build the React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
RUN npm run build 

# Stage 2: Run - Uses lightweight nginx to serve the built files
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

 Build the Docker Image:

# docker build -t my-react-app .
# docker run -d -p 3000:80 --name react-container my-react-app
# Access app on browswer http://localhost:3000
# View container logs : docker logs react-container