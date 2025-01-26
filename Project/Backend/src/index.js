import connectDB from './db/index.js';
import dotenv from 'dotenv';
import { app } from './aap.js'; // Add this line to import the app

dotenv.config({
    path: './.env'
});

// Connect to MongoDB
connectDB()

.then(() => {
    app.listen(process.env.PORT  || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log('Error connecting to MongoDB:', error);
})


