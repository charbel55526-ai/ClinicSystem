import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAppointments } from '../hooks/useAppointments';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../components/DashboardLayout';
import { Doctor } from '../types';
import Swal from 'sweetalert2';

const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export default function PatientDashboard() {
    // 1. Logic handled by custom hook for the list
    const { data: appointments, loading, refresh } = useAppointments('/Appointment/my');

    // 2. States for the booking form
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
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

    const bookAppointment = async () => {
        if (!doctorId || !date) {
            Swal.fire('Error', 'Please select a doctor and date.', 'error');
            return;
        }

        setIsBooking(true);
        try {
            await API.post('/Appointment', {
                doctorId: parseInt(doctorId),
                appointmentDate: date,
                notes
            });
            Swal.fire('Success', 'Appointment booked successfully!', 'success');
            setDoctorId('');
            setDate('');
            setNotes('');
            refresh(); // Refresh list via hook
        } catch (err: any) {
            Swal.fire('Error', err.response?.data || 'Failed to book', 'error');
        } finally {
            setIsBooking(false);
        }
    };

    const cancelAppointment = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to cancel this appointment request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, cancel it'
        });

        if (!result.isConfirmed) return;

        try {
            await API.put(`/Appointment/${id}/cancel`);
            refresh();
            Swal.fire('Cancelled', 'Your request has been cancelled.', 'success');
        } catch (err: any) {
            Swal.fire('Error', 'Failed to cancel.', 'error');
        }
    };

    return (
        <DashboardLayout title="Patient Portal">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Booking Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Book New Appointment</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Select Doctor</label>
                                <select
                                    value={doctorId}
                                    onChange={e => setDoctorId(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Choose a specialist...</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>{d.fullName} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    min={getLocalISOString()}
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Notes (Optional)</label>
                                <textarea
                                    placeholder="Brief reason for visit..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                />
                            </div>

                            <button
                                onClick={bookAppointment}
                                disabled={isBooking}
                                className={`w-full py-3 rounded-xl text-white font-bold transition-all shadow-lg ${isBooking ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                                    }`}
                            >
                                {isBooking ? 'Processing...' : 'Confirm Appointment'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Appointments List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Appointments</h2>

                        {loading ? (
                            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">You haven't booked any appointments yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map(a => (
                                    <div key={a.id} className="group border border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-gray-800 text-lg">{a.doctorName}</h3>
                                                <p className="text-sm text-blue-600 font-semibold">{a.specialization}</p>
                                                <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm font-medium">
                                                    <span className="bg-gray-100 px-2 py-1 rounded">📅 {new Date(a.appointmentDate).toLocaleString()}</span>
                                                </div>
                                                {a.notes && <p className="mt-3 text-sm text-gray-600 bg-white p-2 rounded border border-gray-50 italic">"{a.notes}"</p>}
                                            </div>
                                            <div className="flex flex-col items-end gap-4">
                                                <StatusBadge status={a.status} />
                                                {a.status === 'Pending' && (
                                                    <button
                                                        onClick={() => cancelAppointment(a.id)}
                                                        className="text-red-500 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded transition uppercase tracking-tighter"
                                                    >
                                                        Cancel Request
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}