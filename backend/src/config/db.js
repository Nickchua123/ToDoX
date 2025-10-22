import mongoose from "mongoose";

// lệnh lọc an toàn cho mongoose
mongoose.set("sanitizeFilter", true); 

// kết nối CSDL MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Liên kết CSDL thành công!");
  } catch (error) {
    console.error("Lỗi khi kết nối CSDL:", error);
    process.exit(1); // exit with error
  }
};

