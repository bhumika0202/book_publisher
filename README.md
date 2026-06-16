# 📚 Book Publisher Management System

<div align="center">

### A modern backend application for managing books, categories, users, and orders.

Built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

</div>

---

## 🚀 Overview

The **Book Publisher Management System** is a backend application designed to streamline book publishing and management workflows. It provides secure authentication, role-based authorization, book and category management, order processing, and a scalable REST API architecture.

The project follows clean coding practices with a modular folder structure, validation, and database management using Prisma ORM.

---

## ✨ Features

* 🔐 JWT Authentication
* 👤 Role-Based Authorization
* 📚 Book Management (Create, Read, Update, Delete)
* 🗂️ Category Management
* 📦 Order Management
* ✅ Request Validation with Joi
* ☁️ Cloudinary Image Upload Integration
* 📁 File Uploads using Multer
* 🗄️ PostgreSQL Database
* 🔄 Prisma ORM
* 🛡️ Secure REST APIs
* ⚡ Modular & Scalable Project Structure
* 🌱 Environment Variable Configuration

---

## 🛠️ Tech Stack

| Technology              | Purpose              |
| ----------------------- | -------------------- |
| Node.js                 | Runtime Environment  |
| Express.js              | Backend Framework    |
| JavaScript (ES Modules) | Programming Language |
| PostgreSQL              | Database             |
| Prisma ORM              | Database ORM         |
| JWT                     | Authentication       |
| Joi                     | Request Validation   |
| Multer                  | File Upload          |
| Cloudinary              | Image Storage        |

---

## 📂 Project Structure

```text
src/
│
├── controllers/
├── routes/
├── middleware/
├── validations/
├── services/
├── prisma/
├── utils/
├── config/
└── app.js
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/book-publisher.git
```

### Navigate to the project

```bash
cd book-publisher
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=your_database_url

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PORT=5000
```

### Run Prisma Migration

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

---

## 📖 Core Modules

* Authentication
* User Management
* Book Management
* Category Management
* Order Management
* Image Upload Management

---

## 🔒 Security Features

* JWT-based Authentication
* Protected Routes
* Role-Based Access Control
* Input Validation
* Secure Environment Variables

---

## 🎯 Learning Outcomes

This project helped strengthen knowledge of:

* Backend Architecture
* REST API Development
* Authentication & Authorization
* Database Design
* Prisma ORM
* PostgreSQL
* File Upload Handling
* Clean Code Practices
* Modular Project Structure

---

## 📈 Future Improvements

* Payment Gateway Integration
* Email Notifications
* Search & Filtering
* Pagination
* Book Reviews & Ratings
* Admin Dashboard
* API Documentation with Swagger

---

## 🤝 Contributing

Contributions, ideas, and suggestions are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is created for learning, portfolio, and educational purposes.

---

## 👩‍💻 Author

**Bhumika Parmar**

* Full Stack Developer
* MERN Stack Enthusiast
* Passionate about building scalable web applications

⭐ If you found this project useful, consider giving it a star.
