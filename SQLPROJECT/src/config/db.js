//Add your database
import mysql2 from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

const pool=mysql2.createPool({
    host:process.env.DB_HOST,
    user:"root",
    password:"hanzala",
    database:"jobportal",
    connectionLimit:10,
    queueLimit:0,
    waitForConnections:true
});

const checkConnection=async()=>{
    try {
        const connection=await pool.getConnection();
        console.log("Database Connection Successfull!!");
        connection.release();
        
    } catch (error) {
        console.log("Error connecting to database!");
        throw error;
        
    }
}

export {pool,checkConnection};