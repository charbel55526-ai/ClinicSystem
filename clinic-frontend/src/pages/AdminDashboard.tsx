import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

interface Appointment {
    id: number;
    patientName: string;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    status: string;
    notes: string;
}

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const res = await API.get('/Appointment/all');
            setAppointments(res.data);
        } catch {
            navigate('/login');
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Clinic System — Admin</h1>
                <div className="flex items-center gap-4">
                    <span>{user?.fullName}</span>
                    <button onClick={logout} className="bg-white text-purple-600 px-4 py-1 rounded-lg hover:bg-gray-100">
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
                        <p className="text-gray-500 mt-1">Total Appointments</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <p className="text-3xl font-bold text-green-600">{confirmed}</p>
                        <p className="text-gray-500 mt-1">Confirmed</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <p className="text-3xl font-bold text-yellow-500">{pending}</p>
                        <p className="text-gray-500 mt-1">Pending</p>
                    </div>
                </div>

                {/* All Appointments */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">All Appointments</h2>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 text-gray-600">Patient</th>
                                    <th className="pb-3 text-gray-600">Doctor</th>
                                    <th className="pb-3 text-gray-600">Specialization</th>
                                    <th className="pb-3 text-gray-600">Date</th>
                                    <th className="pb-3 text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(a => (
                                    <tr key={a.id} className="border-b border-gray-100">
                                        <td className="py-3">{a.patientName}</td>
                                        <td className="py-3">{a.doctorName}</td>
                                        <td className="py-3">{a.specialization}</td>
                                        <td className="py-3">{new Date(a.appointmentDate).toLocaleString()}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    a.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}