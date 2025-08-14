import express from "express";
import "dotenv/config";
import cors from "cors";
import taskRoutes from "./Routes/taskRoutes.js";

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use("/api/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.send("welcome to my todo-app");
});


app.listen(PORT, () => console.log(`server is running on ${PORT}`));
