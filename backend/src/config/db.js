import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Link data success");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
