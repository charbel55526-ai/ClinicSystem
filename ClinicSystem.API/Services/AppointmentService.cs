using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystem.API.Services
{
    public class AppointmentService
    {
        private readonly AppDbContext _db;

        public AppointmentService(AppDbContext db)
        {
            _db = db;
        }

        // Patient books an appointment
        public async Task<AppointmentResponseDto?> BookAppointment(int patientUserId, CreateAppointmentDto dto)
        {
            // Find the patient
            var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == patientUserId);
            if (patient == null) return null;

            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = patient.Id,
                AppointmentDate = dto.AppointmentDate,
                Notes = dto.Notes,
                Status = "Pending"
            };

            _db.Appointments.Add(appointment);
            await _db.SaveChangesAsync();

            return await GetAppointmentById(appointment.Id);
        }

        // Get single appointment by id
        public async Task<AppointmentResponseDto?> GetAppointmentById(int id)
        {
            return await _db.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Where(a => a.Id == id)
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    PatientName = a.Patient.User.FullName,
                    DoctorName = a.Doctor.User.FullName,
                    Specialization = a.Doctor.Specialization,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Notes = a.Notes
                })
                .FirstOrDefaultAsync();
        }

        // Patient sees his appointments
        public async Task<List<AppointmentResponseDto>> GetPatientAppointments(int patientUserId)
        {
            return await _db.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Where(a => a.Patient.UserId == patientUserId)
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    PatientName = a.Patient.User.FullName,
                    DoctorName = a.Doctor.User.FullName,
                    Specialization = a.Doctor.Specialization,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Notes = a.Notes
                })
                .ToListAsync();
        }

        // Doctor sees his appointments
        public async Task<List<AppointmentResponseDto>> GetDoctorAppointments(int doctorUserId)
        {
            return await _db.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Where(a => a.Doctor.UserId == doctorUserId)
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    PatientName = a.Patient.User.FullName,
                    DoctorName = a.Doctor.User.FullName,
                    Specialization = a.Doctor.Specialization,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Notes = a.Notes
                })
                .ToListAsync();
        }

        // Doctor updates appointment status
        public async Task<bool> UpdateStatus(int appointmentId, string status)
        {
            var appointment = await _db.Appointments.FindAsync(appointmentId);
            if (appointment == null) return false;

            appointment.Status = status;
            await _db.SaveChangesAsync();
            return true;
        }

        // Admin sees all appointments
        public async Task<List<AppointmentResponseDto>> GetAllAppointments()
        {
            return await _db.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    PatientName = a.Patient.User.FullName,
                    DoctorName = a.Doctor.User.FullName,
                    Specialization = a.Doctor.Specialization,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Notes = a.Notes
                })
                .ToListAsync();
        }
    }
}