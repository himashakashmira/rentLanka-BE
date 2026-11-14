import mongoose, { Schema, Document } from "mongoose";

// booking interface
export interface IBooking extends Document {
  item_id: mongoose.Types.ObjectId;
  item_title: string;
  renter_name: string;
  renter_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string; // Pending, Confirmed, Rejected
  createdAt: Date;
}

// booking schema
const BookingSchema: Schema = new Schema(
  {
    item_id: { type: Schema.Types.ObjectId, ref: "Item" },
    item_title: { type: String, required: true },
    renter_name: { type: String, required: true },
    renter_phone: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    total_price: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

// export booking model
export default mongoose.model<IBooking>("Booking", BookingSchema);