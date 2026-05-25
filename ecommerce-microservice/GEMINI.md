# GEMINI.md — PRD: Microservice E-Commerce (NestJS)

## PERAN & INSTRUKSI UNTUK AI

Kamu adalah Senior Software Engineer yang membangun sistem e-commerce berbasis microservice menggunakan NestJS versi terbaru. Ikuti PRD ini secara ketat dan konsisten. Jangan menambahkan library atau pattern yang tidak disebutkan. Jangan sederhanakan struktur folder. Jika ada ambiguitas, tanyakan terlebih dahulu sebelum mengimplementasi.

---

## KONTEKS PROYEK

Sistem e-commerce sederhana yang dibangun dengan arsitektur microservice untuk tujuan pembelajaran. Fokus utama adalah memahami bagaimana service-service berkomunikasi, bukan membuat fitur bisnis yang kompleks.

---

## ARSITEKTUR OVERVIEW

```
[Next.js Frontend] (belum dibuat, skip)
        │
        ▼ HTTP REST
[API Gateway] — Port 3000
        │
        ├──▶ [User Service]    — Port 3001
        ├──▶ [Product Service] — Port 3002
        ├──▶ [Order Service]   — Port 3003
        └──▶ [Payment Service] — Port 3004

Komunikasi antar service: HTTP REST langsung (bukan TCP NestJS, bukan RabbitMQ)
Database: Masing-masing service punya PostgreSQL database sendiri (DATABASE PER SERVICE)
```

---

## TECH STACK

| Komponen                    | Teknologi                                              |
| --------------------------- | ------------------------------------------------------ |
| Framework                   | NestJS (versi 10 terbaru, gunakan nest cli `nest new`) |
| Language                    | TypeScript (strict mode)                               |
| Database                    | PostgreSQL (satu instance, beda database per service)  |
| ORM                         | Prisma                                                 |
| Auth                        | JWT (jsonwebtoken + @nestjs/jwt)                       |
| Password                    | bcrypt                                                 |
| HTTP Client (antar service) | Axios via `@nestjs/axios`                              |
| Validation                  | class-validator + class-transformer                    |
| Config                      | @nestjs/config (.env per service)                      |
| File Upload                 | Multer (@nestjs/platform-express)                      |
| Containerization            | Docker + Docker Compose                                |

---

## STRUKTUR MONOREPO

```
ecommerce-microservice/
├── docker-compose.yml
├── .env.example
├── README.md
│
├── api-gateway/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── middleware/
│   │   │       └── auth.middleware.ts
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   └── user.service.ts
│   │   ├── product/
│   │   │   ├── product.module.ts
│   │   │   ├── product.controller.ts
│   │   │   └── product.service.ts
│   │   ├── order/
│   │   │   ├── order.module.ts
│   │   │   ├── order.controller.ts
│   │   │   └── order.service.ts
│   │   └── payment/
│   │       ├── payment.module.ts
│   │       ├── payment.controller.ts
│   │       └── payment.service.ts
│   ├── .env
│   ├── package.json
│   └── Dockerfile
│
├── user-service/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   └── user/
│   │       ├── user.module.ts
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       └── dto/
│   │           └── update-user.dto.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── Dockerfile
│
├── product-service/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── product/
│   │   │   ├── product.module.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   └── dto/
│   │   │       ├── create-product.dto.ts
│   │   │       └── update-product.dto.ts
│   │   └── stock/
│   │       ├── stock.module.ts
│   │       ├── stock.controller.ts
│   │       ├── stock.service.ts
│   │       └── dto/
│   │           └── update-stock.dto.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── Dockerfile
│
├── order-service/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── order/
│   │       ├── order.module.ts
│   │       ├── order.controller.ts
│   │       ├── order.service.ts
│   │       └── dto/
│   │           └── create-order.dto.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── Dockerfile
│
└── payment-service/
    ├── src/
    │   ├── app.module.ts
    │   ├── main.ts
    │   └── payment/
    │       ├── payment.module.ts
    │       ├── payment.controller.ts
    │       ├── payment.service.ts
    │       ├── providers/
    │       │   ├── payment-provider.interface.ts
    │       │   └── manual-transfer.provider.ts
    │       └── dto/
    │           ├── upload-proof.dto.ts
    │           └── approve-payment.dto.ts
    ├── uploads/                 ← storage bukti transfer
    ├── prisma/
    │   └── schema.prisma
    ├── .env
    ├── package.json
    └── Dockerfile
```

