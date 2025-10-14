import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import booksRoutes from "./routes/booksRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

import { notFound } from "./middlewares/notFound.js";

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
app.use("/api/cart", cartRoutes);

app.use(notFound);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App lister on port ${PORT}`);
  });
});
