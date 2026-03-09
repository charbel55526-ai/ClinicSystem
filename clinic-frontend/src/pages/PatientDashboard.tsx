import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

interface Appointment {
    id: number;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    status: string;
    notes: string;
}

interface Doctor {
    id: number;
    fullName: string;
    specialization: string;
    phone: string;
    email: string;
}

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await API.get('/Appointment/my');
            setAppointments(res.data);
        } catch {
            navigate('/login');
        }
    };

    const fetchDoctors = async () => {
        const res = await API.get('/Doctor');
        setDoctors(res.data);
    };

    const bookAppointment = async () => {
        try {
            await API.post('/Appointment', {
                doctorId: parseInt(doctorId),
                appointmentDate: date,
                notes
            });
            setMessage('Appointment booked successfully!');
            fetchAppointments();
        } catch {
            setMessage('Failed to book appointment.');
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Clinic System</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user?.fullName}</span>
                    <button onClick={logout} className="bg-white text-blue-600 px-4 py-1 rounded-lg hover:bg-gray-100">
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                {/* Book Appointment */}
                <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Book an Appointment</h2>
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    <select
                        value={doctorId}
                        onChange={e => setDoctorId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    >
                        <option value="">Select a Doctor</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.fullName} — {d.specialization}
                            </option>
                        ))}
                    </select>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    />
                    <input
                        placeholder="Notes (optional)"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                    />
                    <button
                        onClick={bookAppointment}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Book Appointment
                    </button>
                </div>

                {/* My Appointments */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">My Appointments</h2>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments yet.</p>
                    ) : (
                        appointments.map(a => (
                            <div key={a.id} className="border border-gray-200 rounded-lg p-4 mb-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{a.doctorName}</p>
                                        <p className="text-sm text-gray-500">{a.specialization}</p>
                                        <p className="text-sm text-gray-500">{new Date(a.appointmentDate).toLocaleString()}</p>
                                        {a.notes && <p className="text-sm text-gray-400">Notes: {a.notes}</p>}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${a.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            a.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {a.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}