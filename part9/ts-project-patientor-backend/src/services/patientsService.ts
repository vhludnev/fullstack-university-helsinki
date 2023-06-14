import { Patient, InputPatientEntry } from "../types";
import patientsData from "../../data/patients";
import { NonSensitivePatientEntry } from "../types";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientsData;

const getPatients = (): NonSensitivePatientEntry[] => {
  return patientsData.map(({ ssn: _ssn, ...rest }) => ({
    ...rest,
  }));
};

const addPatient = (entry: InputPatientEntry): Patient => {
  const newPatientEntry: Patient = {
    id: uuid(),
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getPatients,
  addPatient,
};
