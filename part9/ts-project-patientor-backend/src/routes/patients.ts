import express from "express";
import patientsService from "../services/patientsService";
import validatedPatientEntry from "../utils";
const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientsService.getPatients());
});

router.post("/patients", (req, res) => {
  try {
    const newPatientEntry = validatedPatientEntry(req.body);
    const addedEntry = patientsService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
