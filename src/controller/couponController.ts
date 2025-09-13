import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import * as couponService from "../services/couponService";
import { couponModel } from "../models/couponModel";

export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await couponService.getAllCoupon();
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}

export const useCoupons = async (req: Request, res: Response) => {
    try {
        const { couponCode } = req.body;
        const coupons = await couponService.useCoupons(couponCode);
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}


export const addCoupons = async (req: Request, res: Response) => {
    const file = (req as Request & { file?: Express.Multer.File }).file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const coupons: couponModel[] = [];
    fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (row) => {
            coupons.push({
                serial_number: row.serialNumber,
                authenticate_code: row.authenticateCode,
                status: row.status || "active",
            });
        })
        .on("end", async () => {
            try {
                await couponService.insertManyCoupons(coupons);
                res.status(201).json({ message: "CSV uploaded successfully", count: coupons.length });
            } catch (err) {
                res.status(500).json({ error: (err as Error).message });
            } finally {
                fs.unlinkSync(file.path);
            }
        });
};


