import diagnosesData from "../../data/diagnoses";
import { Diagnosis } from "../types";

const getDiagnoses = (): Diagnosis[] => {
  return diagnosesData;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnose,
};
