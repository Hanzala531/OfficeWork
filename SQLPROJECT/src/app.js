// app.js
import express from 'express';
import {router} from './routes/userRoutes.js';
import { checkConnection } from './config/db.js';
import createAllTable from './utils/dbUtils.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.listen(3000, async() => {
  console.log('Server running on port 3000');
  try {
    await checkConnection();
    await createAllTable();
  } catch (error) {
    console.log("Failed to initialize the database",error);
    
  }
  app.use('/api/users', router); // Use user routes for API calls
});

