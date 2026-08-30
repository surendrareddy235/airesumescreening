import * as XLSX from "xlsx-js-style";

export const ExportToExcel = (data, filename = "data", fieldsToExport = null) => {
    if (!data || !data.length) return;

    // Filter data to only include specified fields, or use all fields if not specified
    let filteredData = data;
    if (fieldsToExport && Array.isArray(fieldsToExport)) {
        filteredData = data.map((row) => {
            const filtered = {};
            fieldsToExport.forEach((field) => {
                if (field.key in row) {
                    filtered[field.label || field.key] = row[field.key];
                }
            });
            return filtered;
        });
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        const cell = worksheet[cellAddress];

        if (cell) {
            cell.s = {
                fill: { fgColor: { rgb: "4F81BD" } },
                font: { color: { rgb: "FFFFFF" }, bold: true },
                alignment: { horizontal: "center", vertical: "center" },
            };
        }
    }

    worksheet["!autofilter"] = {
        ref: XLSX.utils.encode_range(range),
    };

    const MIN_WIDTH = 12;
    const MAX_WIDTH = 35;

    worksheet["!cols"] = Object.keys(filteredData[0]).map((key) => {
        const maxContentLength = Math.max(
            key.length,
            ...filteredData.map((row) => String(row[key] ?? "").length)
        );

        return {
            wch: Math.min(
                Math.max(maxContentLength + 3, MIN_WIDTH),
                MAX_WIDTH
            ),
        };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    const formattedDateTime = new Date()
        .toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
        })
        .replace(/[/:, ]/g, "_");

    XLSX.writeFile(
        workbook,
        `${filename}_${formattedDateTime}.xlsx`
    );
};
