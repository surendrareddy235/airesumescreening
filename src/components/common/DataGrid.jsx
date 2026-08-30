import { DataGrid as MuiDataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";
import { useMemo } from "react";

const DataGrid = (props) => {
    const baseDefaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 120,
            align: "center",
            headerAlign: "center",
            sortable: true,
        };
    }, []);

    const columnTypes = useMemo(() => {
        return {
            dateColumn: {
                type: "dateTime",
                minWidth: 180,
                valueFormatter: (params) =>
                    params.value
                        ? new Date(params.value).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        : "-",
            },
            numberColumn: {
                type: "number",
                align: "right",
                headerAlign: "right",
            },
        };
    }, []);

    /* ---------------- Props API ---------------- */

    const {
        rows = [],
        columns = [],
        height = "80vh",
        width = "100%",
        marginTop = "10px",
        defaultColDef = baseDefaultColDef,
        pagination = true,
        pageSize = 10,
        rowHeight = 48,
        loading = false,
        toolbar = true,
        ...otherProps
    } = props;

    /* ---------------- Merge defaultColDef ---------------- */

    const mergedColumns = useMemo(() => {
        // Defensive check: ensure columns is an array
        if (!Array.isArray(columns)) {
            console.warn("❌ columns is not an array:", columns);
            return [];
        }
        return columns.map((col) => ({
            ...defaultColDef,
            ...col,
        }));
    }, [columns, defaultColDef]);

    return (
        <Box sx={{ height, width, mt: marginTop, position: "relative" }}>
            {/* Loading Overlay (AG Grid style) */}
            {loading && (
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(255,255,255,0.6)",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            <MuiDataGrid
                rows={rows}
                columns={mergedColumns}
                columnTypes={columnTypes}
                rowHeight={rowHeight}
                disableRowSelectionOnClick
                pagination={pagination}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize, page: 0 },
                    },
                }}
                pageSizeOptions={[pageSize]}
                slots={toolbar ? { toolbar: GridToolbar } : {}}
                loading={loading}
                {...otherProps}
            />
        </Box>
    );
};

export default DataGrid;
