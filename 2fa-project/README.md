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

