import { useState, useEffect } from 'react';
import API from '../services/api';
import { Appointment } from '../types';

export function useAppointments(endpoint: string) {
    const [data, setData] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const res = await API.get(endpoint);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { refresh(); }, [endpoint]);

    return { data, loading, refresh };
}