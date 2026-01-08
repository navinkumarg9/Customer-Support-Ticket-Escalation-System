📌 Customer Support Ticket Escalation System

🔗 Live Website:
https://customer-support-ticket-escalation.netlify.app/

🔗 GitHub Repository:
https://github.com/navinkumarg9/Customer-Support-Ticket-Escalation-System

📖 Project Overview

The Customer Support Ticket Escalation System is a full-stack web application designed to manage customer support tickets efficiently.
It allows users to create tickets, track status, and enables admins to assign agents and escalate tickets when required.

This project follows a modern full-stack architecture with a React frontend and a Spring Boot backend, deployed on cloud platforms.

✨ Features
👤 User

Register and login

Create support tickets

View ticket status and details

🧑‍💼 Admin

View all tickets

Assign tickets to agents

Escalate tickets

Monitor ticket progress

🧑‍🔧 Agent

View assigned tickets

Update ticket status

🛠️ Tech Stack
Frontend

React

React Router

Axios

HTML5, CSS3, JavaScript

Deployed on Netlify

Backend

Java

Spring Boot

Spring Security

JPA / Hibernate

Deployed on Render

MySQL

Deployed on Railway

📂 Frontend – README.md
📁 Frontend Folder Structure
frontend/
 ├── src/
 ├── public/
 ├── dist/
 ├── index.html
 ├── package.json
 └── .env

⚙️ Frontend Setup (Local)
1️⃣ Clone Repository
git clone https://github.com/navinkumarg9/Customer-Support-Ticket-Escalation-System.git

2️⃣ Navigate to Frontend
cd frontend

3️⃣ Install Dependencies
npm install

4️⃣ Configure Environment Variables

Create a .env file:

VITE_API_BASE_URL=http://localhost:8080

5️⃣ Run Development Server
npm run dev

🚀 Frontend Deployment (Netlify)
npm run build


Upload dist/ folder to Netlify
OR

Connect GitHub repo directly to Netlify

📂 Backend – README.md
📁 Backend Folder Structure
helpdesk/
 ├── src/main/java
 ├── src/main/resources
 ├── pom.xml
 ├── Dockerfile
 └── application.properties

⚙️ Backend Setup (Local)
1️⃣ Navigate to Backend
cd helpdesk

2️⃣ Configure Database

Update application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/helpdesk
spring.datasource.username=root
spring.datasource.password=your_password

3️⃣ Run Application
mvn spring-boot:run


Backend will start at:

http://localhost:8080

🔐 API Security

JWT based authentication

Role-based access (USER, ADMIN, AGENT)

🌐 Deployment
Backend

Hosted on Render / Railway

Uses cloud MySQL database

Frontend

Hosted on Netlify

Connected to backend via REST APIs

🧪 Sample Credentials (Optional)
Admin:
email: admin@gmail.com
password: admin123

User:
email: user@gmail.com
password: user123

📌 Future Enhancements

Email notifications

Ticket priority SLA tracking

Dashboard analytics

AI-based ticket categorization

👨‍💻 Author

Navinkumar G
🔗 GitHub: https://github.com/navinkumarg9