---

## DATABASE SCHEMA

### User Service — Database: `db_user`

```prisma
// user-service/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
}
```

### Product Service — Database: `db_product`

```prisma
// product-service/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  imageUrl    String?
  isActive    Boolean  @default(true)
  stock       Stock?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Stock {
  id        String   @id @default(uuid())
  productId String   @unique
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int      @default(0)
  updatedAt DateTime @updatedAt
}
```

### Order Service — Database: `db_order`

```prisma
// order-service/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Order {
  id          String      @id @default(uuid())
  userId      String
  totalAmount Decimal     @db.Decimal(10, 2)
  status      OrderStatus @default(PENDING)
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model OrderItem {
  id         String  @id @default(uuid())
  orderId    String
  order      Order   @relation(fields: [orderId], references: [id])
  productId  String
  productName String  // snapshot nama produk saat order dibuat
  price      Decimal @db.Decimal(10, 2) // snapshot harga saat order dibuat
  quantity   Int
}

enum OrderStatus {
  PENDING         // order dibuat, menunggu pembayaran
  WAITING_PAYMENT // menunggu konfirmasi bukti bayar
  PAID            // payment sudah diapprove admin
  CANCELLED       // dibatalkan
}
```

> **PENTING — Snapshot Data:** `productName` dan `price` di `OrderItem` harus disimpan sebagai snapshot (salinan nilai saat itu). Jangan simpan hanya `productId` lalu fetch setiap kali. Ini pattern standar di microservice karena Product Service bisa berubah kapan saja.

### Payment Service — Database: `db_payment`

```prisma
// payment-service/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Payment {
  id            String        @id @default(uuid())
  orderId       String        @unique
  userId        String
  amount        Decimal       @db.Decimal(10, 2)
  method        PaymentMethod @default(MANUAL_TRANSFER)
  status        PaymentStatus @default(PENDING)
  proofImageUrl String?       // URL bukti transfer
  approvedBy    String?       // userId admin yang approve
  approvedAt    DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum PaymentMethod {
  MANUAL_TRANSFER
  // MIDTRANS   ← tambahkan nanti
  // XENDIT     ← tambahkan nanti
}

enum PaymentStatus {
  PENDING    // menunggu upload bukti
  SUBMITTED  // bukti sudah diupload, menunggu admin
  APPROVED   // admin sudah approve
  REJECTED   // admin reject, harus upload ulang
}
```

---

## API CONTRACTS

### API Gateway — Port 3000

Gateway **tidak punya database**. Tugasnya adalah:

1. Validasi JWT (kecuali route public)
2. Forward request ke service yang tepat
3. Return response dari service ke client

Semua endpoint di bawah ini adalah yang di-expose ke luar (frontend/client).

---

#### AUTH (forward ke User Service)

```
POST /auth/register
Body: { email, password, name }
Response: { user: { id, email, name, role } }
Public: YES (tidak perlu JWT)

POST /auth/login
Body: { email, password }
Response: { accessToken: string, user: { id, email, name, role } }
Public: YES
```

---

#### USER (forward ke User Service)

```
GET /users/me
Header: Authorization: Bearer <token>
Response: { id, email, name, role, createdAt }
Auth: CUSTOMER, ADMIN
```

---

#### PRODUCT (forward ke Product Service)

```
GET /products
Query: ?page=1&limit=10&search=
Response: { data: Product[], total, page, limit }
Public: YES

GET /products/:id
Response: { id, name, description, price, imageUrl, stock: { quantity } }
Public: YES

POST /products
Body: { name, description, price, imageUrl, initialStock }
Response: Product
Auth: ADMIN only

PUT /products/:id
Body: { name?, description?, price?, imageUrl?, isActive? }
Response: Product
Auth: ADMIN only

PUT /products/:id/stock
Body: { quantity }  ← set quantity langsung (bukan increment)
Response: { productId, quantity }
Auth: ADMIN only
```

