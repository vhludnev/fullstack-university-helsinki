import { Male, Female, PersonOutline } from "@mui/icons-material";

import { Gender } from "../types";

interface Props {
  gender: Gender;
}

const GenderIcon: React.FC<Props> = ({ gender }) => {
  switch (gender) {
    case "male":
      return <Male />;
    case "female":
      return <Female />;
    default:
      return <PersonOutline />;
  }
};

export default GenderIcon;
