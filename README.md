# Clinic Appointment System

A full-stack web application for managing clinic appointments built with **ASP.NET Core 10** and **React + TypeScript**.

## Tech Stack

**Backend:**
- ASP.NET Core 10 Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt password hashing

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Axios

## Features

- 👤 Role-based authentication (Patient, Doctor, Admin)
- 📅 Patients can book appointments with doctors
- ✅ Doctors can confirm or cancel appointments
- 📊 Admin dashboard with statistics
- 🔒 Protected routes

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- PostgreSQL 17

### Backend Setup
```bash
cd ClinicSystem.API
dotnet restore
```

Update `appsettings.json` with your PostgreSQL credentials:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=clinicdb;Username=youruser;Password=yourpassword"
}
```
```bash
dotnet ef database update
dotnet run
```

API runs on `http://localhost:5270`

### Frontend Setup
```bash
cd clinic-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/Auth/register | Public | Register new user |
| POST | /api/Auth/login | Public | Login |
| GET | /api/Doctor | Public | List all doctors |
| POST | /api/Doctor/profile | Doctor | Create doctor profile |
| POST | /api/Appointment | Patient | Book appointment |
| GET | /api/Appointment/my | Patient | My appointments |
| GET | /api/Appointment/doctor | Doctor | Doctor's appointments |
| PUT | /api/Appointment/{id}/status | Doctor | Update status |
| GET | /api/Appointment/all | Admin | All appointments |
