import express from "express";
import { calculateExercises } from "./exerciseCalculator";
import { isNotNumber } from "./utils";

interface Data {
  target: number;
  daily_exercises: number[];
}

const app = express();
app.use(express.json());

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body as Data;

  if (daily_exercises.length < 7 || !target) {
    return res.status(400).send({
      error: "parameters missing",
    });
  }

  if (daily_exercises.some((a) => isNotNumber(a)) || isNotNumber(target)) {
    return res.status(400).send({
      error: "malformatted parameters",
    });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = calculateExercises(daily_exercises, target);

    return res.json({ ...result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "server error" });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
