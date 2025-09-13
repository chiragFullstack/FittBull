import { Router } from "express";
import multer from "multer";
import { addCoupons, getAllCoupons, useCoupons } from "../controller/couponController";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/addNew", upload.single("file"), addCoupons);
router.get("/getAll", getAllCoupons);
router.patch("/updateStatus", useCoupons);


export default router;
