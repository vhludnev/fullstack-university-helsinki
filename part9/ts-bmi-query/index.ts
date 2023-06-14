import express from "express";
import { calculateBmi } from "./bmiCalculator";

interface Query {
  height: string;
  weight: string;
}

const app = express();

app.get("/bmi", (req, res) => {
  try {
    const { height, weight } = req.query as unknown as Query;
    const bmi = calculateBmi(height, weight);

    res.json(bmi);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res.json({ error });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
