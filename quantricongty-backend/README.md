# Company Core Backend Template

Starter backend cho **1 công ty / 1 cửa hàng / 1 deployment riêng**.

## 1. Tư duy triển khai đúng với yêu cầu của bạn

Template này **không phải SaaS multi-tenant**.

Nó được thiết kế theo hướng:
- Mỗi khách hàng có **1 backend riêng**
- Mỗi khách hàng có **1 database MongoDB riêng**
- Cùng một cấu trúc CRM + HRM + IAM được **clone** ra để tái sử dụng
- Cùng một giao diện quản trị là bình thường, nhưng **dữ liệu của mỗi công ty là độc lập hoàn toàn**

Nói ngắn gọn:
- Công ty A -> domain A, backend A, database A
- Công ty B -> domain B, backend B, database B

## 2. Công nghệ

- NestJS
- MongoDB + Mongoose
- JWT Auth
- RBAC permission catalog
- Docker Compose cho MongoDB local

## 3. Chạy local

### 3.1. Cài package

```bash
npm install
```

### 3.2. Tạo file env

```bash
cp .env.example .env
```

### 3.3. Chạy MongoDB bằng Docker

```bash
docker compose up -d
```

### 3.4. Chạy API

```bash
npm run start:dev
```

API mặc định:

```text
http://localhost:3000/api
```

## 4. Bootstrap hệ thống lần đầu

Sau khi bật backend, gọi endpoint bootstrap một lần duy nhất:

`POST /api/auth/bootstrap`

Body mẫu:

```json
{
  "company": {
    "name": "ABC Retail",
    "legalName": "ABC Retail Co., Ltd",
    "code": "abc-retail",
    "taxCode": "0312345678",
    "phone": "0909000000",
    "email": "contact@abc.vn",
    "website": "https://abc.vn",
    "address": "Ho Chi Minh City"
  },
  "owner": {
    "fullName": "Nguyen Van A",
    "email": "owner@abc.vn",
    "phone": "0909111222",
    "password": "12345678"
  }
}
```

Kết quả:
- tạo company profile
- tạo role `owner`
- gán toàn bộ permission catalog cho owner
- tạo account đầu tiên
- tạo employee đầu tiên `EMP-0001`
- trả về access token

## 5. Đăng nhập

`POST /api/auth/login`

```json
{
  "email": "owner@abc.vn",
  "password": "12345678"
}
```

## 6. Permission catalog hiện có

Xem nhanh tại:

`GET /api/auth/permission-catalog`

Catalog hiện tại gồm:
- company.read, company.update
- roles.read, roles.create, roles.update, roles.delete
- branches.read, branches.create, branches.update, branches.delete
- orgUnits.read, orgUnits.create, orgUnits.update, orgUnits.delete
- positions.read, positions.create, positions.update, positions.delete
- employees.read, employees.create, employees.update, employees.delete, employees.assignManager
- parties.read, parties.create, parties.update, parties.delete
- contacts.read, contacts.create, contacts.update, contacts.delete
- audit.read

## 7. Cấu trúc thư mục

```text
src
├── app.module.ts
├── main.ts
├── common
│   ├── common.module.ts
│   ├── constants
│   ├── decorators
│   ├── dto
│   ├── guards
│   ├── interfaces
│   └── utils
├── config
│   └── configuration.ts
├── modules
│   ├── audit
│   ├── auth
│   ├── company
│   ├── crm
│   ├── hrm
│   ├── iam
│   └── org
└── scripts
```

## 8. Modules hiện có

### 8.1 Auth
- bootstrap hệ thống
- login bằng email + password
- cấp access token

### 8.2 Company
- lấy company profile
- cập nhật company profile

### 8.3 IAM
- CRUD roles
- permissions ở dạng catalog key

### 8.4 Org
- Branches
- Org units
- Positions

### 8.5 HRM
- Employees
- liên kết employee với account/branch/org unit/position/manager

### 8.6 CRM
- External parties
- Contact persons

### 8.7 Audit
- lưu lịch sử hành động create/update/delete/bootstrap/login

## 9. Vì sao không cần companyId để phân biệt công ty?

Vì hướng của bạn là:
- mỗi công ty là **1 dự án riêng**
- mỗi dự án dùng **1 database riêng**

Cho nên:
- không cần `tenantId` để tách công ty A và B trong cùng runtime
- công ty nào dùng website thương mại điện tử riêng thì website đó gọi đúng API của **project/backend riêng**
- cùng cấu trúc web admin là chuyện bình thường, dữ liệu vẫn khác nhau vì db khác nhau

## 10. Resource chính trong bản v1

### HRM
- Employee
- Branch
- OrgUnit
- Position
- Role
- Account
- Company

### CRM
- ExternalParty
- ContactPerson

## 11. Một số collection MongoDB chính

- accounts
- roles
- company_profiles
- branches
- org_units
- positions
- employees
- external_parties
- contact_people
- audit_logs

## 12. Thứ tự phát triển tiếp theo mình khuyên

### Giai đoạn tiếp theo 1
- tạo account từ màn hình nhân sự
- gán role cho account
- reset password
- khóa / mở khóa account
- upload avatar và file đính kèm

### Giai đoạn tiếp theo 2
- custom field engine riêng cho employee và party
- import/export Excel
- activity timeline chi tiết
- soft delete thay vì hard delete
- dashboard thống kê

### Giai đoạn tiếp theo 3
- approval flow
- notifications
- public API cho website bán hàng hoặc landing page
- customer portal / partner portal

## 13. Nếu sau này làm frontend

Bạn có thể thêm:
- `apps/admin-web` dùng Next.js cho trang quản trị
- `apps/public-web` dùng Next.js cho website công ty / landing / ecommerce

Nhưng ở giai đoạn này, backend nên đi trước như template hiện tại.

## 14. Gợi ý route nhanh

- `POST /api/auth/bootstrap`
- `POST /api/auth/login`
- `GET /api/auth/permission-catalog`
- `GET /api/company/profile`
- `PATCH /api/company/profile`
- `GET/POST/PATCH/DELETE /api/roles`
- `GET/POST/PATCH/DELETE /api/branches`
- `GET/POST/PATCH/DELETE /api/org-units`
- `GET/POST/PATCH/DELETE /api/positions`
- `GET/POST/PATCH/DELETE /api/employees`
- `GET/POST/PATCH/DELETE /api/parties`
- `GET/POST/PATCH/DELETE /api/contacts`
- `GET /api/audit-logs`

## 15. Lưu ý rất quan trọng

Template này là **bản khởi đầu tốt để code thật**, chưa phải full enterprise production.

Những phần bạn nên làm tiếp trước khi go-live:
- refresh token
- forgot/reset password
- rate limiting
- helmet + security headers
- request logging
- soft delete
- exception format chuẩn
- unit test + e2e test
- file storage
- validation nghiệp vụ sâu hơn
- seed master data
