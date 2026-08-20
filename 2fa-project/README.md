# 2FA (OTP via Email) — Working Demo Project

A minimal but complete implementation of Task 7: Two-Factor Authentication using
React + Node.js/Express + Prisma + Resend (email OTP).

## Folder structure
```
2fa-project/
  backend/   Express + Prisma API
  frontend/  React (Vite) app
```

## Setup — Backend

```bash
cd backend
npm install
npm run dev
```
Backend runs at http://localhost:4000

## Setup — Frontend

In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173 (Vite proxies `/api` calls to the backend automatically).

## Screenshots

<img width="822" height="647" alt="Screenshot 2026-08-20 090117" src="https://github.com/user-attachments/assets/a41b9294-0e63-4f31-b889-e5567b8eed5d" />



<img width="785" height="647" alt="Screenshot 2026-08-20 090105" src="https://github.com/user-attachments/assets/b5cc379c-f22f-487d-acee-f72e13170085" />


<img width="842" height="547" alt="Screenshot 2026-08-20 090208" src="https://github.com/user-attachments/assets/714d1091-fbc9-4549-ac33-586ef0ec8b6e" />



<img width="1037" height="507" alt="Screenshot 2026-08-20 090235" src="https://github.com/user-attachments/assets/80fc7751-d9d3-4806-9cc7-79a773ec250b" />



<img width="891" height="533" alt="Screenshot 2026-08-20 090244" src="https://github.com/user-attachments/assets/7209f124-9980-4e69-a80b-ad2852adfb2a" />
