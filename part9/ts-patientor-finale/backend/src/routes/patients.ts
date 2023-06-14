import express from "express";
import patientsService from "../services/patientsService";
import validatedPatientEntry, { validatedNewEntry } from "../utils";
const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientsService.getPatients());
});

router.get("/:id", (req, res) => {
  res.send(patientsService.getPatient(req.params.id));
});

router.post("/", (req, res) => {
  try {
    const newPatient = validatedPatientEntry(req.body);
    const addedEntry = patientsService.addPatient(newPatient);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (req, res) => {
  const id = req.params.id;
  try {
    const newPatientEntry = validatedNewEntry(req.body);
    const addedEntry = patientsService.addPatientEntry(id, newPatientEntry);
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
