import mongoose, { Schema, Document } from "mongoose";

// user interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "host" | "admin";
  createdAt: Date;
}

// user schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["customer", "host", "admin"], 
      default: "customer" 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);