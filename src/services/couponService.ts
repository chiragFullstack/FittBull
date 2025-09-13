import { pool } from "../config/db";
import { couponModel } from "../models/couponModel";

export const getAllCoupon = async () => {
    try {
        const result = await pool.query(
            "SELECT id, serial_number, authenticate_code, status FROM couponcode ORDER BY id ASC"
        );
        return result.rows;
    } catch (err) {
        throw new Error(`Error fetching coupons: ${(err as Error).message}`);
    }
}

export const useCoupons = async (couponCode: string) => {
    try {
        const result = await pool.query(
            "SELECT * FROM couponcode WHERE authenticate_code = $1",
            [couponCode]
        );
        if (result.rows.length === 0) {
            throw new Error("Invalid Coupon Code");
        }
        else {
            const coupon = result.rows[0];
            if (coupon.status !== 'active') {
                throw new Error("Coupon code is already used");
            }
            const updatedRecord = await pool.query(
                "UPDATE couponcode SET status = 'in-active' WHERE authenticate_code = $1 RETURNING *",
                [couponCode]
            );
            return updatedRecord.rows[0];
        }
    } catch (err) {
        throw new Error(`Error using coupon: ${(err as Error).message}`);
    }
}


export const insertManyCoupons = async (coupons: couponModel[]) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        for (const coupon of coupons) {
            await client.query(
                `INSERT INTO couponcode (serial_number, authenticate_code, status)
         VALUES ($1, $2, $3)
         ON CONFLICT (authenticate_code) DO NOTHING`,
                [coupon.serial_number, coupon.authenticate_code, coupon.status || "active"]
            );
        }

        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

