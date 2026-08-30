import { useState } from "react";

const useAPI = (apiFunc) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const extractData = (response) => {
        // Handle different response formats from backend
        // Priority: response.data.data > response.data.result > response.data > response
        let extractedData = null;
        
        if (response?.data?.data !== undefined) {
            extractedData = response.data.data; // Nested format
        } else if (response?.data?.result !== undefined) {
            extractedData = response.data.result; // Alternative nested format
        } else if (response?.data !== undefined) {
            extractedData = response.data; // Direct format
        } else {
            extractedData = response; // Fallback
        }
        
        return extractedData;
    };

    const request = async (...args) => {
        setLoading(true);
        try {
            const response = await apiFunc(...args);
            const extractedData = extractData(response);
            setData(extractedData);
            return response;
        } catch (err) {
            setError(err);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const resetData = () => {
        setData(null);
        setError("");
        setLoading(false);
    };

    return {
        data,
        error,
        loading,
        request,
        resetData,
        setData,
    };
};

export default useAPI;
