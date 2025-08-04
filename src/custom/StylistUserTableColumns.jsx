import { DeleteOutline, Visibility } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Chip, Button, Switch, CircularProgress } from "@mui/material";
import { CheckCircle2, Eye, PlusCircle, Trash2 } from "lucide-react";
import { CustomIconButton } from "./Button";

export const stylistUserTableColumns = ({
  handleToggleStatus,
  handleDelete,
  handleView,
  togglingIds,
}) => [
    { field: "fullName", headerName: "Name" },
    { field: "email", headerName: "Email", width: 220 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "gender",
      headerName: "Gender",
      // width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.gender || "N/A"}
          size="small"
          variant="filled"
          sx={{
            bgcolor:
              params.row.gender?.toLowerCase() === "male"
                ? "info.main"
                : params.row.gender?.toLowerCase() === "female"
                  ? "pink"
                  : "grey.600",
            color: "white",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        />
      ),
    },
    { field: "dob", headerName: "DOB" },
    { field: "createdAt", headerName: "Created" },
    {
      field: "approved",
      headerName: "Approved",
      renderCell: (params) => {
        const isLoading = togglingIds?.[params.row.id];
        const currentStatus = params.row.approved;

        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            {isLoading ? (
              <CircularProgress size={20} color="success" />
            ) : (
              <Switch
                checked={currentStatus}
                onChange={(event) => {
                  event.stopPropagation();
                  handleToggleStatus(params.row.id, currentStatus); // pass current status
                }}
                onClick={(event) => event.stopPropagation()}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#2B3990',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#2B3990',
                  },
                }}
                size="large"
              />
            )}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <CustomIconButton
            size="small"
            icon={<Eye size={16} color="white" />}
            color="rgb(77 141 225)"
            onClick={() => handleView(params.row)}
          />
          <CustomIconButton
            size="small"
            icon={<Trash2 size={16} />}
            color="hsl(0 84.2% 60.2%)"
            onClick={() => handleDelete(params.row.id)}
          />
        </Box>
      ),
    },
  ];
