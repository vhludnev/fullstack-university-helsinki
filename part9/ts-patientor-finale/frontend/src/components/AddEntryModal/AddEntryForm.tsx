import { useState, useEffect, SyntheticEvent } from "react";

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import diagnoseService from "../../services/diagnoses";

import { PatientEntryFormValues, Entry, Diagnosis } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: PatientEntryFormValues) => void;
}

interface EntryTypeOptions {
  value: Entry["type"];
  label: string;
}

const entryTypeOptions: EntryTypeOptions[] = [
  { value: "HealthCheck", label: "Health check" },
  { value: "OccupationalHealthcare", label: "Occupational healthcare" },
  { value: "Hospital", label: "Hospital" },
];

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [discharge, setDischarge] = useState({ date: "", criteria: "" });
  const [sickLeave, setSickLeave] = useState({ startDate: "", endDate: "" });
  const [employerName, setEmployerName] = useState("");
  const [formType, setFormType] =
    useState<PatientEntryFormValues["type"]>("HealthCheck");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Array<Diagnosis["code"]>
  >([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };
    fetchDiagnoses();
  }, []);

  const handleDiagnosisChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      type: formType,
      description,
      date,
      specialist,
      healthCheckRating,
      discharge,
      employerName,
      sickLeave,
      diagnosisCodes,
    });
  };

  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        onSubmit={addEntry}
      >
        <InputLabel style={{ marginTop: 20 }}>Entry type</InputLabel>
        <Select
          label="Entry type"
          fullWidth
          value={formType}
          onChange={({ target }) =>
            setFormType(target.value as PatientEntryFormValues["type"])
          }
        >
          {entryTypeOptions.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Date"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true /* , required: true  */ }}
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        {formType === "HealthCheck" && (
          <TextField
            label="Healthcheck rating"
            fullWidth
            type="number"
            InputProps={{ inputProps: { min: 0, max: 3 } }}
            value={healthCheckRating}
            onChange={({ target }) =>
              setHealthCheckRating(Number(target.value))
            }
          />
        )}
        {formType === "Hospital" && (
          <>
            <TextField
              label="Discharge Date"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true /* , required: true  */ }}
              value={discharge.date}
              onChange={({ target }) =>
                setDischarge({ ...discharge, date: target.value })
              }
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              placeholder="Criteria"
              value={discharge.criteria}
              onChange={({ target }) =>
                setDischarge({ ...discharge, criteria: target.value })
              }
            />
          </>
        )}
        {formType === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              placeholder="Employer name"
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Sick Leave (Start Date)"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true /* , required: true  */ }}
              value={sickLeave.startDate}
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, startDate: target.value })
              }
            />
            <TextField
              label="Sick Leave (End Date)"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true /* , required: true  */ }}
              value={sickLeave.endDate}
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, endDate: target.value })
              }
            />
          </>
        )}

        <InputLabel style={{ marginTop: 10 }}>Diagnoses</InputLabel>
        <Select
          label="Diagnosis codes"
          fullWidth
          multiple
          renderValue={(selected) => selected.join(", ")}
          value={diagnosisCodes}
          onChange={handleDiagnosisChange}
        >
          {diagnoses.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              <Checkbox checked={diagnosisCodes.indexOf(option.code) > -1} />
              <ListItemText primary={`${option.code}: ${option.name}`} />
            </MenuItem>
          ))}
        </Select>

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
