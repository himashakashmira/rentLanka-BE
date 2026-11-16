import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  icon: string;
  count: string;
  description: string;
  image_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: "category" },
    count: { type: String, default: "0 items" },
    description: { type: String, default: "" },
    image_url: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

