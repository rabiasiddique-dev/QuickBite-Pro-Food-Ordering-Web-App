# QuickBite Pro

**Smart Restaurant Ordering & Management Platform**

A modern, full-featured restaurant ordering and management web app built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — fast dev server & bundler
- **Tailwind CSS** — utility-first styling with custom design tokens
- **Framer Motion** — premium animations
- **React Router v7** — client-side routing
- **React Query v5** — data fetching & caching
- **React Hook Form** + **Zod** — forms & validation
- **Recharts** — analytics charts
- **Lucide React** — icons

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format source files with Prettier |
| `npm run type-check` | TypeScript type checking only |

## Project Structure

```
src/
├── components/
│   ├── atoms/        # Button, Input, Typography, Loading, ProtectedRoute
│   ├── molecules/    # Navbar, Sidebar, Card, Modal, Drawer, SearchBox
│   └── organisms/   # CartDrawer, LoginModal, RegisterModal
├── contexts/         # AuthContext, CartContext, ThemeContext
├── data/             # mockData (menu items, orders, etc.)
├── pages/            # All route-level page components
├── services/         # authService
├── types/            # TypeScript type definitions
├── App.tsx
├── main.tsx
└── index.css
```

## Features

- 🏠 Landing page with animations and food showcase
- 🍔 Smart menu with search & category filters
- 🛒 Shopping cart with drawer UI
- 💳 Multi-step checkout with JazzCash / EasyPaisa / COD
- 📦 Order tracking with live status updates
- 👤 Customer dashboard with profile, order history & rewards
- 🛠️ Admin dashboard with analytics, food & order management
- 🌙 Dark mode support
- 📱 Fully responsive (mobile-first)