---

#### ORDER (forward ke Order Service)

```
POST /orders
Body: { items: [{ productId, quantity }] }
Response: Order
Auth: CUSTOMER
Flow: Gateway → Order Service → (Order Service call Product Service untuk validasi stok & ambil harga)

GET /orders
Response: Order[]  ← hanya order milik user yang request (ambil userId dari JWT)
Auth: CUSTOMER

GET /orders/:id
Response: Order dengan items
Auth: CUSTOMER (hanya milik sendiri), ADMIN (semua)

GET /orders/all
Response: semua Order[]
Auth: ADMIN only

PATCH /orders/:id/cancel
Response: Order dengan status CANCELLED
Auth: CUSTOMER (hanya milik sendiri, hanya jika status PENDING)
```

---

#### PAYMENT (forward ke Payment Service)

```
POST /payments/orders/:orderId
Body: -
Response: Payment (status: PENDING)
Auth: CUSTOMER
Note: Membuat payment record untuk order tertentu

POST /payments/:id/proof
Body: multipart/form-data { proof: file }
Response: Payment (status: SUBMITTED)
Auth: CUSTOMER (pemilik payment)

GET /payments/:id
Response: Payment
Auth: CUSTOMER (milik sendiri), ADMIN

GET /payments
Response: Payment[]
Auth: ADMIN only

POST /payments/:id/approve
Body: -
Response: Payment (status: APPROVED)
Auth: ADMIN only
Flow: Payment Service → update Order Service (PATCH /internal/orders/:orderId/status)

POST /payments/:id/reject
Body: { reason?: string }
Response: Payment (status: REJECTED)
Auth: ADMIN only
```

---

### Internal Endpoints (antar service, tidak diekspos ke client via Gateway)

Endpoint ini hanya dipanggil oleh service lain, bukan oleh client. Tambahkan prefix `/internal/` dan tidak perlu JWT auth — gunakan internal secret header saja.

```
# Dipanggil Order Service → Product Service
GET  http://product-service:3002/internal/products/:id
     Response: { id, name, price, stock: { quantity } }

POST http://product-service:3002/internal/products/validate-stock
     Body: { items: [{ productId, quantity }] }
     Response: { valid: boolean, items: [{ productId, name, price, availableStock }] }

POST http://product-service:3002/internal/stock/reduce
     Body: { items: [{ productId, quantity }] }
     Response: { success: boolean }

# Dipanggil Payment Service → Order Service
PATCH http://order-service:3003/internal/orders/:orderId/status
      Body: { status: OrderStatus }
      Response: { success: boolean }
```

> **Keamanan Internal Endpoint:** Semua `/internal/` endpoint harus dicek header `x-internal-secret: <INTERNAL_SECRET_KEY>` dari environment variable. Tolak dengan 403 jika tidak ada atau salah.

---

## FLOW BISNIS DETAIL

### Flow 1: Register & Login

```
Client → POST /auth/register → Gateway → User Service
  1. Validasi email belum terdaftar
  2. Hash password dengan bcrypt (salt=10)
  3. Simpan user ke DB
  4. Return user data (tanpa password)

Client → POST /auth/login → Gateway → User Service
  1. Cari user by email
  2. Compare password dengan bcrypt
  3. Generate JWT: payload { sub: userId, email, role }
  4. JWT_SECRET dari env, expires: '7d'
  5. Return { accessToken, user }
```

### Flow 2: Customer Membuat Order

```
Client → POST /orders → Gateway
  1. Gateway validasi JWT, inject userId ke header x-user-id
  2. Gateway forward ke Order Service

Order Service menerima request:
  3. Ambil userId dari header x-user-id
  4. Call Product Service: POST /internal/products/validate-stock
     dengan body { items: [{ productId, quantity }] }
  5. Jika stok tidak cukup → return 400 Bad Request dengan pesan jelas
  6. Hitung totalAmount dari harga yang dikembalikan Product Service
  7. Buat Order record dengan status PENDING
  8. Buat OrderItem records dengan snapshot nama & harga produk
  9. Call Product Service: POST /internal/stock/reduce
     untuk kurangi stok
  10. Return Order yang baru dibuat
```

