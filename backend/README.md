# PathXpert Backend

A robust Node.js/Express backend for the PathXpert application, providing secure API endpoints for user authentication, report management, and path navigation features.

## 🚀 Features

- User Authentication with Firebase
- Report Creation and Management
- Real-time Push Notifications
- Geolocation Services
- MongoDB Integration
- Secure API Endpoints

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB
- Firebase Account
- npm or yarn

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pathxpert-backend.git
   cd pathxpert-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your environment variables:
     - MongoDB URI
     - Firebase credentials
     - JWT secret
     - Port number

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/history` - Get user history

## 🔒 Security

- JWT Authentication
- Firebase Authentication
- Request Rate Limiting
- Input Validation
- Error Handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
pathxpert-backend/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Custom middlewares
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── utils/         # Helper functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Express.js
- MongoDB
- Firebase
- Node.js community #   P a t h X p e r t  
 