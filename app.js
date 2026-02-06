import express from "express";
import userRouter from "./routes/userRoutes.js";

const app = express();

const date = Date.now();
console.log(date);

app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", userRouter);

app.listen(3000, () => console.log("Server running"));