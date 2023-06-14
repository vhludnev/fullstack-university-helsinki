import { isNotNumber } from "./utils";

interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseBmiArguments = (args: string[]): MultiplyValues => {
  if (!isNotNumber(args[0]) && !isNotNumber(args[1])) {
    return {
      value1: Number(args[0]),
      value2: Number(args[1]),
    };
  } else {
    throw new Error("malformatted parameters");
  }
};

export const calculateBmi = (a: string, b: string) => {
  const { value1, value2 } = parseBmiArguments([a, b]);
  const bmi = value2 / ((value1 / 100) ^ 2);

  const printText =
    bmi < 25
      ? "Normal (healthy weight)"
      : bmi >= 30
      ? "Obese (unhealthy weight)"
      : "Overweight";

  return { weight: value2, height: value1, bmi: printText };
};
