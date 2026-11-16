import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  category: string;
  description: string;
  price_per_day: number;
  security_deposit: number;
  location: string;
  image_url: string;
  images?: string[];
  contact_number: string;
  is_available: boolean;
  rating?: number;
  reviews_count?: number;
  owner_name?: string;
  owner_id?: mongoose.Types.ObjectId;
  specs?: Record<string, string>;
  inclusions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price_per_day: { type: Number, required: true, min: 0 },
    security_deposit: { type: Number, default: 20000, min: 0 },
    location: { type: String, required: true, trim: true },
    image_url: { type: String, default: "" },
    images: { type: [String], default: [] },
    contact_number: { type: String, default: "" },
    is_available: { type: Boolean, default: true },
    rating: { type: Number, default: 4.9 },
    reviews_count: { type: Number, default: 18 },
    owner_name: { type: String, default: "RentLanka Verified Host" },
    owner_id: { type: Schema.Types.ObjectId, ref: "User" },
    specs: { type: Map, of: String, default: {} },
    inclusions: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);

