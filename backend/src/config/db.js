// backend/src/config/db.js
import mongoose from "mongoose";

mongoose.set('sanitizeFilter', true); // sanitize filter on Mongoose queries

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

    console.log("Liên kết CSDL thành công!");
  } catch (error) {
    console.error("Lỗi khi kết nối CSDL:", error);
    process.exit(1); // exit with error
  }
};
