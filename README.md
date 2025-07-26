# MERN E-Commerce

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js). This project is for educational and non-commercial use only, licensed under the Educational Community License, Version 2.0 (ECL-2.0).

## Features

- User authentication (signup, login, password reset)
- Admin panel for product management (add, view products)
- Product catalog and search
- Shopping cart and order management
- Order history for users
- Responsive UI built with React and Vite
- RESTful API backend with Node.js and Express
- MongoDB for data storage
- File upload support for product images

## Project Structure

```
mern-e-commerce/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components (admin, authentication, consumer, partials)
│   │   ├── styles/        # CSS Modules for styling
│   │   ├── app.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── config.jsx     # App configuration
│   ├── api/               # API utility files
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
├── server/                # Backend (Node.js + Express)
│   ├── controllers/       # Route controllers (admin, consumer, user)
│   ├── database/          # DB initialization and schemas
│   ├── methods/           # Business logic (cart, product, user, validation)
│   ├── public/            # Static files
│   ├── uploads/           # Uploaded product images
│   ├── main.js            # Server entry point
│   └── package.json       # Backend dependencies
└── LICENSE                # Project license
```

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/sudonitish/mern-e-commerce.git
   cd mern-e-commerce
   ```

2. **Install dependencies:**
   - For the backend:
     ```sh
     cd server
     npm install
     ```
   - For the frontend:
     ```sh
     cd ../client
     npm install
     ```

3. **Configure environment variables:**
   - Create a `.env` file in the `server/` directory for backend configuration (e.g., MongoDB URI, JWT secret).

4. **Start the backend server:**
   ```sh
   cd server
   npm start
   ```

5. **Start the frontend development server:**
   ```sh
   cd client
   npm run dev
   ```

6. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000) (default)

## License

This project is licensed under the Educational Community License, Version 2.0 (ECL-2.0). See the [LICENSE](./LICENSE) file for details.

**Summary:**
- Free for educational and non-commercial use only
- Redistributions must retain the copyright and license
- No warranty is provided

Thank you for using MERN E-Commerce!
