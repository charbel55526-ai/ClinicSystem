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

        // Helper method to avoid repeating the Select logic
        private IQueryable<AppointmentResponseDto> MapToDto(IQueryable<Appointment> query)
        {
            return query.Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                PatientName = a.Patient.User.FullName,
                DoctorName = a.Doctor.User.FullName,
                Specialization = a.Doctor.Specialization,
                AppointmentDate = a.AppointmentDate,
                Status = a.Status,
                Notes = a.Notes
            });
        }

        public async Task<AppointmentResponseDto?> BookAppointment(int patientUserId, CreateAppointmentDto dto)
        {
            var patient = await _db.Patients.FirstOrDefaultAsync(p => p.UserId == patientUserId);
            if (patient == null) return null;

            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = patient.Id,
                AppointmentDate = DateTime.SpecifyKind(dto.AppointmentDate, DateTimeKind.Utc),
                Notes = dto.Notes,
                Status = "Pending"
            };

            _db.Appointments.Add(appointment);
            await _db.SaveChangesAsync();

            return await GetAppointmentById(appointment.Id);
        }

        public async Task<AppointmentResponseDto?> GetAppointmentById(int id)
        {
            var query = _db.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Where(a => a.Id == id);

            return await MapToDto(query).FirstOrDefaultAsync();
        }

        public async Task<List<AppointmentResponseDto>> GetPatientAppointments(int patientUserId)
        {
            var query = _db.Appointments
                .Where(a => a.Patient.UserId == patientUserId)
                .OrderByDescending(a => a.AppointmentDate);

            return await MapToDto(query).ToListAsync();
        }

        public async Task<List<AppointmentResponseDto>> GetDoctorAppointments(int doctorUserId)
        {
            var query = _db.Appointments
                .Where(a => a.Doctor.UserId == doctorUserId)
                .OrderByDescending(a => a.AppointmentDate);

            return await MapToDto(query).ToListAsync();
        }

        public async Task<bool> UpdateStatus(int appointmentId, string status)
        {
            var appointment = await _db.Appointments.FindAsync(appointmentId);
            if (appointment == null) return false;

            appointment.Status = status.Trim();
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<AppointmentResponseDto>> GetAllAppointments(string? search = null)
        {
            var query = _db.Appointments.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchLower = search.ToLower();
                query = query.Where(a =>
                    a.Patient.User.FullName.ToLower().Contains(searchLower) ||
                    a.Doctor.User.FullName.ToLower().Contains(searchLower) ||
                    a.Doctor.Specialization.ToLower().Contains(searchLower)
                );
            }

            return await MapToDto(query.OrderByDescending(a => a.AppointmentDate)).ToListAsync();
        }

        public async Task<bool> CancelPatientAppointment(int appointmentId, int patientUserId)
        {
            var appointment = await _db.Appointments
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.Patient.UserId == patientUserId);

            if (appointment == null || appointment.Status != "Pending") return false;

            appointment.Status = "Cancelled";
            await _db.SaveChangesAsync();
            return true;
        }
    }
}