interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseBmiArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const calculateBmi = (a: number, b: number) => {
  const bmi = b / ((a / 100) ^ 2);

  const printText =
    bmi < 25
      ? "Normal (healthy weight)"
      : bmi >= 30
      ? "Obese (unhealthy weight)"
      : "Overweight";

  console.log(printText);
};

try {
  const { value1, value2 } = parseBmiArguments(process.argv);

  calculateBmi(value1, value2);
} catch (error: unknown) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
