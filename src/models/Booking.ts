import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  item_id: mongoose.Types.ObjectId;
  item_title: string;
  item_image?: string;
  item_location?: string;
  renter_name: string;
  renter_email?: string;
  renter_phone: string;
  renter_nic: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  daily_rate: number;
  total_price: number;
  security_deposit: number;
  platform_fee: number;
  payment_method: string; // 'LankaPay Escrow' | 'Visa / Master' | 'Pay on Pickup / LankaQR'
  booking_reference: string; // e.g. #LK-FX6-9812
  status: "Pending" | "Confirmed" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    item_id: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    item_title: { type: String, required: true },
    item_image: { type: String, default: "" },
    item_location: { type: String, default: "Colombo" },
    renter_name: { type: String, required: true, trim: true },
    renter_email: { type: String, default: "" },
    renter_phone: { type: String, required: true, trim: true },
    renter_nic: { type: String, required: true, trim: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    duration_days: { type: Number, default: 1 },
    daily_rate: { type: Number, default: 0 },
    total_price: { type: Number, required: true },
    security_deposit: { type: Number, default: 20000 },
    platform_fee: { type: Number, default: 0 },
    payment_method: { type: String, default: "LankaPay Escrow" },
    booking_reference: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

