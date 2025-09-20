import mongoose, { Document, Schema } from "mongoose";

export interface ICouponModel extends Document {
    serial_number: string;
    authenticate_code: string;
    status?: string;
}
const CouponSchema: Schema = new Schema({
    serial_number: { type: String, required: true, unique: true },
    authenticate_code: { type: String, required: true },
    status: { type: String, default: "active" }
});

export default mongoose.model<ICouponModel>("Coupon", CouponSchema);

