import { StreamAgent } from "../api/agent/stream/route";
import express from "express";

const PORT = 8080;
const app = express();

app.use(express.json());

app.get("/api/agent/stream", StreamAgent);

app.listen(PORT, () => console.log("Hello"));

