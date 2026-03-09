import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

interface Appointment {
    id: number;
    patientName: string;
    appointmentDate: string;
    status: string;
    notes: string;
}

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await API.get('/Appointment/doctor');
            setAppointments(res.data);
        } catch {
            navigate('/login');
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await API.put(`/Appointment/${id}/status`, { status });
            fetchAppointments();
        } catch {
            alert('Failed to update status');
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Clinic System</h1>
                <div className="flex items-center gap-4">
                    <span>{user?.fullName}</span>
                    <button onClick={logout} className="bg-white text-green-600 px-4 py-1 rounded-lg hover:bg-gray-100">
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">My Appointments</h2>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments yet.</p>
                    ) : (
                        appointments.map(a => (
                            <div key={a.id} className="border border-gray-200 rounded-lg p-4 mb-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{a.patientName}</p>
                                        <p className="text-sm text-gray-500">{new Date(a.appointmentDate).toLocaleString()}</p>
                                        {a.notes && <p className="text-sm text-gray-400">Notes: {a.notes}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${a.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                a.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {a.status}
                                        </span>
                                        {a.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(a.id, 'Confirmed')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(a.id, 'Cancelled')}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}