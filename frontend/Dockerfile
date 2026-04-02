# --- Stage 1: Build the Angular App ---
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your built Angular app (Ensure 'frontend' matches your angular.json project name!)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy the routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx on port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]