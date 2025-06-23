Book Hub
Book Hub is a web application for managing a personal book library, enabling users to perform CRUD (Create, Read, Update, Delete) operations on book entries. It features user authentication, Cloudinary image uploads, and a responsive UI built with modern technologies.
Features

User Authentication: Register and log in to manage your book collection securely.
CRUD Operations:
Create: Add books with fields like title, author, genre, synopsis, publication date, ISBN, pages, language, publisher, rating, and cover image.
Read: Browse books with search (title, author, synopsis) and filter (genre, author) capabilities, view detailed book pages.
Update: Edit book details (restricted to the user who added the book).
Delete: Remove books (restricted to the user who added the book).
Responsive UI: Designed with Tailwind CSS for seamless desktop and mobile experiences.
State Management: Uses Redux Toolkit for efficient state handling.
Search & Pagination: Filter books and navigate paginated results.
Genres: Fetch and display available genres for book categorization.

Tech Stack

Frontend: React, TypeScript, Vite, Redux Toolkit, React Router (v6.14.0), React Hook Form, Tailwind CSS, Lucide React (icons), React Hot Toast
Backend: Express, TypeScript, MongoDB, Mongoose, Cloudinary, Multer, JSON Web Token, Express Validator
Development Tools: Node.js, npm, MongoDB Community Server

Node.js: v18 or higher
MongoDB: Community Server running on mongodb://localhost:27017
Cloudinary Account: For image uploads
npm: For package management

Setup Instructions

Clone the Repository:
git clone(https://github.com/mbienaimee/Book-Hub)
cd Book-Hub

Backend Setup:

Navigate to the backend directory:cd backend

Install dependencies:npm install express mongoose cloudinary multer jsonwebtoken express-validator cors dotenv @types/express @types/multer @types/jsonwebtoken ts-node typescript

Create a .env file in backend/ with:MONGO_URI=mongodb://localhost:27017/bookhub
JWT_SECRET=your_jwt_secret
PORT=5000

Replace your_cloud_name, your_api_key, and your_api_secret with your Cloudinary credentials, and your_jwt_secret with a secure string.
Start MongoDB:mongod

Start the backend server:npm run dev

The server runs on http://localhost:5000.

Frontend Setup:

Navigate to the frontend directory:cd ../frontend

Install dependencies:npm install react react-dom react-router-dom@6.14.0 @reduxjs/toolkit react-redux axios react-hook-form tailwindcss lucide-react react-hot-toast @types/react @types/react-dom @vitejs/plugin-react typescript vite

Create a .env file in frontend/ with:VITE_API_URL=http://localhost:5000/api

Start the frontend development server:npm run dev

The app runs on http://localhost:5173.

Verify Setup:

Open http://localhost:5173 in a browser.
Register a user, log in, and test CRUD operations (see below).

Testing CRUD Operations
To verify CRUD functionality in the browser:

Register/Login:

Navigate to /register to create an account, then log in at /login.
Verify: Successful login redirects to /.

Create Book:

Go to /add-book (requires login).
Enter required fields: title, author, synopsis, publication date, genre, language.
Optionally add: ISBN, pages, publisher, rating, cover image (JPEG/PNG, <5MB).
Submit the form.
Verify: Book appears on the homepage (/). Check backend logs for POST /api/books success. If a 500 error occurs, see troubleshooting.

Read Books:

On the homepage (/), view all books with pagination.
Use the search bar (title/author/synopsis) and filters (genre/author).
Click "View Details" to see a book’s details at /books/:id.
Verify: Books load correctly, filters work, and details page displays all fields (e.g., ISBN, rating, language).

Update Book:

On the homepage, click the edit icon (pencil) for a book you added.
Modify fields and submit.
Verify: Changes appear on the homepage and details page. Check backend logs for PUT /api/books/:id success.

Delete Book:

On the homepage, click the delete icon (trash) for a book you added.
Verify: Book is removed from the homepage. Check backend logs for DELETE /api/books/:id success.

Genres:

On /add-book or /edit/:id, verify the genre dropdown populates correctly.
Verify: Check backend logs for GET /api/books/genres success.

Troubleshooting

POST /api/books 500 Error:
Check backend logs (backend terminal) for details (e.g., Cloudinary upload failure, validation errors, MongoDB issues).
Verify Cloudinary credentials in backend/.env.
Ensure MongoDB is running (mongod) and the bookhub database is accessible.
In the browser, open DevTools (F12) → Console, check FormData in AddBookPage.tsx to confirm all required fields are sent.

Navigation Issues:
Ensure Header.tsx links (/, /add-book, /login, /register) match routes in App.tsx.
Verify react-router-dom@6.14.0 to avoid compatibility issues.

CORS Errors:
Confirm cors middleware is enabled in server.ts.

Frontend Errors:
Check browser DevTools → Console for Redux or API errors.
Ensure VITE_API_URL in frontend/.env matches http://localhost:5173/.

Autocomplete Warnings:
LoginPage.tsx and RegisterPage.tsx include autoComplete attributes to suppress browser warnings.

Backend Dependencies
{
"dependencies": {
"express": "^4.18.2",
"mongoose": "^7.0.0",
"jsonwebtoken": "^9.0.0",
"express-validator": "^7.0.1",
"cors": "^2.8.5",
"dotenv": "^16.0.3"
},
"devDependencies": {
"@types/express": "^4.17.17",
"@types/multer": "^1.4.7",
"@types/jsonwebtoken": "^9.0.1",
"ts-node": "^10.9.1",
"typescript": "^5.0.2"
}
}

Frontend Dependencies
{
"dependencies": {
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-router-dom": "6.14.0",
"@reduxjs/toolkit": "^1.9.5",
"react-redux": "^8.0.5",
"axios": "^1.4.0",
"react-hook-form": "^7.43.9",
"tailwindcss": "^3.3.2",
"lucide-react": "^0.263.0",
"react-hot-toast": "^2.4.1"
},
"devDependencies": {
"@types/react": "^18.2.15",
"@types/react-dom": "^18.2.7",
"@vitejs/plugin-react": "^4.0.0",
"typescript": "^5.0.2",
"vite": "^4.4.5"
}
}
=======

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
