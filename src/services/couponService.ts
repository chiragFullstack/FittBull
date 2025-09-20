import Coupon, { ICouponModel } from "../models/couponModel";


export const getAllCoupon = async (): Promise<ICouponModel[]> => {
    try {
        return await Coupon.find().sort({ _id: 1 }); // sort by created order
    } catch (err) {
        throw new Error(`Error fetching coupons: ${(err as Error).message}`);
    }
};


export const useCoupons = async (couponCode: string): Promise<ICouponModel> => {
    try {
        const coupon = await Coupon.findOne({ authenticate_code: couponCode });

        if (!coupon) {
            throw new Error("Coupon code is not matched");
        }

        if (coupon.status !== "active") {
            throw new Error("Coupon is already used");
        }

        coupon.status = "in-active";
        await coupon.save();

        return coupon;
    } catch (err) {
        throw new Error(`Error using coupon: ${(err as Error).message}`);
    }
};



export const insertManyCoupons = async (coupons: ICouponModel[]): Promise<void> => {
    try {
        // Use bulk insert, skip duplicates
        await Coupon.insertMany(coupons, { ordered: false });
    } catch (err: any) {
        if (err.code === 11000) {
            // duplicate key error (unique violation on serial_number)
            console.warn("Duplicate coupon(s) found, skipped...");
        } else {
            throw new Error(`Error inserting coupons: ${(err as Error).message}`);
        }
    }
};