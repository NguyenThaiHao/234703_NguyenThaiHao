# 234703_NguyenThaiHao

## 1. Gioi thieu
Ung dung quan ly thiet bi phong hoc tren nen tang web.

## 2. Cong nghe
- Frontend: React
- Backend: Node.js va Express
- Database: MongoDB Atlas
- Quan ly ma nguon: GitHub
- Dong goi: Docker
- Trien khai: Render

## 3. Cau truc du an
- backend/: Ma nguon backend
- frontend/: Ma nguon frontend
- README.md: Tai lieu du an
- .gitignore: Cac tep Git bo qua

## 4. Chuc nang
- Xem danh sach thiet bi phong hoc
- Xem chi tiet thiet bi
- Them, cap nhat va xoa thiet bi
- Tim kiem theo ma, ten, loai thiet bi hoac phong hoc
- Theo doi tinh trang: Dang su dung, Hu hong, Dang sua chua, Ngung su dung

## 5. Database
- Database: 234703_NguyenThaiHao
- Collection: devices

## 6. Tac gia
- Ho ten: Nguyen Thai Hao
- MSSV: 234703

## 7. Bao mat
Khong dua mat khau, access token hoac tep .env len GitHub.

## 8. Chay ung dung

Tao file `backend/.env` voi cac bien `PORT`, `MONGODB_URI` va `CLIENT_URL`.

```bash
cd backend
npm install
npm start
```

Mo terminal moi de chay frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend cung cap API tai `http://localhost:5000` va frontend tai `http://localhost:5173`.

## 9. API thiet bi

- `GET /api/devices`
- `GET /api/devices/:id`
- `POST /api/devices`
- `PUT /api/devices/:id`
- `DELETE /api/devices/:id`
- `GET /api/devices?search=projector`
- `GET /health`