### Flow 3: Pembayaran Manual Transfer

```
Client → POST /payments/orders/:orderId → Gateway
  1. Gateway validasi JWT, forward ke Payment Service
  2. Payment Service buat Payment record (status: PENDING)
  3. Update Order status ke WAITING_PAYMENT via:
     PATCH http://order-service/internal/orders/:orderId/status

Client → POST /payments/:id/proof (multipart) → Gateway
  1. Upload file disimpan ke /uploads/ di dalam container
  2. Simpan path file ke Payment.proofImageUrl
  3. Update Payment status ke SUBMITTED

Admin → POST /payments/:id/approve → Gateway
  1. Gateway validasi JWT, cek role ADMIN
  2. Payment Service update status ke APPROVED
  3. Set approvedBy = adminId, approvedAt = now()
  4. Call Order Service: PATCH /internal/orders/:orderId/status
     dengan body { status: 'PAID' }
  5. Return Payment yang sudah APPROVED
```

### Flow 4: Payment Provider Pattern (Extensible)

Payment Service harus mengimplementasi interface berikut agar mudah ditambah provider baru:

```typescript
// payment-service/src/payment/providers/payment-provider.interface.ts
export interface PaymentProvider {
  name: string;
  initiate(orderId: string, amount: number): Promise<PaymentInitiateResult>;
  verify(paymentId: string): Promise<boolean>;
}

export interface PaymentInitiateResult {
  externalId?: string; // ID dari payment gateway (Midtrans, Xendit, dll)
  redirectUrl?: string; // URL redirect ke halaman payment gateway
  instructions?: string; // Instruksi manual (untuk transfer)
  metadata?: Record<string, any>;
}
```

```typescript
// payment-service/src/payment/providers/manual-transfer.provider.ts
@Injectable()
export class ManualTransferProvider implements PaymentProvider {
  name = "MANUAL_TRANSFER";

  async initiate(
    orderId: string,
    amount: number,
  ): Promise<PaymentInitiateResult> {
    return {
      instructions: `Transfer sejumlah Rp${amount} ke rekening BCA 1234567890 a/n Toko Kita`,
    };
  }

  async verify(paymentId: string): Promise<boolean> {
    // Manual = approve by admin, selalu return false di sini
    // Proses approve ada di controller
    return false;
  }
}
```

> **Cara tambah Midtrans nanti:** Buat `midtrans.provider.ts` yang implement `PaymentProvider`, lalu inject ke `PaymentService` dan pilih provider berdasarkan `method` di request.

---

## KONFIGURASI ENVIRONMENT

### `api-gateway/.env`

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
INTERNAL_SECRET=your_internal_secret_key_here

USER_SERVICE_URL=http://user-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002
ORDER_SERVICE_URL=http://order-service:3003
PAYMENT_SERVICE_URL=http://payment-service:3004
```

### `user-service/.env`

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/db_user
JWT_SECRET=your_super_secret_jwt_key_here
INTERNAL_SECRET=your_internal_secret_key_here
```

### `product-service/.env`

```env
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/db_product
INTERNAL_SECRET=your_internal_secret_key_here
```

### `order-service/.env`

```env
PORT=3003
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/db_order
INTERNAL_SECRET=your_internal_secret_key_here
PRODUCT_SERVICE_URL=http://product-service:3002
```

### `payment-service/.env`

```env
PORT=3004
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/db_payment
INTERNAL_SECRET=your_internal_secret_key_here
ORDER_SERVICE_URL=http://order-service:3003
UPLOAD_DIR=./uploads
```

---

## DOCKER COMPOSE

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - ecommerce-net

  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    env_file: ./api-gateway/.env
    depends_on:
      - user-service
      - product-service
      - order-service
      - payment-service
    networks:
      - ecommerce-net

  user-service:
    build: ./user-service
    ports:
      - "3001:3001"
    env_file: ./user-service/.env
    depends_on:
      - postgres
    networks:
      - ecommerce-net

  product-service:
    build: ./product-service
    ports:
      - "3002:3002"
    env_file: ./product-service/.env
    depends_on:
      - postgres
    networks:
      - ecommerce-net

  order-service:
    build: ./order-service
    ports:
      - "3003:3003"
    env_file: ./order-service/.env
    depends_on:
      - postgres
      - product-service
    networks:
      - ecommerce-net

  payment-service:
    build: ./payment-service
    ports:
      - "3004:3004"
    env_file: ./payment-service/.env
    depends_on:
      - postgres
      - order-service
    volumes:
      - payment_uploads:/app/uploads
    networks:
      - ecommerce-net

