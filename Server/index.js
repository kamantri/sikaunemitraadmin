import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';
 import routes from './routes/index.js';


// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
 app.use('/api', routes);
 
// Add middleware for JSON content type validation
// routes.use((req, res, next) => {
//   if (req.method === 'POST' && !req.is('application/json')) {
//     return res.status(400).json({
//       status: "error",
//       message: "Content-Type must be application/json"
//     });
//   }
//   next();
// });
// Basic route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const altPort = PORT + 1;
    console.log(`Port ${PORT} is in use, trying port ${altPort}...`);
    app.listen(altPort, () => {
      console.log(`Server is running on port ${altPort}`);
    });
  }
});
