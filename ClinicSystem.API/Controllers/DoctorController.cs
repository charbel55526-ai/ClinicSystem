using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;
using ClinicSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClinicSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly DoctorService _doctorService;

        public DoctorController(DoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        // Doctor creates his profile
        [HttpPost("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreateProfile(CreateDoctorProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _doctorService.CreateProfile(userId, dto);
            if (result == null)
                return BadRequest("Profile already exists");
            return Ok(result);
        }

        // Get all doctors (public, no login needed)
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllDoctors()
        {
            var result = await _doctorService.GetAllDoctors();
            return Ok(result);
        }

        // Get my profile (Doctor only)
        [HttpGet("me")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _doctorService.GetDoctorByUserId(userId);
            if (result == null)
                return NotFound("Profile not found");
            return Ok(result);
        }
        // Admin removes a doctor
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var result = await _doctorService.DeleteDoctor(id);
            if (!result)
                return NotFound("Doctor not found");
            return Ok("Doctor removed");
        }


        // Inside DoctorController.cs

        // PUT: api/Doctor/profile (Added to allow updating)
        [HttpPut("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateProfile(CreateDoctorProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _doctorService.UpdateProfile(userId, dto);

            if (result == null)
                return NotFound("Doctor profile not found");

            return Ok(result);
        }
    }
}