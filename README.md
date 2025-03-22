# E-Learning LMS Platform

An advanced Learning Management System (LMS) built with **FastAPI** for the backend. This platform supports three types of users: **Admin**, **Teacher**, and **Student**, and provides features like course management, assignments, attendance tracking, grading, and more.

## Features

### User Roles
1. **Admin**
   - Manage users (create, update, delete).
   - Manage courses and assignments.
   - View system-wide reports and analytics.
2. **Teacher**
   - Create and manage courses.
   - Assign and grade assignments.
   - Track and manage student attendance.
   - View student performance reports.
3. **Student**
   - Enroll in courses.
   - Submit assignments.
   - View grades and feedback.
   - Track attendance and progress.

### Core Functionalities
- **Course Management**: Create, update, and delete courses. Assign teachers and students to courses.
- **Assignment System**: Teachers can create assignments, and students can submit them. Teachers can grade submissions.
- **Attendance Tracking**: Teachers can mark attendance for students in their courses.
- **Grading System**: Teachers can assign grades for assignments and exams. Students can view their grades.
- **User Authentication**: Secure login and role-based access control.
- **Reports and Analytics**: Generate reports for attendance, grades, and overall performance.
- **Certificates**: on complication of course a certificate is generated and issued to student automaticaly.

## Tech Stack

### Backend
- **FastAPI**: High-performance backend framework for building APIs.
- **Database**: MongoDB
- **Authentication**: JWT-based authentication for secure access.

### Frontend
- Used react for frontend

### Deployment
- **Server**: can Deployed on cloud platforms like AWS, Azure, or Heroku.
- **Containerization**: Dockerized for easy deployment and scalability.

## Installation

### Prerequisites
- Python 3.9+
- FastAPI
- MongoDB
- Docker (optional)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/mE-uMAr/E-learning-LMS.git
   cd E-learning-LMS
   ```

2. Create a virtual environment and install dependencies:
    ```sh
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
3. setup MongoDB 
create a database and connect it by updatiing .env directory

4. Run backend
```sh
python ./backend/main.py
```
### Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

### License
This project is licensed under the MIT License. See the LICENSE file for details.
