import diagnosesData from "../../data/diagnoses";
import { Diagnose } from "../types";

const getDiagnoses = (): Diagnose[] => {
  return diagnosesData;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnose,
};
