

---

# 📚 E-Learning LMS Platform

An advanced **Learning Management System (LMS)** built with **FastAPI** (backend) and **React** (frontend). The platform supports three user roles—**Admin**, **Teacher**, and **Student**—and provides a complete set of tools for managing courses, assignments, attendance, grading, and analytics.

---

## 🚀 Features

### 👤 User Roles

1. **Admin**

   * Manage users (create, update, delete)
   * Oversee courses and assignments
   * Access system-wide reports and analytics

2. **Teacher**

   * Create and manage courses
   * Assign and grade assignments
   * Mark and monitor student attendance
   * View student performance reports

3. **Student**

   * Enroll in courses
   * Submit assignments
   * View grades and feedback
   * Monitor attendance and course progress

---

### 🔧 Core Functionalities

* **Course Management**: Add, update, delete courses; assign teachers and students
* **Assignments**: Teachers can create, assign, and grade assignments
* **Attendance Tracking**: Teachers can record and view student attendance
* **Grading System**: Provide assignment and exam scores with feedback
* **Authentication**: Secure login with JWT and role-based access control
* **Reports & Analytics**: Visual reports for grades, attendance, and performance
* **Certificates**: Auto-generate certificates on course completion

---

## 🛠️ Tech Stack

### Backend

* **Framework**: FastAPI
* **Database**: MongoDB
* **Authentication**: JWT-based
* **Dependencies**:

  * `uvicorn==0.22.0`
  * `motor==3.5.1`
  * `pydantic==1.10.21`
  * `pymongo==4.8.0`
  * `python-jose==3.3.0`
  * `passlib==1.7.4`
  * `python-multipart==0.0.6`
  * `email-validator==2.0.0`
  * `python-dotenv==1.0.0`
  * `bcrypt==4.0.1`
  * `Authlib` (ensure compatibility with FastAPI)

> **⚠️ Troubleshooting FastAPI:**
> Ensure your Python version is 3.9+ and that dependencies match the versions listed above.

### Frontend

* **Framework**: React
* **Getting Started**:

  ```bash
  npm install
  npm start
  ```

### Deployment

* **Cloud Ready**: AWS, Azure, Heroku
* **Docker**: Included Dockerfile for easy containerization and deployment

---

## ⚙️ Installation

### Prerequisites

* Python 3.9+
* MongoDB
* Node.js & npm
* Docker (optional)

### 🧪 Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/awais7012/E-learning-LMS.git
cd E-learning-LMS
```

#### 2. Backend Setup

```bash
python -m venv venv
# For Windows:
venv\Scripts\activate
# For Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

* Setup your `.env` file with MongoDB credentials.
* Run the backend:

```bash
python ./backend/main.py
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

> Follow the project’s coding standards and write tests when applicable.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

