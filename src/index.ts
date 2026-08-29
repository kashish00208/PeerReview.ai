import express from "express";
import ParsePaper from "../app/api/papers/route";
import dotenv from 'dotenv'

dotenv.config()

const port = 8080;
const app = express();

app.use(express.json());

app.post("/api/papers", ParsePaper);

app.listen(port, () => {
    console.log(`BACKEND IS RUNNING ON PORT ${port}`);
});
