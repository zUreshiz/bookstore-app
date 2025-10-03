import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.put("/user", (req, res) => {
  res.send("PUT request");
});

app.post("/", (req, res) => {
  res.send("POST request");
});

app.delete("/user", (req, res) => {
  res.send("DELETE request");
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App lister on port ${port}`);
  });
});
