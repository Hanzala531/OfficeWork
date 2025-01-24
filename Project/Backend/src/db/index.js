import mongoose from "mongoose";

try {
await mongoose.connect("mongodb+srv://Hanzala:0987654321@project1.mpisi.mongodb.net/VideoTube?retryWrites=true&w=majority;");
console.log("connected to Mongoose");
}
 
catch (err) {
  console.error(err.message);
  process.exit(1);
}