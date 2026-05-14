import { useState } from 'react'; // Added useState
import { useAppointments } from '../hooks/useAppointments';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../components/DashboardLayout';
import API from '../services/api';
import Swal from 'sweetalert2';

export default function DoctorDashboard() {
    const { data: appointments, loading, refresh } = useAppointments('/Appointment/doctor');

    // NEW: Search State
    const [searchTerm, setSearchTerm] = useState('');

    const updateStatus = async (id: number, status: string) => {
        try {
            await API.put(`/Appointment/${id}/status`, { status });
            refresh();
            Swal.fire({
                title: 'Updated!',
                text: `Appointment ${status.toLowerCase()} successfully.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    // Derived State: Filter appointments based on patient name
    const filteredAppointments = appointments.filter(a =>
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Doctor Portal">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
                        <p className="text-sm text-gray-500">
                            {filteredAppointments.length} showing of {appointments.length} total
                        </p>
                    </div>

                    {/* NEW: Search Bar */}
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-gray-400">
                            {searchTerm ? `No patients found matching "${searchTerm}"` : "No appointments scheduled."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Map over filteredAppointments instead of appointments */}
                        {filteredAppointments.map(a => (
                            <div key={a.id} className="group border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:bg-green-50/20 transition-all duration-200">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-gray-800 text-lg">{a.patientName}</p>
                                            <StatusBadge status={a.status} />
                                        </div>

                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                📅 {new Date(a.appointmentDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                ⏰ {new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {a.notes && (
                                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600 italic border-l-2 border-green-400">
                                                "{a.notes}"
                                            </div>
                                        )}
                                    </div>

                                    {a.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateStatus(a.id, 'Confirmed')}
                                                className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition shadow-sm"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => updateStatus(a.id, 'Cancelled')}
                                                className="flex-1 md:flex-none bg-white text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}