namespace ClinicSystem.API.DTOs
{
    public class CreateDoctorProfileDto
    {
        public string Specialization { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class DoctorResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}