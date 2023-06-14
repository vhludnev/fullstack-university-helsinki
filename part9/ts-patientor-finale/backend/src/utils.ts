import { BaseEntry } from "../frontend/src/types";
import {
  Diagnosis,
  Discharge,
  Entry,
  Gender,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  InputPatientEntry,
  NewEntry,
  OccupationalHealthcareEntry,
  SickLeave,
  UnionOmit,
} from "./types";

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
  return (
    Object.values(Gender)
      //.map((g) => g.toString())
      .includes(param as Gender)
  );
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect gender: " + gender);
  }
  return gender;
};

const isEntry = (entry: unknown): entry is Entry => {
  return !!entry;
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!Array.isArray(entries) || entries.every((e) => !isEntry(e))) {
    throw new Error("Incorrect entries");
  }
  return entries as Entry[];
};

const isEntryType = (type: unknown): type is Entry["type"] =>
  isString(type) &&
  ["Hospital", "OccupationalHealthcare", "HealthCheck"].includes(type);

const parseEntryType = (type: unknown): Entry["type"] => {
  if (!type || !isEntryType(type)) {
    throw new Error("Incorrect or missing type");
  }
  return type;
};

const parseSickLeave = (sickLeave: {
  startDate: unknown;
  endDate: unknown;
}): SickLeave => {
  if (
    !sickLeave.startDate ||
    !isString(sickLeave.startDate) ||
    !isDate(sickLeave.startDate) ||
    !sickLeave.endDate ||
    !isString(sickLeave.endDate) ||
    !isDate(sickLeave.endDate)
  ) {
    throw new Error("Incorrect or missing date");
  }
  return { startDate: sickLeave.startDate, endDate: sickLeave.endDate };
};

const parseDischarge = (discharge: {
  date: unknown;
  criteria: unknown;
}): Discharge => {
  if (
    !discharge.date ||
    !isString(discharge.date) ||
    !isDate(discharge.date) ||
    !discharge.criteria ||
    !isString(discharge.criteria)
  ) {
    throw new Error("Incorrect or missing date");
  }
  return { date: discharge.date, criteria: discharge.criteria };
};

export const isNumber = (number: unknown): number is number => {
  return typeof number === "number" || number instanceof Number;
};

const isHealthCheckRating = (rating: unknown): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .filter(isNumber)
    .includes(rating as HealthCheckRating);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(rating)) {
    throw new Error("Incorrect Healthcheck rating: " + rating);
  }
  return rating;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const assertBaseEntry = (object: unknown): UnionOmit<BaseEntry, "id"> => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if (
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "diagnosisCodes" in object
  ) {
    return {
      description: parseTextEntry(object.description),
      date: parseDate(object.date),
      specialist: parseTextEntry(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
    };
  }

  throw new Error("Incorrect data: a field missing");
};

const assertHealthCheckEntry = (
  object: unknown
): UnionOmit<HealthCheckEntry, "id"> => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if ("healthCheckRating" in object) {
    return {
      ...assertBaseEntry(object),
      type: "HealthCheck",
      healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
    };
  }
  throw new Error("Incorrect data: the Healthcheck rating field missing");
};

const assertHospitalEntry = (
  object: unknown
): UnionOmit<HospitalEntry, "id"> => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if ("discharge" in object) {
    return {
      ...assertBaseEntry(object),
      type: "Hospital",
      discharge: parseDischarge(object.discharge as Discharge),
    };
  }
  throw new Error("Incorrect data: Discharge date or criteria field missing");
};

const assertOccupationalHealthcareEntry = (
  object: unknown
): UnionOmit<OccupationalHealthcareEntry, "id"> => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if ("employerName" in object && "sickLeave" in object) {
    return {
      ...assertBaseEntry(object),
      type: "OccupationalHealthcare",
      employerName: parseTextEntry(object.employerName),
      sickLeave: parseSickLeave(object.sickLeave as SickLeave),
    };
  }
  throw new Error("Incorrect data: a field missing");
};

export const validatedNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if ("type" in object && parseEntryType(object.type)) {
    switch (object.type) {
      case "HealthCheck":
        return assertHealthCheckEntry(object);
      case "OccupationalHealthcare":
        return assertOccupationalHealthcareEntry(object);
      case "Hospital":
        return assertHospitalEntry(object);
    }
  }

  throw new Error("Incorrect data: a field missing");
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
    "occupation" in object &&
    "entries" in object
  ) {
    const newPatientEntry: InputPatientEntry = {
      name: parseTextEntry(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseTextEntry(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseTextEntry(object.occupation),
      entries: parseEntries(object.entries),
    };

    return newPatientEntry;
  }

  throw new Error("Incorrect data: a field missing");
};

export default validatedPatientEntry;
