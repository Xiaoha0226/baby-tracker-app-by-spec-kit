# Quick Start Guide: 宝宝成长记录语音版

**Last Updated**: 2026-03-22

## Prerequisites

- Node.js 18+ 
- npm 9+ or pnpm 8+
- Git

## Project Structure

```
baby-tracker-app/
├── backend/                 # NestJS API server
│   ├── src/
│   ├── test/
│   └── data/               # SQLite database
├── frontend/               # Vue 3 + Vite SPA
│   ├── src/
│   └── public/
└── README.md
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file:

```env
# Database
DATABASE_URL=./data/baby-tracker.db

# JWT Secrets
JWT_SECRET=your-jwt-secret-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Service
OPENAI_API_KEY=sk-your-openai-api-key

# Server
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

```bash
mkdir -p data
npm run migration:run
```

### 4. Start Development Server

```bash
npm run start:dev
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=宝宝成长记录
VITE_APP_VERSION=1.0.0
```

### 3. Start Development Server

```bash
npm run dev
```

## Development Workflow

```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Next Steps

1. ✅ Setup complete - both services running
2. Create your first record via voice input
3. Explore statistics dashboard
