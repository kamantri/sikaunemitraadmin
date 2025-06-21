
import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
const allRouters = express.Router();

// Mount auth routes under /auth
allRouters.use('/auth', authRoutes);
allRouters.use('/auth', userRoutes);


export default allRouters;