# 🎓 Student Feedback System

A full-stack role-based student feedback platform that enables students to submit course feedback anonymously, while faculty and admins can view meaningful insights and visual reports.

Built with **React**, **Node.js**, **Express**, and **MySQL**.

---

## 🔗 Live Demo
👉 [View Demo](https://your-live-demo-link.com)

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
## 🖼️ Screenshots

### Home Page
<img width="800" alt="Home Page" src="https://github.com/user-attachments/assets/ae63729b-2b72-44d9-9551-fe85b7c854d8" />

### Login Page
<img width="800" alt="Login Page" src="https://github.com/user-attachments/assets/15b77515-078e-4ad4-b704-a3630f83444b" />

### Student Dashboard
<img width="800" alt="Student Dashboard" src="https://github.com/user-attachments/assets/4d62f6b1-2d8f-4fff-9db0-6e26d23dbd66" />

### Faculty Dashboard
<img width="800" alt="Faculty Dashboard" src="https://github.com/user-attachments/assets/b446903f-7ac8-4b04-b1c0-89c69126547b" />

### Admin Dashboard
<img width="800" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/52d83e3c-6558-4827-847b-1e9e38b78aca" />
## 🧰 Tech Stack

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
