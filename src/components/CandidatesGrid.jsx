import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Chip, Typography, Box, Paper, Button, Stack } from "@mui/material";
import useCandidates from "../hooks/useCandidates";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DataGrid from "./common/DataGrid";
import { ExportToExcel } from "../utils/ExportToExcel";
export default function CandidatesGrid({ onDataLoaded }) {
  const { jobId } = useParams();
  const {
    candidatesData = [],
    candidatesLoading,
    initCandidates,
  } = useCandidates();

  useEffect(() => {
    initCandidates(jobId);
  }, [jobId]);

  /* 🔹 Send data to parent for export */
  useEffect(() => {
    if (onDataLoaded) {
      onDataLoaded(candidatesData || []);
    }
  }, [candidatesData, onDataLoaded]);
  const handleExportExcel = () => {
    if (!Array.isArray(candidatesData) || candidatesData.length === 0) return;
    
    // Define fields to export with their display labels - only selected fields
    const fieldsToExport = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "experience_years", label: "Experience (Years)" },
      { key: "education_level", label: "Education" },
      { key: "skills", label: "Skills" },
      { key: "match_score", label: "Match %" },
      { key: "status", label: "Status" },
      { key: "reasoning", label: "Reasoning" },
      { key: "location", label: "Location" },
    ];
    
    ExportToExcel(candidatesData, "Candidates_Report", fieldsToExport);
  };
  const styles = {
    // container: {
    //     p: 3,
    //     bgcolor: "#f8f9fa",
    //     minHeight: "100vh",
    // },
    paper: {
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid rgba(0,0,0,0.08)",
    },
    dataGrid: {
      border: "none",
      "& .MuiDataGrid-columnHeaders": {
        bgcolor: "#f1f5f9",
        color: "#475569",
        fontSize: "0.875rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
      "& .MuiDataGrid-row": {
        "&:hover": {
          bgcolor: "#f8fafc",
        },
        cursor: "pointer",
      },
      "& .MuiDataGrid-cell": {
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        color: "#334155",
        fontSize: "0.9rem",
      },
      "& .MuiDataGrid-virtualScroller": {
        bgcolor: "#ffffff",
      },
      "& .MuiDataGrid-footerContainer": {
        borderTop: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
      },
    },
    statusChip: {
      fontWeight: 600,
      fontSize: "0.75rem",
      height: "24px",
      borderRadius: "6px",
      textTransform: "capitalize",
    },
  };

  const statusStyles = {
    shortlisted: { bg: "#dcfce7", color: "#166534" },
    rejected: { bg: "#fee2e2", color: "#991b1b" },
    pending: { bg: "#fef3c7", color: "#92400e" },
  };

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Candidate Name",
        flex: 1.2,
        minWidth: 160,
        renderCell: (params) => (
          <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.4,
        minWidth: 200,
        renderCell: (params) => (
          <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "phone",
        headerName: "Phone",
        flex: 0.8,
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "experience_years",
        headerName: "Exp (Yrs)",
        type: "numberColumn",
        flex: 0.7,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "skills",
        headerName: "Skills",
        flex: 1.1,
        minWidth: 180,
        renderCell: (params) => (
          <Typography
            variant="body2"
            noWrap
            title={params.value}
            sx={{ fontSize: "0.85rem", color: "#475569", maxWidth: 160 }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: "match_score",
        headerName: "Match %",
        type: "numberColumn",
        flex: 0.7,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            sx={{
              fontWeight: "0.85rem",
              color:
                params.value > 70
                  ? "#16a34a"
                  : params.value > 40
                    ? "#d97706"
                    : "#dc2626",
            }}
          >
            {params.value}%
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.9,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            sx={{
              ...styles.statusChip,
              bgcolor: statusStyles[params.value]?.bg || "#f1f5f9",
              color: statusStyles[params.value]?.color || "#475569",
              minWidth: 80,
            }}
          />
        ),
      },
      // {
      //     field: "reasoning",
      //     headerName: "Reasoning",
      //     flex: 1.8,
      //     minWidth: 240,
      //     renderCell: (params) => (
      //         <Typography
      //             variant="body2"
      //             noWrap
      //             title={params.value}
      //             sx={{ fontSize: "0.85rem", color: "#64748b", fontStyle: "italic", maxWidth: 220 }}
      //         >
      //             {params.value}
      //         </Typography>
      //     ),
      // },
    ],
    [],
  );

  return (
    <Box sx={styles.container}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportExcel}
          disabled={!candidatesData.length}
        >
          Export Excel
        </Button>
      </Stack>

      <Paper elevation={0} sx={styles.paper}>
        <DataGrid
          rows={candidatesData}
          columns={columns}
          loading={candidatesLoading}
          pageSize={13}
          pagination
          disableRowSelectionOnClick
          autoHeight={false}
          height="85vh"
          sx={styles.dataGrid}
        />
      </Paper>
    </Box>
  );
}
