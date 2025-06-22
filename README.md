# Book Hub - Literary Collection Management System

A full-stack web application for book enthusiasts to discover, manage, and share their favorite books. Built with modern technologies and a beautiful, responsive design.

## Features

### Authentication & User Management

- **User Registration & Login** - Secure JWT-based authentication
- **Protected Routes** - Access control for authenticated users
- **User Profiles** - Personalized user experience

### Book Management

- **Add Books** - Create new book entries with detailed information
- **View Books** - Browse books with beautiful card layouts
- **Edit Books** - Update book information (only by book owners)
- **Delete Books** - Remove books from collection (only by book owners)
- **Book Details** - Comprehensive book information pages

### Discovery & Search

- **Real-time Search** - Search books by title, author, or synopsis
- **Genre Filtering** - Filter books by genre categories
- **Responsive Grid** - Beautiful responsive book grid layout
- **Pagination** - Efficient data loading with pagination

### Media Management

- **Image Upload** - Cloudinary integration for book cover images
- **Image Optimization** - Automatic image resizing and optimization
- **Fallback Images** - Placeholder images for books without covers

### User Experience

- **Responsive Design** - Works perfectly on all devices
- **Beautiful UI** - Warm, literary-themed design
- **Loading States** - Smooth loading indicators
- **Toast Notifications** - User-friendly feedback messages
- **Error Handling** - Comprehensive error management

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety and better development experience
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend

- **React 18** - UI library with latest features
- **TypeScript** - Type safety and better development experience
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Vite** - Fast build tool and development server

## Project Structure

\`\`\`
book-hub/
├── backend/ # Backend API server
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ │ ├── database.ts # MongoDB connection
│ │ │ └── cloudinary.ts # Cloudinary setup
│ │ ├── controllers/ # Route controllers
│ │ │ ├── authController.ts
│ │ │ └── bookController.ts
│ │ ├── middleware/ # Custom middleware
│ │ │ └── auth.ts # Authentication middleware
│ │ ├── models/ # Database models
│ │ │ ├── User.ts # User model
│ │ │ └── Book.ts # Book model
│ │ ├── routes/ # API routes
│ │ │ ├── authRoutes.ts # Authentication routes
│ │ │ └── bookRoutes.ts # Book CRUD routes
│ │ ├── types/ # TypeScript type definitions
│ │ │ └── index.ts # Shared types
│ │ └── server.ts # Express server setup
│ ├── dist/ # Compiled JavaScript (generated)
│ ├── package.json # Backend dependencies
│ ├── tsconfig.json # TypeScript configuration
│ └── .env # Environment variables
├── frontend/ # React frontend application
│ ├── src/
│ │ ├── components/ # Reusable React components
│ │ │ ├── Auth/ # Authentication components
│ │ │ ├── Books/ # Book-related components
│ │ │ ├── Common/ # Shared components
│ │ │ └── Layout/ # Layout components
│ │ ├── pages/ # Page components
│ │ │ ├── HomePage.tsx
│ │ │ ├── LoginPage.tsx
│ │ │ ├── RegisterPage.tsx
│ │ │ └── AddBookPage.tsx
│ │ ├── store/ # Redux store configuration
│ │ │ ├── slices/ # Redux slices
│ │ │ ├── hooks.ts # Typed Redux hooks
│ │ │ └── store.ts # Store configuration
│ │ ├── services/ # API services
│ │ │ └── api.ts # Axios configuration and API calls
│ │ ├── types/ # TypeScript type definitions
│ │ │ └── index.ts # Frontend types
│ │ ├── App.tsx # Main App component
│ │ ├── main.tsx # React entry point
│ │ └── index.css # Global styles
│ ├── public/ # Static assets
│ ├── package.json # Frontend dependencies
│ ├── tsconfig.json # TypeScript configuration
│ ├── tailwind.config.js # Tailwind CSS configuration
│ ├── vite.config.ts # Vite configuration
│ └── index.html # HTML template
└── README.md # Project documentation
\`\`\`

## Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/atlas) or local installation
- **Cloudinary Account** - [Sign up here](https://cloudinary.com/) for image storage

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/mbienaimee/Book-Hub
   cd book-hub
   \`\`\`

2. **Backend Setup**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Frontend Setup**
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

### Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

\`\`\`env

# Server Configuration

PORT=5000
NODE_ENV=development

# JWT Secret (use a strong, random string)

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Cloudinary Configuration

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
\`\`\`

### Running the Application

1. **Start the Backend Server**
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`
   The backend server will start on `http://localhost:5000`

2. **Start the Frontend Development Server**
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`
   The frontend application will start on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`
