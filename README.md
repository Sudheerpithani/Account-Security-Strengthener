🔐 Account Security Strengthener
📌 Project Description

Account Security Strengthener is a secure authentication web application designed to improve password management and account protection in banking systems.
The platform enforces strong password policies, implements OTP-based two-factor authentication, and ensures secure session management using modern security standards.

The goal is to reduce weak authentication practices while maintaining a smooth and user-friendly experience for bank customers and IT security teams.

🛠️ Tech Stack
Frontend

React.js

React Router

Axios

React Toastify (notifications)

CSS (custom styling)

Backend

Node.js

Express.js

MongoDB (Mongoose ORM)

JWT (JSON Web Tokens)

bcrypt (password hashing)

Nodemailer (OTP email delivery)

Security & Deployment

OTP-based Two-Factor Authentication

JWT-based session management

Environment variables for secrets

Cloud-ready (AWS / GCP / Azure compatible)

🚀 How to Run the Project
1️⃣ Clone the Repository
git clone <your-repo-url>
cd account-security-strengthener

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASS=your_email_app_password


Start the backend server:

npm start


Backend will run on:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend will run on:

http://localhost:3000

🔐 Security Features
✅ Strong Password Enforcement

Minimum 8 characters

Must include:

Letters

Numbers

Special characters

Validated on both frontend and backend

✅ Secure Password Storage

Passwords are hashed using bcrypt

Plain-text passwords are never stored

Resistant to brute-force and rainbow table attacks

✅ OTP-Based Two-Factor Authentication (2FA)

OTP sent to registered email during login

OTP required before accessing dashboard

OTP expires automatically after a fixed time

✅ OTP Resend & Expiration Control

Old OTPs are invalidated after expiration

New OTP generated on resend

Prevents OTP reuse and abuse

✅ JWT-Based Authentication

JWT issued after OTP verification

Protected routes require valid token

Unauthorized users redirected to login

✅ Protected Dashboard

Access allowed only for authenticated users

Token validation on page load

Secure logout clears session data

📊 Compliance & Standards

Designed according to NIST SP 800-63B digital identity guidelines

Implements multi-factor authentication

Follows secure credential handling practices

Conclusion

Account Security Strengthener provides a robust, scalable, and secure authentication system suitable for banking and financial applications. It significantly enhances account protection while maintaining usability and compliance with modern security standards.
