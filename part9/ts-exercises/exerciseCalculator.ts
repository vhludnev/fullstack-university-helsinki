import { isNotNumber } from "./utils";

type Rating = 1 | 2 | 3;

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExercArguments = (daily_exercises: number[], target: number) => {
  if (daily_exercises.length < 7 || !target)
    throw new Error("parameters missing");

  if (daily_exercises.some((a) => isNotNumber(a)) || isNotNumber(target))
    throw new Error("malformatted parameters");

  return {
    daily_exercises: daily_exercises.map((a) => Number(a)),
    target: Number(target),
  };
};

export const calculateExercises = (a: number[], b: number): Result => {
  const { daily_exercises, target } = parseExercArguments(a, b);

  const hoursTotalTrainedArray = daily_exercises.filter((d) => d > 0);

  const averageHoursTrainedPerDay =
    hoursTotalTrainedArray.reduce((a, b) => a + b, 0) / daily_exercises.length;

  const rating: Rating =
    averageHoursTrainedPerDay > 3 ? 3 : averageHoursTrainedPerDay < 1.5 ? 1 : 2;

  let text = "";

  switch (rating) {
    case 1:
      text = "bad";
      break;
    case 2:
      text = "good";
      break;
    case 3:
      text = "outstanding";
      break;
    default:
      text = "";
  }

  return {
    periodLength: daily_exercises.length,
    trainingDays: hoursTotalTrainedArray.length,
    success: averageHoursTrainedPerDay > 2 ? true : false,
    rating,
    ratingDescription: text,
    target,
    average: averageHoursTrainedPerDay,
  } as Result;
};