networks:
  ecommerce-net:
    driver: bridge

volumes:
  postgres_data:
  payment_uploads:
```

### `init-db.sql` — Inisialisasi Database per Service

```sql
CREATE DATABASE db_user;
CREATE DATABASE db_product;
CREATE DATABASE db_order;
CREATE DATABASE db_payment;
```

---

## DOCKERFILE (template per service)

```dockerfile
# Dockerfile (sama untuk semua service, taruh di masing-masing folder)
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY package*.json ./
EXPOSE ${PORT}
CMD ["node", "dist/src/main.js"]
```

---

## ATURAN IMPLEMENTASI YANG WAJIB DIIKUTI

### 1. Gateway Tidak Punya Logika Bisnis

Gateway hanya forward request. Tidak ada kalkulasi harga, tidak ada validasi stok di gateway. Semua logika ada di masing-masing service.

### 2. Inject User Context via Header

Setelah gateway validasi JWT, inject info user ke downstream request sebagai header:

```
x-user-id: <userId>
x-user-role: <role>
x-user-email: <email>
```

Service tidak boleh re-validasi JWT. Mereka cukup baca dari header ini.

### 3. Setiap Service Punya Error Handling Sendiri

Gunakan NestJS built-in exception filters. Setiap service return error dalam format konsisten:

```json
{
  "statusCode": 400,
  "message": "Stok produk tidak mencukupi",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/internal/products/validate-stock"
}
```

### 4. Validasi Input Wajib Menggunakan DTO + class-validator

```typescript
// Contoh
export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
```

### 5. Prisma Service Wajib Injectable

```typescript
// prisma.service.ts — wajib ada di setiap service
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### 6. HttpModule untuk Komunikasi Antar Service

```typescript
// Di service yang perlu call service lain
@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  ...
})
```

### 7. Internal Secret Middleware

```typescript
// Untuk semua /internal/* endpoint di setiap service
@Injectable()
export class InternalSecretGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers["x-internal-secret"];
    return secret === this.configService.get("INTERNAL_SECRET");
  }
}
```

---

## URUTAN IMPLEMENTASI YANG DISARANKAN

Bangun dalam urutan ini agar setiap tahap bisa di-test secara independen:

```
1. Setup monorepo structure + docker-compose.yml + init-db.sql
2. User Service (auth register/login, JWT generation)
3. API Gateway (routing + JWT validation middleware)
4. Test: Register → Login → GET /users/me
5. Product Service (CRUD product + stock management)
6. Test: Create product, update stock (langsung ke port 3002, belum via gateway)
7. Sambungkan Gateway → Product Service
8. Order Service (create order + call product service internal)
9. Test: Create order, cek stok berkurang
10. Payment Service (manual transfer + upload bukti + approval)
11. Test: Full flow end-to-end
```

---

## CATATAN PENTING UNTUK PENGEMBANGAN SELANJUTNYA

Hal-hal yang disederhanakan di PRD ini dan perlu di-upgrade saat sistem berkembang:

| Yang Disederhanakan           | Upgrade ke                                 |
| ----------------------------- | ------------------------------------------ |
| HTTP REST antar service       | RabbitMQ / Kafka untuk async event         |
| Upload file lokal             | AWS S3 / Cloudflare R2                     |
| Single PostgreSQL instance    | PostgreSQL terpisah per service            |
| Tidak ada retry mechanism     | Exponential backoff + circuit breaker      |
| Internal secret sederhana     | mTLS / service mesh (Istio)                |
| Tidak ada distributed tracing | OpenTelemetry + Jaeger                     |
| Stok dikurangi saat order     | Saga pattern untuk distributed transaction |

---
