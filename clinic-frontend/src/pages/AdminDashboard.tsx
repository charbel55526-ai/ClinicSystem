import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Swal from 'sweetalert2';
import { Appointment, Doctor } from '../types';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    
    // NEW: Search States
    const [apptSearch, setApptSearch] = useState('');
    const [docSearch, setDocSearch] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchAll();
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await API.get('/Doctor');
            setDoctors(res.data);
        } catch (err) {
            console.error("Failed to fetch doctors");
        }
    };

    const fetchAll = async () => {
        try {
            const res = await API.get('/Appointment/all');
            setAppointments(res.data);
        } catch {
            navigate('/login');
        }
    };

    const deleteDoctor = async (id: number) => {
        const doctor = doctors.find(d => d.id === id);
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Remove Dr. ${doctor?.fullName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, remove',
        });

        if (!result.isConfirmed) return;

        try {
            await API.delete(`/Doctor/${id}`);
            fetchDoctors();
            Swal.fire('Removed!', 'Doctor removed successfully.', 'success');
        } catch {
            Swal.fire('Error', 'Failed to remove doctor.', 'error');
        }
    };

    // Derived State: Filtered Appointments
    const filteredAppointments = appointments.filter(a => 
        a.patientName.toLowerCase().includes(apptSearch.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(apptSearch.toLowerCase())
    );

    // Derived State: Filtered Doctors
    const filteredDoctors = doctors.filter(d => 
        d.fullName.toLowerCase().includes(docSearch.toLowerCase()) ||
        d.specialization.toLowerCase().includes(docSearch.toLowerCase())
    );

    const stats = [
        { label: 'Total', value: appointments.length, color: 'text-blue-600' },
        { label: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length, color: 'text-green-600' },
        { label: 'Pending', value: appointments.filter(a => a.status === 'Pending').length, color: 'text-yellow-500' },
        { label: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length, color: 'text-red-500' },
    ];

    return (
        <DashboardLayout title="Admin Dashboard">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* 2. Appointments Table with Search */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold text-gray-700">All Appointments</h2>
                        <input 
                            type="text"
                            placeholder="Search patients or doctors..."
                            className="w-full md:w-64 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={apptSearch}
                            onChange={(e) => setApptSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-400 uppercase text-xs border-b">
                                <tr>
                                    <th className="pb-3 px-2">Patient</th>
                                    <th className="pb-3 px-2">Doctor</th>
                                    <th className="pb-3 px-2">Date</th>
                                    <th className="pb-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map(a => (
                                    <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                                        <td className="py-4 px-2 font-medium">{a.patientName}</td>
                                        <td className="py-4 px-2">{a.doctorName}</td>
                                        <td className="py-4 px-2 text-gray-500">{new Date(a.appointmentDate).toLocaleDateString()}</td>
                                        <td className="py-4 px-2">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                a.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                a.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAppointments.length === 0 && (
                            <p className="text-center text-gray-400 py-10">No appointments match your search.</p>
                        )}
                    </div>
                </div>

                {/* 3. Doctor Management with Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Manage Doctors</h2>
                    <input 
                        type="text"
                        placeholder="Search by name or specialty..."
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                    />
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {filteredDoctors.map(d => (
                            <div key={d.id} className="flex justify-between items-center p-4 border border-gray-50 rounded-xl bg-gray-50/50">
                                <div>
                                    <p className="font-bold text-gray-800">{d.fullName}</p>
                                    <p className="text-xs text-blue-600 font-medium">{d.specialization}</p>
                                </div>
                                <button
                                    onClick={() => deleteDoctor(d.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {filteredDoctors.length === 0 && (
                            <p className="text-center text-gray-400 py-4 italic text-sm">No doctors found.</p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}