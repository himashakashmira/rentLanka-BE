import mongoose, { Schema, Document } from "mongoose";

// category interface
export interface ICategory extends Document {
  name: string;
  icon: string;
  description: string;
}

// category schema
const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: "tag" },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);