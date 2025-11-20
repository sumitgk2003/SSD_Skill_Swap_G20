import dotenv from "dotenv";
// Load environment variables before importing other modules
dotenv.config({
  path: "src/.env",
});
import connectDB from "./db/index.js";
import { server } from "./app.js";

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!!", err);
  });
