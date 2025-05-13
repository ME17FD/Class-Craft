# 🎓 ClassCraft - University Management System

ClassCraft is a modern, full-stack web application designed to manage a university's academic structure. It provides administrators with powerful tools to manage users, classrooms, modules, schedules, and more, while giving professors and students real-time access to their information and timetables.

## 🛠️ Technologies Used

### Backend (Java - Spring Boot)
- Spring Boot
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- MySQL
- ModelMapper
- Maven

### Frontend (React + TypeScript)
- React + Vite
- TypeScript
- Axios
- React Router
- @react-pdf/renderer
- jsPDF + jspdf-autotable
- xlsx
- Tailwind CSS or Bootstrap (choose based on your styling)

---

## 📚 Features

### 👤 User Management
- Admin login with full access
- Roles: `ROLE_ADMIN`, `ROLE_PROFESSOR`, `ROLE_STUDENT`
- JWT-based authentication & authorization

### 🏫 Academic Structure
- Manage Students, Professors, Groups, and Filieres
- Assign Professors to Modules and SubModules
- Create and manage Courses and Sceances (sessions)

### 🗓️ Timetable & Scheduling
- Dynamic Timetable generation
- Associate TimetableEntries with Classrooms, Courses, Days, and Time Slots
- Prevent conflicts during classroom reservations

### 📁 File Export
- Export Timetables and Reports to:
  - PDF (via @react-pdf/renderer and jsPDF)
  - Excel (via xlsx)

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

---

### 🧩 Backend Setup

1. **Clone the project repository and navigate to the backend folder:**

   ```bash
   git clone https://https://github.com/ME17FD/Class-Craft.git
   cd Class-Craft
   ```
Configure the MySQL database connection:

Edit the file src/main/resources/application.properties and update it with your own database credentials:

properties
Copy
Edit
spring.datasource.url=jdbc:mysql://localhost:3306/classcraftdb
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
Start the Spring Boot application:

bash
Copy
Edit
mvn spring-boot:run
The backend will be available at: http://localhost:8080

vbnet
Copy
Edit

Let me know if you also want the frontend setup in the same format.







