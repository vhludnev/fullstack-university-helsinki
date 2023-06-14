import express from "express";
import cors from "cors";
import patientsRouter from "./src/routes/patients";
import diagnosesRouter from "./src/routes/diagnoses";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// app.get("/ping", (_req, res) => {
//   console.log("someone pinged here");
//   res.send("pong");
// });

app.use("/api/patients", patientsRouter);
app.use("/api/diagnoses", diagnosesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
