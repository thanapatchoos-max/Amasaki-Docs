# Document Management System

ระบบจัดการเอกสาร พัฒนาด้วย AdonisJS, Inertia.js, React และ TypeScript
ใช้ SQLite สำหรับการพัฒนาในเครื่อง

## ความสามารถ

- จัดการเอกสาร อัปโหลด ดาวน์โหลด และประวัติเวอร์ชัน
- จัดการโฟลเดอร์และสิทธิ์การเข้าถึง
- จัดการผู้ใช้ บทบาท และสิทธิ์
- Dashboard รายงาน การแจ้งเตือน และ Audit Log
- ถังขยะและการกู้คืนข้อมูล

## เริ่มใช้งานในเครื่อง

ต้องติดตั้ง Node.js 24 ขึ้นไป และ npm

```powershell
git clone https://github.com/thanapatchoos-max/Amasaki-Docs.git
cd Amasaki-Docs
npm ci
Copy-Item .env.example .env
node ace generate:key
node ace migration:run
npm run dev
```

เปิด http://localhost:3333 โดยใช้ค่า `HOST` และ `PORT` ใน `.env`

หากต้องการข้อมูลสาธิต ให้รัน `node ace db:seed` บนฐานข้อมูลสำหรับพัฒนาเท่านั้น
Seeder จะล้างข้อมูลเดิมและสร้างข้อมูลจำลองใหม่ บัญชีสาธิต ได้แก่
`admin`, `manager`, `engineer` และ `test` ใช้รหัสผ่าน `password123`
บัญชีและปุ่มเข้าสู่ระบบสาธิตมีไว้สำหรับการพัฒนา

## โครงสร้างโปรเจกต์

```text
app/                 Controllers, models, services และ middleware
database/            Migrations และ seeders
inertia/             React pages, layouts และ components
resources/views/     HTML layout
start/               Routes และการตั้งค่าขณะเริ่มระบบ
tests/               การตั้งค่าทดสอบ
```

ไฟล์ `.env`, ฐานข้อมูลในเครื่อง, ไฟล์อัปโหลด, `node_modules` และไฟล์ build
ไม่รวมอยู่ใน repository ให้สร้าง `.env` จาก `.env.example` เมื่อติดตั้งใหม่

## คำสั่ง

```powershell
npm run dev
npm run build
npm run typecheck
npm run lint
npm test
```

สถานะตรวจสอบ ณ 2 พฤศจิกายน 2026: Typecheck ยังไม่ผ่านจากข้อผิดพลาดเดิม
เช่น unused imports, types ใน seeders และไฟล์เดิมที่อ้างอิง Next.js
โปรเจกต์ยังต้องแก้ไขข้อผิดพลาดเหล่านี้ก่อนยืนยัน production build
