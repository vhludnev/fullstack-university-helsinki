import { Entry, InputPatientEntry, NewEntry } from "./../types";
import { Patient } from "../types";
import patientsData from "../../data/patients";
import { NonSensitivePatient } from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): NonSensitivePatient[] => {
  return patientsData.map(({ ssn: _ssn, ...rest }) => ({
    ...rest,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patientsData.find((p) => p.id === id);
  if (!patient) {
    throw new Error("No patient found");
  }
  return patient;
};

const addPatient = (newPatient: InputPatientEntry): Patient => {
  const addedPatient: Patient = {
    id: uuid(),
    ...newPatient,
  };

  return addedPatient;
};

const addPatientEntry = (id: Patient["id"], newEntry: NewEntry): Patient => {
  const patient = getPatient(id) as Patient;

  const newPatientEntry = {
    id: uuid(),
    ...newEntry,
  };

  patient.entries = [...(patient.entries as Entry[]), newPatientEntry];
  return patient;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  addPatientEntry,
};
