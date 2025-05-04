# Task Management API

A comprehensive RESTful API for task management built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- CRUD operations for tasks
- Task filtering, sorting, and searching
- Dashboard analytics (priority distribution, completion rate, upcoming deadlines)
- API documentation with Swagger
- Secure password hashing with bcrypt
- Input validation with express-validator
- Security headers with Helmet

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone git@github.com:Gitsandu/taskmanagementBackend.git

   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=d9bX2hD7ZqNwS3mQvYl5B8e4JrU1K6vGqHc0ZxTtMpWnAoLdFiUsXeRgYjCnVmKp
   FRONTEND_URL=http://localhost:5713
   ```

   Notes:
   - If using MongoDB Atlas, replace the MONGO_URI with your connection string
   - Adjust FRONTEND_URL to match your frontend application URL

## Running the Application

### Development mode:
```
npm run dev
```

### Production mode:
```
npm start
```

The server will start on the port specified in your .env file (default: 5000).
- API Documentation: http://localhost:5000/api-docs

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token

### Tasks

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks for logged-in user
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Dashboard

- `GET /api/dashboard/priority-distribution` - Get task count by priority
- `GET /api/dashboard/completion-rate` - Get completion rate over time
- `GET /api/dashboard/upcoming-deadlines` - Get tasks with upcoming deadlines

For detailed API documentation, refer to:
- Swagger UI: http://localhost:5000/api-docs
- [API Documentation](./api-documentation.md)

## Project Structure

```
backend/
├── config/             # Configuration files
│   ├── db.js           # Database connection
│   └── swagger.js      # Swagger configuration
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── taskController.js
│   └── dashboardController.js
├── middleware/         # Custom middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── models/             # Mongoose models
│   ├── Task.js
│   └── User.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── dashboardRoutes.js
├── utils/              # Utility functions
│   └── generateToken.js
├── .env                # Environment variables
└── server.js           # Entry point
```

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Input validation is performed using express-validator
- Security headers are set using Helmet
- CORS is configured to allow only the frontend application
- Environment variables are used for sensitive information

## Frontend Integration

For detailed instructions on how to integrate with a frontend application, refer to the [API Documentation](./api-documentation.md) file.

## Development

### Adding New Features

1. Create/modify models in the `models` directory
2. Create/modify controllers in the `controllers` directory
3. Create/modify routes in the `routes` directory
4. Update Swagger documentation in route files

### Testing the API

You can test the API using:
- Swagger UI at http://localhost:5000/api-docs
- Postman or similar API testing tools
- curl commands

Example curl command for login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check that the MONGO_URI in your .env file is properly formatted
- Verify network connectivity to your MongoDB instance

### JWT Authentication Issues

- Ensure the JWT_SECRET in your .env file is set
- Check that the token is being sent in the Authorization header as "Bearer [token]"
- Verify that the token hasn't expired

## Contact

For any questions or support, please contact [mbsandu21@gmail.com].
