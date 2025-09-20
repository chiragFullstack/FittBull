import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import * as couponService from "../services/couponService";
import { ICouponModel } from "../models/couponModel";

/**
 * Get all coupons
 */
export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await couponService.getAllCoupon();
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

/**
 * Use coupon by code
 */
export const useCoupons = async (req: Request, res: Response) => {
    try {
        const { couponCode } = req.body;

        if (!couponCode) {
            return res.status(400).json({ error: "Coupon code is required" });
        }

        const coupon = await couponService.useCoupons(couponCode);
        res.status(200).json({ message: "Coupon applied successfully", coupon });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};

/**
 * Upload CSV file and insert coupons
 */
export const addCoupons = async (req: Request, res: Response) => {
    const file = (req as Request & { file?: Express.Multer.File }).file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const coupons: ICouponModel[] = [];

    fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (row) => {
            coupons.push({
                serial_number: row.serialNumber,
                authenticate_code: row.authenticateCode,
                status: row.status || "active",
            } as ICouponModel);
        })
        .on("end", async () => {
            try {
                await couponService.insertManyCoupons(coupons);
                res
                    .status(201)
                    .json({ message: "CSV uploaded successfully", count: coupons.length });
            } catch (err) {
                res.status(500).json({ error: (err as Error).message });
            } finally {
                fs.unlinkSync(file.path);
            }
        });
};
