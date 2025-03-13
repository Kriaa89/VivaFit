import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from "./config/mongoose.config.js";
import router from "./routes/post.routes.js";


const app = express();
app.use(express.json(), cors());
dotenv.config();

const PORT = process.env.PORT || 8080;

app.use("/api/posts", router);
dbConnect();

app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);