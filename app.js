import express from "express";
import userRouter from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.use("/api/users",userRouter);

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})