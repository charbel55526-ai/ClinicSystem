import { useState, useEffect } from 'react';
import API from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import Swal from 'sweetalert2';

export default function ProfileEdit() {
    const [specialization, setSpecialization] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Get the current doctor's details
            const res = await API.get('/Doctor/me'); // Assuming you have a 'me' or 'profile' endpoint
            setSpecialization(res.data.specialization);
            setPhone(res.data.phone);
        } catch (err) {
            Swal.fire('Error', 'Could not load profile data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!specialization || !phone) {
            return Swal.fire('Wait!', 'All fields are required.', 'info');
        }

        setIsUpdating(true);
        try {
            await API.put('/Doctor/profile', { specialization, phone });
            Swal.fire({
                title: 'Success!',
                text: 'Your profile has been updated.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err: any) {
            Swal.fire('Update Failed', err.response?.data || 'Something went wrong', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <DashboardLayout title="Settings">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-linear-to-r from-green-600 to-emerald-600 p-8 text-white">
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <p className="opacity-90 text-sm mt-1">Keep your professional information up to date.</p>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                                        Specialization
                                    </label>
                                    <input
                                        type="text"
                                        value={specialization}
                                        onChange={(e) => setSpecialization(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="e.g. Pediatrics"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-50" />

                            <div className="flex items-center justify-between pt-2">
                                <p className="text-xs text-gray-400 italic">
                                    Last updated: Just now
                                </p>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${isUpdating
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 shadow-green-100'
                                        }`}
                                >
                                    {isUpdating ? 'Saving Changes...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}