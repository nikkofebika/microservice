# Microservice E-Commerce (NestJS)

Sistem e-commerce berbasis microservice menggunakan NestJS, PostgreSQL, Prisma, dan Docker.

## Struktur Project

- `api-gateway`: Entry point (Port 3000)
- `user-service`: Auth & User Management (Port 3001)
- `product-service`: Product & Stock (Port 3002)
- `order-service`: Order Management (Port 3003)
- `payment-service`: Payment Processing (Port 3004)

## Cara Menjalankan

1. Pastikan Docker & Docker Compose terinstal.
2. Clone repository.
3. Jalankan:
   ```bash
   docker compose up --build
   ```
4. Sistem akan berjalan dan database akan diinisialisasi secara otomatis.

## API Documentation

Lihat `GEMINI.md` untuk detail API Contract.
