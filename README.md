# LMS — Learning Management System

A full-stack MERN app with three roles: Student, Instructor, and Admin.

## Stack

- **Frontend** — React 19, React Router 7, Bootstrap 5, Vite
- **Backend** — Node.js, Express, MongoDB, JWT, Cloudinary

## Getting Started

### Backend

```bash
cd LMSBackend
npm install
npm run dev
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

To create the admin account (first time only):

```bash
npm run create-admin
```

### Frontend

```bash
cd LearningManagementSystem
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

App runs at `http://localhost:5173`

## Roles

- **Student** — browse courses, enroll, watch lessons, track progress
- **Instructor** — create and manage courses, upload video lessons
- **Admin** — manage all users and courses, view analytics
