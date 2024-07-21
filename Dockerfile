# Sử dụng một hình ảnh cơ sở với Node.js
FROM node:16

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY ["package.json", "package-lock.json*", "./"]

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn ứng dụng vào container
COPY . .

# Mở cổng mà ứng dụng sẽ lắng nghe
EXPOSE 4000

# Chạy ứng dụng NestJS
CMD [ "npm", "run", "start:prod" ]
