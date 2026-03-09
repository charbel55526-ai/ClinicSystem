import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../services/api';

export default function DoctorSetup() {
    const [specialization, setSpecialization] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSetup = async () => {
        if (!specialization) {
            setMessage('❌ Please enter your specialization.');
            return;
        }
        if (!phone) {
            setMessage('❌ Please enter your phone number.');
            return;
        }
        try {
            await API.post('/Doctor/profile', { specialization, phone });
            navigate('/doctor');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setMessage(err.response?.data || 'Failed to save profile.');
            } else {
                setMessage('Something went wrong.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-600 mb-2">Complete Your Profile</h2>
                <p className="text-center text-gray-500 text-sm mb-6">Please fill in your details before continuing</p>
                {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
                <input
                    placeholder="Specialization (e.g. Cardiology)"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                    onClick={handleSetup}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}