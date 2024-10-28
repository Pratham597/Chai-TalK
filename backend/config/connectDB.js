import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn=await mongoose.connect("mongodb://localhost:27017/chatApp");
    console.log(`MongoDb is connected with  ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit()
  }
};
export default connectDB;
