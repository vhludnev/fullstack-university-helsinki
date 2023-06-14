import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

import { PatientEntryFormValues, Patient } from "../../types";
import GenderIcon from "../GenderIcon";
import { useParams } from "react-router-dom";

import patientService from "../../services/patients";
import EntryDetails from "../EntryDetails";
import AddEntryModal from "../AddEntryModal";
import axios from "axios";

const PatientDetailPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    if (id) {
      const fetchPatient = async (id: string) => {
        const patient = await patientService.getOne(id);
        setPatient(patient);
      };
      fetchPatient(id);
    }
  }, [id]);

  const submitNewEntry = async (
    values: PatientEntryFormValues
  ): Promise<void> => {
    try {
      const patient = await patientService.addEntry(id as string, values);
      setPatient(patient);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  if (!patient) {
    return null;
  }

  return (
    <div className="App">
      <Typography variant="h5" my={3}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <List>
        <ListItem sx={{ p: 0 }}>
          <ListItemText primary={`ssn: ${patient.ssn}`} />
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemText primary={`occupation: ${patient.occupation}`} />
        </ListItem>
      </List>
      <Box mb={2}>
        <Typography variant="h6" mt={2}>
          entries
        </Typography>
        {patient.entries.length ? (
          patient.entries.map((entry) => (
            <Box key={entry.id} sx={{ pt: 2 }}>
              <EntryDetails entry={entry} />
            </Box>
          ))
        ) : (
          <Typography variant="subtitle1">No Entries</Typography>
        )}
      </Box>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientDetailPage;
