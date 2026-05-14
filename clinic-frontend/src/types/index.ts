// src/types/index.ts

export type Role = 'Admin' | 'Doctor' | 'Patient';

export interface User {
    fullName: string;
    role: Role;
}

export interface Doctor {
    id: number;
    fullName: string;
    specialization: string;
    phone?: string;
    email?: string;
}

export interface Appointment {
    id: number;
    patientName: string;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    notes: string;
}