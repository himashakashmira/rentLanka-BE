import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGO_LOCAL_URL ||
    "mongodb+srv://himashakashmira7_db_user:Rentlanka1234@cluster0.5wwmvdh.mongodb.net/rentlanka_db?retryWrites=true&w=majority";

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(` MongoDB Connection Warning: ${error.message}`);
    console.log("ℹ️ Server running with resilient fallback.");
  }
};

export default connectDB;

