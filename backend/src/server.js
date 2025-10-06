import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import booksRoutes from "./routes/booksRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/books", booksRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/users", usersRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App lister on port ${PORT}`);
  });
});
