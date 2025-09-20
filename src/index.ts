import express from "express";
import connectDB from "./config/db";

import userRoutes from "./routes/userRoutes";
import couponRoutes from "./routes/couponRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();
// Routes
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
