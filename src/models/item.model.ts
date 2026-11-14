import mongoose, { Schema, Document } from "mongoose";

// item interface for typescript
export interface IItem extends Document {
  title: string;
  category: string;
  description: string;
  price_per_day: number;
  location: string;
  image_url: string;
  contact_number: string;
  is_available: boolean;
  createdAt: Date;
}

// mongoose schema
const ItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price_per_day: { type: Number, required: true },
    location: { type: String, required: true },
    image_url: { type: String },
    contact_number: { type: String },
    is_available: { type: Boolean, default: true },
  },
  {
    timestamps: true, // auto create createdAt and updatedAt
  }
);

// export model
export default mongoose.model<IItem>("Item", ItemSchema);