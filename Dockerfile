# Sử dụng image node để build app
FROM node:18 AS build

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng image nginx để chạy bản build
FROM nginx:alpine

# Copy file build sang thư mục nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file cấu hình nginx tùy chỉnh (nếu có)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]