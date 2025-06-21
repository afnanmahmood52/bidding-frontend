# 🎯 Auction Frontend (React + Vite)

This is the **frontend** for a real-time auction platform built with **React**, **Vite**, **Tailwind CSS**, and **Socket.IO**. It connects to a NestJS backend and supports real-time bidding with elegant UI and feedback using toast notifications.

---

## 🚀 Features

- 🧾 View auction items with live highest bids
- 💸 Place new bids
- 🕒 Live updates via WebSocket (no polling)
- ✅ Toast messages for success/error feedback
- 🎨 Tailwind CSS for modern styling
- 🐳 Fully Dockerized

---

## 🧱 Tech Stack

- React (Hooks)
- Vite
- Tailwind CSS
- Socket.IO (Client)
- React Hot Toast
- Docker

---

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
2. Environment Setup
Create a .env file in the root with the following content:

env
Copy
Edit
VITE_BACKEND_URL=http://localhost:3000
This should point to your backend server. If you're using Docker Compose, it may be http://backend:3000 inside the Docker network.

3. Run Development Server
bash
Copy
Edit
npm run dev
Visit: http://localhost:5173

🐳 Docker Setup
🗂 Folder Structure
bash
Copy
Edit
frontend/
├── Dockerfile
├── docker-compose.yml
├── .env
├── package.json
└── src/
📄 Dockerfile
Dockerfile
Copy
Edit
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
📄 docker-compose.yml
yaml
Copy
Edit
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - '5173:80'
    environment:
      VITE_BACKEND_URL: ${VITE_BACKEND_URL}
🧪 Testing
Make sure the backend is running (locally or via Docker).

Make sure the VITE_BACKEND_URL points to your backend.

Run docker compose up --build.

Visit: http://localhost:5173