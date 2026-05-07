# Full Fledged MERN Stack Learning Management System

A complete full-stack Learning Management System built with the MERN stack. The platform supports three roles — Admin, Instructor, and Student — each with dedicated dashboards and role-based access control.

---

## Project Overview

This LMS allows:
- **Students** to register, browse courses, enroll, and watch video lessons
- **Instructors** to create, edit, and delete courses, and upload video lessons via Cloudinary
- **Admins** to manage all users and courses, and view enrollment analytics

---

## Technologies Used

### Frontend
- React.js 19
- React Router 7
- Axios
- Bootstrap 5 & React Bootstrap
- Vite

### Backend
- Node.js
- Express.js 5
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt
- Cloudinary + Multer (video uploads)
- Dotenv

---

## Features

- JWT-based authentication with bcrypt password hashing
- Role-based access control (Admin, Instructor, Student)
- Course creation, editing, and deletion
- Video lesson uploads to Cloudinary
- Student course enrollment
- Enrollment analytics dashboard for admins
- Protected routes on both frontend and backend
- Responsive UI with Bootstrap 5

---

## Project Structure

```
├── LMSBackend/               # Node.js + Express backend
│   └── src/
│       ├── config/           # Database connection
│       ├── controller/       # Route controllers
│       ├── middleware/        # Auth & role middleware
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API routes
│       ├── utils/            # Utility scripts
│       └── server.js         # Entry point
│
└── LearningManagementSystem/ # React frontend
    └── src/
        ├── components/       # Reusable UI components
        ├── context/          # Auth context
        ├── pages/            # Page components
        ├── routes/           # Route definitions & guards
        └── services/         # Axios API service functions
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

---

### 2. Backend Setup

```bash
cd LMSBackend
npm install
```

Create a `.env` file in the `LMSBackend/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lms
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Create the admin user (first time only):

```bash
npm run create-admin
```

---

### 3. Frontend Setup

```bash
cd LearningManagementSystem
npm install
```

Create a `.env` file in the `LearningManagementSystem/` folder:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

---

### 4. Access the App

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT |

### Courses
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/courses | Get all courses | Public |
| GET | /api/courses/:id | Get course by ID | Public |
| POST | /api/courses | Create a course | Instructor |
| PUT | /api/courses/:id | Update a course | Instructor, Admin |
| DELETE | /api/courses/:id | Delete a course | Instructor, Admin |

### Lessons
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/lessons | Upload a lesson | Instructor |
| GET | /api/lessons/:courseId | Get lessons for a course | Authenticated |

### Enrollment
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/enroll | Enroll in a course | Student |
| GET | /api/my-courses | Get enrolled courses | Student |
| GET | /api/analytics | Get enrollment analytics | Admin |

### Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/users | Get all users | Admin |
| DELETE | /api/users/:id | Delete a user | Admin |
| GET | /api/users/profile | Get current user profile | Authenticated |

---

## User Roles

| Role | Permissions |
|---|---|
| **Student** | Register, login, browse courses, enroll, view lessons |
| **Instructor** | Create/edit/delete own courses, upload lessons |
| **Admin** | Manage all users & courses, view analytics |

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:5173) |
| `VITE_API_BASE_URL` | Backend API base URL for the frontend |
