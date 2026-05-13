# 🎓 Student Feedback System

A full-stack role-based student feedback platform that enables students to submit course feedback anonymously, while faculty and admins can view meaningful insights and visual reports.

Built with **React**, **Node.js**, **Express**, and **MySQL**.

---



---

## 📌 Features

### 👤 Student
- Role-based login
- Select semester & view subjects
- Submit feedback:
  - **Theory + Teacher**
  - **Practical + Teacher**
  - **Course-only**
- Feedback is recorded **anonymously**

### 👨‍🏫 Faculty
- Login to personalized dashboard
- View anonymous feedback trends
- Track performance across subjects
- Export feedback reports as CSV

### 🛠️ Admin
- Manage all feedback and user roles
- See global feedback stats and trends
- Access complete faculty/course reports
- Export any dataset to CSV

---




---

### Frontend
- ⚛️ React.js
- 🌬️ Tailwind CSS
- 📊 Recharts
- 🔐 React Router + Context API

### Backend
- 🟢 Node.js
- 🚀 Express.js
- 🗃️ MySQL
- 🔒 JWT Authentication

---

## 🗂️ Project Structure
```bash
INTERSHIP_NG/
├── student_feedback/                  # React client
│   ├── public/
│   ├── src/
│   │   ├── assets/                    # Logos, background images
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/                # Header, Sidebar (shared)
│   │   │   ├── faculty/               # Recharts components
│   │   │   └── student/               # SubjectTable, etc.
│   │   ├── context/                   # AuthContext.js
│   │   ├── data/                      # Dummy course/subject data
│   │   ├── Pages/
│   │   │   ├── Admin/
│   │   │   ├── Faculty/
│   │   │   └── Student/               # Login, Dashboard, Settings, FeedbackForm
│   │   ├── routes/                    # ProtectedRoute.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── tailwind.config.js
│   ├── package.json
│   └── README.md
├── server/                            # Express backend
│   ├── login_routes/                  # Role-based login routes
│   ├── db.js                          # MySQL connection config
│   └── server.js                      # Express server entry
├── .gitignore
├── LICENSE
└── README.md                          # You're reading it 😉
```

## ⚙️ Setup Instructions

### 🧑‍💻 Prerequisites
- Node.js and npm installed
- MySQL Server installed and running
- (Optional) Postman or ThunderClient for API testing

### 📦 Backend Setup (`/server`)
1. Navigate to server directory:
```bash
cd server
npm install

```
## Configure MySQL Database:
```bash
CREATE DATABASE feedback_system;
```
## Create .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=feedback_system

### Start backend server:
 ```bash
node server.js
```

## Navigate to frontend directory:
   ```bash
   cd student_feedback
   npm install
   npm start
   ```
