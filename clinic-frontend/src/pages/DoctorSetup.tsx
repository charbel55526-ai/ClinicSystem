import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext'; // Import your Auth context

export default function DoctorSetup() {
    const [specialization, setSpecialization] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { logout, user } = useAuth(); // Access logout in case they're on the wrong account

    const handleSetup = async () => {
        // 1. Validation
        if (!specialization || !phone) {
            Swal.fire({
                title: 'Missing Info',
                text: 'Please fill in both fields to continue.',
                icon: 'info',
                confirmButtonColor: '#16a34a'
            });
            return;
        }

        setLoading(true);
        try {
            // 2. API Call
            await API.post('/Doctor/profile', { specialization, phone });

            await Swal.fire({
                title: 'Profile Updated!',
                text: 'Welcome to the team, Dr. ' + (user?.fullName || ''),
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            navigate('/doctor');
        } catch (err: any) {
            Swal.fire('Error', err.response?.data || 'Failed to save profile.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* Simple Logo/Branding */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    Clinic<span className="text-green-600">Portal</span>
                </h1>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Doctor Onboarding</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        We just need a few more details to set up your dashboard.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Specialization</label>
                        <input
                            placeholder="e.g. Internal Medicine"
                            value={specialization}
                            onChange={e => setSpecialization(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                        <input
                            placeholder="+1 (555) 000-0000"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    <button
                        onClick={handleSetup}
                        disabled={loading}
                        className={`w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Finish Setup'}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <button
                        onClick={logout}
                        className="text-sm text-slate-400 hover:text-red-500 transition-colors font-medium"
                    >
                        Not your account? Logout
                    </button>
                </div>
            </div>
        </div>
    );
}