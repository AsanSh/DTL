# Telegram WebApp

A full-stack application with React frontend and Express backend for handling request forms in a Telegram WebApp.

## Project Structure

```
.
├── frontend/           # React + TypeScript + Tailwind CSS
├── backend/           # Express.js server
└── package.json       # Root package.json for managing both parts
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup

1. Install dependencies for all parts:
```bash
npm run install:all
```

## Development

To run both frontend and backend in development mode:

```bash
npm run dev
```

- Frontend will be available at: http://localhost:5173
- Backend will be available at: http://localhost:4000

## Production

To run the application in production mode:

```bash
npm run start
```

## Features

- Telegram WebApp integration
- Form validation with React Hook Form
- Responsive design with Tailwind CSS
- Express backend with CORS support
- Request logging
- TypeScript support 