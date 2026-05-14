using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystem.API.Services
{
    public class DoctorService
    {
        private readonly AppDbContext _db;

        public DoctorService(AppDbContext db)
        {
            _db = db;
        }

        // Doctor creates his profile after registering
        public async Task<DoctorResponseDto?> CreateProfile(int userId, CreateDoctorProfileDto dto)
        {
            // Check if profile already exists
            if (await _db.Doctors.AnyAsync(d => d.UserId == userId))
                return null;

            var doctor = new Doctor
            {
                UserId = userId,
                Specialization = dto.Specialization,
                Phone = dto.Phone
            };

            _db.Doctors.Add(doctor);
            await _db.SaveChangesAsync();

            return await GetDoctorByUserId(userId);
        }

        // Get doctor by userId
        public async Task<DoctorResponseDto?> GetDoctorByUserId(int userId)
        {
            return await _db.Doctors
                .Include(d => d.User)
                .Where(d => d.UserId == userId)
                .Select(d => new DoctorResponseDto
                {
                    Id = d.Id,
                    FullName = d.User.FullName,
                    Specialization = d.Specialization,
                    Phone = d.Phone,
                    Email = d.User.Email
                })
                .FirstOrDefaultAsync();
        }

        // Get all doctors (for patients to browse)
        public async Task<List<DoctorResponseDto>> GetAllDoctors()
        {
            return await _db.Doctors
                .Include(d => d.User)
                .Select(d => new DoctorResponseDto
                {
                    Id = d.Id,
                    FullName = d.User.FullName,
                    Specialization = d.Specialization,
                    Phone = d.Phone,
                    Email = d.User.Email
                })
                .ToListAsync();
        }
        // Admin gets all doctors new functions
        public async Task<List<DoctorResponseDto>> GetAllDoctorsWithDetails()
        {
            return await _db.Doctors
                .Include(d => d.User)
                .Select(d => new DoctorResponseDto
                {
                    Id = d.Id,
                    FullName = d.User.FullName,
                    Specialization = d.Specialization,
                    Phone = d.Phone,
                    Email = d.User.Email
                })
                .ToListAsync();
        }

        // Admin removes a doctor
        public async Task<bool> DeleteDoctor(int doctorId)
        {
            var doctor = await _db.Doctors.FindAsync(doctorId);
            if (doctor == null) return false;

            _db.Doctors.Remove(doctor);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<DoctorResponseDto?> UpdateProfile(int userId, CreateDoctorProfileDto dto)
        {
            var doctor = await _db.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null) return null;

            // Update fields
            doctor.Specialization = dto.Specialization;
            doctor.Phone = dto.Phone;

            await _db.SaveChangesAsync();

            return new DoctorResponseDto
            {
                Id = doctor.Id,
                FullName = doctor.User.FullName,
                Specialization = doctor.Specialization,
                Phone = doctor.Phone,
                Email = doctor.User.Email
            };
        }
    }
}