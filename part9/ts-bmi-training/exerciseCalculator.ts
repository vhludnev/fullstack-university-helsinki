import { isNotNumber } from "./utils";

type Rating = 1 | 2 | 3;

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExercArguments = (args: string[]): number[] => {
  if (args.length < 4) throw new Error("Not enough arguments");

  if (args.slice(2).every((a) => !isNotNumber(a))) {
    return [...args.slice(2).map((a) => Number(a))];
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const calculateExercises = (array: number[]) => {
  const [target, ...days] = array;
  const hoursTotalTrainedArray = days.filter((d) => d > 0);

  const averageHoursTrainedPerDay =
    hoursTotalTrainedArray.reduce((a, b) => a + b, 0) / days.length;

  const rating: Rating =
    averageHoursTrainedPerDay > 3 ? 3 : averageHoursTrainedPerDay < 1.5 ? 1 : 2;

  let text = "";

  switch (rating) {
    case 1:
      text = "you can do be better than that";
      break;
    case 2:
      text = "not too bad but could be better";
      break;
    case 3:
      text = "outstanding";
      break;
    default:
      text = "";
  }

  return console.log({
    periodLength: days.length,
    trainingDays: hoursTotalTrainedArray.length,
    success: averageHoursTrainedPerDay > 2 ? true : false,
    rating,
    ratingDescription: text,
    target,
    average: averageHoursTrainedPerDay,
  } as Result);
};

try {
  const { ...args } = parseExercArguments(process.argv);

  calculateExercises(Object.values(args) as number[]);
} catch (error: unknown) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
