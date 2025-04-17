
# EduNep Backend

Backend API server for the EduNep education platform.

## Setup Instructions

### Prerequisites
- Node.js 14.x or higher
- MySQL 5.7 or higher

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
```
npm install
```
4. Create a `.env` file in the root of the backend directory and add your configuration:
```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=edunep

# Server Configuration
PORT=4000

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key
```

5. Create the database and tables:
```
mysql -u root -p < db-init.sql
```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login`: Login with email and password
- `POST /api/auth/register`: Register a new user

### Users
- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get user by ID
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user (admin only)

### Notes
- `GET /api/notes`: Get all notes
- `GET /api/notes/:id`: Get note by ID
- `POST /api/notes`: Create a new note (auth required)
- `PUT /api/notes/:id`: Update a note (auth required)
- `DELETE /api/notes/:id`: Delete a note (auth required)
- `PATCH /api/notes/:id/pin`: Toggle pin status (auth required)
- `PATCH /api/notes/:id/availability`: Toggle availability (auth required)

### Courses
- `GET /api/courses`: Get all courses
- `GET /api/courses/:id`: Get course by ID
- `POST /api/courses`: Create a new course (auth required)
- `PUT /api/courses/:id`: Update a course (auth required)
- `DELETE /api/courses/:id`: Delete a course (auth required)
- `POST /api/courses/:id/lessons`: Add lesson to course (auth required)
- `PUT /api/courses/:courseId/lessons/:lessonId`: Update a lesson (auth required)
- `DELETE /api/courses/:courseId/lessons/:lessonId`: Delete a lesson (auth required)
