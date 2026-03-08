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
    }
}