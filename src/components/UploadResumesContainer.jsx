import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Stack,
    Paper,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Fade,
    Alert,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";

import useUploadJob from "../hooks/useUploadJobs";

/* =========================
   VALIDATION SCHEMA
========================= */
const schema = yup.object({
    resumes: yup
        .mixed()
        .required("Please upload at least one resume")
        .test(
            "fileCount",
            "Please upload at least one resume",
            (value) => value?.length > 0
        )
        .test(
            "fileType",
            "Only PDF, DOC, DOCX files are allowed",
            (value) =>
                !value ||
                Array.from(value).every((file) =>
                    [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ].includes(file.type)
                )
        )
        .test(
            "fileSize",
            "Each file must be less than 5MB",
            (value) =>
                !value ||
                Array.from(value).every(
                    (file) => file.size <= 5 * 1024 * 1024
                )
        ),
});

export default function UploadResumesContainer({
    open,
    onClose,
    onUploadCompleted,
}) {
    const { jobId } = useParams();
    const { uploadResumes } = useUploadJob();

    const [showLoader, setShowLoader] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState(
        "Uploading resumes..."
    );
    const [uploadError, setUploadError] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const watchedFiles = watch("resumes");

    /* =========================
       RESET FORM ON MODAL CLOSE
    ========================= */
    useEffect(() => {
        if (!open) {
            reset();
            setShowLoader(false);
            setLoaderMessage("Uploading resumes...");
            setUploadError(null);
        }
    }, [open, reset]);

    /* =========================
       SUBMIT HANDLER
    ========================= */
    const onSubmit = async (data) => {
        setShowLoader(true);
        setLoaderMessage("Uploading resumes...");
        setUploadError(null);

        try {
            await uploadResumes(jobId, data.resumes);

            onClose();            // close modal
            reset();              // clear form
            onUploadCompleted?.();
        } catch (err) {
            console.error("❌ Upload error:", err);
            
            // Extract error message from backend response
            const errorMessage = 
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to upload resumes. Please try again.";
            
            setUploadError(errorMessage);
            setShowLoader(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={showLoader ? undefined : onClose}
                fullWidth
                maxWidth="sm"
                TransitionComponent={Fade}
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        background:
                            "linear-gradient(135deg, #1976d2, #1565c0)",
                        color: "#fff",
                    }}
                >
                    <WorkOutlineIcon />
                    <Typography fontWeight={600} flexGrow={1}>
                        Upload Resumes
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        disabled={showLoader}
                        sx={{ color: "#fff" }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Paper sx={{ p: 3 }}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Stack spacing={2.5}>
                                {errors.resumes && (
                                    <Alert severity="error">
                                        {errors.resumes.message}
                                    </Alert>
                                )}

                                {uploadError && (
                                    <Alert 
                                        severity="error" 
                                        onClose={() => setUploadError(null)}
                                        sx={{ whiteSpace: "pre-wrap" }}
                                    >
                                        {uploadError}
                                    </Alert>
                                )}

                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={
                                        <CloudUploadOutlinedIcon />
                                    }
                                    sx={{
                                        borderStyle: "dashed",
                                        py: 2,
                                    }}
                                    disabled={showLoader}
                                >
                                    Select Resume Files
                                    <input
                                        hidden
                                        type="file"
                                        multiple
                                        {...register("resumes")}
                                    />
                                </Button>

                                {watchedFiles?.length > 0 && (
                                    <Stack spacing={0.5}>
                                        {Array.from(watchedFiles).map(
                                            (file, idx) => (
                                                <Typography
                                                    key={idx}
                                                    variant="body2"
                                                >
                                                    • {file.name}
                                                </Typography>
                                            )
                                        )}
                                    </Stack>
                                )}

                                <Divider />

                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    spacing={2}
                                >
                                    <Button
                                        color="error"
                                        onClick={onClose}
                                        disabled={showLoader}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={showLoader}
                                    >
                                        Upload
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Paper>
                </DialogContent>
            </Dialog>

            {/* LOADER */}
            <Backdrop
                open={showLoader}
                sx={{
                    color: "#fff",
                    zIndex: (theme) =>
                        theme.zIndex.drawer + 999,
                }}
            >
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress color="inherit" />
                    <Typography>{loaderMessage}</Typography>
                </Stack>
            </Backdrop>
        </>
    );
}
