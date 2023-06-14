import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import { ReactNode, useState, useEffect } from "react";
import diagnoseService from "../services/diagnoses";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const WrapperCard = ({
  entry,
  children,
  header,
}: {
  entry: Entry;
  children?: ReactNode;
  header?: ReactNode;
}) => {
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom component="div">
            {entry.date} {header}
          </Typography>
          <Typography style={{ fontStyle: "italic" }}>
            {entry.description}
          </Typography>
          {children}
          <Typography variant="body2">
            diagnose by {entry.specialist}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };
    fetchDiagnoses();
  }, []);

  const diagnosesCodeName = (code: Diagnosis["code"]) => {
    const diagnosis = diagnoses?.find((d) => d.code === code);
    if (diagnosis) return diagnosis.name;
  };

  return (
    <WrapperCard entry={entry}>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        {entry.diagnosisCodes?.map((code) => (
          <ListItem key={code} sx={{ display: "list-item", p: 0 }}>
            <ListItemText primary={`${code} ${diagnosesCodeName(code)}`} />
          </ListItem>
        ))}
      </List>
    </WrapperCard>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => (
  <WrapperCard entry={entry} header={<MedicalServicesIcon />}>
    <FavoriteIcon
      style={{
        color:
          entry.healthCheckRating === 0
            ? "green"
            : entry.healthCheckRating === 1
            ? "yellow"
            : entry.healthCheckRating === 2
            ? "orange"
            : "red",
      }}
    />
  </WrapperCard>
);

const OccupationalEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => (
  <WrapperCard
    entry={entry}
    header={
      <>
        <WorkIcon /> {entry.employerName}
      </>
    }
  ></WrapperCard>
);

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
