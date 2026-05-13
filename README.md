# 🎓 Student Feedback System

A full-stack role-based student feedback platform that enables students to submit course feedback anonymously, while faculty and admins can view meaningful insights and visual reports.

Built with **React**, **Node.js**, **Express**, and **MySQL**.

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
student-feedback/
├── student_feedback/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── _redirects
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── faculty/
│   │   │   └── student/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── Pages/
│   │   │   ├── Admin/
│   │   │   ├── Faculty/
│   │   │   └── Student/
│   │   ├── routes/
│   │   │   └── ProtectedRoute.js
│   │   ├── App.js
│   │   └── index.js
│   ├── backend/
│   │   └── server/
│   │       ├── dashboard_routes/
│   │       ├── login_routes/
│   │       ├── database_queries/
│   │       │   ├── Schema.sql
│   │       │   └── StoredProcedure.sql
│   │       ├── db.js
│   │       ├── server.js
│   │       └── package.json
│   ├── package.json
│   └── tailwind.config.js
├── netlify.toml
├── README.md
├── LICENSE
└── .gitignore

```

## ⚙️ Setup Instructions

### 🧑‍💻 Prerequisites
- Node.js and npm installed
- MySQL Server installed and running
- (Optional) Postman or ThunderClient for API testing

Setup Instructions

1. Clone Project

git clone https://github.com/PranathiR73/student-feedback.git
cd student-feedback
2. Setup MySQL Database

Open MySQL and run:

CREATE DATABASE student_feedback;
USE student_feedback;
Then run the SQL file:

student_feedback/backend/server/database_queries/Schema.sql
3. Backend Setup

Go to backend folder:

cd student_feedback/backend/server
npm install
Create .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_feedback
PORT=3001
Start backend:

npm start
Backend runs at:

http://localhost:3001
4. Frontend Setup

Open another terminal:

cd student_feedback
npm install
npm start
Frontend runs at:

http://localhost:3000
