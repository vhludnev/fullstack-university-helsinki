import { Gender, InputPatientEntry } from "./types";

export const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseTextEntry = (text: unknown): string => {
  if (!isString(text)) {
    throw new Error("Incorrect entry: " + text);
  }

  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect gender: " + gender);
  }
  return gender;
};

const validatedPatientEntry = (object: unknown): InputPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: InputPatientEntry = {
      name: parseTextEntry(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseTextEntry(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseTextEntry(object.occupation),
    };

    return newEntry;
  }

  throw new Error("Incorrect data: a field missing");
};

export default validatedPatientEntry;
