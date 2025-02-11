import { Box } from "@mui/material";
import SupplierDetails from "../../components/SupplierForm/SupplierDetails";

const Profile = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "2rem",
      }}
    >
      <SupplierDetails />
    </Box>
  );
};

export default Profile;
