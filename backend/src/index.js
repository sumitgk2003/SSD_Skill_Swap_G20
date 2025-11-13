import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server, io } from "./app.js";
dotenv.config({
  path: "src/.env",
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!!", err);
  });
