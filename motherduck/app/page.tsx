"use client"

import { MotherDuckClientProvider, useMotherDuckClientState } from "@/lib/motherduck/context/motherduckClientContext";
import HintComponent from "./components/hint";
import { useCallback, useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/Map'), {
    ssr: false,
    loading: () => <p>Loading map...</p>
});

const SQL_QUERY_STRING = `
SELECT 
    "Incident Datetime",
    "Incident Category",
    "Incident Description",
    Latitude,
    Longitude,
    "Police District"
FROM 
    sf_crime_stats.data
WHERE 
    Latitude IS NOT NULL 
    AND Longitude IS NOT NULL
LIMIT 1000;
`;

interface CrimeDataPoint {
    datetime: string;
    category: string;
    description: string;
    latitude: number;
    longitude: number;
    policeDistrict: string;
}

const useFetchCrimeData = () => {
    const { safeEvaluateQuery } = useMotherDuckClientState();
    const [error, setError] = useState<string | null>(null);

    const fetchCrimeData = useCallback(async () => {
        try {
            const safeResult = await safeEvaluateQuery(SQL_QUERY_STRING);
            if (safeResult.status === "success") {
                setError(null);
                return safeResult.result.data.toRows().map((row) => {
                    return {
                        datetime: row["Incident Datetime"]?.valueOf() as string,
                        category: row["Incident Category"]?.valueOf() as string,
                        description: row["Incident Description"]?.valueOf() as string,
                        latitude: row.Latitude?.valueOf() as number,
                        longitude: row.Longitude?.valueOf() as number,
                        policeDistrict: row["Police District"]?.valueOf() as string,
                    };
                });
            } else {
                setError(safeResult.err.message);
                return [];
            }
        } catch (error) {
            setError("fetchCrimeData failed with error: " + error);
            return [];
        }
    }, [safeEvaluateQuery]);

    return { fetchCrimeData, error };
}

function CrimeMap() {
    const { fetchCrimeData, error } = useFetchCrimeData();
    const [crimeData, setCrimeData] = useState<CrimeDataPoint[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const result = await fetchCrimeData();
            setCrimeData(result);
            setLoading(false);
        };
        fetch();
    }, [fetchCrimeData]);

    if (error) return <div className="text-red-500 p-5">{error}</div>;
    if (loading) return <div className="p-5">Loading...</div>;

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">SF Crime Statistics Map</h1>
            <Map crimeData={crimeData} />
        </div>
    );
}

export default function Home() {
    return (
        <div>
            <MotherDuckClientProvider>
                <CrimeMap />
                <HintComponent />
            </MotherDuckClientProvider>
        </div>
    );
}
