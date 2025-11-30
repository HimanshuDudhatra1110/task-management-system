# 📋 Task Management System

A modern, secure full-stack task management application built with the MERN stack (MongoDB, Express.js, React + Vite, Node.js). Features secure HTTP-only cookie authentication, real-time task management, and a beautiful responsive UI.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF)
![Redux](https://img.shields.io/badge/State-Redux_Toolkit-764ABC)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC)

## ✨ Features

### 🔐 Authentication & Security

- **HTTP-only Cookie Authentication** - Secure token storage
- **JWT-based Sessions** - Stateless authentication
- **Password Hashing** - bcrypt with salt rounds
- **Protected Routes** - Client and server-side protection
- **CSRF Protection** - SameSite cookie attributes
- **XSS Protection** - Tokens inaccessible to JavaScript
- **Auto-logout on 401** - Automatic session cleanup

### 📝 Task Management

- **CRUD Operations** - Create, Read, Update, Delete tasks
- **Task Properties:**
  - Title & Description
  - Status (To Do, In Progress, Completed)
  - Priority (Low, Medium, High)
  - Due Date
  - Tags
  - User Assignment
- **Advanced Features:**
  - Real-time search
  - Multiple filters (status, priority)
  - Sorting capabilities
  - Pagination
  - Task statistics dashboard

### 🎨 User Interface

- **Modern Design** - Clean, professional UI with Tailwind CSS
- **Responsive Layout** - Mobile, tablet, and desktop optimized
- **Interactive Components:**
  - Task cards with status indicators
  - Modal dialogs for create/edit
  - Delete confirmation dialogs
  - Toast notifications
  - Loading states
  - Empty states
- **Visual Feedback:**
  - Color-coded priorities
  - Status icons
  - Hover effects
  - Smooth transitions

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **React Toastify** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-system
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your monogo url
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173
```

**Start the backend server:**

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to: `http://localhost:3000`
