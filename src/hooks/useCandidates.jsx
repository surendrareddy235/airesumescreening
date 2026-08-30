import { useState } from "react";
import { getCandidatesApi } from "../api/candidatesApi";
import useDashboard from "./useDashBoard";
export default function useCandidates() {
    const [candidatesData, setCandidatesData] = useState([]);
    const [candidatesLoading, setCandidatesLoading] = useState(false);
    const [pollingLoading, setPollingLoading] = useState(false);
    const { jobRequest } = useDashboard();
    const initCandidates = async (jobId) => {
        try {
            setCandidatesLoading(true);
            const res = await getCandidatesApi(jobId);
            // Ensure data is an array
            const candidatesArray = Array.isArray(res?.data) ? res.data : [];
            setCandidatesData(candidatesArray);
        } catch (err) {
            console.error("❌ Failed to fetch candidates", err);
            setCandidatesData([]);
        } finally {
            setCandidatesLoading(false);
        }
    };

    const pollCandidatesUntilDone = async (jobId) => {
        setPollingLoading(true);
        const POLL_DELAY = 5000;

        try {
            while (true) {
                const res = await jobRequest(jobId);
                const status = res?.data?.status;
                await initCandidates(jobId);
                console.log("⏳ Job Status:", status);

                if (status && status !== "processing") {
                    await initCandidates(jobId);
                    break;
                }

                await new Promise((r) => setTimeout(r, POLL_DELAY));
            }
        } catch (err) {
            console.error("❌ Polling error", err);
        } finally {
            setPollingLoading(false);
        }
    };

    return {
        candidatesData,
        candidatesLoading,
        pollingLoading,
        pollCandidatesUntilDone,
        initCandidates
    };
}
